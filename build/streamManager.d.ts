/// <reference types="node" />
import ConsoleLog from '@winkgroup/console-log';
import { EventEmitter } from 'node:events';
export declare class CmdStreamManagerNoConsoleLog extends EventEmitter {
    name: 'stdout' | 'stderr';
    collectDataAsString: boolean;
    data: string;
    constructor(name: 'stdout' | 'stderr');
    getNewData(inputNewData: Error | string, consoleLog: ConsoleLog): string;
}
export declare class CmdStreamManager extends CmdStreamManagerNoConsoleLog {
    getNewData(inputNewData: Error | string, consoleLog: ConsoleLog): string;
}
