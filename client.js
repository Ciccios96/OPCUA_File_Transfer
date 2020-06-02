"use strict";
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
        while (_) try {
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
exports.__esModule = true;
var node_opcua_1 = require("node-opcua");
var node_opcua_file_transfer_1 = require("node-opcua-file-transfer");
var util_1 = require("util");
var fs = require("fs");
var readline = require("readline");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};
var options = {
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: node_opcua_1.MessageSecurityMode.None,
    securityPolicy: node_opcua_1.SecurityPolicy.None,
    endpoint_must_exist: false
};
var client = node_opcua_1.OPCUAClient.create(options);
// const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
var endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var session, browseResult, _i, _a, reference, fileNodeId, clientFile, mode, data, my_data_filename, size, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 13, , 14]);
                    // step 1 : connect to
                    return [4 /*yield*/, client.connect(endpointUrl)];
                case 1:
                    // step 1 : connect to
                    _b.sent();
                    console.log("Client connected!");
                    return [4 /*yield*/, client.createSession()];
                case 2:
                    session = _b.sent();
                    console.log("Session created!");
                    // step 3 : browse
                    return [4 /*yield*/, rl.question("inserisci qualcosa ", function (answer) {
                            console.log(answer);
                            rl.close();
                        })];
                case 3:
                    // step 3 : browse
                    _b.sent();
                    return [4 /*yield*/, session.browse("ns=1;i=1000")];
                case 4:
                    browseResult = _b.sent();
                    console.log("References of FileSystem :");
                    for (_i = 0, _a = browseResult.references; _i < _a.length; _i++) {
                        reference = _a[_i];
                        console.log("   -> ", reference.browseName.toString());
                    }
                    fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, "MyFile", 1);
                    clientFile = new node_opcua_file_transfer_1.ClientFile(session, fileNodeId);
                    mode = node_opcua_file_transfer_1.OpenFileMode.ReadWriteAppend;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, clientFile.setPosition([0, 1])];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, clientFile.read(20)];
                case 7:
                    data = _b.sent();
                    console.log("Contenuto del file: ", data.toString("utf-8"));
                    my_data_filename = "./downloads/someFile.txt";
                    return [4 /*yield*/, util_1.promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8")];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, clientFile.size()];
                case 9:
                    size = _b.sent();
                    console.log("The current file size is : ", size, " bytes");
                    // don't forget to close the file when done
                    return [4 /*yield*/, clientFile.close()];
                case 10:
                    // don't forget to close the file when done
                    _b.sent();
                    // close session
                    return [4 /*yield*/, session.close()];
                case 11:
                    // close session
                    _b.sent();
                    // disconnecting
                    return [4 /*yield*/, client.disconnect()];
                case 12:
                    // disconnecting
                    _b.sent();
                    console.log("Done!");
                    return [3 /*break*/, 14];
                case 13:
                    err_1 = _b.sent();
                    console.log("An error has occured : ", err_1);
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    });
}
main();
