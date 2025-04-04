import { IpcChannel } from "../shared/ipc/channels";
import { IpcPayloads } from "../shared/ipc/payloads";

interface IpcRendererApi {
  send: <T extends IpcChannel>(
    channel: T,
    data: IpcPayloads[T]["request"]
  ) => void;

  on: <T extends IpcChannel>(
    channel: T,
    callback: (data: IpcPayloads[T]["response"]) => void
  ) => () => void;

  once: <T extends IpcChannel>(
    channel: T,
    callback: (data: IpcPayloads[T]["response"]) => void
  ) => void;

  invoke: <T extends IpcChannel>(
    channel: T,
    data: IpcPayloads[T]["request"]
  ) => Promise<IpcPayloads[T]["response"]>;
}

declare global {
  interface Window {
    ipcRenderer: IpcRendererApi;
  }
}
