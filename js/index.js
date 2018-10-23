var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log("Connection recieved");
});

http.listen(8000, function(){
    console.log('listening on *:8000');
  });