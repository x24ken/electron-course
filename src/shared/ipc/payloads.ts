import { IpcChannels } from "./channels.js";

/**
 * システム情報の型定義
 */
export interface SystemInfo {
  platform: string;
  arch: string;
  cpuModel: string;
  cpuCores: number;
  totalMemory: number; // GB
  freeMemory: number; // GB
  totalDisk: number; // GB
  freeDisk: number; // GB
}

/**
 * システムリソース統計情報の型定義
 */
export interface SystemStats {
  cpuUsage: number; // パーセント (0-100)
  memoryUsage: number; // パーセント (0-100)
  diskUsage: number; // パーセント (0-100)
  timestamp: number; // Unix timestamp (ms)
}

/**
 * ウィンドウ状態の型定義
 */
export interface WindowState {
  isMaximized: boolean;
  isMinimized: boolean;
  isFocused: boolean;
}

/**
 * IPC通信のペイロード型マッピングの定義
 *
 * 各チャンネルに対して、requestとresponseの型を定義します。
 * これにより、送受信するデータの型安全性を確保します。
 */
export interface IpcPayloads {
  // システム関連
  [IpcChannels.APP_INFO]: {
    request: void;
    response: {
      name: string;
      version: string;
      electronVersion: string;
    };
  };

  [IpcChannels.APP_QUIT]: {
    request: { force?: boolean };
    response: void;
  };

  // ウィンドウ操作関連
  [IpcChannels.WINDOW_MINIMIZE]: {
    request: void;
    response: void;
  };

  [IpcChannels.WINDOW_MAXIMIZE]: {
    request: void;
    response: void;
  };

  [IpcChannels.WINDOW_CLOSE]: {
    request: void;
    response: void;
  };

  [IpcChannels.WINDOW_IS_MAXIMIZED]: {
    request: void;
    response: boolean;
  };

  // コンテンツ関連
  [IpcChannels.CONTENT_LOADED]: {
    request: {
      route: string;
      timestamp: number;
    };
    response: void;
  };

  // システムリソース関連
  [IpcChannels.SYSTEM_STATS]: {
    request: void;
    response: SystemStats;
  };

  [IpcChannels.SYSTEM_INFO]: {
    request: void;
    response: SystemInfo;
  };
}
