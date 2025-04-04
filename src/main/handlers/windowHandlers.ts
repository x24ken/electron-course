import { BrowserWindow, ipcMain, IpcMainEvent, app } from "electron";
import { IpcChannels } from "../../shared/ipc/channels.js";
import { ipc } from "../ipc/ipcMain.js";

// ハンドラーが登録済みかどうかのフラグ
let isSetup = false;

/**
 * ウィンドウ関連のIPC通信ハンドラー
 *
 * @returns クリーンアップ関数
 */
export function setupWindowHandlers(): () => void {
  // 既に設定済みなら何もしない
  if (isSetup) {
    console.log("Window handlers already set up");
    return () => {}; // ダミーのクリーンアップ関数
  }

  console.log("Setting up window handlers");
  isSetup = true;

  // ウィンドウの最小化
  ipc.on(IpcChannels.WINDOW_MINIMIZE, (event: IpcMainEvent) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.minimize();
    }
  });

  // ウィンドウの最大化/復元
  ipc.on(IpcChannels.WINDOW_MAXIMIZE, (event: IpcMainEvent) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    }
  });

  // ウィンドウを閉じる
  ipc.on(IpcChannels.WINDOW_CLOSE, (event: IpcMainEvent) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    if (window) {
      window.close();
    }
  });

  // アプリケーションを終了
  ipc.on(IpcChannels.APP_QUIT, (event: IpcMainEvent, data) => {
    console.log("Quitting application", data);
    app.quit();
  });

  // ウィンドウが最大化されているかどうかを確認
  ipc.handle(IpcChannels.WINDOW_IS_MAXIMIZED, (event: IpcMainEvent) => {
    const window = BrowserWindow.fromWebContents(event.sender);
    return window ? window.isMaximized() : false;
  });

  // クリーンアップ関数
  return () => {
    if (!isSetup) return;

    console.log("Cleaning up window handlers");
    ipcMain.removeHandler(IpcChannels.WINDOW_IS_MAXIMIZED);
    isSetup = false;
  };
}
