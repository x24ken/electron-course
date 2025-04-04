/**
 * Electronプリロードスクリプト
 *
 * このファイルはCommonJS形式で記述する必要があります。
 * ESモジュール構文は使用できません。
 */
const { contextBridge, ipcRenderer } = require("electron");

/**
 * 型安全なIPC通信APIの実装（Renderer側）
 */
const ipcRendererApi = {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  on: (channel, callback) => {
    const wrappedCallback = (_event, data) => callback(data);
    ipcRenderer.on(channel, wrappedCallback);
    return () => {
      ipcRenderer.removeListener(channel, wrappedCallback);
    };
  },

  once: (channel, callback) => {
    const wrappedCallback = (_event, data) => callback(data);
    ipcRenderer.once(channel, wrappedCallback);
  },

  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
};

// 安全なAPIをブラウザウィンドウに公開
contextBridge.exposeInMainWorld("ipcRenderer", ipcRendererApi);
