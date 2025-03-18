import { test, expect, _electron } from "@playwright/test";

let electronApp: Awaited<ReturnType<typeof _electron.launch>>;
let mainPage: Awaited<ReturnType<typeof electronApp.firstWindow>>;

/**
 * プリロードスクリプトが読み込まれるのを待つ関数
 * - Electronブリッジが利用可能になるまで待機
 * - 100ミリ秒ごとにチェックを行う
 */
async function waitForPreloadScript() {
  return new Promise((resolve) => {
    // 100ミリ秒ごとにElectronブリッジの存在をチェック
    const interval = setInterval(async () => {
      // メインページでelectronオブジェクトの存在を評価
      const electronBridge = await mainPage.evaluate(() => {
        return (window as Window & { electron?: any }).electron;
      });

      // Electronブリッジが見つかったら
      if (electronBridge) {
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

test("最小化できるかどうか", async () => {
  await mainPage.click("#minimize");
  const isMinimized = await electronApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMinimized();
  });
  expect(isMinimized).toBeTruthy();
});

test("最大化できるかどうか", async () => {
  await mainPage.click("#maximize");
  const isMaximized = await electronApp.evaluate((electron) => {
    return electron.BrowserWindow.getAllWindows()[0].isMaximized();
  });
  expect(isMaximized).toBeTruthy();
});

test("メニューがあるかどうか", async () => {
  const menu = await electronApp.evaluate((electron) => {
    return electron.Menu.getApplicationMenu();
  });
  expect(menu).not.toBeNull();
  expect(menu?.items).toHaveLength(2);
  expect(menu?.items[1].label).toBe("View");
});
