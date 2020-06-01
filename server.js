/*global require,setInterval,console */
const opcua = require("node-opcua");
const util = require("util");
const fs = require("fs");
const file_transfer = require("node-opcua-file-transfer");

// Let's create an instance of OPCUAServer
const server = new opcua.OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "/UA/MyLittleServer", // this path will be added to the endpoint resource name
     buildInfo : {
        productName: "MySampleServer1",
        buildNumber: "7658",
        buildDate: new Date(2014,5,2)
    }
});

function post_initialize() {
    console.log("initialized");

    function construct_my_address_space(server) {

        const my_data_filename = "/file.txt";
    
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();
        
        //creazione folders

        const FileSystem = namespace.addFolder(addressSpace.rootFolder,{
            browseName: "FileSystem"
        }); 

        const Documents = namespace.addFolder(FileSystem,{
            browseName: "Documents"
        });

        //instanzio il fileType
        const fileType = addressSpace.findObjectType("FileType");

        //creo i vari nodi filetype
        const myFile = fileType.instantiate({
            nodeId: "s=MyFile",
            browseName: "MyFile",
            organizedBy: FileSystem
        })

        file_transfer.installFileType(myFile, { 
            filename: my_data_filename
        });

        const myFile2 = fileType.instantiate({
            nodeId: "s=Document_File",
            browseName: "Document_File",
            organizedBy: Documents
        })

        file_transfer.installFileType(myFile2, { 
            filename: my_data_filename
        });         

    }
    construct_my_address_space(server);
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        const endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });


}
server.initialize(post_initialize);