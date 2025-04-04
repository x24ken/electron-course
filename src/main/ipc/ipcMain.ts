import {
  BrowserWindow,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
  WebContents,
} from "electron";
import { IpcChannel } from "../../shared/ipc/channels.js";
import { IpcPayloads } from "../../shared/ipc/payloads.js";

/**
 * メインプロセスからレンダラープロセスへのIPC通信のためのAPI
 */
export interface IpcMainApi {
  handle: <T extends IpcChannel>(
    channel: T,
    handler: (
      event: IpcMainEvent,
      data: IpcPayloads[T]["request"]
    ) => Promise<IpcPayloads[T]["response"]> | IpcPayloads[T]["response"]
  ) => void;

  removeHandler: <T extends IpcChannel>(channel: T) => void;

  on: <T extends IpcChannel>(
    channel: T,
    listener: (event: IpcMainEvent, data: IpcPayloads[T]["request"]) => void
  ) => void;

  off: <T extends IpcChannel>(
    channel: T,
    listener: (event: IpcMainEvent, data: IpcPayloads[T]["request"]) => void
  ) => void;

  once: <T extends IpcChannel>(
    channel: T,
    listener: (event: IpcMainEvent, data: IpcPayloads[T]["request"]) => void
  ) => void;

  send: <T extends IpcChannel>(
    channel: T,
    webContents: WebContents,
    data: IpcPayloads[T]["response"]
  ) => void;

  broadcast: <T extends IpcChannel>(
    channel: T,
    data: IpcPayloads[T]["response"]
  ) => void;
}

/**
 * 型安全なIPC通信のためのメインプロセス側実装
 */
export const ipc: IpcMainApi = {
  handle: <T extends IpcChannel>(
    channel: T,
    handler: (
      event: IpcMainEvent,
      data: IpcPayloads[T]["request"]
    ) => Promise<IpcPayloads[T]["response"]> | IpcPayloads[T]["response"]
  ): void => {
    ipcMain.handle(channel, async (event: IpcMainInvokeEvent, data) => {
      // IpcMainInvokeEventからIpcMainEventに必要なプロパティを持つオブジェクトを作成
      const eventWithMainEventProps = {
        ...event,
        // 必要なプロパティをダミー実装
        reply: () => {},
        returnValue: undefined,
        ports: [],
      } as IpcMainEvent;

      return await handler(eventWithMainEventProps, data);
    });
  },

  removeHandler: <T extends IpcChannel>(channel: T): void => {
    ipcMain.removeHandler(channel);
  },

  on: <T extends IpcChannel>(
    channel: T,
    listener: (event: IpcMainEvent, data: IpcPayloads[T]["request"]) => void
  ): void => {
    ipcMain.on(channel, (event, data) => {
      listener(event, data);
    });
  },

  off: <T extends IpcChannel>(
    channel: T,
    listener: (event: IpcMainEvent, data: IpcPayloads[T]["request"]) => void
  ): void => {
    ipcMain.removeListener(channel, listener);
  },

  once: <T extends IpcChannel>(
    channel: T,
    listener: (event: IpcMainEvent, data: IpcPayloads[T]["request"]) => void
  ): void => {
    ipcMain.once(channel, (event, data) => {
      listener(event, data);
    });
  },

  send: <T extends IpcChannel>(
    channel: T,
    webContents: WebContents,
    data: IpcPayloads[T]["response"]
  ): void => {
    webContents.send(channel, data);
  },

  broadcast: <T extends IpcChannel>(
    channel: T,
    data: IpcPayloads[T]["response"]
  ): void => {
    // 全ての開いているウィンドウにメッセージを送信
    BrowserWindow.getAllWindows().forEach((window) => {
      if (window.webContents) {
        window.webContents.send(channel, data);
      }
    });
  },
};
