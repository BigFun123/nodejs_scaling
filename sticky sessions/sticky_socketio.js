const http = require("http");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

if (cluster.isMaster) {
    // HTTP Server on the primary
    const httpServer = http.createServer();

    // This is the primary setup sticky session
    setupMaster(httpServer, {
        loadBalancingMethod: "least-connection"
    });

    // set up connection between master and workers
    setupPrimary();

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    };

    cluster.on("exit", function () {
        cluster.fork();
    });




} else {
    const origin = "http://localhost:3001";
    const io = require("socket.io")(3000, {
        cors: { origin }
    });
    io.on("connection", function (socket) {
        //...
        console.log("new connection", socket.id);
    });

    io.on("disconnect", function (socket) {
        //...
        console.log("disconnection", socket.id);
    });

    io.on("message", function (socket) {
        //...
        console.log("message", socket.id);
    });

    io.on("testerEvent", function (socket) {
        //...
        console.log("testerEvent", socket.id);
    });

    console.log("Worker started");
}