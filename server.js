"use strict";
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
            browseName: "createFileObjecttxt",
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
                        for (var i = 0; i < more_files.length; i++) {
                            var filenames = path.join(filenames, more_files[i]);
                            if (more_files[i] == fileName) {
                                var my_data_filename = path.join(__dirname, "./server_files/Documents/" + fileName);
                                util_1.promisify(fs.unlink)(my_data_filename);
                            }
                        }
                    }
                    else if (files[i] == fileName) {
                        var my_data_filename = path.join(__dirname, "./server_files/" + fileName);
                        util_1.promisify(fs.unlink)(my_data_filename);
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
            nodeId: "s=createFileObjectpdf",
            browseName: "createFileObjectpdf",
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
