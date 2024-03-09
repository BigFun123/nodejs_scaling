const cluster = require('cluster');

const net = require('net')
let port = 3000;
const ADDRESS = 'localhost';

let result = 0;
let counter = 0;

console.log(cluster.worker.id, 'is running');
// create a socket.io server
const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', (client) => {
    console.log('Client connected');

    client.on('testerEvent', (data) => {

        // do some work
        for (let i = 0; i < 5_000_0; i++) {
            let x = Math.random();
            let y = Math.random();
            let z = Math.random();
            let a = x * y * z;
            result = a;
        }
        
        counter++;

        // get process time in milliseconds
        let hrTime = process.hrtime();
        let timeInMilliseconds = hrTime[0] * 1000 + hrTime[1] / 1e6;

        if (counter % 100 == 0) {
            console.log("\033[%d;%dH", 0, 10);
            console.log(cluster.worker.id, data);
        }

        client.emit('serverevent', {
            wid: cluster.worker.id,
            ack: data.id, result: result, time: timeInMilliseconds
        });
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