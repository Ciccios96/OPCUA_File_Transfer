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
var inquirer = require("inquirer");
var path = require("path");
var command = "";
var connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
};
//const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var question, risposta, oggettoJSON, parsedData, address, secPolicy_question, risposta, oggettoJSON3, parsedData, secMode, _a, secPolicy_question, risposta, oggettoJSON_1, parsedData, secPolicy, secPolicy_question, risposta, oggettoJSON2, parsedData, secPolicy, secPolicy_question, risposta, oggettoJSON3_1, parsedData, secPolicy, options, client, session, _b, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 32, , 33]);
                    question = [
                        {
                            type: 'input',
                            name: 'address_server',
                            message: "Enter Server endpoint URL:"
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 1:
                    risposta = _c.sent();
                    oggettoJSON = JSON.stringify(risposta, null, ' ');
                    parsedData = JSON.parse(oggettoJSON);
                    address = parsedData.address_server;
                    secPolicy_question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Select a securityMode:',
                            choices: ['1 - None', '2 - Sign', '3 - SignAndEncrypt']
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(secPolicy_question)];
                case 2:
                    risposta = _c.sent();
                    oggettoJSON3 = JSON.stringify(risposta, null, ' ');
                    parsedData = JSON.parse(oggettoJSON3);
                    secMode = parsedData.command;
                    _a = secMode;
                    switch (_a) {
                        case "1 - None": return [3 /*break*/, 3];
                        case "2 - Sign": return [3 /*break*/, 5];
                        case "3 - SignAndEncrypt": return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 3:
                    secPolicy_question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Select a Security Policy:',
                            choices: ['None']
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(secPolicy_question)];
                case 4:
                    risposta = _c.sent();
                    oggettoJSON_1 = JSON.stringify(risposta, null, ' ');
                    parsedData = JSON.parse(oggettoJSON_1);
                    secPolicy = parsedData.command;
                    return [3 /*break*/, 10];
                case 5:
                    secPolicy_question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Select a Security Policy:',
                            choices: ['Basic128Rsa15', 'Basic256', 'Basic256Sha256']
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(secPolicy_question)];
                case 6:
                    risposta = _c.sent();
                    oggettoJSON2 = JSON.stringify(risposta, null, ' ');
                    parsedData = JSON.parse(oggettoJSON2);
                    secPolicy = parsedData.command;
                    return [3 /*break*/, 10];
                case 7:
                    secPolicy_question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Select a Security Policy:',
                            choices: ['Basic128Rsa15', 'Basic256', 'Basic256Sha256']
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(secPolicy_question)];
                case 8:
                    risposta = _c.sent();
                    oggettoJSON3_1 = JSON.stringify(risposta, null, ' ');
                    parsedData = JSON.parse(oggettoJSON3_1);
                    secPolicy = parsedData.command;
                    return [3 /*break*/, 10];
                case 9:
                    console.log("Errore...");
                    _c.label = 10;
                case 10:
                    if (secMode == "1 - None") {
                        secMode = node_opcua_1.MessageSecurityMode.None;
                    }
                    else if (secMode == "2 - Sign") {
                        secMode = node_opcua_1.MessageSecurityMode.Sign;
                    }
                    else {
                        secMode = node_opcua_1.MessageSecurityMode.SignAndEncrypt;
                    }
                    if (secPolicy == "None") {
                        secPolicy = node_opcua_1.SecurityPolicy.None;
                    }
                    else if (secPolicy == "Basic128Rsa15") {
                        secPolicy = node_opcua_1.SecurityPolicy.Basic128Rsa15;
                    }
                    else if (secPolicy == "Basic256") {
                        secPolicy = node_opcua_1.SecurityPolicy.Basic256;
                    }
                    else if (secPolicy == "Basic256Sha256") {
                        secPolicy = node_opcua_1.SecurityPolicy.Basic256Sha256;
                    }
                    options = {
                        applicationName: "MyClient",
                        connectionStrategy: connectionStrategy,
                        securityMode: secMode,
                        securityPolicy: secPolicy,
                        endpoint_must_exist: false
                    };
                    client = node_opcua_1.OPCUAClient.create(options);
                    //  connect to
                    return [4 /*yield*/, connect(address, client)];
                case 11:
                    //  connect to
                    _c.sent();
                    return [4 /*yield*/, create_session(client)];
                case 12:
                    session = _c.sent();
                    _c.label = 13;
                case 13:
                    if (!(command != "exit")) return [3 /*break*/, 30];
                    return [4 /*yield*/, input()];
                case 14:
                    // user input
                    command = _c.sent();
                    _b = command;
                    switch (_b) {
                        case "browse": return [3 /*break*/, 15];
                        case "read": return [3 /*break*/, 17];
                        case "write": return [3 /*break*/, 19];
                        case "upload": return [3 /*break*/, 21];
                        case "download": return [3 /*break*/, 23];
                        case "exit": return [3 /*break*/, 25];
                        case "delete": return [3 /*break*/, 26];
                    }
                    return [3 /*break*/, 28];
                case 15: return [4 /*yield*/, browse(session)];
                case 16:
                    _c.sent();
                    return [3 /*break*/, 29];
                case 17: return [4 /*yield*/, read_file(session)];
                case 18:
                    _c.sent();
                    return [3 /*break*/, 29];
                case 19: return [4 /*yield*/, write_file(session)];
                case 20:
                    _c.sent();
                    return [3 /*break*/, 29];
                case 21: return [4 /*yield*/, call_method(session)];
                case 22:
                    _c.sent();
                    return [3 /*break*/, 29];
                case 23: return [4 /*yield*/, download(session)];
                case 24:
                    _c.sent();
                    return [3 /*break*/, 29];
                case 25: return [3 /*break*/, 29];
                case 26: return [4 /*yield*/, delete_file(session)];
                case 27:
                    _c.sent();
                    return [3 /*break*/, 29];
                case 28:
                    console.log("Wrong Input, retry");
                    return [3 /*break*/, 29];
                case 29: return [3 /*break*/, 13];
                case 30: return [4 /*yield*/, ending(session, client)];
                case 31:
                    _c.sent();
                    return [3 /*break*/, 33];
                case 32:
                    err_1 = _c.sent();
                    console.log("An error has occured : ", err_1);
                    return [3 /*break*/, 33];
                case 33: return [2 /*return*/];
            }
        });
    });
}
main();
function connect(endpoint, client) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.connect(endpoint)];
                case 1:
                    _a.sent();
                    console.log("Client connected!");
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.log("Cannot connect to endpoint:", endpoint);
                    console.log("retry");
                    process.exit(0);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function create_session(client) {
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
        var browseResult, _i, _a, reference, _b, _c, reference;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, session.browse("ns=1;i=1000")];
                case 1:
                    browseResult = _d.sent();
                    console.log("References of FileSystem :");
                    for (_i = 0, _a = browseResult.references; _i < _a.length; _i++) {
                        reference = _a[_i];
                        console.log("   -> ", reference.browseName.toString());
                    }
                    return [4 /*yield*/, session.browse("ns=1;i=1001")];
                case 2:
                    browseResult = _d.sent();
                    console.log("References of Documents :");
                    for (_b = 0, _c = browseResult.references; _b < _c.length; _b++) {
                        reference = _c[_b];
                        console.log("   -> ", reference.browseName.toString());
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function read_file(session) {
    return __awaiter(this, void 0, void 0, function () {
        var questions, risposta, oggettoJSON, parsedData, StringID, extention, browseResult, fileNodeId, clientFile, mode, bytes, byte, data, question, risposta, oggettoJSON_2, parsedData, risposta;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    questions = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'What node do you want to read?'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    StringID = parsedData.command;
                    extention = path.extname(StringID);
                    return [4 /*yield*/, session.browse("ns=1;s=" + StringID)];
                case 2:
                    browseResult = _a.sent();
                    if ((browseResult.references).length == 0) {
                        console.log("Error, file does not exists!");
                        return [2 /*return*/];
                    }
                    fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, StringID, 1);
                    clientFile = new node_opcua_file_transfer_1.ClientFile(session, fileNodeId);
                    mode = node_opcua_file_transfer_1.OpenFileMode.Read;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, clientFile.size()];
                case 4:
                    bytes = _a.sent();
                    byte = bytes[1];
                    return [4 /*yield*/, clientFile.setPosition(0)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, clientFile.read(byte)];
                case 6:
                    data = _a.sent();
                    if (extention == ".txt") {
                        console.log("File data: ", data.toString("utf-8"));
                    }
                    else {
                        console.log("Can't read binary file of a PDF");
                    }
                    question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Do you want to download it?',
                            choices: ["yes", "no"]
                        }
                    ];
                    _a.label = 7;
                case 7:
                    if (!(risposta != "yes" && risposta != "no")) return [3 /*break*/, 9];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 8:
                    risposta = _a.sent();
                    oggettoJSON_2 = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON_2);
                    risposta = parsedData.command;
                    switch (risposta) {
                        case "yes":
                            if (extention == ".txt")
                                download_file(data, StringID);
                            else if (extention == ".pdf")
                                download_PDF(data, StringID);
                            break;
                        case "no":
                            console.log("I will return to the Main Menu");
                            break;
                        default:
                            console.log("Wrong Input");
                            break;
                    }
                    return [3 /*break*/, 7];
                case 9: return [2 /*return*/];
            }
        });
    });
}
function download_file(data, StringID) {
    return __awaiter(this, void 0, void 0, function () {
        var my_data_filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    my_data_filename = "./downloads/" + StringID;
                    return [4 /*yield*/, util_1.promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function download_PDF(data, StringID) {
    return __awaiter(this, void 0, void 0, function () {
        var my_data_filename;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    my_data_filename = "./downloads/" + StringID;
                    return [4 /*yield*/, util_1.promisify(fs.writeFile)(my_data_filename, data, "binary")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function write_file(session) {
    return __awaiter(this, void 0, void 0, function () {
        var questions, risposta, oggettoJSON, parsedData, StringID, browseResult, question, risposta, oggettoJSON, parsedData, write_mode, fileNodeId, clientFile, mode, mode, mode, questions, risposta, parsedData, dato, dataToWrite;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    questions = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'What node do you want to write?'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    StringID = parsedData.command;
                    if (path.extname(StringID) != ".txt") {
                        console.log("Sorry, Can't Write a non txt File");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, session.browse("ns=1;s=" + StringID)];
                case 2:
                    browseResult = _a.sent();
                    if ((browseResult.references).length == 0) {
                        console.log("Error, file does not exists!");
                        return [2 /*return*/];
                    }
                    question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Please select a opening mode for the file',
                            choices: ["Write", "WriteAppend", "WriteEraseExisting"]
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 3:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    write_mode = parsedData.command;
                    fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, StringID, 1);
                    clientFile = new node_opcua_file_transfer_1.ClientFile(session, fileNodeId);
                    if (!(write_mode == "Write")) return [3 /*break*/, 5];
                    mode = node_opcua_file_transfer_1.OpenFileMode.Write;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 5:
                    if (!(write_mode == "WriteAppend")) return [3 /*break*/, 7];
                    mode = node_opcua_file_transfer_1.OpenFileMode.WriteAppend;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7:
                    if (!(write_mode == "WriteEraseExisting")) return [3 /*break*/, 9];
                    mode = node_opcua_file_transfer_1.OpenFileMode.WriteEraseExisting;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    questions = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'What do you want to write?'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 10:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    dato = parsedData.command;
                    dataToWrite = Buffer.from(dato);
                    return [4 /*yield*/, clientFile.write(dataToWrite)];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function ending(session, client) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // close session
                return [4 /*yield*/, session.close()];
                case 1:
                    // close session
                    _a.sent();
                    // disconnecting
                    return [4 /*yield*/, client.disconnect()];
                case 2:
                    // disconnecting
                    _a.sent();
                    console.log("Exited");
                    return [2 /*return*/];
            }
        });
    });
}
function call_method(session) {
    return __awaiter(this, void 0, void 0, function () {
        var override, questions, risposta, oggettoJSON, parsedData, name, yn, browseResult, override_question, risposta, oggettoJSON, parsedData, methodsToCall, nodeID, fileNodeId, clientFile, mode, question, risposta, parsedData, dato, dataToWrite, question, risposta, parsedData, dato, methodToCall, nodeID, question, risposta, parsedData, dato;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    override = false;
                    questions = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'Name the new file node'
                        },
                        {
                            type: 'rawlist',
                            name: 'command2',
                            message: 'Do you want to store it in documents?',
                            choices: ["yes", "no"]
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    name = parsedData.command;
                    yn = parsedData.command2;
                    if (path.extname(name) != ".txt" && path.extname(name) != ".pdf") {
                        console.log("Sorry, Can't create a non txt or pdf File");
                        return [2 /*return*/];
                    }
                    if (yn != "yes" && yn != "no") {
                        console.log("Sorry, bad input on yes or no");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, session.browse("ns=1;s=" + name)];
                case 2:
                    browseResult = _a.sent();
                    if (!((browseResult.references).length > 0)) return [3 /*break*/, 4];
                    override_question = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'The file alredy exists, do you want to override it?',
                            choices: ["yes", "no"]
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(override_question)];
                case 3:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    if (parsedData.command == "yes") {
                        override = true;
                    }
                    else if (parsedData.command == "no") {
                        return [2 /*return*/];
                    }
                    _a.label = 4;
                case 4:
                    if (!(path.extname(name) == ".txt")) return [3 /*break*/, 8];
                    if (override == false) {
                        methodsToCall = [];
                        nodeID = node_opcua_1.coerceNodeId("ns=1;i=1003");
                        methodsToCall.push({
                            objectId: node_opcua_1.coerceNodeId("ns=1;i=1002"),
                            methodId: nodeID,
                            inputArguments: [{
                                    dataType: node_opcua_1.DataType.String,
                                    value: name
                                }, {
                                    dataType: node_opcua_1.DataType.String,
                                    value: yn
                                }]
                        });
                        session.call(methodsToCall, function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                console.log("ok");
                            }
                        });
                        console.log("I have called the method: " + nodeID);
                    }
                    fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, name, 1);
                    clientFile = new node_opcua_file_transfer_1.ClientFile(session, fileNodeId);
                    mode = node_opcua_file_transfer_1.OpenFileMode.Write;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 5:
                    _a.sent();
                    question = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'What do you want to write in this node?'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 6:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    dato = parsedData.command;
                    dataToWrite = Buffer.from(dato);
                    return [4 /*yield*/, clientFile.write(dataToWrite)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    if (!(path.extname(name) == ".pdf")) return [3 /*break*/, 13];
                    if (!(override == false)) return [3 /*break*/, 10];
                    question = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'Please write the path for the .pdf file'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 9:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    dato = parsedData.command;
                    fs.readFile(dato, 'binary', function (err, binary) {
                        if (err) {
                            console.log("Error, file not found");
                            return;
                        }
                        else {
                            var methodsToCall = [];
                            var nodeID = node_opcua_1.coerceNodeId("ns=1;i=1006");
                            methodsToCall.push({
                                objectId: node_opcua_1.coerceNodeId("ns=1;i=1002"),
                                methodId: nodeID,
                                inputArguments: [{
                                        dataType: node_opcua_1.DataType.String,
                                        value: name
                                    }, {
                                        dataType: node_opcua_1.DataType.String,
                                        value: yn
                                    }, {
                                        dataType: node_opcua_1.DataType.String,
                                        value: binary
                                    }]
                            });
                            session.call(methodsToCall, function (err, results) {
                                if (err) {
                                    console.log(err);
                                    return;
                                }
                                else {
                                    null;
                                }
                            });
                            console.log("I have called the method: " + nodeID);
                        }
                    });
                    return [3 /*break*/, 13];
                case 10:
                    if (!(override == true)) return [3 /*break*/, 13];
                    methodToCall = [];
                    nodeID = node_opcua_1.coerceNodeId("ns=1;s=deleteFileObject");
                    methodToCall.push({
                        objectId: node_opcua_1.coerceNodeId("ns=1;i=1002"),
                        methodId: nodeID,
                        inputArguments: [{
                                dataType: node_opcua_1.DataType.String,
                                value: name
                            }]
                    });
                    session.call(methodToCall, function (err, results) {
                        if (err) {
                            console.log("Errore:", err);
                            return;
                        }
                        else {
                            null;
                        }
                    });
                    question = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'Please write the path for the .pdf file'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 11:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    dato = parsedData.command;
                    return [4 /*yield*/, fs.readFile(dato, 'binary', function (err, binary) {
                            if (err) {
                                console.log("Error, file not found");
                                return;
                            }
                            else {
                                var methodsToCall2 = [];
                                var nodeID2 = node_opcua_1.coerceNodeId("ns=1;s=createFileObjectpdf");
                                methodsToCall2.push({
                                    objectId: node_opcua_1.coerceNodeId("ns=1;i=1002"),
                                    methodId: nodeID2,
                                    inputArguments: [{
                                            dataType: node_opcua_1.DataType.String,
                                            value: name
                                        }, {
                                            dataType: node_opcua_1.DataType.String,
                                            value: yn
                                        }, {
                                            dataType: node_opcua_1.DataType.String,
                                            value: binary
                                        }]
                                });
                                session.call(methodsToCall2, function (err, results) {
                                    if (err) {
                                        console.log(err);
                                        return;
                                    }
                                    else {
                                        null;
                                    }
                                });
                                console.log("I have called the method: " + nodeID2);
                            }
                        })];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
function input() {
    return __awaiter(this, void 0, void 0, function () {
        var risposta, questions, oggettoJSON, parsedData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    questions = [
                        {
                            type: 'rawlist',
                            name: 'command',
                            message: 'Avaiable Commands:',
                            choices: ["browse", "read", "write", "upload", "download", "delete", "exit"]
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    return [2 /*return*/, parsedData.command.toLowerCase()];
            }
        });
    });
}
function download(session) {
    return __awaiter(this, void 0, void 0, function () {
        var questions, risposta, oggettoJSON, parsedData, StringID, extention, browseResult, fileNodeId, clientFile, mode, bytes, byte, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    questions = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'What node do you want to download?'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(questions)];
                case 1:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    StringID = parsedData.command;
                    extention = path.extname(StringID);
                    return [4 /*yield*/, session.browse("ns=1;s=" + StringID)];
                case 2:
                    browseResult = _a.sent();
                    if ((browseResult.references).length == 0) {
                        console.log("Error, file does not exists!");
                        return [2 /*return*/];
                    }
                    fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, StringID, 1);
                    clientFile = new node_opcua_file_transfer_1.ClientFile(session, fileNodeId);
                    mode = node_opcua_file_transfer_1.OpenFileMode.Read;
                    return [4 /*yield*/, clientFile.open(mode)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, clientFile.size()];
                case 4:
                    bytes = _a.sent();
                    byte = bytes[1];
                    return [4 /*yield*/, clientFile.setPosition(0)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, clientFile.read(byte)];
                case 6:
                    data = _a.sent();
                    if (extention == ".txt")
                        download_file(data, StringID);
                    else if (extention == ".pdf")
                        download_PDF(data, StringID);
                    console.log("File Downloaded");
                    return [2 /*return*/];
            }
        });
    });
}
function delete_file(session) {
    return __awaiter(this, void 0, void 0, function () {
        var question, risposta, oggettoJSON, parsedData, name, browseResult, methodToCall, nodeID;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    question = [
                        {
                            type: 'input',
                            name: 'command',
                            message: 'What file do you want to delete?'
                        }
                    ];
                    return [4 /*yield*/, inquirer.prompt(question)];
                case 1:
                    risposta = _a.sent();
                    oggettoJSON = JSON.stringify(risposta, null, '');
                    parsedData = JSON.parse(oggettoJSON);
                    name = parsedData.command;
                    return [4 /*yield*/, session.browse("ns=1;s=" + name)];
                case 2:
                    browseResult = _a.sent();
                    if ((browseResult.references).length == 0) {
                        console.log("Error, file does not exists!");
                        return [2 /*return*/];
                    }
                    methodToCall = [];
                    nodeID = node_opcua_1.coerceNodeId("ns=1;s=deleteFileObject");
                    methodToCall.push({
                        objectId: node_opcua_1.coerceNodeId("ns=1;i=1002"),
                        methodId: nodeID,
                        inputArguments: [{
                                dataType: node_opcua_1.DataType.String,
                                value: name
                            }]
                    });
                    session.call(methodToCall, function (err, results) {
                        if (err) {
                            console.log("Errore:", err);
                        }
                        else {
                            console.log("File Eliminated");
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
