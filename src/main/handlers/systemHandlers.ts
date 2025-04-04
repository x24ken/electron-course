import { app, BrowserWindow, IpcMainEvent } from "electron";
import * as os from "os";
import * as fs from "fs";
import { IpcChannels } from "../../shared/ipc/channels.js";
import { SystemInfo, SystemStats } from "../../shared/ipc/payloads.js";
import { ipc } from "../ipc/ipcMain.js";

// MBをGBに変換
const MB_TO_GB = 1024 * 1024 * 1024;

/**
 * システム情報の取得
 */
export function getSystemInfo(): SystemInfo {
  const cpus = os.cpus();
  const totalMemoryBytes = os.totalmem();
  const freeMemoryBytes = os.freemem();

  // ディスク情報の取得 (プラットフォームに依存)
  let totalDisk = 0;
  let freeDisk = 0;
  try {
    const root = process.platform === "win32" ? "C:\\" : "/";
    const stats = fs.statfsSync(root);
    totalDisk = stats.blocks * stats.bsize;
    freeDisk = stats.bfree * stats.bsize;
  } catch (error) {
    console.error("Failed to get disk stats:", error);
  }

  return {
    platform: process.platform,
    arch: process.arch,
    cpuModel: cpus.length > 0 ? cpus[0].model : "Unknown",
    cpuCores: cpus.length,
    totalMemory: Math.round((totalMemoryBytes / MB_TO_GB) * 100) / 100,
    freeMemory: Math.round((freeMemoryBytes / MB_TO_GB) * 100) / 100,
    totalDisk: Math.round((totalDisk / MB_TO_GB) * 100) / 100,
    freeDisk: Math.round((freeDisk / MB_TO_GB) * 100) / 100,
  };
}

/**
 * システムのリソース使用率を取得
 */
async function getSystemStats(): Promise<SystemStats> {
  // CPU使用率の計算 (前回と今回の差分から算出)
  const cpuUsage = await getCpuUsage();

  // メモリ使用率
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsage = (usedMemory / totalMemory) * 100;

  // ディスク使用率
  let diskUsage = 0;
  try {
    const root = process.platform === "win32" ? "C:\\" : "/";
    const stats = fs.statfsSync(root);
    const totalBlocks = stats.blocks;
    const freeBlocks = stats.bfree;
    diskUsage = ((totalBlocks - freeBlocks) / totalBlocks) * 100;
  } catch (error) {
    console.error("Failed to get disk usage:", error);
  }

  return {
    cpuUsage: Math.round(cpuUsage * 100) / 100,
    memoryUsage: Math.round(memoryUsage * 100) / 100,
    diskUsage: Math.round(diskUsage * 100) / 100,
    timestamp: Date.now(),
  };
}

/**
 * CPU使用率を取得 (非同期)
 */
function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startMeasure = os.cpus();

    // 1秒後に再度測定
    setTimeout(() => {
      const endMeasure = os.cpus();
      let idleDifference = 0;
      let totalDifference = 0;

      // 各CPUコアの使用率を計算し平均を取る
      for (let i = 0; i < startMeasure.length; i++) {
        const startTimes = startMeasure[i].times;
        const endTimes = endMeasure[i].times;

        // アイドル時間の差分
        idleDifference += endTimes.idle - startTimes.idle;

        // 合計時間の差分
        totalDifference +=
          endTimes.user -
          startTimes.user +
          (endTimes.nice - startTimes.nice) +
          (endTimes.sys - startTimes.sys) +
          (endTimes.idle - startTimes.idle) +
          (endTimes.irq - startTimes.irq);
      }

      // CPU使用率 = (1 - アイドル時間の差分 / 合計時間の差分) * 100
      const cpuUsage = (1 - idleDifference / totalDifference) * 100;
      resolve(cpuUsage);
    }, 1000);
  });
}

/**
 * 定期的にシステム情報を送信
 */
function startSystemStatsPolling(mainWindow: BrowserWindow, intervalMs = 2000) {
  let timer: NodeJS.Timeout;

  const sendStats = async () => {
    if (!mainWindow.isDestroyed()) {
      const stats = await getSystemStats();
      ipc.send(IpcChannels.SYSTEM_STATS, mainWindow.webContents, stats);
      timer = setTimeout(sendStats, intervalMs);
    }
  };

  sendStats();

  return () => {
    clearTimeout(timer);
  };
}

/**
 * システム関連のIPC通信ハンドラーのセットアップ
 */
export function setupSystemHandlers(mainWindow: BrowserWindow): () => void {
  // システム情報を取得するハンドラー
  ipc.handle(IpcChannels.SYSTEM_INFO, () => {
    return getSystemInfo();
  });

  // 定期的にシステム統計情報を送信
  const stopPolling = startSystemStatsPolling(mainWindow);

  // アプリ情報を取得するハンドラー
  ipc.handle(IpcChannels.APP_INFO, () => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      electronVersion: process.versions.electron,
    };
  });

  // クリーンアップ用の関数を返す
  return () => {
    stopPolling();
  };
}
