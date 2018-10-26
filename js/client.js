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
            identity_state[2][math.abs(gate.control-1)] = ["z", 2];
            identity_state[3][gate.control] = ["x", 2];
            break;
    }
    return identity_state;
}

function interact(gate, qubit) {
    var r;
    if(math.random()>=0.5) {
        r = 1;
    } else {
        r = 0;
    }
    var c;
    if(gate[0]=="z") {
        c = cz;
    } else {
        c = cx;
    }
    c= (c-1)*2 -1;
    var alpha = [0, 1/4, 2, 3, 4, 5, 6, 7][math.floor(math.random()*8)];
    var phase = c*gate[1] - alpha + r
    var theta = phase + "pi/4";

    var circuit = new QuantumCircuit(1);
    circuit.addGate("h", 0, 0);
    circuit.addGate("rz", 1, 0, {
        params: {
            phi: theta
        }
    });
    var obj = circuit.save();
    //send obj on socket
}

//Take input of 1 gate from user and generate the list
//Keep this list as a global variable
//Run interact for the first gate
//SOCKET connection runs interact for all the rest of the gates in the list
//If no gates are left, socket triggers input function again!
//Simplifying: Pauli correction is performed after every brickwork block so cx and cz can be reset