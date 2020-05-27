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

    function build_my_address_space(server){
        const addressSpace = server.engine.addressSpace;
        const namespace = addressSpace.getOwnNamespace();

        //declare a new object
        let device = namespace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "MyDevice"
        })

        namespace.addVariable({
            propertyOf: device,
            browseName: "CPU_Architecture",
            dataType: "String",
            value: {
                get: function() {
                    return new opcua.Variant({
                        dataType: opcua.DataType.String,
                        value: process.arch
                    });
                }
            }
        });

    }

    build_my_address_space(server);
    console.log("Address space initialized");

    server.start(() => {
        console.log("server ascolta");
        let endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log("endpoint primario: ",endpointUrl);
    });
});