import { test, expect, _electron } from "@playwright/test";

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage: Awaited<ReturnType<typeof electronApp.firstWindow>>;

/**
 * プリロードスクリプトが読み込まれるのを待つ関数
 * - IPCレンダラーAPIが利用可能になるまで待機
 * - 100ミリ秒ごとにチェックを行う
 */
async function waitForPreloadScript() {
  return new Promise((resolve) => {
    // 100ミリ秒ごとにIPC APIの存在をチェック
    const interval = setInterval(async () => {
      // メインページでipcRendererオブジェクトの存在を評価
      const ipcRenderer = await mainPage.evaluate(() => {
        return (window as Window & { ipcRenderer?: any }).ipcRenderer;
      });

      // IPCレンダラーが見つかったら
      if (ipcRenderer) {
        clearInterval(interval); // インターバルを停止
        resolve(true); // Promiseを解決
      }
    }, 100); // 100ミリ秒間隔
  });
}

test.beforeEach(async () => {
  electronApp = await _electron.launch({
    args: ["."],
    env: {
      NODE_ENV: "development",
    },
  });
  mainPage = await electronApp.firstWindow();
  await waitForPreloadScript();
});

test.afterEach(async () => {
  await electronApp.close();
});

test("タイトルが表示されているか", async () => {
  const title = await mainPage.textContent(".title-bar-title");
  expect(title).toBe("Electron System Monitor");
});

test("システム情報が表示されているか", async () => {
  // システム情報セクションが表示されるまで待機
  await mainPage.waitForSelector(".info-section");

  // システム情報のセクションがあることを確認
  const sectionCount = await mainPage.locator(".info-section").count();
  expect(sectionCount).toBeGreaterThan(0);
});

test("最小化ボタンが機能するか", async () => {
  await mainPage.click(".minimize-button");
  const isMinimized = await electronApp.evaluate(({ BrowserWindow }) => {
    return BrowserWindow.getAllWindows()[0].isMinimized();
  });
  expect(isMinimized).toBeTruthy();
});

test("最大化ボタンが機能するか", async () => {
  await mainPage.click(".maximize-button");
  // 少し待機して最大化処理が完了するのを待つ
  await mainPage.waitForTimeout(500);

  const isMaximized = await electronApp.evaluate(({ BrowserWindow }) => {
    return BrowserWindow.getAllWindows()[0].isMaximized();
  });
  expect(isMaximized).toBeTruthy();
});
