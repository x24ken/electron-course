import osUtils from "os-utils";
import fs from "fs";
import os from "os";
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
  const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024);

  return {
    totalStorage,
    cpuModel,
    totalMemoryGB,
  };
}

function getCpuUsage() {
  return new Promise((resolve) => {
    osUtils.cpuUsage((percentage) => {
      resolve(percentage);
    });
  });
}

function getRamUsage() {
  return new Promise((resolve) => {
    resolve(1 - osUtils.freememPercentage());
  });
}

function getStorageData() {
  // requires node 18
  const stats = fs.statfsSync(process.platform === "win32" ? "C://" : "/");
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;

  return {
    total: Math.floor(total / 1_000_000_000), // GBに変換
    usage: 1 - free / total,
  };
}
