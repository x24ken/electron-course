import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { setupWindowHandlers } from "./handlers/windowHandlers.js";
import { setupSystemHandlers } from "./handlers/systemHandlers.js";

// ES Moduleでの__dirnameの代替
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let cleanupWindowHandlers: (() => void) | null = null;

// 開発モードかどうか
const isDevelopment = process.env.NODE_ENV === "development";

/**
 * メインウィンドウの作成
 */
function createWindow() {
  console.log("Preload path:", path.join(__dirname, "preload.js"));

  // ブラウザウィンドウの作成
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    frame: false, // フレームレスウィンドウ
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // コンテキスト分離を有効化
      nodeIntegration: false, // Node.js統合を無効化
    },
  });

  // 開発モードではローカルサーバーから読み込み、本番モードではビルドされたHTMLファイルを読み込む
  if (isDevelopment) {
    mainWindow.loadURL("http://localhost:5174");
    // 開発ツールを開く
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../index.html"));
  }

  // システム情報ハンドラーのセットアップ (ウィンドウごとに設定)
  const cleanupSystemHandlers = setupSystemHandlers(mainWindow);

  // ウィンドウが閉じられたときの処理
  mainWindow.on("closed", () => {
    // クリーンアップ
    cleanupSystemHandlers();
    mainWindow = null;
  });
}

// アプリの起動時の処理
app.whenReady().then(() => {
  // ウィンドウ操作ハンドラーはアプリ起動時に一度だけ設定
  cleanupWindowHandlers = setupWindowHandlers();

  createWindow();

  // macOSでは、ウィンドウがすべて閉じられてもアプリは終了せず、
  // ドックアイコンをクリックするとウィンドウが再度開かれる
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOS以外では、すべてのウィンドウが閉じられるとアプリは終了する
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// アプリ終了時のクリーンアップ
app.on("will-quit", () => {
  if (cleanupWindowHandlers) {
    cleanupWindowHandlers();
    cleanupWindowHandlers = null;
  }
});
