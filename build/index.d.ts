/// <reference types="node" />
import type { PartialDeep } from 'type-fest';
import { ChildProcessWithoutNullStreams } from "child_process";
import ConsoleLog from '@winkgroup/console-log';
import { CmdStreamManager } from './streamManager';
export interface CmdOptions {
    getResult: boolean;
    timeout: number;
    args: string[];
    spawnOptions?: any;
}
export default class Cmd {
    timeout: number;
    cmd: string;
    args: string[];
    consoleLog: ConsoleLog;
    stdout: CmdStreamManager;
    stderr: CmdStreamManager;
    exitCode: number | null;
    spawnOptions?: any;
    private childProcess;
    constructor(cmd: string, inputOptions?: PartialDeep<CmdOptions>);
    start(): ChildProcessWithoutNullStreams | null | undefined;
    kill(): void;
    run(): Promise<Cmd>;
    cmdStr(): string;
    static run(cmd: string, inputOptions?: PartialDeep<CmdOptions>, consoleLog?: ConsoleLog): Promise<Cmd>;
    static exists(cmd: string): Promise<boolean>;
}
