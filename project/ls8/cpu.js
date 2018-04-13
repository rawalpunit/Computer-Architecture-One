/**
 * LS-8 v2.0 emulator skeleton code
 */
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;
    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
    // Special-purpose registers
    this.reg.PC = 0; // Program Counter
    this.reg.FL = 0; // Flag Reg
    this.reg[7] = 0xf4; // SP
    this.reg[6] = 0; // Keypress
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
  startTimer() {
    this.timer = setInterval(() => {
      this.reg[6] = 0b00000001; // Keypress
    });
  }
  stopTimer() {
    clearInterval(this.timer);
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
        // !!! IMPLEMENT ME
        return this.reg[regA] * this.reg[regB];
        break;
      case "ADD":
        return this.reg[regA] + this.reg[regB];
        break;
    }
  }
  /**
   * Advances the CPU one cycle
   */
  tick() {
    const inting = () => {
      this.stopTimer(); // Don't interrupt
      this.reg[6] = this.reg[6] & 0b11111110; //Bit clear
      handle_PUSHval(this.reg.PC); //register pc stack gets pushed
      handle_PUSHval(this.reg.FL); //flag gets pushed to stack
      for (let i = 0; i < 7; i++) {
        //R0 to R6 in order
        handle_PUSHval(this.reg[i]);
      }
      this.reg.PC = this.ram.read(0xf8); //Handler address
      this.advancePC = false; //
    };
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)
    // !!! IMPLEMENT ME
    let IR = this.ram.read(this.reg.PC);
    // Debugging output
    //console.log(`${this.reg.PC}: ${IR.toString(2)}`);
    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.
    // !!! IMPLEMENT ME
    let operandA = this.ram.read(this.reg.PC + 1);
    let operandB = this.ram.read(this.reg.PC + 2);
    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.
    // !!! IMPLEMENT ME
    const ADD = 0b10101000;
    const CALL = 0b01001000;
    const CMP = 0b10100000;
    const HLT = 0b00000001;
    const IRET = 0b00001011;
    const JEQ = 0b01010001;
    const JGT = 0b01010100;
    const JLT = 0b01010011;
    const JMP = 0b01010000;
    const JNE = 0b01010010;
    const LDI = 0b10011001;
    const MUL = 0b10101010;
    const POP = 0b01001100;
    const PRA = 0b01000010;
    const PRN = 0b01000011;
    const PUSH = 0b01001101;
    const RET = 0b00001001;
    const ST = 0b10011010;
    //Stack pointer and IS
    let SP = 7;
    let IS = 6;
    const advancePC = true;
    //Helpers
    const handle_ADD = (registerA, registerB) => {
      this.reg[registerA] = this.alu("ADD", registerA, registerB);
      this.advancePC = true;
    };
    const handle_CALL = register => {
      handle_PUSHval(this.reg.PC + 2);
      this.reg.PC = this.reg[register];
      this.advancePC = false;
    };
    const handle_CMP = (registerA, registerB) => {
      switch (true) {
        case this.reg[registerA] === this.reg[registerB]:
          this.reg.FL = 0b00000001;
          break;
        case this.reg[registerA] > this.reg[registerB]:
          this.reg.FL = 0b00000010;
          break;
        case this.reg[registerA] < this.reg[registerB]:
          this.reg.FL = 0b00000100;
          break;
      }
      this.advancePC = true;
    };
    const handle_HLT = () => {
      this.stopClock();
      clearInterval(this.timer);
    };
    const handle_IRET = () => {
      for (let i = 6; i >= 0; i--) {
        //pop R6 into R0
        this.reg[i] = handle_POPval();
      }
      this.reg.FL = handle_POPval(); //FL register is popped
      this.reg.PC = handle_POPval();
      this.startTimer(); //start interrupt
      IR = this.ram.read(this.reg.PC); // move on to next step
      this.advancePC = false; // else false
    };
    const handle_JEQ = register => {
      if (this.reg.FL === 0b00000001) {
        handle_JMP(register);
      } else {
        this.reg.PC += 2;
      }
    };
    const handle_JGT = register => {
      if (this.reg.FL === 0b00000010) {
        handle_JMP(register);
      } else {
        this.reg.PC += 2;
      }
    };
    const handle_JLT = register => {
      if (this.reg.FL === 0b00000100) {
        handle_JMP(register);
      } else {
        this.reg.PC += 2;
      }
    };
    const handle_JMP = register => {
      this.reg.PC = this.reg[register];
    };
    const handle_JNE = register => {
      if (this.reg.FL !== 0b00000001) {
        handle_JMP(register);
      } else {
        this.reg.PC += 2;
      }
    };
    const handle_LDI = (register, value) => {
      this.reg[register] = value;
    };
    const handle_MUL = (registerA, registerB) => {
      this.reg[registerA] = this.alu("MUL", registerA, registerB);
    };
    const handle_POP = register => {
      this.reg[register] = handle_POPval();
    };
    const handle_POPval = () => {
      return this.ram.read(this.reg[SP]++);
    };
    const handle_PRA = register => {
      console.log(String.fromCharCode(this.reg[register]));
    };
    const handle_PRN = register => {
      console.log(this.reg[register]);
    };
    const handle_PUSH = register => {
      this.ram.write(--this.reg[SP], this.reg[register]);
    };
    const handle_PUSHval = value => {
      this.ram.write(--this.reg[SP], value);
    };
    const handle_RET = () => {
      this.reg.PC = handle_POPval();
    };
    const handle_ST = (registerA, registerB) => {
      this.ram.write(this.reg[registerA], this.reg[registerB]);
    };
    const branchTable = {
      [ADD]: handle_ADD,
      [CALL]: handle_CALL,
      [CMP]: handle_CMP,
      [HLT]: handle_HLT,
      [IRET]: handle_IRET,
      [JEQ]: handle_JEQ,
      [JGT]: handle_JGT,
      [JLT]: handle_JLT,
      [JMP]: handle_JMP,
      [JNE]: handle_JNE,
      [LDI]: handle_LDI,
      [MUL]: handle_MUL,
      [POP]: handle_POP,
      [PRA]: handle_PRA,
      [PRN]: handle_PRN,
      [PUSH]: handle_PUSH,
      [RET]: handle_RET,
      [ST]: handle_ST
    };
    if (this.reg[IS] !== 0) {
      inting();
      IR = this.ram.read(this.reg.PC);
    }
    if (Object.keys(branchTable).includes(IR.toString())) {
      branchTable[IR](operandA, operandB);
    } else {
      handle_invalid_instruction(IR);
    }
    switch (IR) {
      case CALL: // Mul and Add shouldnt be in here...
      case IRET:
      case JEQ:
      case JGT:
      case JLT:
      case JMP:
      case JNE:
      case RET:
        break;
      default:
        // move PC for all commands that do not directly set it
        if (this.advancePC) {
          this.reg.PC += (IR >>> 6) + 1;
        }
        this.advancePC = true;
        break;
    }
    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.
    // !!! IMPLEMENT ME
  }
}
module.exports = CPU