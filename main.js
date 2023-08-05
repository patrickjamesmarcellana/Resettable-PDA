const fs = require('fs') // file-system

let input_machine = []
class State {
    constructor(name) {
        this.name = name
        this.isInitial = false // default
        this.isFinal = false   // default
        this.isReset = false   // default
        this.transitions = []
    }

    addTransition = () => {
        this.transitions.push()
    }

}

class Transition {
    
}


function readFile(filename) {
    input_machine = fs.readFileSync(filename).toString('UTF8').split("\r\n")
}
function extract_components(input_machine) {
    states = []
}











readFile('sample_machine.txt')
console.log(input_machine)

extract_components(input_machine)



