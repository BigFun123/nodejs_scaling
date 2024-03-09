const cluster = require('cluster');
const { fileURLToPath } = require('url');

const cpuCount = require('os').cpus().length;
console.log(cpuCount);

//const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
console.log(`Primary pid=${process.pid}`);
cluster.setupPrimary({
    exec: `${__dirname}/worker.js`
});

cluster.on('disconnect', (worker) => {
    console.log(`The worker #${worker.id} has disconnected`);
});

cluster.on('exit', (worker, code, signal) => {
    console.log(`The worker #${worker.id} has exited with code ${code} and signal ${signal}`);
    console.log("starting a new worker");
    cluster.fork();
});

cluster.on('fork', (worker) => {
    console.log(`The worker #${worker.id} has forked`);
});

cluster.on('listening', (worker, address) => {
    console.log(`A worker is now connected to ${address.address}:${address.port}`);
}
);

cluster.on('message', (worker, message, handle) => {
    console.log(`The worker #${worker.id} has sent a message: ${message}`);
});

cluster.on('online', (worker) => {
    console.log(`The worker #${worker.id} is online`);
});

cluster.on('setup', () => {
    console.log('The setup has been completed');
});

cluster.on('teardown', () => {
    console.log('The teardown has been completed');
});

cluster.on('worker', (worker) => {
    console.log(`The worker #${worker.id} is now connected`);
});

for (let i = 0; i < cpuCount; i++) {
    cluster.fork();
}