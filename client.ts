import {
    OPCUAClient,
    MessageSecurityMode, SecurityPolicy,
    NodeId,
    NodeIdType,
    coerceNodeId,
    DataType,
    MethodIds
} from "node-opcua";
import { ClientFile, OpenFileMode } from "node-opcua-file-transfer";
import {promisify} from "util";
const fs = require("fs");
const inquirer = require("inquirer");
const path = require("path");
var command = "";

const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
}
//const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

async function main() {
    try {
        var question = [
            {
              type: 'input',
              name: 'address_server',
              message: "Enter Server endpoint URL:"
            }
        ];
        var risposta = await inquirer.prompt(question);
        var oggettoJSON = JSON.stringify(risposta, null, ' ');
        var parsedData = JSON.parse(oggettoJSON);
        var address = parsedData.address_server;

        var secPolicy_question = [
            {
                type: 'rawlist',
                name: 'command',
                message: 'Select a securityMode:',
                choices: ['1 - None', '2 - Sign', '3 - SignAndEncrypt']
            }
        ];
        var risposta = await inquirer.prompt(secPolicy_question);
        const oggettoJSON3 = JSON.stringify(risposta, null, ' ');
        var parsedData = JSON.parse(oggettoJSON3);
        var secMode = parsedData.command;

        switch(secMode) {
            case "1 - None":
                var secPolicy_question = [
                    {
                        type: 'rawlist',
                        name: 'command',
                        message: 'Select a Security Policy:',
                        choices: ['None']
                    }
                ];
                var risposta = await inquirer.prompt(secPolicy_question);
                const oggettoJSON = JSON.stringify(risposta, null, ' ');
                var parsedData = JSON.parse(oggettoJSON);
                var secPolicy = parsedData.command;
                break;
            case "2 - Sign":
                var secPolicy_question = [
                    {
                        type: 'rawlist',
                        name: 'command',
                        message: 'Select a Security Policy:',
                        choices: ['Basic128Rsa15', 'Basic256', 'Basic256Sha256']
                    }
                ];
                var risposta = await inquirer.prompt(secPolicy_question);
                const oggettoJSON2 = JSON.stringify(risposta, null, ' ');
                var parsedData = JSON.parse(oggettoJSON2);
                var secPolicy = parsedData.command;
                break;
            case "3 - SignAndEncrypt":
                var secPolicy_question = [
                    {
                        type: 'rawlist',
                        name: 'command',
                        message: 'Select a Security Policy:',
                        choices: ['Basic128Rsa15', 'Basic256', 'Basic256Sha256']
                    }
                ];
                var risposta = await inquirer.prompt(secPolicy_question);
                const oggettoJSON3 = JSON.stringify(risposta, null, ' ');
                var parsedData = JSON.parse(oggettoJSON3);
                var secPolicy = parsedData.command;
                break;
            default:
                console.log("Errore...");
            }

        if(secMode == "1 - None"){
           secMode = MessageSecurityMode.None;
        }else if(secMode == "2 - Sign"){
            secMode = MessageSecurityMode.Sign;
        }else {
            secMode = MessageSecurityMode.SignAndEncrypt;
        }

        if(secPolicy == "None"){
            secPolicy = SecurityPolicy.None;
        }else if (secPolicy == "Basic128Rsa15"){
            secPolicy = SecurityPolicy.Basic128Rsa15;
        }else if (secPolicy == "Basic256"){
            secPolicy = SecurityPolicy.Basic256;
        }else if (secPolicy == "Basic256Sha256"){
            secPolicy = SecurityPolicy.Basic256Sha256;
        }
        const options = {
            applicationName: "MyClient",
            connectionStrategy: connectionStrategy,
            securityMode: secMode,
            securityPolicy: secPolicy,
            endpoint_must_exist: false,
        };

        const client = OPCUAClient.create(options);
        
    //  connect to
        await connect(address,client);
            
    // createSession
        const session = await create_session(client);
 
    while(command != "exit"){
    // user input
        command = await input();

        switch(command){
            case "browse":
                await browse(session);
                break;
            case "read":
                await read_file(session);
                break;
            case "write":
                await write_file(session);
                break;
            case "upload":
                await create_file(session);
                break;
            case "download":
                await download(session);
                break;
            case "exit":
                break;
            case "delete":
                await delete_file(session);
                break;
            case "rename":
                await rename(session);
                break;
            case "move":
                break;
            default:
                console.log("Wrong Input, retry");
                break;
            }
        }
    await ending(session,client);
    } catch(err) {
        console.log("An error has occured : ",err);
        }
    
}
main();

async function connect(endpoint,client){
    try {
        await client.connect(endpoint);
        console.log("Client connected!");
    } catch (err) {
        console.log("Cannot connect to endpoint:", endpoint);
        console.log("retry");
        process.exit(0);
    }
}

async function create_session(client){
    const session = await client.createSession();
    console.log("Session created!");
    return session;
}

async function browse(session){
    var browseResult = await session.browse("ns=1;i=1000");
     
    console.log("References of FileSystem :");
    for(const reference of browseResult.references) {
        console.log( "   -> ", reference.browseName.toString());
    }

    browseResult = await session.browse("ns=1;i=1001");
     
    console.log("References of Documents :");
    for(const reference of browseResult.references) {
        console.log( "   -> ", reference.browseName.toString());
    }
}

async function read_file(session){
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'What node do you want to read?'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    const oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var StringID = parsedData.command;
    var extension = path.extname(StringID);

    var browseResult = await session.browse("ns=1;s=" + StringID);
    if ((browseResult.references).length == 0) {
        console.log("Error, file does not exists!");
        return;
    }

    const fileNodeId = new NodeId(NodeIdType.STRING, StringID, 1);
    const clientFile = new ClientFile(session, fileNodeId);
    const mode = OpenFileMode.Read;

    await clientFile.open(mode);

    var bytes = await clientFile.size();

    var byte = bytes[1];
    await clientFile.setPosition(0);
    const data: Buffer = await clientFile.read(byte);
    if(extension == ".txt"){
        console.log("File data: ", data.toString("utf-8"));
    }else{
        console.log("Can't read binary file of a PDF");
    }
    var question = [
        {
            type: 'rawlist',
            name: 'command',
            message: 'Do you want to download it?',
            choices: ["yes","no"]
        }
    ];
    
    var risposta = await inquirer.prompt(question);
    const oggettoJSON2 = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON2);
    var risposta = parsedData.command;
    switch(risposta){
        case "yes":
            if(extension == ".txt")
                download_file_txt(data,StringID);
            else
                download_file(data,StringID);
            break;
        case "no":
            console.log("I will return to the Main Menu");
            break;
        default:
            console.log("Wrong Input");
            break;
    }
    
    console.log("Operation Succesful");
}

async function download_file_txt(data,StringID){
    const my_data_filename = "./downloads/" + StringID;
    await promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8");
}

async function download_file(data,StringID){
    const my_data_filename = "./downloads/" + StringID;
    await promisify(fs.writeFile)(my_data_filename, data, "binary");
}

async function write_file(session){
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'What node do you want to write?'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    var oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var StringID = parsedData.command;
    if (path.extname(StringID) != ".txt"){
        console.log("Sorry, Can't Write a non txt File");
        return;
    }

    var browseResult = await session.browse("ns=1;s=" + StringID);
    if ((browseResult.references).length == 0) {
        console.log("Error, file does not exists!");
        return;
    }

    var question = [
        {
            type: 'rawlist',
            name: 'command',
            message: 'Please select a opening mode for the file',
            choices: ["Write","WriteAppend","WriteEraseExisting"]
        }
    ];
    var risposta = await inquirer.prompt(question);
    var oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var write_mode = parsedData.command;

    const fileNodeId = new NodeId(NodeIdType.STRING, StringID, 1);
    const clientFile = new ClientFile(session, fileNodeId);

    if(write_mode == "Write"){
        const mode = OpenFileMode.Write;
        await clientFile.open(mode);
    }else if(write_mode == "WriteAppend"){
        const mode = OpenFileMode.WriteAppend;
        await clientFile.open(mode);
    }else if(write_mode == "WriteEraseExisting"){
        const mode = OpenFileMode.WriteEraseExisting;
        await clientFile.open(mode);
    }

    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'What do you want to write?'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var dato = parsedData.command;
    
    const dataToWrite = Buffer.from(dato);
    await clientFile.write(dataToWrite);

    console.log("Operation Succesful");
}

async function ending(session,client){
    // close session
    await session.close();
 
    // disconnecting
    await client.disconnect();
    console.log("Exited");
}

async function create_file(session) {
    var override = false;
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'Name the new file node'
        },
        {
            type: 'rawlist',
            name: 'command2',
            message: 'Do you want to store it in documents?',
            choices: ["yes","no"]
        }
    ];
    var risposta = await inquirer.prompt(questions);
    var oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var name = parsedData.command;
    var yn = parsedData.command2;
    var extension = path.extname(name);

    if(! /\.(jpe?g|png|gif|bmp|docx|pdf|txt|pptx)$/i.test(name + extension)){
        console.log("This file is not supported");
        return
    }

    var browseResult = await session.browse("ns=1;s=" + name);
    if ((browseResult.references).length > 0) {
        var override_question = [
            {
                type: 'rawlist',
                name: 'command',
                message: 'The file alredy exists, do you want to override it?',
                choices: ["yes","no"]
            }
        ];
        var risposta = await inquirer.prompt(override_question);
        var oggettoJSON = JSON.stringify(risposta,null,'');
        var parsedData = JSON.parse(oggettoJSON);
        var yn_override = parsedData.command;
        if (yn_override == "yes"){
            override = true;
        } else 
            return;
    }

    if(override == false){
        var question = [
            {
                type: 'input',
                name: 'command',
                message: 'Please write the path for the file'
            }
        ];
        var risposta = await inquirer.prompt(question);
        oggettoJSON = JSON.stringify(risposta,null,'');
        var parsedData = JSON.parse(oggettoJSON);
        var dato = parsedData.command;

        fs.readFile(dato,'binary', async function(err,binary){
            if (err){
                console.log("Error, file not found");
                return;
            }else{
                const methodsToCall = [];
                const nodeID = coerceNodeId("ns=1;s=createFileObject");
                methodsToCall.push({
                objectId: coerceNodeId("ns=1;i=1002"),
                methodId: nodeID,
                inputArguments: [{
                    dataType: DataType.String,
                    value: name
                },{
                    dataType: DataType.String,
                    value: yn
                },{
                    dataType: DataType.String,
                    value: binary
                }]
                });
                session.call(methodsToCall, function(err,results){
                if (err){
                    console.log(err);
                    return;
                }
                });
                const fileNodeId = new NodeId(NodeIdType.STRING, name, 1);
                const clientFile = new ClientFile(session, fileNodeId);
                const mode = OpenFileMode.WriteAppend;
    
                await clientFile.open(mode);
                const dataToWrite = Buffer.from(' ');
                await clientFile.write(dataToWrite);
            }
        });
    }
    else {
        const methodToCall = [];
        const nodeID = coerceNodeId("ns=1;s=deleteFileObject");
        methodToCall.push({
            objectId: coerceNodeId("ns=1;i=1002"),
            methodId: nodeID,
            inputArguments: [{
                dataType: DataType.String,
                value: name
            }]
        });
        session.call(methodToCall,function(err,results){
            if(err){
                console.log("Errore:", err);
                return;
            }
        });
        var question = [
            {
                type: 'input',
                name: 'command',
                message: 'Please write the path for the file'
            }
        ];
        var risposta = await inquirer.prompt(question);
        oggettoJSON = JSON.stringify(risposta,null,'');
        var parsedData = JSON.parse(oggettoJSON);
        var dato = parsedData.command;

        fs.readFile(dato,'binary', async function(err,binary){
            if (err){
                console.log("Error, file not found");
                return;
            } else {
                const methodsToCall = [];
                const nodeID2 = coerceNodeId("ns=1;s=createFileObject");
                methodsToCall.push({
                    objectId: coerceNodeId("ns=1;i=1002"),
                    methodId: nodeID2,
                    inputArguments: [{
                        dataType: DataType.String,
                        value: name
                    },{
                        dataType: DataType.String,
                        value:yn
                    },{
                        dataType: DataType.String,
                        value:binary
                    }]
                });
                session.call(methodsToCall, function(err,results){
                    if (err){
                        console.log(err);
                        return;
                    }
                });
                const fileNodeId = new NodeId(NodeIdType.STRING, name, 1);
                const clientFile = new ClientFile(session, fileNodeId);
                const mode = OpenFileMode.WriteAppend;
    
                await clientFile.open(mode);
                const dataToWrite = Buffer.from(' ');
                await clientFile.write(dataToWrite);
            }
        });
    }
}

async function input(){
    var risposta;
    var questions = [
        {
            type: 'rawlist',
            name: 'command',
            message: 'Avaiable Commands:',
            choices: ["browse","read","write","upload","download","delete","rename","exit"]
        }
    ];
    risposta = await inquirer.prompt(questions);
    const oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    return parsedData.command.toLowerCase();
}

async function download(session){
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'What node do you want to download?'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    const oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var StringID = parsedData.command;
    var extension = path.extname(StringID);

    var browseResult = await session.browse("ns=1;s=" + StringID);
    if ((browseResult.references).length == 0) {
        console.log("Error, file does not exists!");
        return;
    }

    const fileNodeId = new NodeId(NodeIdType.STRING, StringID, 1);
    const clientFile = new ClientFile(session, fileNodeId);
    const mode = OpenFileMode.Read;

    await clientFile.open(mode);

    var bytes = await clientFile.size();

    var byte = bytes[1];
    await clientFile.setPosition(0);
    const data: Buffer = await clientFile.read(byte);

    if(extension == ".txt"){
        download_file_txt(data,StringID);
    }
    else {
        download_file(data,StringID);
    }
    console.log("File Downloaded");
}

async function delete_file(session){
    var question = [
        {
            type: 'input',
            name: 'command',
            message: 'What file do you want to delete?'
        }
    ];
    var risposta = await inquirer.prompt(question);
    var oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var name = parsedData.command;

    var browseResult = await session.browse("ns=1;s=" + name);
    if ((browseResult.references).length == 0) {
        console.log("Error, file does not exists!");
        return;
    }

    const methodToCall = [];
    const nodeID = coerceNodeId("ns=1;s=deleteFileObject");
    methodToCall.push({
        objectId: coerceNodeId("ns=1;i=1002"),
        methodId: nodeID,
        inputArguments: [{
            dataType: DataType.String,
            value: name
        }]
    });
    session.call(methodToCall,function(err,results){
        if(err){
            console.log("Errore:", err);
        }
    });
    console.log("File Eliminated");
}

async function rename(session){
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'What node do you want to rename?'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    const oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var StringID = parsedData.command;
    var extension = path.extname(StringID);

    var browseResult = await session.browse("ns=1;s=" + StringID);
    if ((browseResult.references).length == 0) {
        console.log("Error, file does not exists!");
        return;
    }

    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'Please write the new name'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    const oggettoJSON2 = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON2);
    var new_name = parsedData.command;
    var extension2 = path.extname(new_name);

    if(extension != extension2){
        console.log("The renamed file must have the same extension!");
        return;
    }

    const methodToCall = [];
    const nodeID = coerceNodeId("ns=1;s=renameFileObject");
    methodToCall.push({
        objectId: coerceNodeId("ns=1;i=1002"),
        methodId: nodeID,
        inputArguments: [{
            dataType: DataType.String,
            value: StringID
        },
        {
            dataType: DataType.String,
            value: new_name
        }]
    });
    session.call(methodToCall,function(err,results){
        if(err){
            console.log("Errore:", err);
        }
    });
    console.log("File Renamed");
}