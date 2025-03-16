import os from "os";
import fs from "fs";
const POLLING_INTERVAL = 500;

export function pollResource() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = await getRamUsage();
    const storageData = getStorageData();
    console.log(
      `CPU Usage: ${cpuUsage}% | RAM Usage: ${ramUsage}% | Storage: Total ${
        storageData.total
      }GB, Usage: ${(storageData.usage * 100).toFixed(2)}%`
    );
  }, POLLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGB = Math.floor(os.totalmem() / (1024 * 1024 * 1024));

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

function getCpuUsage() {
  return new Promise((resolve) => {
    const cpus = os.cpus();
    setTimeout(() => {
      const newCpus = os.cpus();
      let totalIdle = 0;
      let totalTick = 0;

      for (let i = 0; i < cpus.length; i++) {
        const cpu = newCpus[i];
        const oldCpu = cpus[i];

        const times = ["user", "nice", "sys", "idle", "irq"] as const;
        for (const type of times) {
          totalTick += cpu.times[type] - oldCpu.times[type];
        }
        totalIdle += cpu.times.idle - oldCpu.times.idle;
      }

      const usage = 100 - (totalIdle / totalTick) * 100;
      resolve(usage.toFixed(2));
    }, 1000);
  });
}

function getRamUsage() {
  return new Promise((resolve) => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const used = totalMem - freeMem;
    const usagePercentage = ((used / totalMem) * 100).toFixed(2);
    resolve(usagePercentage);
  });
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000), // GBに変換
    usage: 1 - free / total,
  };
}
