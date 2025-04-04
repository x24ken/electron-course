/**
 * IPCチャンネルの定義
 *
 * チャンネル名を一元管理することで、タイプミスを防ぎ、型安全性を確保します。
 */
export const IpcChannels = {
  // システム関連
  APP_INFO: "app:info",
  APP_QUIT: "app:quit",

  // ウィンドウ操作関連
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close",
  WINDOW_IS_MAXIMIZED: "window:isMaximized",

  // コンテンツ関連
  CONTENT_LOADED: "content:loaded",

  // システムリソース関連
  SYSTEM_STATS: "system:stats",
  SYSTEM_INFO: "system:info",
} as const;

// IPCチャンネル名の型
export type IpcChannel = (typeof IpcChannels)[keyof typeof IpcChannels];
