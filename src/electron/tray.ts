import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetsPath } from "./pathResolver.js";

const createTray = (mainWindow: BrowserWindow) => {
  const tray = new Tray(
    path.join(
      getAssetsPath(),
      process.platform === "darwin" ? "trayIconTemplate.png" : "trayIcon.png"
    )
  );
  tray.setToolTip("CPU Monitor");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Quit",
        click: () => {
          app.quit();
        },
      },
      {
        label: "Show",
        click: () => {
          mainWindow.show();
          if (app.dock) {
            app.dock.show();
          }
        },
      },
    ])
  );
};

export default createTray;
