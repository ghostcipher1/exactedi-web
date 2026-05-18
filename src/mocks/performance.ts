export interface Benchmark {
  cpu: string;
  cpuDetail: string;
  rows: {
    operation: string;
    throughput: string;
    wall: string;
    peakMemory: string;
  }[];
}

export const benchmarks: Benchmark[] = [
  {
    cpu: "AMD Ryzen 7 5700G",
    cpuDetail: "8c/16t, commodity desktop",
    rows: [
      { operation: "Parse", throughput: "187 MB/s", wall: "5.5 s", peakMemory: "5 MB" },
      { operation: "Validate", throughput: "130 MB/s", wall: "7.9 s", peakMemory: "1.2 GB" },
    ],
  },
  {
    cpu: "Intel Core Ultra 9 275HX",
    cpuDetail: "server-grade laptop",
    rows: [
      { operation: "Parse", throughput: "412 MB/s", wall: "2.5 s", peakMemory: "5 MB" },
      { operation: "Validate", throughput: "415 MB/s", wall: "2.5 s", peakMemory: "5 MB" },
    ],
  },
];

export const benchmarkCaveat =
  "All numbers are real, reproducible, and CPU-dependent. Your throughput will vary with disk, CPU, and segment density.";