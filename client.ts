import {
    OPCUAClient,
    MessageSecurityMode, SecurityPolicy,
    NodeId,
    NodeIdType,
    randomInt16
} from "node-opcua";
import { ClientFile, OpenFileMode } from "node-opcua-file-transfer";
import {promisify} from "util";
const fs = require("fs");
const pdf = require("pdfkit");
const readline = require("readline");

//var rl = readline.createInterface({
//    input: process.stdin,
//    output: process.stdout
//  });
 
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
// const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

async function main() {
    try {
    // step 1 : connect to
        await connect(endpointUrl);
 
    // step 2 : createSession
        const session = await create_session();
 
    // step 3 : browse
        await browse(session);

    // step 4 : read a NodeId
        const clientFile = await read_node(session,"MyFile");

    // operations on txt file
        await open_file(clientFile);

        const data = await read_file(clientFile,20);

        await download_file(data);

        await size_file(clientFile);

        await write_file(clientFile);

    // operation on pdf file
        const clientFile2 = await read_node(session,"PDF_File");

        await open_file(clientFile2);

        const data2 = await read_file(clientFile2,83750);

        await download_PDF(data2);

        await size_file(clientFile2);
        

    // closing file, session and connection
        await ending(clientFile,session);

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

async function read_node(session,StringID){
    const fileNodeId = new NodeId(NodeIdType.STRING, StringID, 1);
    const clientFile = new ClientFile(session, fileNodeId);
    return clientFile;
}

async function open_file(clientFile){
    const mode = OpenFileMode.ReadWriteAppend;
    await clientFile.open(mode);
}

async function read_file(clientFile,bytes){
    await clientFile.setPosition(0);
    const data: Buffer = await clientFile.read(bytes);
    console.log("Contenuto del file: ", data.toString("utf-8"));
    return data;
}

async function download_file(data){
    const my_data_filename = "./downloads/someFile.txt";
    await promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8");
}

async function download_PDF(data){
    const my_data_filename = "./downloads/someFile.pdf";
    await promisify(fs.writeFile)(my_data_filename, data, "binary");
}

async function size_file(clientFile){
    const size = await clientFile.size();
    console.log("The current file size is : ", size, " bytes");
}

async function write_file(clientFile){
    const dataToWrite = Buffer.from("Some data");
    await clientFile.write(dataToWrite);
}

async function ending(clientFile,session){
    await clientFile.close();

    // close session
    await session.close();
 
    // disconnecting
    await client.disconnect();
    console.log("Done!");
}