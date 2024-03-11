var cluster = require('cluster'); // Only required if you want the worker id
var sticky = require('sticky-session');

var server = require('http').createServer(function(req, res) {
  res.end('worker: ' + cluster.worker.id);
});

//sticky.listen() will return false if Master
if (!sticky.listen(server, 3000)) { 
  // Master code
  server.once('listening', function() {
    console.log('server started on 3000 port');
  });
} else {
  // Worker code
    console.log('worker: ' + cluster.worker.id);
}