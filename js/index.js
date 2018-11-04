const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mbqc = require('./mbqc_block');
const math = require("mathjs");

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


var qubits = []

io.on('connection', function(socket) {
    socket.on('gate', function(gate) {
        console.log('here!');
        circuit = mbqc(gate.gate[0], gate.gate[1], gate.circuit);
        circuit.run({
            '0': math.complex(qubits[gate.qubit][0]),
            '2': math.complex(qubits[gate.qubit][1])
        }, {
            setstate: true
        });
        var c = circuit.getCregValue("c");
        socket.emit('measurement', {
            'c': c
        });
        console.log(c);
        console.log(circuit.stateAsString(true));
        // qubits[gate.qubit]
    });
    socket.on('initialize', function(qubitcount) {
        for(var i = 0; i<qubitcount; i++) {
            qubits.push([1, 0]);
        }
        socket.emit('initialize-complete');
    });
    socket.on('terminate', function() {
        socket.emit('qubits', qubits);
    })
});

http.listen(8000, function(){
    console.log('listening on *:8000');
  });