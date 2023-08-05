const fs = require('fs')    // file-system

let input_machine = []      // array of string input lines from text file
let states = []             // array of state objects 
let input_end_marker = '' 

class State {
    constructor(name) {
        this.name = name
        this.isInitial = false // default
        this.isFinal = false   // default
        this.isReset = false   // default
        this.transitions = []
    }

    addTransition = (trans_arr) => {
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

function extract_states(input_machine) {
    // create state objects and add them to global variable states
    states_string = input_machine[0].split(",")
    for(let state of states_string) {
        const new_state = new State(state)
        states.push(new_state)
    }
}

function extract_end_marker(input_machine) {
    input_end_marker = input_machine[2]
}

function search_state(state_name) {
    for(i = 0; i < states.length; i++) {
        if(states[i].name === state_name)
            return i
    }
}

function extract_transitions(input_machine) {
    // get number of transitions
    const transition_count = parseInt(input_machine[4])

    for(let i = 5; i < 5 + transition_count; i++) {
        const trans_arr = input_machine[i].split(",")
        const state_name = trans_arr[0]

        // find state from the array of states
        const state_index = search_state(state_name)
        states[state_index].addTransition(trans_arr) // add transition to state object's list of transitions
        console.log(states[state_index])
    }
}











readFile('sample_machine.txt')
extract_states(input_machine)
extract_end_marker(input_machine)
extract_transitions(input_machine)
console.log(states[5].isFinal)



