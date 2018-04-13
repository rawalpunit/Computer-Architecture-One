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
const POP = 0b01001100;
const PUSH = 0b01001101;
// const ST = 0b10011010;
const CALL = 0b01001000;
const RET = 0b00001001;

const SP = 7;

class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
    this.reg[SP] = 0xF4;
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    //   console.log(address, value);

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
    

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // !!! IMPLEMENT ME
    let operandA = this.ram.read(this.reg.PC + 1);
    let operandB = this.ram.read(this.reg.PC + 2);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME
    // this.alu(IR, operandA, operandB);
    let advancePC;
    
    // These are the fucntion handlers
    const handle_POP = register => {
        this.reg[register] = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
    }

    const handle_PUSH = register => {
        this.reg[SP]--;
        this.ram.write(this.reg[SP], this.reg[register]);
    }

    // const handle_ST = (regA, regB) => {
    //     this.ram.write(this.reg[regA]) = this.reg[regB];
    // }

    const handle_CALL = register => {
       let addr = this.reg.PC + 1;
       handle_PUSH(addr);
       this.reg.PC = this.reg[register];
    }
    
    const handle_RET = () => {
        this.reg.PC = this.ram.read(this.reg[SP]);
        this.reg[SP]++;
    }

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
      case POP:
      handle_POP(operandA);
        break;
    case PUSH:
        handle_PUSH(operandA);
        break;
    // case ST:
    //     handle_ST(operandA, operandB);
    //     break;
    case CALL:
        // advancePC = false;
        handle_CALL(operandA);
        break;
    case RET:
        handle_RET();
        break;
    default:
        console.log('invalid instruction: ', IR);
        this.stopClock();
    }

    // const handle_HLT = () => {
    //   this.stopClock();
    // };


    // const handle_LDI = (register, value) => {
    //   this.reg[register] = value;
    // };

    // const handle_PRN = register => {
    //   console.log(this.reg[register]);
    // };

    // const handle_MUL = (operandA, operandB) => {
    //   this.reg[operandA] = this.alu("MUL", operandA, operandB);
    // };

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME

    if (advancePC) {
    let operandCount = (IR >>> 6) & 0b11;
    let totalInstructionLength = operandCount + 1;
    this.reg.PC += totalInstructionLength;
    } 
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
