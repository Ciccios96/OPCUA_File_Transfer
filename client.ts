import {
    OPCUAClient,
    MessageSecurityMode, SecurityPolicy,
    AttributeIds,
    makeBrowsePath,
    ClientSubscription,
    TimestampsToReturn,
    MonitoringParametersOptions,
    ReadValueIdLike,
    ClientMonitoredItem,
    DataValue,
    NodeId,
    NodeIdType
} from "node-opcua";
import { ClientFile, OpenFileMode } from "node-opcua-file-transfer";
 
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
        const browseResult = await session.browse("RootFolder");
     
        console.log("References of RootFolder :");
        for(const reference of browseResult.references) {
            console.log( "   -> ", reference.browseName.toString());
        }

    // step 4 : read a variable with readVariableValue
        const fileNodeId = new NodeId(NodeIdType.STRING, "MyFile", 1);
        const clientFile = new ClientFile(session, fileNodeId);

    // let's open the file
        const mode = OpenFileMode.ReadWriteAppend;
        await clientFile.open(mode);

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