var cx = 0;
var cz = 0;
var gateindex = 0;

var socket = io();

function get_brickwork_block(gate) {
    var identity_state = [[["z", 0], ["z", 0]], 
                            [["z", 0], ["z", 0]], 
                            [["z", 0], ["z", 0]], 
                            [["z", 0], ["z", 0]], 
                            [["z", 0], ["z", 0]]];
    switch(gate.name) {
        case "z":   identity_state[0][gate.bit] = ["z", gate.angle];
                    break;
        case "x":   identity_state[0][gate.bit] = ["x", gate.angle];
                    break;
        case "h":
            identity_state[0][gate.bit] = ["x", 2];
            identity_state[1][gate.bit] = ["z", 2];
            identity_state[2][gate.bit] = ["x", 2];
            break;
        case "cnot":
            identity_state[1][gate.control] = ["x", 2];
            identity_state[2][Math.abs(gate.control-1)] = ["z", 2];
            identity_state[3][gate.control] = ["x", 2];
            break;
    }
    return identity_state;
}

function interact(gate, qubit) {
    var r;
    if(Math.random()>=0.5) {
        r = 4;
    } else {
        r = 0;
    }
    var c;
    if(gate[0]=="z") {
        cz+=r/4;
        c = cz;
    } else {
        cx+=r/4;
        c = cx;
    }
    c= (c-1)*2 -1;
    var alpha = [0, 1, 2, 3, 4, 5, 6, 7][Math.floor(Math.random()*8)];
    r = 0; alpha = 0; c = 1;
    var phase = c*gate[1] - alpha + r
    var theta = phase + "pi/4";
    gate[1] = theta;
    var circuit = new QuantumCircuit(1);
    circuit.addGate("h", 0, 0);
    circuit.addGate("rz", 1, 0, {
        params: {
            phi: alpha
        }
    });
    var obj = circuit.save();
    console.log('Theta: ' + theta);
    console.log('Alpha: ' + alpha);
    console.log('r: ' + r);
    socket.emit('gate', {
        'gate': gate,
        'qubit': qubit,
        'circuit': obj
    });

    socket.on('measurement', function(c) {
       if(gate[0] == "z") {
           cz+=c;
       } else {
           cx+=c;
       }
       if(true) {
        socket.emit('terminate');
       } else {
        //    interact(gate2, qubit2);
       }
       //interact with the next gate and determine whether to cnot
    });
}

socket.emit('initialize', 1);

socket.on('initialize-complete', function() {
    interact(["z", 0], 0);
});

socket.on('qubits', function(qubits) {
    console.log(qubits);
    //perform pauli correction
});

//Take input of 1 gate from user and generate the list
//Keep this list as a global variable
//Run interact for the first gate
//SOCKET connection runs interact for all the rest of the gates in the list
//If no gates are left, socket triggers input function again!
//Simplifying: Pauli correction is performed after every brickwork block so cx and cz can be reset