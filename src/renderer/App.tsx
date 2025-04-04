import React from "react";
import { TitleBar } from "./components/TitleBar";
import { SystemMonitor } from "./components/SystemMonitor";
import { IpcChannels } from "../shared/ipc/channels.js";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <TitleBar title="Electron System Monitor" />

      <div className="app-content">
        <SystemMonitor />

        <div className="app-footer">
          <p>Powered by Electron + React + TypeScript</p>
          <p>
            <button
              className="quit-button"
              onClick={() =>
                window.ipcRenderer.send(IpcChannels.APP_QUIT, { force: false })
              }
            >
              アプリを終了
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
