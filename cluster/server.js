// use nodejs cluster
// all in one example

const cluster = require('cluster');

const net = require('net')
let port = 3000;
const ADDRESS = 'localhost';

console.log('the total number of CPUs is', require('os').cpus().length);
console.log('primary pid=', process.pid);



if (cluster.isMaster) {
    const cpuCount = require('os').cpus().length;
    for (let i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(cluster.worker.id, 'Worker process has died');
        console.log(cluster.worker.id, 'Starting a new worker');
        cluster.fork();
    });
} else {

    console.log(cluster.worker.id, 'is running');
    // create a socket.io server
    const server = require('http').createServer();
    const io = require('socket.io')(server);

    io.on('connection', (client) => {
        console.log('Client connected');
        client.on('testerEvent', (data) => {            
            console.log(cluster.worker.id, data);
            client.emit('serverevent', "ack"  + data.id);
        });
        client.on('message', (data) => {
            console.log(cluster.worker.id, data);
        });
        client.on('disconnect', () => {
            console.log(cluster.worker.id, 'Client disconnected');
        });
    });

    server.listen(port, ADDRESS, () => {
        console.log(cluster.worker.id, `Server started on http://${ADDRESS}:${port}`);
    });
    

    console.log(cluster.worker.id, 'Worker process started');
   // port++;
}

