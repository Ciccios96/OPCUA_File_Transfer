/*global require,setInterval,console */
const opcua = require("node-opcua");
const util = require("util");
const fs = require("fs");
const file_transfer = require("node-opcua-file-transfer");
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

        const my_data_filename1 = "./server_files/file.txt";
        const my_data_filename2 = "./server_files/prova.pdf";
        const my_data_filename3 = "./server_files/dummy.txt";
    
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
            filename: my_data_filename1
        });

        const myFile2 = fileType.instantiate({
            nodeId: "s=Document_File",
            browseName: "Document_File",
            organizedBy: Documents
        })

        file_transfer.installFileType(myFile2, { 
            filename: my_data_filename1
        });  
        
        const myFile3 = fileType.instantiate({
            nodeId: "s=PDF_File",
            browseName: "PDF_File",
            organizedBy: FileSystem
        })

        file_transfer.installFileType(myFile3, { 
            filename: my_data_filename2
        }); 

        const objectFile = namespace.addObject({
            organizedBy: FileSystem,
            browseName: "ObjectFile"
        });

        const method = namespace.addMethod(objectFile,{

            browseName: "createFile",
        
            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String        
                }
             ],
        
            outputArguments: []
        });

        method.bindMethod((inputArguments,context,callback) => {

            const file_name = inputArguments[0].value;
        
            console.log("Hello World ! I will create a file named ",file_name);

            var nodeid = "s=" + file_name;

            const my_data_filename3 = "./server_files/"+ file_name;
            promisify(fs.writeFile)(my_data_filename3,"", "utf8");

            const myFile4 = fileType.instantiate({
                nodeId: nodeid,
                browseName: file_name,
                organizedBy: FileSystem
            })
    
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