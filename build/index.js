"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var lodash_1 = __importDefault(require("lodash"));
var console_log_1 = __importDefault(require("@winkgroup/console-log"));
var streamManager_1 = require("./streamManager");
var Cmd = /** @class */ (function () {
    function Cmd(cmd, inputOptions) {
        this.args = [];
        this.exitCode = null;
        this.childProcess = null;
        var options = lodash_1.default.defaults(inputOptions, {
            getResult: true,
            timeout: 20,
            args: []
        });
        this.cmd = cmd;
        this.timeout = options.timeout;
        this.args = options.args;
        this.consoleLog = new console_log_1.default({ prefix: 'Cmd' });
        this.stdout = new streamManager_1.CmdStreamManager('stdout');
        this.stderr = new streamManager_1.CmdStreamManager('stderr');
        this.spawnOptions = options.spawnOptions;
        if (options.getResult) {
            this.stdout.collectDataAsString = true;
            this.stderr.collectDataAsString = true;
        }
    }
    Cmd.prototype.start = function () {
        var _this = this;
        var commandStr = this.cmdStr();
        if (this.childProcess) {
            this.consoleLog.warn("".concat(commandStr, " already started"));
            return;
        }
        this.consoleLog.print(commandStr);
        this.stdout.data = '';
        this.stderr.data = '';
        this.exitCode = null;
        try {
            this.childProcess = (0, child_process_1.spawn)(this.cmd, this.args, this.spawnOptions);
        }
        catch (e) {
            this.stderr.getNewData(e);
        }
        var timeoutObj = null;
        if (!this.childProcess) {
            this.childProcess = null;
            return this.childProcess;
        }
        this.childProcess.on('error', function (error) { _this.stderr.getNewData(error); });
        if (this.childProcess.stderr)
            this.childProcess.stderr.on('data', function (data) {
                _this.stderr.getNewData(data);
            });
        if (this.childProcess.stdout)
            this.childProcess.stdout.on('data', function (data) {
                _this.stdout.getNewData(data);
            });
        this.childProcess.on('close', function (code) {
            if (timeoutObj) {
                clearTimeout(timeoutObj);
                timeoutObj = null;
            }
            _this.childProcess = null;
            _this.exitCode = code;
        });
        if (this.timeout) {
            timeoutObj = setTimeout(function () {
                _this.stderr.getNewData('TIMEOUT');
                _this.kill();
            }, this.timeout * 1000);
        }
        return this.childProcess;
    };
    Cmd.prototype.kill = function () {
        if (this.childProcess) {
            this.childProcess.stdin.end();
            this.childProcess.stdout.destroy();
            this.childProcess.stderr.destroy();
            this.childProcess.kill();
        }
        else
            console.error('unable to kill Cmd:no child process');
    };
    Cmd.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.start();
            if (_this.childProcess) {
                _this.childProcess.on('close', function (code) {
                    if (code !== 0) {
                        _this.consoleLog.error("".concat(_this.cmd, " exit with code ").concat(_this.exitCode));
                        var result = _this.stderr.collectDataAsString ? _this.stderr.data : _this.stdout.data;
                        reject(_this.stderr);
                    }
                    else {
                        var result = _this.stdout.collectDataAsString ? _this.stdout.data : _this.stderr.data;
                        resolve(result);
                    }
                });
            }
            else
                reject(_this.stderr.data);
        });
    };
    Cmd.prototype.cmdStr = function () {
        var trailer = this.args.length > 0 ? this.args.join(' ') : '';
        if (trailer)
            trailer = ' ' + trailer;
        return this.cmd + trailer;
    };
    Cmd.run = function (cmd, inputOptions) {
        var command = new Cmd(cmd, inputOptions);
        return command.run();
    };
    return Cmd;
}());
exports.default = Cmd;
