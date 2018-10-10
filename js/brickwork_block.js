var QuantumCircuit = require("quantum-circuit");

function get_brickwork_block(direction, angle) {

    var circuit = new QuantumCircuit(2);

    circuit.createCreg("c", 1);
    
    circuit.addGate("cx", 0, [0, 1]);
    circuit.addGate("r" + direction, 1, 0, {
        params: {
            phi: angle
        }
    });
    circuit.addGate("h", 2, 0);
    circuit.addMeasure(0, "c", 0);
    return circuit.save();
}

// circuit.run([1, 0]);

// console.log(circuit.getCregValue("c"));
// console.log(circuit.stateAsString(true));