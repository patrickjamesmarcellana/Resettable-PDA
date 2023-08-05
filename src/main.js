const fs = require('fs')    // file-system

let input_machine = []      // array of string input lines from text file
let states = []             // array of state objects 
let input_end_marker = '' 
let current_line_index = 0

let stack = []

class State {
    constructor(name) {
        this.name = name
        this.is_initial = false // default
        this.is_final = false   // default
        this.is_reset = false   // default
        this.transitions = []
    }

    add_transition = (trans_arr) => {
        const new_transition = new Transition(trans_arr[0], trans_arr[1], trans_arr[2], trans_arr[3], trans_arr[4])
        this.transitions.push(new_transition)
    }

    set_as_initial = () => {
        this.is_initial = true
    }

    set_as_final = () => {
        this.is_final = true
    }

    set_as_reset = () => {
        this.is_reset = true
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

function read_file(filename) {
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
        states[state_index].add_transition(trans_arr) // add transition to state object's list of transitions
    }

    current_line_index = 5 + transition_count // to be used in referencing the next components in input_machine
}

function set_initial_states(input_machine) {
    const initial_state_name = input_machine[current_line_index]
    const state_index = search_state(initial_state_name)
    states[state_index].set_as_initial()
    current_line_index += 1
}

function set_initial_stack_symbol(input_machine) {
    const stack_symbol = input_machine[current_line_index]
    stack.push(stack_symbol)
    current_line_index += 1
}

function set_final_states(input_machine) {
    const final_state_names = input_machine[current_line_index].split(",")
    for(state_name of final_state_names) {
        const state_index = search_state(state_name)
        states[state_index].set_as_final()
    }
    current_line_index += 1
}

function set_reset_states(input_machine) {
    const reset_state_names = input_machine[current_line_index].split(",")
    for(state_name of reset_state_names) {
        const state_index = search_state(state_name)
        states[state_index].set_as_reset()
    }
    current_line_index += 1
}

/* EXTRACT MACHINE FROM FILE */
read_file('sample_machine.txt')
extract_states(input_machine)
extract_end_marker(input_machine)
extract_transitions(input_machine)
set_initial_states(input_machine)
set_initial_stack_symbol(input_machine)
set_final_states(input_machine)
set_reset_states(input_machine)

console.log(states)


