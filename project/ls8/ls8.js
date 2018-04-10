const RAM = require("./ram");
const CPU = require("./cpu");
const fs = require("fs");
const readline = require("readline");
/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {
  // Hardcoded program to print the number 8 on the console
  //   const program = [
  //     // print8.ls8
  //     "10011001", // LDI R0,8  Store 8 into R0
  //     "00000000",
  //     "00001000",
  //     "01000011", // PRN R0    Print the value in R0
  //     "00000000",
  //     "00000001" // HLT       Halt and quit
  //   ];

  //   const program = [
  //     "10011001", //LDI R0,8
  //     "00000000",
  //     "00001000",
  //     "10011001", //LDI R1,9
  //     "00000001",
  //     "00001001",
  //     "10101010", //MUL R0,R1 <---
  //     "00000000",
  //     "00000001",
  //     "01000011", // PRN R0
  //     "00000000",
  //     "00000001" // HLT
  //   ];

  let counter = 0;
  const readLines = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
  });

  readLines.on("line", line => {
    // console.log(parseInt(line, 2));
    // console.log(line);
    cpu.poke(counter, parseInt(line, 2));
    counter++;
  });

  //   readLines.on("close", () => {
  //     cpu.startClock();
  //     console.log("test");
  //   });

  // Load the program into the CPU's memory a byte at a time
  //   for (let i = 0; i < process.argv[2].length; i++) {
  //     // console.log("We are on the ith loop and the value of i is", i);
  //     console.log(process.argv[2]);
  //     cpu.poke(i, parseInt(process.argv[2], 2));
  //   }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu, process.argv[2]);

cpu.startClock();
