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
  let counter = 0;
  const readLines = readline.createInterface({
    input: fs.createReadStream(process.argv[2])
  });

  readLines.on("line", line => {
    
    // cpu.poke(counter, parseInt(line, 2));
    // console.log('this is parseint: ', parseInt(line, 2));
    // console.log(parseInt('123foo'));
    let stringVar = line.split('#')[0].trim() ;
    let parsing = parseInt(stringVar, 2);
    if (!isNaN(parsing)) {
      cpu.poke(counter++, parsing);
  }
    });

  readLines.on("close", line => {
    
    cpu.startClock();

  });

 


}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu, process.argv[2]);

// cpu.startClock();
