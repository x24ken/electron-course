import { app, BrowserWindow } from "electron";
import { isDev, ipcMainHandle } from "./utils.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pollResource(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });
});
