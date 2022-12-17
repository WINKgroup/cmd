import type { PartialDeep } from 'type-fest'
import { ChildProcessWithoutNullStreams, spawn } from "child_process"
import _ from "lodash"
import ConsoleLog, { ConsoleLogGeneralOptions, LogLevel } from '@winkgroup/console-log'
import { CmdStreamManager, CmdStreamManagerOptions } from './streamManager'
import { ConsoleLogLevelOptions } from '@winkgroup/console-log/build/level'

export interface CmdOptions {
    getResult: boolean // shortcut option to setup stdout & stderr options
    timeout: number
    args: string[]
    spawnOptions?:any
    consoleLogGeneralOptions: ConsoleLogGeneralOptions
    consoleLogLevelOptions?: {[key: string]: PartialDeep<ConsoleLogLevelOptions>}
    stdoutOptions?:Partial<CmdStreamManagerOptions>
    stderrOptions?:Partial<CmdStreamManagerOptions>
}

export default class Cmd {
    timeout: number
    cmd:string
    args = [] as string[]
    stdout:CmdStreamManager
    stderr:CmdStreamManager
    exitCode = null as number | null
    spawnOptions?:any
    consoleLog:ConsoleLog
    private childProcess = null as ChildProcessWithoutNullStreams | null

    constructor(cmd:string, inputOptions?:Partial<CmdOptions>) {
        const options:CmdOptions = _.defaults(inputOptions, {
            getResult: true,
            timeout: 20,
            args: [] as string[],
            consoleLogGeneralOptions: { prefix: 'Cmd' }
        })

        this.cmd = cmd
        this.timeout = options.timeout
        this.args = options.args

        this.stdout = new CmdStreamManager('stdout', options.consoleLogGeneralOptions, options.stdoutOptions)
        this.stderr = new CmdStreamManager('stderr', options.consoleLogGeneralOptions, options.stderrOptions)
        this.spawnOptions = options.spawnOptions

        this.consoleLog = new ConsoleLog(options.consoleLogGeneralOptions)

        this.stdout.collectDataAsString = options.getResult
        this.stderr.collectDataAsString = options.getResult
    }

    start() {
        const commandStr = this.cmdStr()
        if (this.childProcess) {
            this.consoleLog.warn(`${commandStr} already started: not starting again`)
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
            if ( code !== 0 ) this.consoleLog.error(`exit with code ${this.exitCode}`)
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
            else console.error('unable to kill Cmd: no child process')
    }

    run() {
        return new Promise<Cmd>( (resolve) => {
            this.start()
            
            if (this.childProcess)
                this.childProcess.on('close', () => { resolve(this) })
                else resolve(this)
        })
    }

    cmdStr() {
        let trailer = this.args.length > 0 ? this.args.join(' ') : ''
        if (trailer) trailer = ' ' + trailer
        return this.cmd + trailer
    }

    static run(cmd:string, inputOptions?:Partial<CmdOptions>) {
        const command = new Cmd(cmd, inputOptions)
        return command.run()
    }

    static async exists(cmd:string) {
        const options:Partial<CmdOptions> = {
            consoleLogGeneralOptions: { verbosity: LogLevel.NONE },
            args: ['-v', cmd]
        }

        const command = await this.run('command', options)
        return (command.exitCode === 0)
    }
}