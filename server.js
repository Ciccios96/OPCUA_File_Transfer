"use strict";
exports.__esModule = true;
/*global require,setInterval,console */
var opcua = require("node-opcua");
var util = require("util");
var fs = require("fs");
var file_transfer = require("node-opcua-file-transfer");
var util_1 = require("util");
// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/MyLittleServer",
    buildInfo: {
        productName: "MySampleServer1",
        buildNumber: "7658",
        buildDate: new Date(2014, 5, 2)
    }
});
function post_initialize() {
    console.log("initialized");
    function construct_my_address_space(server) {
        var my_data_filename1 = "./server_files/Document_File.txt";
        var my_data_filename2 = "./server_files/prova.pdf";
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
        var myFile = fileType.instantiate({
            nodeId: "s=MyFile.txt",
            browseName: "MyFile.txt",
            organizedBy: FileSystem
        });
        file_transfer.installFileType(myFile, {
            filename: my_data_filename1
        });
        var myFile2 = fileType.instantiate({
            nodeId: "s=Document_File.txt",
            browseName: "Document_File.txt",
            organizedBy: Documents
        });
        file_transfer.installFileType(myFile2, {
            filename: my_data_filename1
        });
        var myFile3 = fileType.instantiate({
            nodeId: "s=PDF_File.pdf",
            browseName: "PDF_File.pdf",
            organizedBy: FileSystem
        });
        file_transfer.installFileType(myFile3, {
            filename: my_data_filename2
        });
        var objectFile = namespace.addObject({
            organizedBy: FileSystem,
            browseName: "ObjectFile"
        });
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
            var file_name = inputArguments[0].value;
            var folder = inputArguments[1].value;
            console.log("Hello World ! I will create a file named ", file_name);
            var nodeid = "s=" + file_name;
            var my_data_filename3 = "./server_files/" + file_name;
            util_1.promisify(fs.writeFile)(my_data_filename3, "", "utf8");
            var myFile4;
            if (folder == "y") {
                myFile4 = fileType.instantiate({
                    nodeId: nodeid,
                    browseName: file_name,
                    organizedBy: Documents
                });
            }
            else {
                myFile4 = fileType.instantiate({
                    nodeId: nodeid,
                    browseName: file_name,
                    organizedBy: FileSystem
                });
            }
            file_transfer.installFileType(myFile4, {
                filename: my_data_filename3
            });
            console.log("ho creato il nodo FileType");
            var callMethodResult = {
                statusCode: opcua.StatusCodes.Good,
                outputArguments: []
            };
            callback(null, callMethodResult);
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
