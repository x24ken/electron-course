const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStaticData: (callback: (statistics: any) => void) => {
    callback({});
  },
  getStaticData: () => console.log("static"),
});
