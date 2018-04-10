/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 *
 */

const HLT = 0b00000001;
const LDI = 0b10011001;
const PRN = 0b01000011;
const MUL = 0b10101010;

class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case "MUL":
        this.reg[regA] = this.reg[regA] * this.reg[regB];
        break;
      //   case "ADD":
      //     return regA + regB;
      //     break;
      //   case "SUB":
      //     return regA - regB;
      //     break;
      //   case "DIV":
      //     return regA / regB;
      //     break;
      // case 'INC':
      //     return regA  regB;
      //     break;
      // case 'DEC':
      //     return regA * regB;
      //     break;
      // case 'CMP':
      //     return regA * regB;
      //     break;
      default:
        console.log("op not found");
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    // !!! IMPLEMENT ME
    let IR = this.ram.read(this.reg.PC);

    // Debugging output
    // console.log(`${this.reg.PC}: ${IR.toString(2)}`);
    // console.log("see me");

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // !!! IMPLEMENT ME
    let operandA = this.ram.read(this.reg.PC + 1);
    let operandB = this.ram.read(this.reg.PC + 2);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME
    // this.alu(IR, operandA, operandB);
    //I changed this...

    switch (IR) {
      case HLT:
        this.stopClock();
        break;
      case LDI:
        this.reg[operandA] = operandB;
        break;
      case PRN:
        console.log(this.reg[operandA]);
      case MUL:
        this.alu("MUL", operandA, operandB);
        break;
    }

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME

    let operandCount = (IR >>> 6) & 0b11;
    let totalInstructionLength = operandCount + 1;
    this.reg.PC += totalInstructionLength;
    // console.log(this.reg);
    // let stringIR = IR.toString();
    // if (stringIR[0] === "0" && stringIR[1] === "1") {
    //   this.reg.PC += 2;
    // } else if (stringIR[0] === "1" && stringIR[1] === "0") {
    //   this.reg.PC += 3;
    // }
  }
}

module.exports = CPU;
