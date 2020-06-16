"use strict";
exports.__esModule = true;
/*global require,setInterval,console */
var opcua = require("node-opcua");
var util = require("util");
var fs = require("fs");
var file_transfer = require("node-opcua-file-transfer");
var path = require('path');
var util_1 = require("util");
// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/FileTransfer",
    serverCertificateManager: new opcua.OPCUACertificateManager({
        automaticallyAcceptUnknownCertificate: true,
        rootFolder: path.join(__dirname, "../certs")
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
        //creazione metodo
        var method = namespace.addMethod(objectFile, {
            browseName: "createFile",
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
                var file_name = inputArguments[0].value;
                var folder = inputArguments[1].value;
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
