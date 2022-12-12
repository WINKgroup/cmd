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
    logLevel:LogLevel

    constructor(name: 'stdout' | 'stderr', logLevel?:LogLevel) {
        super(name)
        if (!logLevel) logLevel = name === 'stdout' ? LogLevel.INFO : LogLevel.ERROR
        this.logLevel = logLevel
    }

    getNewData(inputNewData:Error | string, consoleLog:ConsoleLog) {
        const newData = super.getNewData(inputNewData, consoleLog)
        consoleLog.print(newData, this.logLevel)
        return newData
    }
}