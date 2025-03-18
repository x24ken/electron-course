const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStaticData: (callback) => {
    return ipcOn("statistics", callback);
  },
  subscribeViewChange: (callback) => {
    return ipcOn("changeView", callback);
  },
  getStaticData: () => ipcInvoke("getStaticData"),
} satisfies Window["electron"]);

function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void
) {
  const cb = (
    event: Electron.IpcRendererEvent,
    payload: EventPayloadMapping[Key]
  ) => {
    callback(payload);
  };

  electron.ipcRenderer.on(key, cb);
  return () => {
    electron.ipcRenderer.off(key, cb);
  };
}
