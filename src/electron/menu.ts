import { app, BrowserWindow, Menu } from "electron";
import { ipcWebContentHandle } from "./utils.js";

const createMenu = (mainWindow: BrowserWindow) => {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === "darwin" ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "Quit",
            click: () => {
              app.quit();
            },
          },
          {
            label: "DevTools",
            click: () => {
              mainWindow.webContents.openDevTools();
            },
            visible: process.env.NODE_ENV === "development",
          },
        ],
      },
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () => {
              ipcWebContentHandle("changeView", mainWindow.webContents, "CPU");
            },
          },
          {
            label: "Memory",
            click: () => {
              ipcWebContentHandle("changeView", mainWindow.webContents, "RAM");
            },
          },
          {
            label: "Storage",
            click: () => {
              ipcWebContentHandle(
                "changeView",
                mainWindow.webContents,
                "STORAGE"
              );
            },
          },
        ],
      },
    ])
  );
};

export default createMenu;
