/*global require,setInterval,console */
const opcua = require("node-opcua");
const util = require("util");
const fs = require("fs");
const file_transfer = require("node-opcua-file-transfer");
const path = require('path');
import {promisify} from "util";
import { NodeIdType, NodeId, StatusCodes } from "node-opcua";

var file_name;
var folder;

// Let's create an instance of OPCUAServer
const server = new opcua.OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "/UA/FileTransfer", // this path will be added to the endpoint resource name
    serverCertificateManager: new opcua.OPCUACertificateManager({
        automaticallyAcceptUnknownCertificate: true,
        rootFolder: path.join(__dirname,"./certs")
    }),
    buildInfo : {
        productName: "FileTransfer1",
        buildNumber: "7658",
        buildDate: new Date()
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
        //creazione metodo createFileObject
        const method = namespace.addMethod(objectFile,{

            nodeId: "s=createFileObjectTxt",
            browseName: "createFileObjectTxt",
        
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
            try{
                file_name = inputArguments[0].value;
                folder = inputArguments[1].value;
        
                console.log("I will create a file named ",file_name);

                var nodeid = "s=" + file_name;

                var myFile;

                if (folder == "yes"){
                    var my_data_filename = "./server_files/Documents/"+ file_name;
                    promisify(fs.writeFile)(my_data_filename,"", "utf8");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: Documents
                    })
                    file_transfer.installFileType(myFile, { 
                        filename: my_data_filename
                    }); 
                }
                else {
                    var my_data_filename = "./server_files/"+ file_name;
                    promisify(fs.writeFile)(my_data_filename,"", "utf8");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: FileSystem
                    })
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
            }catch
            {   
                if (folder == "yes"){
                    var my_data_filename = "./server_files/Documents/"+ file_name;
                    fs.unlink(my_data_filename,function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                else {
                    var my_data_filename = "./server_files/"+ file_name;
                    fs.unlink(my_data_filename,function(err){
                        if(err){
                            console.log(err);
                        }
                    })
                }
                console.log("Error on node creation");      
                callMethodResult = {
                statusCode: opcua.StatusCodes.Bad,
                outputArguments: []
            };
            }
            finally 
            {
                callback(null,callMethodResult);
            }
        });

        //creazione metodo eliminateFileObject
        const method2 = namespace.addMethod(objectFile,{

            nodeId: "s=deleteFileObject",
            browseName: "deleteFileObject",
        
            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String        
                }
             ],
            outputArguments: []
        });

        method2.bindMethod((inputArguments,context,callback) =>{
            try{
                const fileName = inputArguments[0].value;

                const fileNodeId = new NodeId(NodeIdType.STRING,fileName,1);
                
                var files=fs.readdirSync(startPath);
                for(var i=0;i<files.length;i++){
                    var filename=path.join(startPath,files[i]);
                    var stat = fs.lstatSync(filename);
                    if (stat.isDirectory()){
                        var filenames = filename;
                        var more_files=fs.readdirSync(filenames);
                        console.log(filenames);
                        for(var j=0;j<more_files.length;j++){
                            var filenames=path.join(filenames,more_files[j]);
                            if (more_files[j] == fileName){
                                const my_data_filename = path.join(__dirname,"./server_files/Documents/" + fileName);
                                promisify(fs.unlink)(my_data_filename);
                                console.log("eliminated " + my_data_filename);
                            }
                        }
                    }
                    else if (files[i] == fileName) {
                        const my_data_filename = path.join(__dirname,"./server_files/" + fileName);
                        promisify(fs.unlink)(my_data_filename);
                        console.log("eliminated " + my_data_filename);
                    };
                };

                namespace.deleteNode(fileNodeId);

                console.log("Eliminated node: ",fileName);

                var callMethodResult = {
                    statusCode: StatusCodes.Good,
                    outputArguments: []
                }
            }catch{
                var callMethodResult = {
                    statusCode: StatusCodes.Bad,
                    outputArguments: []
                }
            }finally{
                callback(null,callMethodResult);
            }
        });

        const method3 = namespace.addMethod(objectFile,{
            
            nodeId: "s=createFileObject",
            browseName: "createFileObject",
        
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
                },
                {
                    name:"bin",
                    description: { text: "specifies if the bin of the pdf"},
                    dataType: opcua.DataType.String
                }
             ],
        
            outputArguments: []
        });

        method3.bindMethod((inputArguments,context,callback) => {
            try{
                file_name = inputArguments[0].value;
                folder = inputArguments[1].value;
                var bin = inputArguments[2].value;
        
                console.log("I will create a file named ",file_name);

                var nodeid = "s=" + file_name;

                var myFile;

                if (folder == "yes"){
                    var my_data_filename = "./server_files/Documents/"+ file_name;
                    promisify(fs.writeFile)(my_data_filename,bin, "binary");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: Documents
                    })
                    file_transfer.installFileType(myFile, { 
                        filename: my_data_filename
                    }); 
                }
                else {
                    var my_data_filename = "./server_files/"+ file_name;
                    promisify(fs.writeFile)(my_data_filename,bin, "binary");
                    myFile = fileType.instantiate({
                        nodeId: nodeid,
                        browseName: file_name,
                        organizedBy: FileSystem
                    })
                    file_transfer.installFileType(myFile, { 
                        filename: my_data_filename
                    }); 
                }

                var callMethodResult;
            

                console.log("ho creato il nodo FileType");
        
                callMethodResult = {
                    statusCode: opcua.StatusCodes.Good,
                    outputArguments: []
                }
            }catch
            {   
                if (folder == "yes"){
                    var my_data_filename = "./server_files/Documents/"+ file_name;
                    fs.unlink(my_data_filename,function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                else {
                    var my_data_filename = "./server_files/"+ file_name;
                    fs.unlink(my_data_filename,function(err){
                        if(err){
                            console.log(err);
                        }
                    });
                }
                console.log("Error on node creation");      
                callMethodResult = {
                statusCode: opcua.StatusCodes.Bad,
                outputArguments: []
            }
            }
            finally 
            {
                callback(null,callMethodResult);
            }
        });

        //creazione metodo renameFileObject
        const renameFileObject = namespace.addMethod(objectFile,{

            nodeId: "s=renameFileObject",
            browseName: "renameFileObject",
                
            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String        
                },
                {
                    name:"newName",
                    description: { text: "specifies the new name"},
                    dataType: opcua.DataType.String
                }
                ],
                outputArguments: []
            });
        
        renameFileObject.bindMethod((inputArguments,context,callback) =>{
            try{
                const fileName = inputArguments[0].value;
        
                const newName = inputArguments[1].value;
        
                var documents = false;
        
                var my_new_data_filename;
        
                const fileNodeId = new NodeId(NodeIdType.STRING,fileName,1);
                        
                var files=fs.readdirSync(startPath);
                for(var i=0;i<files.length;i++){
                    var filename=path.join(startPath,files[i]);
                    var stat = fs.lstatSync(filename);
                    if (stat.isDirectory()){
                        var filenames = filename;
                        var more_files=fs.readdirSync(filenames);
                        console.log(filenames);
                        for(var j=0;j<more_files.length;j++){
                            var filenames=path.join(filenames,more_files[j]);
                            if (more_files[j] == fileName){
                                documents = true;
                                const my_data_filename = path.join(__dirname,"./server_files/Documents/" + fileName);
                                my_new_data_filename = "./server_files/Documents/" + newName;
                                fs.rename(my_data_filename, my_new_data_filename, function(err) {
                                    if ( err ) console.log('ERROR: ' + err);
                                });
                                console.log("modified name");
                            }
                        }
                    }
                    else if (files[i] == fileName) {
                        documents = false;
                        const my_data_filename = path.join(__dirname,"./server_files/" + fileName);
                        my_new_data_filename = "./server_files/" + newName;
                        fs.rename(my_data_filename, my_new_data_filename, function(err) {
                            if ( err ) console.log('ERROR: ' + err);
                        });
                        console.log("modified name");
                    };
                };
        
                namespace.deleteNode(fileNodeId);
        
                if (documents == false){
                    const myFile = fileType.instantiate({
                        nodeId: "s=" + newName,
                        browseName: newName,
                        organizedBy: FileSystem
                    })
                    
                    file_transfer.installFileType(myFile, { 
                        filename: my_new_data_filename
                    });
                }
                else if(documents == true){
                    const myFile = fileType.instantiate({
                    nodeId: "s=" + newName,
                    browseName: newName,
                    organizedBy: Documents
                })
                
                    file_transfer.installFileType(myFile, { 
                        filename: my_new_data_filename
                    });
                }
        
                var callMethodResult = {
                    statusCode: StatusCodes.Good,
                    outputArguments: []
                }
            }catch{
                var callMethodResult = {
                    statusCode: StatusCodes.Bad,
                    outputArguments: []
                }
            }finally{
                callback(null,callMethodResult);
            }
        });

        const moveFileObject = namespace.addMethod(objectFile,{

            nodeId: "s=moveFileObject",
            browseName: "moveFileObject",
                
            inputArguments:  [
                {
                    name:"filename",
                    description: { text: "specifies the name of the File" },
                    dataType: opcua.DataType.String        
                }
                ],
                outputArguments: []
            });
            
        moveFileObject.bindMethod((inputArguments,context,callback) =>{
            try{
                const fileName = inputArguments[0].value;
            
                var documents = false;
            
                var my_data_filename;
            
                const fileNodeId = new NodeId(NodeIdType.STRING,fileName,1);
                            
                var files=fs.readdirSync(startPath);
                for(var i=0;i<files.length;i++){
                    var filename=path.join(startPath,files[i]);
                    var stat = fs.lstatSync(filename);
                    if (stat.isDirectory()){
                        var filenames = filename;
                        var more_files=fs.readdirSync(filenames);
                        console.log(filenames);
                        for(var j=0;j<more_files.length;j++){
                            var filenames=path.join(filenames,more_files[j]);
                            if (more_files[j] == fileName){
                                documents = true;
                                my_data_filename = path.join(__dirname,"./server_files/Documents/" + fileName);
                                fs.readFile(my_data_filename,'binary', async function(err,binary){
                                    if (err){
                                        console.log("Error, file not found");
                                        return;
                                    }else{
                                        promisify(fs.writeFile)("./server_files/" + fileName, binary, "binary");
                                    }
                                });
                                promisify(fs.unlink)(my_data_filename);
                            }
                        }
                    }
                    else if (files[i] == fileName) {
                        documents = false;
                        my_data_filename = path.join(__dirname,"./server_files/" + fileName);
                        fs.readFile(my_data_filename,'binary', async function(err,binary){
                            if (err){
                                console.log("Error, file not found");
                                return;
                            }else{
                                await promisify(fs.writeFile)("./server_files/Documents/" + fileName, binary, "binary");
                            }
                        });
                        promisify(fs.unlink)(my_data_filename);
                    };
                };
            
                namespace.deleteNode(fileNodeId);
            
                if (documents == false){
                    const myFile = fileType.instantiate({
                        nodeId: "s=" + fileName,
                        browseName: fileName,
                        organizedBy: Documents
                    })
                        
                    file_transfer.installFileType(myFile, { 
                        filename: "./server_files/Documents/" + fileName
                    });
                }
                else if(documents == true){
                    const myFile = fileType.instantiate({
                    nodeId: "s=" + fileName,
                    browseName: fileName,
                    organizedBy: FileSystem
                })
                    
                    file_transfer.installFileType(myFile, { 
                        filename: "./server_files/" + fileName
                    });
                }
            
                var callMethodResult = {
                    statusCode: StatusCodes.Good,
                    outputArguments: []
                    }
                }catch{
                var callMethodResult = {
                    statusCode: StatusCodes.Bad,
                    outputArguments: []
                }
            }finally{
                callback(null,callMethodResult);
            }
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
            filename: filename
        });
        };
    };
};