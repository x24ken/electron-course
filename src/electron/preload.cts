const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStaticData: (callback: (statistics: any) => void) => {
    electron.ipcRenderer.on("statistics", (event, statistics) => {
      callback(statistics);
    });
  },
  getStaticData: () => electron.ipcRenderer.invoke("getStaticData"),
} satisfies Window["electron"]);
