function get_brickwork_block(gate) {
    var identity_state = [[["z", "0"], ["z", "0"]], 
                            [["z", "0"], ["z", "0"]], 
                            [["z", "0"], ["z", "0"]], 
                            [["z", "0"], ["z", "0"]], 
                            [["z", "0"], ["z", "0"]]];
    switch(gate.name) {
        case "z":   identity_state[0][gate.bit] = ["z", gate.angle];
                    break;
        case "x":   identity_state[0][gate.bit] = ["x", gate.angle];
                    break;
        case "h":
            identity_state[0][gate.bit] = ["x", "pi/2"];
            identity_state[1][gate.bit] = ["z", "pi/2"];
            identity_state[2][gate.bit] = ["x", "pi/2"];
            break;
        case "cnot":
            identity_state[1][gate.control] = ["x", "pi/2"];
            identity_state[2][math.abs(gate.control-1)] = ["z", "pi/2"];
            identity_state[3][gate.control] = ["x", "pi/2"];
            break;
    }
    return identity_state;
}