import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

/*
レンダラーから受けとり、何かしら返す
*/
export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key]
) {
  ipcMain.handle(key, (event) => {
    validateEventFrame(event.senderFrame);
    return handler();
  });
}

/*
レンダラーからの待ち受け状態
*/
export function ipcMainOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void
) {
  ipcMain.on(key, (event, payload) => {
    handler(payload);
  });
}

/*
レンダラーに何か送る
*/
export function ipcWebContentHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContent: WebContents,
  payload: EventPayloadMapping[Key]
) {
  webContent.send(key, payload);
}

function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5125") {
    return;
  }

  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Invalid frame");
  }
}
