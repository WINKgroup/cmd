import ConsoleLog, { LogLevel } from '@winkgroup/console-log'
import { EventEmitter } from 'node:events'

export class CmdStreamManager extends EventEmitter  {
    name: 'stdout' | 'stderr'
    collectDataAsString = false
    data = ''
    consoleLog: ConsoleLog

    constructor(name: 'stdout' | 'stderr') {
        super()
        this.name = name
        this.consoleLog = new ConsoleLog()
    }

    getNewData(inputNewData:Error | string) {
        const newData = typeof inputNewData === 'string' ? inputNewData : inputNewData.toString()
        if (this.collectDataAsString) this.data += newData
        this.emit('data', inputNewData)
        const level = (this.name == 'stderr' ? LogLevel.ERROR : LogLevel.INFO)
        this.consoleLog.print(newData, level)
    }
}