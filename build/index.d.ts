/// <reference types="node" />
import type { PartialDeep } from 'type-fest';
import { ChildProcessWithoutNullStreams } from "child_process";
import ConsoleLog, { ConsoleLogGeneralOptions } from '@winkgroup/console-log';
import { CmdStreamManager, CmdStreamManagerOptions } from './streamManager';
import { ConsoleLogLevelOptions } from '@winkgroup/console-log/build/level';
export interface CmdOptions {
    getResult: boolean;
    timeout: number;
    args: string[];
    spawnOptions?: any;
    consoleLogGeneralOptions: ConsoleLogGeneralOptions;
    consoleLogLevelOptions?: {
        [key: string]: PartialDeep<ConsoleLogLevelOptions>;
    };
    stdoutOptions?: Partial<CmdStreamManagerOptions>;
    stderrOptions?: Partial<CmdStreamManagerOptions>;
}
export default class Cmd {
    timeout: number;
    cmd: string;
    args: string[];
    stdout: CmdStreamManager;
    stderr: CmdStreamManager;
    exitCode: number | null;
    spawnOptions?: any;
    consoleLog: ConsoleLog;
    private childProcess;
    constructor(cmd: string, inputOptions?: Partial<CmdOptions>);
    start(): ChildProcessWithoutNullStreams | null | undefined;
    kill(): void;
    run(): Promise<Cmd>;
    cmdStr(): string;
    static run(cmd: string, inputOptions?: Partial<CmdOptions>): Promise<Cmd>;
    static exists(cmd: string): Promise<boolean>;
}
