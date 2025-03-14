import path from "path";
import { isDev } from "./utils.js";
import { app } from "electron";

export function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    isDev() ? "." : "..",
    "/dist-electron/preload.cjs"
  );
}
