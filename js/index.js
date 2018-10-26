const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mbqc = require('./mbqc_block');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("../"));
app.use('/',express.static("../views"));
app.engine('.html', require('ejs').__express);
app.set('views',  path.resolve("../html"));
app.set('view engine', 'html');

app.get('/', function(req, res){
    res.render('index', {});
  });

io.on('connection', function(socket) {
    socket.on('gate', function(gate) {
        circuit = mbqc(gate.gate[0], gate.gate[1], gate.circuit);
        circuit.run(["Need to supply", 0]);
        socket.emit('measurement', {
            c: circuit.getCregValue("c")
        });
        console.log(circuit.stateAsString(true));
    });
});

http.listen(8000, function(){
    console.log('listening on *:8000');
  });