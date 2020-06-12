import {
    OPCUAClient,
    MessageSecurityMode, SecurityPolicy,
    NodeId,
    NodeIdType,
    coerceNodeId,
    DataType
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
const options = {
    applicationName: "MyClient",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpoint_must_exist: false,
};
const client = OPCUAClient.create(options);
const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

async function main() {
    try {
    //  connect to
        await connect(endpointUrl);
 
    // createSession
        const session = await create_session();
 
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
                await call_method(session);
                break;
            case "exit":
                break;
            default:
                console.log("Wrong Input, retry");
                break;
            }
        }
    await ending(session);
    } catch(err) {
        console.log("An error has occured : ",err);
        }
    
}
main();

async function connect(endpoint){
    await client.connect(endpoint);
    console.log("Client connected!");
}

async function create_session(){
    const session = await client.createSession();
    console.log("Session created!");
    return session;
}

async function browse(session){
    const browseResult = await session.browse("ns=1;i=1000");
     
    console.log("References of FileSystem :");
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
    var extention = path.extname(StringID);
    const fileNodeId = new NodeId(NodeIdType.STRING, StringID, 1);
    const clientFile = new ClientFile(session, fileNodeId);
    const mode = OpenFileMode.Read;

    await clientFile.open(mode);

    var bytes = await clientFile.size();

    var byte = bytes[1];
    await clientFile.setPosition(0);
    const data: Buffer = await clientFile.read(byte);
    console.log("Contenuto del file: ", data.toString("utf-8"));
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'Do you want to download it? y/n'
        }
    ];
    while(risposta != "y" && risposta != "n"){
        var risposta = await inquirer.prompt(questions);
        const oggettoJSON = JSON.stringify(risposta,null,'');
        var parsedData = JSON.parse(oggettoJSON);
        var risposta = parsedData.command;
        switch(risposta){
            case "y":
                if(extention == ".txt")
                    download_file(data);
                else if (extention == ".pdf")
                    download_PDF(data);
                break;
            case "n":
                console.log("I will return to the Main Menu");
                break;
            default:
                console.log("Wrong Input");
                break;
        }
    }
}

async function download_file(data){
    const my_data_filename = "./downloads/someFile.txt";
    await promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8");
}

async function download_PDF(data){
    const my_data_filename = "./downloads/someFile.pdf";
    await promisify(fs.writeFile)(my_data_filename, data, "binary");
}

async function write_file(session){
    var ok = true;
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
        ok = false;
    }
    const fileNodeId = new NodeId(NodeIdType.STRING, StringID, 1);
    const clientFile = new ClientFile(session, fileNodeId);
    const mode = OpenFileMode.WriteAppend;

    await clientFile.open(mode);

    if (ok == true){
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
    }
}

async function ending(session){
    // close session
    await session.close();
 
    // disconnecting
    await client.disconnect();
    console.log("Exited");
}

async function call_method(session) {
    var ok = true;
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'Name the new file node'
        }
    ];
    var risposta = await inquirer.prompt(questions);
    var oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    var name = parsedData.command;

    if (path.extname(name) != ".txt"){
        console.log("Sorry, Can't create a non txt File");
        ok = false;
    }

    else if (path.extname(name) == ".txt"){
        const methodsToCall = [];
        const nodeID = coerceNodeId("ns=1;i=1003");
        methodsToCall.push({
            objectId: coerceNodeId("ns=1;i=1002"),
            methodId: nodeID,
            inputArguments: [{
                dataType: DataType.String,
                value: name
            }]
        });
        session.call(methodsToCall, function(err,results){
           // ....
        });
        console.log("Ho chiamato il metodo: " + nodeID);
        return name
    }
}

async function input(){
    var risposta;
    var questions = [
        {
            type: 'input',
            name: 'command',
            message: 'Avaiable Commands: browse,read,write,upload,exit'
        }
    ];
    risposta = await inquirer.prompt(questions);
    const oggettoJSON = JSON.stringify(risposta,null,'');
    var parsedData = JSON.parse(oggettoJSON);
    return parsedData.command.toLowerCase();
}