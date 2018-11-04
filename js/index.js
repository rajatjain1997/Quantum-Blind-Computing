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

function two_qubit_collapse(state, c) {
    console.log(state);
    var a, b;
    if(c==0) {
        a = state[0];
        b = state[1]; 
    } else {
        a = state[2];
        b = state[3];
    }
    mod_a = Math.pow(a.re, 2) + Math.pow(a.im, 2);
    mod_b = Math.pow(b.re, 2) + Math.pow(b.im, 2);
    console.log(mod_a);
    norm = Math.sqrt(mod_a + mod_b);
    console.log(norm);
    new_state = [
        math.complex(a.re/norm, a.im/norm),
        math.complex(b.re/norm, b.im/norm)
    ]
    return new_state;
}

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
        qubits[gate.qubit] = two_qubit_collapse(circuit.state, c);
        socket.emit('measurement', {
            'c': c
        });
        console.log(c);
        console.log(circuit.stateAsString(true));
        console.log(qubits);
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