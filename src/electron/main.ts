import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }

  pollResource(mainWindow);

  ipcMain.handle("getStaticData", () => {
    return getStaticData();
  });
});
