import ConsoleLog, { LogLevel } from '@winkgroup/console-log'
import { EventEmitter } from 'node:events'

export class CmdStreamManagerNoConsoleLog extends EventEmitter  {
    name: 'stdout' | 'stderr'
    collectDataAsString = false
    data = ''

    constructor(name: 'stdout' | 'stderr') {
        super()
        this.name = name
    }

    getNewData(inputNewData:Error | string, consoleLog:ConsoleLog) {
        const newData = typeof inputNewData === 'string' ? inputNewData : inputNewData.toString()
        if (this.collectDataAsString) this.data += newData
        this.emit('data', inputNewData)
        return newData
    }
}

export class CmdStreamManager extends CmdStreamManagerNoConsoleLog {
    getNewData(inputNewData:Error | string, consoleLog:ConsoleLog) {
        const newData = super.getNewData(inputNewData, consoleLog)
        const level = (this.name == 'stderr' ? LogLevel.ERROR : LogLevel.INFO)
        consoleLog.print(newData, level)
        return newData
    }
}