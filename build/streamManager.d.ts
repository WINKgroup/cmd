/// <reference types="node" />
import ConsoleLog from '@winkgroup/console-log';
import { EventEmitter } from 'node:events';
export declare class CmdStreamManager extends EventEmitter {
    name: 'stdout' | 'stderr';
    collectDataAsString: boolean;
    data: string;
    consoleLog: ConsoleLog;
    constructor(name: 'stdout' | 'stderr');
    getNewData(inputNewData: Error | string): void;
}
