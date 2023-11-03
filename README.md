# Resettable-PDA
This program is a simulator of a resettable pushdown automata (RPDA): a modified version of a pushdown automata (PDA) where reset states are present. These reset states *reset* the stack of the machine and bring the input head back to the beginning of the input string.

## Running the Program
1. To run the program, launch the command prompt and make sure that you are in the folder's directory.
2. Then, ensure that all modules necessary are installed by running the command `npm i` in the terminal.
3. Then, launch the program by running the command `npm start` in the terminal.
4. To create your own machine, please refer to the machine format file `machine_format.txt`
5. Two sample files are included in this folder, `sample_machine.txt` and `sample_machine_2.txt`. The first one is a machine designed for the language that accepts strings in the format $0^n1^n2^n$.
   The second one is a PDA machine simulated using an RPDA machine, and it is the language defined in Problem Set #2, Item No. 6.
6. To utilize the GUI, a slider is provided to scroll between the time units of the timelines. An accepted verdict is shown if a timeline turns green. Meanwhile, a reject verdict is shown if a timeline becomes red. Note that the final step may be the machine removing the rejected timeline. Hence, if you scroll all the way to the end and see no output, try moving back 1 time unit.
