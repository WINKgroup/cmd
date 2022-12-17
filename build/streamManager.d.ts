/// <reference types="node" />
import ConsoleLog, { ConsoleLogGeneralOptions, LogLevel } from '@winkgroup/console-log';
import { ConsoleLogLevelOptions } from '@winkgroup/console-log/build/level';
import { EventEmitter } from 'node:events';
import { PartialDeep } from 'type-fest';
export interface CmdStreamManagerOptions {
    collectDataAsString: boolean;
    logLevel: LogLevel;
    consoleLogLevelOptions?: {
        [key: string]: PartialDeep<ConsoleLogLevelOptions>;
    };
}
export declare class CmdStreamManager extends EventEmitter {
    name: 'stdout' | 'stderr';
    collectDataAsString: boolean;
    logLevel: LogLevel;
    consoleLog: ConsoleLog;
    data: string;
    constructor(name: 'stdout' | 'stderr', consoleLogGeneralOptions: ConsoleLogGeneralOptions, inputOptions?: Partial<CmdStreamManagerOptions>);
    getNewData(inputNewData: Error | string): string;
}
