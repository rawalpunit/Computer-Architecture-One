The CPU runs millions of instructions per cycle...Concurrency is defined as instructions that might overlap per cycle but don't necessarily run in parallel. Since concurrent operations don't have to be run serially.or in parallel..they can be run in the same cycle.

Assembly language is closer to human readable..as opposed to machine language..whcih is mainly 1s and 0s.
 machine language is the Bit encoding of opcodes while Assembly is the symbolic encoding of the same.

 A GPU basically has lots of cores to do some simple tasks in parallel. 3D rendering basically needs a lot of parallel processing...so each core renders one small part of the image. Comparatively a CPU has far lesser cores and hence doesn't do as well 3D rendering as a GPU.

 GPU use their many cores to do rendering on 3D images quite fast. ML is the same kind of 'embarassingly parallel' kind of problem..and hence GPUs lend themselves quite readily to optimise this kind of parallel computation.
