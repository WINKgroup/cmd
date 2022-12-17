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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmdStreamManager = void 0;
var console_log_1 = __importStar(require("@winkgroup/console-log"));
var lodash_1 = __importDefault(require("lodash"));
var node_events_1 = require("node:events");
var CmdStreamManager = /** @class */ (function (_super) {
    __extends(CmdStreamManager, _super);
    function CmdStreamManager(name, consoleLogGeneralOptions, inputOptions) {
        var _this = _super.call(this) || this;
        _this.data = '';
        _this.name = name;
        var options = lodash_1.default.defaults(inputOptions, {
            collectDataAsString: true,
            logLevel: name === 'stdout' ? console_log_1.LogLevel.INFO : console_log_1.LogLevel.ERROR,
        });
        _this.collectDataAsString = options.collectDataAsString;
        _this.logLevel = options.logLevel;
        _this.consoleLog = new console_log_1.default(consoleLogGeneralOptions, options.consoleLogLevelOptions);
        if (!_this.consoleLog.generalOptions.id)
            _this.consoleLog.generalOptions.id = name;
        return _this;
    }
    CmdStreamManager.prototype.getNewData = function (inputNewData) {
        var newData = typeof inputNewData === 'string' ? inputNewData : inputNewData.toString();
        if (this.collectDataAsString)
            this.data += newData;
        this.emit('data', inputNewData);
        this.consoleLog.print(newData, this.logLevel);
        return newData;
    };
    return CmdStreamManager;
}(node_events_1.EventEmitter));
exports.CmdStreamManager = CmdStreamManager;
