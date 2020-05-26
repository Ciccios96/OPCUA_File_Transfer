let os = require("os");

let opcua = require("node-opcua");

let file_transfer = require("node-opcua-file-transfer")

let server = new opcua.OPCUAServer({
    port: 4334,
    resourcePath: "/UA/TransferServer",
    buildInfo: {
        productName: "TransferServer1",
        buildNumber: "1",
        buildDate: new Date()
    }
});

server.initialize(() => {
    console.log("OPC UA server initialized");

    //build_my_address_space(server);
    //console.log("Address Space inizilialzed");

    server.start(() => {
        console.log("server ascolta");
        let endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log("endpoint primario: ",endpointUrl);
    });
});