import type { PartialDeep } from 'type-fest'
import { ChildProcessWithoutNullStreams, spawn } from "child_process"
import _ from "lodash"
import ConsoleLog from '@winkgroup/console-log'
import { CmdStreamManager } from './streamManager'

export interface CmdOptions {
    getResult: boolean // shortcut option to setup stdout & stderr options
    timeout: number
    args: string[]
    spawnOptions?:any
}

export default class Cmd {
    timeout: number
    cmd:string
    args = [] as string[]
    consoleLog: ConsoleLog
    stdout:CmdStreamManager
    stderr:CmdStreamManager
    exitCode = null as number | null
    spawnOptions?:any
    private childProcess = null as ChildProcessWithoutNullStreams | null

    constructor(cmd:string, inputOptions?:PartialDeep<CmdOptions>) {
        const options:CmdOptions = _.defaults(inputOptions, {
            getResult: true,
            timeout: 20,
            args: [] as string[]
        })

        this.cmd = cmd
        this.timeout = options.timeout
        this.args = options.args
        this.consoleLog = new ConsoleLog({ prefix: 'Cmd' })
        this.stdout = new CmdStreamManager('stdout')
        this.stderr = new CmdStreamManager('stderr')
        this.spawnOptions = options.spawnOptions

        if (options.getResult) {
            this.stdout.collectDataAsString = true
            this.stderr.collectDataAsString = true
        }
    }

    start() {
        const commandStr = this.cmdStr()
        if (this.childProcess) {
            this.consoleLog.warn(`${commandStr} already started`)
            return
        }
        this.consoleLog.print(commandStr)
        this.stdout.data = ''
        this.stderr.data = ''
        this.exitCode = null

        try {
            this.childProcess = spawn(this.cmd, this.args, this.spawnOptions)
        } catch (e) {
            this.stderr.getNewData(e as Error | string)
        }
        let timeoutObj = null as NodeJS.Timeout | null
        if (!this.childProcess) {
            this.childProcess = null
            return this.childProcess
        }

        this.childProcess.on('error', (error) => { this.stderr.getNewData( error ) })

        if (this.childProcess.stderr) this.childProcess.stderr.on('data', (data) => {
            this.stderr.getNewData( data )
        })

        if (this.childProcess.stdout) this.childProcess.stdout.on('data', (data) => {
            this.stdout.getNewData( data )
        })

        this.childProcess.on('close', (code) => {
            if (timeoutObj) {
                clearTimeout(timeoutObj)
                timeoutObj = null
            }
            this.childProcess = null
            this.exitCode = code
        })

        if (this.timeout) {
            timeoutObj = setTimeout( () => {
                this.stderr.getNewData( 'TIMEOUT' )
                this.kill()
            }, this.timeout * 1000)
        }

        return this.childProcess
    }

    kill() {
        if (this.childProcess) {
            this.childProcess.stdin.end()
            this.childProcess.stdout.destroy()
            this.childProcess.stderr.destroy()
            this.childProcess.kill()
        }
            else console.error('unable to kill Cmd:no child process')
    }

    run() {
        return new Promise<string>( (resolve, reject) => {
            this.start()
            
            if (this.childProcess) {
                this.childProcess.on('close', (code) => {
                    if (code !== 0) {
                        this.consoleLog.error(`${this.cmd} exit with code ${this.exitCode}`)
                        const result = this.stderr.collectDataAsString ? this.stderr.data : this.stdout.data
                        reject(this.stderr)
                    } else {
                        const result = this.stdout.collectDataAsString ? this.stdout.data : this.stderr.data
                        resolve(result)
                    }
                })
            }
                else reject(this.stderr.data)
        })
    }

    cmdStr() {
        let trailer = this.args.length > 0 ? this.args.join(' ') : ''
        if (trailer) trailer = ' ' + trailer
        return this.cmd + trailer
    }

    static run(cmd:string, inputOptions?:PartialDeep<CmdOptions>) {
        const command = new Cmd(cmd, inputOptions)
        return command.run()
    }
}