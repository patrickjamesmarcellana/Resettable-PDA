const fs = require('fs')    // file-system
const readlineSync = require('readline-sync')

let input_machine = []      // array of string input lines from text file
let states = []             // array of state objects 
let input_end_marker = '' 
let initial_stack_symbol = ''
let initial_state

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

class Timeline {
    constructor(input_head, curr_state, stack, is_accepted, is_dead) {
        this.input_head = input_head // an integer corresponding to the current index in the input
        this.curr_state = curr_state
        this.stack = stack
        this.is_accepted = is_accepted
        this.is_dead = is_dead
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

function set_initial_state(input_machine) {
    const initial_state_name = input_machine[current_line_index]
    const state_index = search_state(initial_state_name)
    states[state_index].set_as_initial()
    initial_state = states[state_index]
    current_line_index += 1
}

function get_initial_stack_symbol(input_machine) {
    initial_stack_symbol = input_machine[current_line_index]
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
    if(reset_state_names[0] === '')  // if there are no reset states specified
        return
    for(state_name of reset_state_names) {
        const state_index = search_state(state_name)
        states[state_index].set_as_reset()
    }
    current_line_index += 1
}

function get_input_string() {
    return readlineSync.question('Enter input string: ') + input_end_marker
}

function display_timelines(timelines) {
    for(let i = 0; i < timelines.length; i++) {
        console.log('Active Timeline ' + i + ":")
        console.log('Input String: ' + input_string)
        console.log('Input Head: ' + timelines[i].input_head) // change this to highlighted symbol in the input string in the gui
        console.log('Stack: ' + timelines[i].stack)
        console.log('Current State: ' + timelines[i].curr_state.name) // not needed 

        if(timelines[i].is_accepted) {
            console.log('TIMELINE ACCEPTED')
        } else if(timelines[i].is_dead) {
            console.log('TIMELINE IS DEAD') // timeline may or may not be removed in the next sequence of displaying timelines
            timelines.splice(i, 1) // remove the timeline
        }
        console.log('')
    }

    console.log('='.repeat(50))

}

/* READ MACHINE DEFINITION FILE */
read_file('sample_machine.txt')

/* CONVERT MACHINE INTO INTERNAL REPRESENTATION */
extract_states(input_machine)
extract_end_marker(input_machine)
extract_transitions(input_machine)
set_initial_state(input_machine)
get_initial_stack_symbol(input_machine)
set_final_states(input_machine)
set_reset_states(input_machine)

/* INPUT TRACE */
let input_string = get_input_string()
let accepted_timelines = 0
let timelines = []

// first timeline at initial state
const new_timeline = new Timeline(0, initial_state, [initial_stack_symbol], false, false)
timelines.push(new_timeline)

display_timelines(timelines)

// main loop
while(timelines.length > 0 && accepted_timelines === 0) { // stops if there becomes an accepted timeline
    // go to next set of transitions: store and delete existing timelines
    let existing_timelines = timelines
    timelines = []

    // add new set of timelines by getting the next set of transitions
    for(let timeline of existing_timelines) {
        const curr_state = timeline.curr_state
        const transitions = curr_state.transitions
        let valid_transitions = []

        // filter valid transitions
        for(let transition of transitions) {
            if(transition.input === input_string[timeline.input_head] || transition.input === '&') { // internal lambda representation is '&'
                if(transition.pop_symbol === '&') {
                    valid_transitions.push(transition)
                } else if(transition.push_symbol === '&' &&
                          transition.pop_symbol === timeline.stack[timeline.stack.length - 1]) {
                    valid_transitions.push(transition)
                }
            }
        }

        // check if timeline is accepted already
        if(timeline.stack.length === 0 && timeline.input_head === input_string.length) {
            timeline.is_accepted = true
            timelines.push(timeline)
            accepted_timelines += 1
            continue
        }

        // check if timeline is dead
        if(valid_transitions.length === 0 && timeline.is_accepted === false) {
            timeline.is_dead = true
            timelines.push(timeline) // for display purposes
            continue
        }

        // make new timelines per each transition
        for(let transition of valid_transitions) {
            let new_stack = timeline.stack
            let new_input_head = timeline.input_head
            let new_curr_state = timeline.curr_state

            if(transition.input === input_string[timeline.input_head]) {
                new_input_head += 1
            }

            if(transition.pop_symbol === '&' && transition.push_symbol !== '&') {
                // case where the transition will only push to the stack
                new_stack.push(transition.push_symbol)
            } else if(transition.push_symbol === '&' && transition.pop_symbol !== '&') { 
                // pop symbol already guaranteed to be valid by the filter valid transitions above
                // case where the transition will only pop the stack
                new_stack.pop()
            }

            // case where both push and pop = '&' is already handled through this and the moving of input head
            new_curr_state = states[search_state(transition.next_state)]

            // check if the new current state is a reset state
            if(new_curr_state.is_reset) {
                new_stack = ['Z']
                new_input_head = 0
            }
            const new_timeline = new Timeline(new_input_head, new_curr_state, new_stack, false, false)
            timelines.push(new_timeline)
        }
    }
    display_timelines(timelines)
}