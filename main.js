const fs = require('fs') // file-system

let input_machine = []   // array of string input lines from text file
let states = []          // array of state objects 

class State {
    constructor(name) {
        this.name = name
        this.isInitial = false // default
        this.isFinal = false   // default
        this.isReset = false   // default
        this.transitions = []
    }

    addTransition = (transition_string) => {
        const trans_arr = transition_string.split(",")
        const new_transition = new Transition(trans_arr[0], trans_arr[1], trans_arr[2], trans_arr[3], trans_arr[4])
        this.transitions.push(new_transition)
    }

    setAsInitial = () => {
        this.isInitial = true
    }

    setAsFinal = () => {
        this.isFinal = true
    }

    setAsReset = () => {
        this.isReset = true
    }
}

class Transition {
    constructor(curr_state, input, pop_symbol, next_state, push_symbol) {
        this.curr_state = curr_state
        this.input = input
        this.pop_symbol = pop_symbol
        this.next_state = next_state
        this.push_symbol = push_symbol
    }
}

function readFile(filename) {
    input_machine = fs.readFileSync(filename).toString('UTF8').split("\r\n")
}

function extract_components(input_machine) {
    // create state objects
    states_string = input_machine[0].split(",")
    for(let state of states_string) {
        const new_state = new State(state)
        states.push(new_state)
    }
}












readFile('sample_machine.txt')
console.log(input_machine)

extract_components(input_machine)
console.log(states)


