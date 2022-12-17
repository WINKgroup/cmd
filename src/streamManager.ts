import ConsoleLog, { ConsoleLogGeneralOptions, LogLevel } from '@winkgroup/console-log'
import { ConsoleLogLevelOptions } from '@winkgroup/console-log/build/level'
import _ from 'lodash'
import { EventEmitter } from 'node:events'
import { PartialDeep } from 'type-fest'

export interface CmdStreamManagerOptions {
    collectDataAsString: boolean
    logLevel: LogLevel
    consoleLogLevelOptions?: {[key: string]: PartialDeep<ConsoleLogLevelOptions>}
}

export class CmdStreamManager extends EventEmitter  {
    name: 'stdout' | 'stderr'
    collectDataAsString: boolean
    logLevel: LogLevel
    consoleLog: ConsoleLog
    data = ''

    constructor(name: 'stdout' | 'stderr', consoleLogGeneralOptions: ConsoleLogGeneralOptions, inputOptions?:Partial<CmdStreamManagerOptions>) {
        super()
        this.name = name
        const options = _.defaults(inputOptions, {
            collectDataAsString: true,
            logLevel: name === 'stdout' ? LogLevel.INFO : LogLevel.ERROR,
        })

        this.collectDataAsString = options.collectDataAsString
        this.logLevel = options.logLevel
        this.consoleLog = new ConsoleLog(consoleLogGeneralOptions, options.consoleLogLevelOptions)
        if (!this.consoleLog.generalOptions.id) this.consoleLog.generalOptions.id = name
    }

    getNewData(inputNewData:Error | string) {
        const newData = typeof inputNewData === 'string' ? inputNewData : inputNewData.toString()
        if (this.collectDataAsString) this.data += newData
        this.emit('data', inputNewData)
        this.consoleLog.print(newData, this.logLevel)
        return newData
    }
}
