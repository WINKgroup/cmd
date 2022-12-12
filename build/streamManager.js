"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdStreamManager = exports.CmdStreamManagerNoConsoleLog = void 0;
var console_log_1 = require("@winkgroup/console-log");
var node_events_1 = require("node:events");
var CmdStreamManagerNoConsoleLog = /** @class */ (function (_super) {
    __extends(CmdStreamManagerNoConsoleLog, _super);
    function CmdStreamManagerNoConsoleLog(name) {
        var _this = _super.call(this) || this;
        _this.collectDataAsString = false;
        _this.data = '';
        _this.name = name;
        return _this;
    }
    CmdStreamManagerNoConsoleLog.prototype.getNewData = function (inputNewData, consoleLog) {
        var newData = typeof inputNewData === 'string' ? inputNewData : inputNewData.toString();
        if (this.collectDataAsString)
            this.data += newData;
        this.emit('data', inputNewData);
        return newData;
    };
    return CmdStreamManagerNoConsoleLog;
}(node_events_1.EventEmitter));
exports.CmdStreamManagerNoConsoleLog = CmdStreamManagerNoConsoleLog;
var CmdStreamManager = /** @class */ (function (_super) {
    __extends(CmdStreamManager, _super);
    function CmdStreamManager(name, logLevel) {
        var _this = _super.call(this, name) || this;
        if (!logLevel)
            logLevel = name === 'stdout' ? console_log_1.LogLevel.INFO : console_log_1.LogLevel.ERROR;
        _this.logLevel = logLevel;
        return _this;
    }
    CmdStreamManager.prototype.getNewData = function (inputNewData, consoleLog) {
        var newData = _super.prototype.getNewData.call(this, inputNewData, consoleLog);
        consoleLog.print(newData, this.logLevel);
        return newData;
    };
    return CmdStreamManager;
}(CmdStreamManagerNoConsoleLog));
exports.CmdStreamManager = CmdStreamManager;
