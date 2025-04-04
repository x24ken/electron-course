import React, { useEffect, useState } from "react";
import { IpcChannels } from "../../shared/ipc/channels.js";
import "./TitleBar.css";

interface TitleBarProps {
  title: string;
}

/**
 * カスタムタイトルバーコンポーネント
 *
 * フレームレスウィンドウのタイトルバーとウィンドウコントロールを提供します。
 */
export const TitleBar: React.FC<TitleBarProps> = ({ title }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  // ウィンドウの最大化状態を監視
  useEffect(() => {
    // 初期状態を取得
    window.ipcRenderer
      .invoke(IpcChannels.WINDOW_IS_MAXIMIZED, undefined)
      .then((maximized) => setIsMaximized(maximized));

    // ウィンドウリサイズ時に状態を更新
    const handleResize = () => {
      window.ipcRenderer
        .invoke(IpcChannels.WINDOW_IS_MAXIMIZED, undefined)
        .then((maximized) => setIsMaximized(maximized));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ウィンドウを最小化
  const handleMinimize = () => {
    window.ipcRenderer.send(IpcChannels.WINDOW_MINIMIZE, undefined);
  };

  // ウィンドウを最大化/復元
  const handleMaximize = () => {
    window.ipcRenderer.send(IpcChannels.WINDOW_MAXIMIZE, undefined);
  };

  // ウィンドウを閉じる
  const handleClose = () => {
    window.ipcRenderer.send(IpcChannels.WINDOW_CLOSE, undefined);
  };

  return (
    <div className="title-bar">
      <div className="title-bar-drag-area">
        <div className="title-bar-title">{title}</div>
      </div>
      <div className="title-bar-controls">
        <button
          className="title-bar-button minimize-button"
          onClick={handleMinimize}
          aria-label="Minimize"
        >
          <svg width="10" height="1" viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" fill="currentColor" />
          </svg>
        </button>

        <button
          className="title-bar-button maximize-button"
          onClick={handleMaximize}
          aria-label={isMaximized ? "Restore" : "Maximize"}
        >
          {isMaximized ? (
            // 復元アイコン
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path
                d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z"
                fill="currentColor"
              />
            </svg>
          ) : (
            // 最大化アイコン
            <svg width="10" height="10" viewBox="0 0 10 10">
              <path d="M0 0v10h10V0H0zm9 9H1V1h8v8z" fill="currentColor" />
            </svg>
          )}
        </button>

        <button
          className="title-bar-button close-button"
          onClick={handleClose}
          aria-label="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path
              d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
