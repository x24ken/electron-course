import { app, BrowserWindow, Tray } from "electron";
import { isDev, ipcMainHandle, ipcMainOn } from "./utils.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";
import createTray from "./tray.js";
import createMenu from "./menu.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
    frame: false,
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

  ipcMainOn("sendFrameWindowAction", (action) => {
    switch (action) {
      case "CLOSE":
        mainWindow.close();
        break;
      case "MINIMIZE":
        mainWindow.minimize();
        break;
      case "MAXIMIZE":
        mainWindow.maximize();
        break;
    }
  });

  createTray(mainWindow);

  handleCloseEvent(mainWindow);

  createMenu(mainWindow);
});

function handleCloseEvent(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (event) => {
    if (willClose) {
      return;
    }

    event.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}
