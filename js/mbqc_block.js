var QuantumCircuit = require("quantum-circuit");

function get_mbqc_block(direction, angle, alpha) {

    var circuit = new QuantumCircuit(2);

    circuit.createCreg("c", 1);
    circuit.registerGate("alpha", alpha);

    circuit.addGate("cx", 1, [0, 1]);
    circuit.addGate("alpha", 0, 1);
    circuit.addGate("r" + direction, 2, 0, {
        params: {
            phi: angle
        }
    });
    circuit.addGate("h", 3, 0);
    circuit.addMeasure(0, "c", 0);
    circuit.save();
    return circuit;
}

module.exports = get_mbqc_block;


circuit = get_mbqc_block("z", "pi/2");

circuit.run([1, 0]);

console.log(circuit.getCregValue("c"));
console.log(circuit.stateAsString(true));