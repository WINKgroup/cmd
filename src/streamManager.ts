import ConsoleLog, { ConsoleLogLevel } from '@winkgroup/console-log';
import _ from 'lodash';
import { EventEmitter } from 'node:events';

export interface CmdStreamManagerOptions {
    collectDataAsString: boolean;
    logLevel: ConsoleLogLevel;
}

export class CmdStreamManager extends EventEmitter {
    name: 'stdout' | 'stderr';
    collectDataAsString: boolean;
    logLevel: ConsoleLogLevel;
    data = '';

    constructor(
        name: 'stdout' | 'stderr',
        inputOptions?: Partial<CmdStreamManagerOptions>
    ) {
        super();
        this.name = name;
        const options = _.defaults(inputOptions, {
            collectDataAsString: true,
            logLevel: name === 'stdout' ? ConsoleLogLevel.INFO : ConsoleLogLevel.ERROR,
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
