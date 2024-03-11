// use a socket
//const io = require('socket.io');
//const socket = io.connect('http://localhost:3000');
// send a socket message to the server
//socket.emit('testerEvent', { description: 'A custom event named testerEvent!' });
// use socket.io to send a message to the server
const io = require('socket.io-client');
const socket = io.connect('http://localhost:3000');
//socket.send('A message from the client!');
let counter = 0;
let id = 0;
let timeofflight = 0;
let mintime = 99999;
let maxtime = 0;
setInterval(() => {
    //socket.send('A message from the client!');
    id++;
    socket.emit('testerEvent', { description: 'A custom event named testerEvent!', id: id });
    /// print to 10,10, in the console
    
}, 10);

socket.on('serverevent', (data) => {
    
    counter++;
    // calculate how much work is being done per second
    // get process time in miliseconds
    let hrTime = process.hrtime();
    let timeInMilliseconds = hrTime[0] * 1000 + hrTime[1] / 1e6;
    let delta = timeInMilliseconds - data.time ;
    if (delta < mintime) mintime = delta;
    if (delta > maxtime) maxtime = delta;

    if (counter % 200 == 0) {
        console.log("\033[%d;%dH", 0, 10);
        console.log(counter + " delta " + delta.toFixed(2) + " min:" + mintime.toFixed(2) + " max:" + maxtime.toFixed(2) + "           "); ;
        mintime = 99999;
        maxtime = 0;
    }


    
});

socket.on('disconnect', (reason) => {
    console.log("\033[%d;%dH", 2, 10);
    console.log(reason);
});








