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
const readline = require("readline");

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
 
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
        await client.connect(endpointUrl);
        console.log("Client connected!");
 
    // step 2 : createSession
        const session = await client.createSession();
        console.log("Session created!");
 
    // step 3 : browse
        await rl.question("inserisci qualcosa ",(answer)=>{
            console.log(answer);
            rl.close();
        });
        const browseResult = await session.browse("ns=1;i=1000");
     
        console.log("References of FileSystem :");
        for(const reference of browseResult.references) {
            console.log( "   -> ", reference.browseName.toString());
        }

    // step 4 : read a variable with readVariableValue
        const fileNodeId = new NodeId(NodeIdType.STRING, "MyFile", 1);
        const clientFile = new ClientFile(session, fileNodeId);

    // let's open the file
        const mode = OpenFileMode.ReadWriteAppend;
        await clientFile.open(mode);

        await clientFile.setPosition([0,1]);
        const data: Buffer = await clientFile.read(20);
        console.log("Contenuto del file: ", data.toString("utf-8"));

        const my_data_filename = "./downloads/someFile.txt";
        await promisify(fs.writeFile)(my_data_filename, data.toString("utf-8"), "utf8");

        const size = await clientFile.size();
        console.log("The current file size is : ", size, " bytes");

        // don't forget to close the file when done
        await clientFile.close();

    // close session
        await session.close();
 
    // disconnecting
        await client.disconnect();
        console.log("Done!");
    } catch(err) {
        console.log("An error has occured : ",err);
    }
}
main();