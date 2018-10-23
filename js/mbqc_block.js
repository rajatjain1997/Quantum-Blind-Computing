var QuantumCircuit = require("quantum-circuit");

function get_mbqc_block(direction, angle) {

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
    circuit.save();
    return circuit;
}


circuit = get_mbqc_block("z", "pi/2");

circuit.run([1, 0]);

console.log(circuit.getCregValue("c"));
console.log(circuit.stateAsString(true));