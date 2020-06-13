/*global require,setInterval,console */
const opcua = require("node-opcua");
const util = require("util");
const fs = require("fs");
const file_transfer = require("node-opcua-file-transfer");
const path = require('path');
import {promisify} from "util";

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

        var startPath = "./server_files";
    
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

        node_creation(startPath,fileType,FileSystem,Documents,false);

        //oggetto per ospitare il metodo
        const objectFile = namespace.addObject({
            organizedBy: FileSystem,
            browseName: "ObjectFile"
        });
        //creazione metodo
        const method = namespace.addMethod(objectFile,{

            browseName: "createFile",
        
            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String        
                },
                {
                    name:"folder",
                    description: { text: "specifies if the node must be in the FileSystem or Documents"},
                    dataType: opcua.DataType.String
                }
             ],
        
            outputArguments: []
        });

        method.bindMethod((inputArguments,context,callback) => {

            const file_name = inputArguments[0].value;
            const folder = inputArguments[1].value;
        
            console.log("Hello World ! I will create a file named ",file_name);

            var nodeid = "s=" + file_name;

            const my_data_filename3 = "./server_files/"+ file_name;
            promisify(fs.writeFile)(my_data_filename3,"", "utf8");

            var myFile4;

            if (folder == "y"){
                myFile4 = fileType.instantiate({
                    nodeId: nodeid,
                    browseName: file_name,
                    organizedBy: Documents
                })
            }
            else {
                myFile4 = fileType.instantiate({
                    nodeId: nodeid,
                    browseName: file_name,
                    organizedBy: FileSystem
                })
            }
    
            file_transfer.installFileType(myFile4, { 
                filename: my_data_filename3
            }); 

            console.log("ho creato il nodo FileType");
        
            const callMethodResult = {
                statusCode: opcua.StatusCodes.Good,
                outputArguments: []
            };
            callback(null,callMethodResult);
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

function node_creation(startPath,fileType,folder,folder2,recursive){
    var files=fs.readdirSync(startPath);
    if (recursive == true){
        var organized = folder2
    }
    else var organized = folder
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            node_creation(filename,fileType,folder,folder2,true);
        }
        else {
            const myFile = fileType.instantiate({
            nodeId: "s=" + files[i],
            browseName: files[i],
            organizedBy: organized
        })

        file_transfer.installFileType(myFile, { 
            filename: files[i]
        });
        };
    };
};