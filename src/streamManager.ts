import ConsoleLog, { LogLevel } from '@winkgroup/console-log';
import _ from 'lodash';
import { EventEmitter } from 'node:events';

export interface CmdStreamManagerOptions {
    collectDataAsString: boolean;
    logLevel: LogLevel;
}

export class CmdStreamManager extends EventEmitter {
    name: 'stdout' | 'stderr';
    collectDataAsString: boolean;
    logLevel: LogLevel;
    data = '';

    constructor(
        name: 'stdout' | 'stderr',
        inputOptions?: Partial<CmdStreamManagerOptions>
    ) {
        super();
        this.name = name;
        const options = _.defaults(inputOptions, {
            collectDataAsString: true,
            logLevel: name === 'stdout' ? LogLevel.INFO : LogLevel.ERROR,
        });

        this.collectDataAsString = options.collectDataAsString;
        this.logLevel = options.logLevel;
    }

    getNewData(inputNewData: Error | string, consoleLog: ConsoleLog) {
        const newData =
            typeof inputNewData === 'string'
                ? inputNewData
                : inputNewData.toString();
        if (this.collectDataAsString) this.data += newData;
        this.emit('data', inputNewData);
        consoleLog.print(newData, this.logLevel);
        return newData;
    }
}
