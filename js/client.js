function interact(gate, qubit, c) {
    var r;
    if(math.random()>=0.5) {
        r = 1;
    } else {
        r = 0;
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

