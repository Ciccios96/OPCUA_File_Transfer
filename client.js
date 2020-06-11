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
var endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var session, filename, clientFile, data, clientFile2, data2, clientFile3, data3, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 24, , 25]);
                    //  connect to
                    return [4 /*yield*/, connect(endpointUrl)];
                case 1:
                    //  connect to
                    _a.sent();
                    return [4 /*yield*/, create_session()];
                case 2:
                    session = _a.sent();
                    // browse
                    return [4 /*yield*/, browse(session)];
                case 3:
                    // browse
                    _a.sent();
                    return [4 /*yield*/, call_method(session)];
                case 4:
                    filename = _a.sent();
                    return [4 /*yield*/, read_node(session, "MyFile")];
                case 5:
                    clientFile = _a.sent();
                    // operations on txt file
                    return [4 /*yield*/, open_file(clientFile)];
                case 6:
                    // operations on txt file
                    _a.sent();
                    return [4 /*yield*/, read_file(clientFile, 20)];
                case 7:
                    data = _a.sent();
                    return [4 /*yield*/, download_file(data)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, size_file(clientFile)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, write_file(clientFile)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, read_node(session, "PDF_File")];
                case 11:
                    clientFile2 = _a.sent();
                    return [4 /*yield*/, open_file(clientFile2)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, read_file(clientFile2, 83750)];
                case 13:
                    data2 = _a.sent();
                    return [4 /*yield*/, download_PDF(data2)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, size_file(clientFile2)];
                case 15:
                    _a.sent();
                    // creating a new Node in the server
                    return [4 /*yield*/, call_method(session)];
                case 16:
                    // creating a new Node in the server
                    _a.sent();
                    return [4 /*yield*/, read_node(session, filename)];
                case 17:
                    clientFile3 = _a.sent();
                    return [4 /*yield*/, open_file(clientFile3)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, read_file(clientFile3, 20)];
                case 19:
                    data3 = _a.sent();
                    return [4 /*yield*/, download_file(data3)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, size_file(clientFile3)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, write_file(clientFile3)];
                case 22:
                    _a.sent();
                    // closing file, session and connection
                    return [4 /*yield*/, ending(clientFile, session)];
                case 23:
                    // closing file, session and connection
                    _a.sent();
                    return [3 /*break*/, 25];
                case 24:
                    err_1 = _a.sent();
                    console.log("An error has occured : ", err_1);
                    return [3 /*break*/, 25];
                case 25: return [2 /*return*/];
            }
        });
    });
}
main();
function connect(endpoint) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.connect(endpoint)];
                case 1:
                    _a.sent();
                    console.log("Client connected!");
                    return [2 /*return*/];
            }
        });
    });
}
function create_session() {
    return __awaiter(this, void 0, void 0, function () {
        var session;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.createSession()];
                case 1:
                    session = _a.sent();
                    console.log("Session created!");
                    return [2 /*return*/, session];
            }
        });
    });
}
function browse(session) {
    return __awaiter(this, void 0, void 0, function () {
        var browseResult, _i, _a, reference;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, session.browse("ns=1;i=1000")];
                case 1:
                    browseResult = _b.sent();
                    console.log("References of FileSystem :");
                    for (_i = 0, _a = browseResult.references; _i < _a.length; _i++) {
                        reference = _a[_i];
                        console.log("   -> ", reference.browseName.toString());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function read_node(session, StringID) {
    return __awaiter(this, void 0, void 0, function () {
        var fileNodeId, clientFile;
        return __generator(this, function (_a) {
            fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, StringID, 1);
            clientFile = new node_opcua_file_transfer_1.ClientFile(session, fileNodeId);
            return [2 /*return*/, clientFile];
        });
    });
}
function open_file(clientFile) {
    return __awaiter(this, void 0, void 0, function () {
        var mode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mode = node_opcua_file_transfer_1.OpenFileMode.ReadWriteAppend;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function read_file(clientFile, bytes) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clientFile.setPosition(0)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, clientFile.read(bytes)];
                case 2:
                    data = _a.sent();
                    console.log("Contenuto del file: ", data.toString("utf-8"));
                    return [2 /*return*/, data];
            }
        });
    });
}
function download_file(data) {
    return __awaiter(this, void 0, void 0, function () {
        var my_data_filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    my_data_filename = "./downloads/someFile.txt";
                    return [4 /*yield*/, util_1.promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function download_PDF(data) {
    return __awaiter(this, void 0, void 0, function () {
        var my_data_filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    my_data_filename = "./downloads/someFile.pdf";
                    return [4 /*yield*/, util_1.promisify(fs.writeFile)(my_data_filename, data, "binary")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function size_file(clientFile) {
    return __awaiter(this, void 0, void 0, function () {
        var size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clientFile.size()];
                case 1:
                    size = _a.sent();
                    console.log("The current file size is : ", size, " bytes");
                    return [2 /*return*/];
            }
        });
    });
}
function write_file(clientFile) {
    return __awaiter(this, void 0, void 0, function () {
        var dataToWrite;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataToWrite = Buffer.from("Some data");
                    return [4 /*yield*/, clientFile.write(dataToWrite)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ending(clientFile, session) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, clientFile.close()];
                case 1:
                    _a.sent();
                    // close session
                    return [4 /*yield*/, session.close()];
                case 2:
                    // close session
                    _a.sent();
                    // disconnecting
                    return [4 /*yield*/, client.disconnect()];
                case 3:
                    // disconnecting
                    _a.sent();
                    console.log("Done!");
                    return [2 /*return*/];
            }
        });
    });
}
function call_method(session) {
    return __awaiter(this, void 0, void 0, function () {
        var methodsToCall, name, nodeID;
        return __generator(this, function (_a) {
            methodsToCall = [];
            name = Math.random().toString(10).slice(2);
            nodeID = node_opcua_1.coerceNodeId("ns=1;i=1003");
            methodsToCall.push({
                objectId: node_opcua_1.coerceNodeId("ns=1;i=1002"),
                methodId: nodeID,
                inputArguments: [{
                        dataType: node_opcua_1.DataType.String,
                        value: name
                    }]
            });
            session.call(methodsToCall, function (err, results) {
                // ....
            });
            console.log("Ho chiamato il metodo: " + nodeID);
            return [2 /*return*/, name];
        });
    });
}
