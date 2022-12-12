"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var lodash_1 = __importDefault(require("lodash"));
var console_log_1 = __importStar(require("@winkgroup/console-log"));
var streamManager_1 = require("./streamManager");
var Cmd = /** @class */ (function () {
    function Cmd(cmd, inputOptions) {
        this.args = [];
        this.exitCode = null;
        this.childProcess = null;
        var options = lodash_1.default.defaults(inputOptions, {
            getResult: true,
            timeout: 20,
            args: [],
            stdoutLogLevel: console_log_1.LogLevel.INFO,
            stderrLogLevel: console_log_1.LogLevel.ERROR
        });
        this.cmd = cmd;
        this.timeout = options.timeout;
        this.args = options.args;
        this.consoleLog = new console_log_1.default({ prefix: 'Cmd' });
        this.stdout = new streamManager_1.CmdStreamManager('stdout', options.stdoutLogLevel);
        this.stderr = new streamManager_1.CmdStreamManager('stderr', options.stderrLogLevel);
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
            this.consoleLog.warn("".concat(commandStr, " already started: not starting again"));
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
            this.stderr.getNewData(e, this.consoleLog);
        }
        var timeoutObj = null;
        if (!this.childProcess) {
            this.childProcess = null;
            return this.childProcess;
        }
        this.childProcess.on('error', function (error) { _this.stderr.getNewData(error, _this.consoleLog); });
        if (this.childProcess.stderr)
            this.childProcess.stderr.on('data', function (data) {
                _this.stderr.getNewData(data, _this.consoleLog);
            });
        if (this.childProcess.stdout)
            this.childProcess.stdout.on('data', function (data) {
                _this.stdout.getNewData(data, _this.consoleLog);
            });
        this.childProcess.on('close', function (code) {
            if (timeoutObj) {
                clearTimeout(timeoutObj);
                timeoutObj = null;
            }
            _this.childProcess = null;
            _this.exitCode = code;
            if (code !== 0)
                _this.consoleLog.error("exit with code ".concat(_this.exitCode));
        });
        if (this.timeout) {
            timeoutObj = setTimeout(function () {
                _this.stderr.getNewData('TIMEOUT', _this.consoleLog);
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
            console.error('unable to kill Cmd: no child process');
    };
    Cmd.prototype.run = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.start();
            if (_this.childProcess)
                _this.childProcess.on('close', function () { resolve(_this); });
            else
                resolve(_this);
        });
    };
    Cmd.prototype.cmdStr = function () {
        var trailer = this.args.length > 0 ? this.args.join(' ') : '';
        if (trailer)
            trailer = ' ' + trailer;
        return this.cmd + trailer;
    };
    Cmd.run = function (cmd, inputOptions, consoleLog) {
        var command = new Cmd(cmd, inputOptions);
        if (consoleLog)
            command.consoleLog = consoleLog;
        return command.run();
    };
    Cmd.exists = function (cmd) {
        return __awaiter(this, void 0, void 0, function () {
            var command;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.run('command', {
                            args: ['-v', cmd]
                        }, new console_log_1.default({ verbosity: console_log_1.LogLevel.NONE }))];
                    case 1:
                        command = _a.sent();
                        return [2 /*return*/, (command.exitCode === 0)];
                }
            });
        });
    };
    return Cmd;
}());
exports.default = Cmd;
