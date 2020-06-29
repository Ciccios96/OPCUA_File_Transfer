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
/*global require,setInterval,console */
var opcua = require("node-opcua");
var util = require("util");
var fs = require("fs");
var file_transfer = require("node-opcua-file-transfer");
var path = require('path');
var util_1 = require("util");
var node_opcua_1 = require("node-opcua");
var file_name;
var folder;
// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/FileTransfer",
    serverCertificateManager: new opcua.OPCUACertificateManager({
        automaticallyAcceptUnknownCertificate: true,
        rootFolder: path.join(__dirname, "./certs")
    }),
    buildInfo: {
        productName: "FileTransfer1",
        buildNumber: "7658",
        buildDate: new Date()
    }
});
function post_initialize() {
    console.log("initialized");
    function construct_my_address_space(server) {
        var startPath = "./server_files";
        var addressSpace = server.engine.addressSpace;
        var namespace = addressSpace.getOwnNamespace();
        //creazione folders
        var FileSystem = namespace.addFolder(addressSpace.rootFolder, {
            browseName: "FileSystem"
        });
        var Documents = namespace.addFolder(FileSystem, {
            browseName: "Documents"
        });
        //instanzio il fileType
        var fileType = addressSpace.findObjectType("FileType");
        //creo i vari nodi filetype
        node_creation(startPath, fileType, FileSystem, Documents, false);
        //oggetto per ospitare il metodo
        var objectFile = namespace.addObject({
            organizedBy: FileSystem,
            browseName: "ObjectFile"
        });
        //creazione metodo createFileObject
        var method = namespace.addMethod(objectFile, {
            nodeId: "s=createFileObjectTxt",
            browseName: "createFileObjectTxt",
            inputArguments: [
                {
                    name: "filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String
                },
                {
                    name: "folder",
                    description: { text: "specifies if the node must be in the FileSystem or Documents" },
                    dataType: opcua.DataType.String
                }
            ],
            outputArguments: []
        });
        method.bindMethod(function (inputArguments, context, callback) {
            try {
                file_name = inputArguments[0].value;
                folder = inputArguments[1].value;
                console.log("I will create a file named ", file_name);
                var nodeid = "s=" + file_name;
                var myFile;
                if (folder == "yes") {
                    var my_data_filename = "./server_files/Documents/" + file_name;
                    util_1.promisify(fs.writeFile)(my_data_filename, "", "utf8");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: Documents
                    });
                    file_transfer.installFileType(myFile, {
                        filename: my_data_filename
                    });
                }
                else {
                    var my_data_filename = "./server_files/" + file_name;
                    util_1.promisify(fs.writeFile)(my_data_filename, "", "utf8");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: FileSystem
                    });
                    file_transfer.installFileType(myFile, {
                        filename: my_data_filename
                    });
                }
                var callMethodResult;
                console.log("ho creato il nodo FileType");
                callMethodResult = {
                    statusCode: opcua.StatusCodes.Good,
                    outputArguments: []
                };
            }
            catch (_a) {
                if (folder == "yes") {
                    var my_data_filename = "./server_files/Documents/" + file_name;
                    fs.unlink(my_data_filename, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    var my_data_filename = "./server_files/" + file_name;
                    fs.unlink(my_data_filename, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                console.log("Error on node creation");
                callMethodResult = {
                    statusCode: opcua.StatusCodes.Bad,
                    outputArguments: []
                };
            }
            finally {
                callback(null, callMethodResult);
            }
        });
        //creazione metodo eliminateFileObject
        var method2 = namespace.addMethod(objectFile, {
            nodeId: "s=deleteFileObject",
            browseName: "deleteFileObject",
            inputArguments: [
                {
                    name: "filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String
                }
            ],
            outputArguments: []
        });
        method2.bindMethod(function (inputArguments, context, callback) {
            try {
                var fileName = inputArguments[0].value;
                var fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, fileName, 1);
                var files = fs.readdirSync(startPath);
                for (var i = 0; i < files.length; i++) {
                    var filename = path.join(startPath, files[i]);
                    var stat = fs.lstatSync(filename);
                    if (stat.isDirectory()) {
                        var filenames = filename;
                        var more_files = fs.readdirSync(filenames);
                        console.log(filenames);
                        for (var j = 0; j < more_files.length; j++) {
                            var filenames = path.join(filenames, more_files[j]);
                            if (more_files[j] == fileName) {
                                var my_data_filename = path.join(__dirname, "./server_files/Documents/" + fileName);
                                util_1.promisify(fs.unlink)(my_data_filename);
                                console.log("eliminated " + my_data_filename);
                            }
                        }
                    }
                    else if (files[i] == fileName) {
                        var my_data_filename = path.join(__dirname, "./server_files/" + fileName);
                        util_1.promisify(fs.unlink)(my_data_filename);
                        console.log("eliminated " + my_data_filename);
                    }
                    ;
                }
                ;
                namespace.deleteNode(fileNodeId);
                console.log("Eliminated node: ", fileName);
                var callMethodResult = {
                    statusCode: node_opcua_1.StatusCodes.Good,
                    outputArguments: []
                };
            }
            catch (_a) {
                var callMethodResult = {
                    statusCode: node_opcua_1.StatusCodes.Bad,
                    outputArguments: []
                };
            }
            finally {
                callback(null, callMethodResult);
            }
        });
        var method3 = namespace.addMethod(objectFile, {
            nodeId: "s=createFileObject",
            browseName: "createFileObject",
            inputArguments: [
                {
                    name: "filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String
                },
                {
                    name: "folder",
                    description: { text: "specifies if the node must be in the FileSystem or Documents" },
                    dataType: opcua.DataType.String
                },
                {
                    name: "bin",
                    description: { text: "specifies if the bin of the pdf" },
                    dataType: opcua.DataType.String
                }
            ],
            outputArguments: []
        });
        method3.bindMethod(function (inputArguments, context, callback) {
            try {
                file_name = inputArguments[0].value;
                folder = inputArguments[1].value;
                var bin = inputArguments[2].value;
                console.log("I will create a file named ", file_name);
                var nodeid = "s=" + file_name;
                var myFile;
                if (folder == "yes") {
                    var my_data_filename = "./server_files/Documents/" + file_name;
                    util_1.promisify(fs.writeFile)(my_data_filename, bin, "binary");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: Documents
                    });
                    file_transfer.installFileType(myFile, {
                        filename: my_data_filename
                    });
                }
                else {
                    var my_data_filename = "./server_files/" + file_name;
                    util_1.promisify(fs.writeFile)(my_data_filename, bin, "binary");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: FileSystem
                    });
                    file_transfer.installFileType(myFile, {
                        filename: my_data_filename
                    });
                }
                var callMethodResult;
                console.log("ho creato il nodo FileType");
                callMethodResult = {
                    statusCode: opcua.StatusCodes.Good,
                    outputArguments: []
                };
            }
            catch (_a) {
                if (folder == "yes") {
                    var my_data_filename = "./server_files/Documents/" + file_name;
                    fs.unlink(my_data_filename, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    var my_data_filename = "./server_files/" + file_name;
                    fs.unlink(my_data_filename, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                console.log("Error on node creation");
                callMethodResult = {
                    statusCode: opcua.StatusCodes.Bad,
                    outputArguments: []
                };
            }
            finally {
                callback(null, callMethodResult);
            }
        });
        //creazione metodo renameFileObject
        var renameFileObject = namespace.addMethod(objectFile, {
            nodeId: "s=renameFileObject",
            browseName: "renameFileObject",
            inputArguments: [
                {
                    name: "filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String
                },
                {
                    name: "newName",
                    description: { text: "specifies the new name" },
                    dataType: opcua.DataType.String
                }
            ],
            outputArguments: []
        });
        renameFileObject.bindMethod(function (inputArguments, context, callback) {
            try {
                var fileName = inputArguments[0].value;
                var newName = inputArguments[1].value;
                var documents = false;
                var my_new_data_filename;
                var fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, fileName, 1);
                var files = fs.readdirSync(startPath);
                for (var i = 0; i < files.length; i++) {
                    var filename = path.join(startPath, files[i]);
                    var stat = fs.lstatSync(filename);
                    if (stat.isDirectory()) {
                        var filenames = filename;
                        var more_files = fs.readdirSync(filenames);
                        console.log(filenames);
                        for (var j = 0; j < more_files.length; j++) {
                            var filenames = path.join(filenames, more_files[j]);
                            if (more_files[j] == fileName) {
                                documents = true;
                                var my_data_filename = path.join(__dirname, "./server_files/Documents/" + fileName);
                                my_new_data_filename = "./server_files/Documents/" + newName;
                                fs.rename(my_data_filename, my_new_data_filename, function (err) {
                                    if (err)
                                        console.log('ERROR: ' + err);
                                });
                                console.log("modified name");
                            }
                        }
                    }
                    else if (files[i] == fileName) {
                        documents = false;
                        var my_data_filename = path.join(__dirname, "./server_files/" + fileName);
                        my_new_data_filename = "./server_files/" + newName;
                        fs.rename(my_data_filename, my_new_data_filename, function (err) {
                            if (err)
                                console.log('ERROR: ' + err);
                        });
                        console.log("modified name");
                    }
                    ;
                }
                ;
                namespace.deleteNode(fileNodeId);
                if (documents == false) {
                    var myFile = fileType.instantiate({
                        nodeId: "s=" + newName,
                        browseName: newName,
                        organizedBy: FileSystem
                    });
                    file_transfer.installFileType(myFile, {
                        filename: my_new_data_filename
                    });
                }
                else if (documents == true) {
                    var myFile = fileType.instantiate({
                        nodeId: "s=" + newName,
                        browseName: newName,
                        organizedBy: Documents
                    });
                    file_transfer.installFileType(myFile, {
                        filename: my_new_data_filename
                    });
                }
                var callMethodResult = {
                    statusCode: node_opcua_1.StatusCodes.Good,
                    outputArguments: []
                };
            }
            catch (_a) {
                var callMethodResult = {
                    statusCode: node_opcua_1.StatusCodes.Bad,
                    outputArguments: []
                };
            }
            finally {
                callback(null, callMethodResult);
            }
        });
        var moveFileObject = namespace.addMethod(objectFile, {
            nodeId: "s=moveFileObject",
            browseName: "moveFileObject",
            inputArguments: [
                {
                    name: "filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String
                }
            ],
            outputArguments: []
        });
        moveFileObject.bindMethod(function (inputArguments, context, callback) {
            try {
                var fileName_1 = inputArguments[0].value;
                var documents = false;
                var my_data_filename;
                var fileNodeId = new node_opcua_1.NodeId(node_opcua_1.NodeIdType.STRING, fileName_1, 1);
                var files = fs.readdirSync(startPath);
                for (var i = 0; i < files.length; i++) {
                    var filename = path.join(startPath, files[i]);
                    var stat = fs.lstatSync(filename);
                    if (stat.isDirectory()) {
                        var filenames = filename;
                        var more_files = fs.readdirSync(filenames);
                        console.log(filenames);
                        for (var j = 0; j < more_files.length; j++) {
                            var filenames = path.join(filenames, more_files[j]);
                            if (more_files[j] == fileName_1) {
                                documents = true;
                                my_data_filename = path.join(__dirname, "./server_files/Documents/" + fileName_1);
                                fs.readFile(my_data_filename, 'binary', function (err, binary) {
                                    return __awaiter(this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            if (err) {
                                                console.log("Error, file not found");
                                                return [2 /*return*/];
                                            }
                                            else {
                                                util_1.promisify(fs.writeFile)("./server_files/" + fileName_1, binary, "binary");
                                            }
                                            return [2 /*return*/];
                                        });
                                    });
                                });
                                util_1.promisify(fs.unlink)(my_data_filename);
                            }
                        }
                    }
                    else if (files[i] == fileName_1) {
                        documents = false;
                        my_data_filename = path.join(__dirname, "./server_files/" + fileName_1);
                        fs.readFile(my_data_filename, 'binary', function (err, binary) {
                            return __awaiter(this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!err) return [3 /*break*/, 1];
                                            console.log("Error, file not found");
                                            return [2 /*return*/];
                                        case 1: return [4 /*yield*/, util_1.promisify(fs.writeFile)("./server_files/Documents/" + fileName_1, binary, "binary")];
                                        case 2:
                                            _a.sent();
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            });
                        });
                        util_1.promisify(fs.unlink)(my_data_filename);
                    }
                    ;
                }
                ;
                namespace.deleteNode(fileNodeId);
                if (documents == false) {
                    var myFile = fileType.instantiate({
                        nodeId: "s=" + fileName_1,
                        browseName: fileName_1,
                        organizedBy: FileSystem
                    });
                    file_transfer.installFileType(myFile, {
                        filename: "./server_files/" + fileName_1
                    });
                }
                else if (documents == true) {
                    var myFile = fileType.instantiate({
                        nodeId: "s=" + fileName_1,
                        browseName: fileName_1,
                        organizedBy: Documents
                    });
                    file_transfer.installFileType(myFile, {
                        filename: "./server_files/Documents/" + fileName_1
                    });
                }
                var callMethodResult = {
                    statusCode: node_opcua_1.StatusCodes.Good,
                    outputArguments: []
                };
            }
            catch (_a) {
                var callMethodResult = {
                    statusCode: node_opcua_1.StatusCodes.Bad,
                    outputArguments: []
                };
            }
            finally {
                callback(null, callMethodResult);
            }
        });
    }
    construct_my_address_space(server);
    server.start(function () {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl);
    });
}
server.initialize(post_initialize);
function node_creation(startPath, fileType, folder, folder2, recursive) {
    var files = fs.readdirSync(startPath);
    if (recursive == true) {
        var organized = folder2;
    }
    else
        var organized = folder;
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            node_creation(filename, fileType, folder, folder2, true);
        }
        else {
            var myFile = fileType.instantiate({
                nodeId: "s=" + files[i],
                browseName: files[i],
                organizedBy: organized
            });
            file_transfer.installFileType(myFile, {
                filename: filename
            });
        }
        ;
    }
    ;
}
;
