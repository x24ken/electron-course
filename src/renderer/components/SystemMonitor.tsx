import React, { useEffect, useState } from "react";
import { IpcChannels } from "../../shared/ipc/channels.js";
import { SystemInfo, SystemStats } from "../../shared/ipc/payloads.js";
import "./SystemMonitor.css";

/**
 * システム情報と統計情報を表示するコンポーネント
 */
export const SystemMonitor: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // コンポーネントマウント時にシステム情報を取得
  useEffect(() => {
    // システム情報の取得
    window.ipcRenderer
      .invoke(IpcChannels.SYSTEM_INFO, undefined)
      .then((info) => setSystemInfo(info))
      .catch((err) =>
        setError("システム情報の取得に失敗しました: " + err.message)
      );

    // 統計情報のリスナーを設定
    const unsubscribe = window.ipcRenderer.on(
      IpcChannels.SYSTEM_STATS,
      (stats) => {
        setSystemStats(stats);
      }
    );

    return () => {
      // クリーンアップ
      unsubscribe();
    };
  }, []);

  // アプリケーション情報の取得
  const [appInfo, setAppInfo] = useState<{
    name: string;
    version: string;
    electronVersion: string;
  } | null>(null);

  useEffect(() => {
    window.ipcRenderer
      .invoke(IpcChannels.APP_INFO, undefined)
      .then((info) => setAppInfo(info))
      .catch((err) => console.error("アプリ情報の取得に失敗しました:", err));
  }, []);

  if (error) {
    return <div className="system-monitor error">{error}</div>;
  }

  if (!systemInfo) {
    return (
      <div className="system-monitor loading">システム情報を読み込み中...</div>
    );
  }

  return (
    <div className="system-monitor">
      <h2>システムモニター</h2>

      {appInfo && (
        <div className="info-section">
          <h3>アプリケーション情報</h3>
          <div className="info-grid">
            <div className="info-label">名前:</div>
            <div className="info-value">{appInfo.name}</div>

            <div className="info-label">バージョン:</div>
            <div className="info-value">{appInfo.version}</div>

            <div className="info-label">Electron:</div>
            <div className="info-value">{appInfo.electronVersion}</div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>ハードウェア情報</h3>
        <div className="info-grid">
          <div className="info-label">プラットフォーム:</div>
          <div className="info-value">
            {systemInfo.platform} ({systemInfo.arch})
          </div>

          <div className="info-label">CPU:</div>
          <div className="info-value">
            {systemInfo.cpuModel} ({systemInfo.cpuCores}コア)
          </div>

          <div className="info-label">メモリ:</div>
          <div className="info-value">{systemInfo.totalMemory} GB</div>

          <div className="info-label">ディスク:</div>
          <div className="info-value">{systemInfo.totalDisk} GB</div>
        </div>
      </div>

      {systemStats && (
        <div className="info-section">
          <h3>リソース使用率</h3>
          <div className="resource-meters">
            <div className="resource-meter">
              <div className="meter-label">CPU</div>
              <div className="meter-bar">
                <div
                  className="meter-fill"
                  style={{ width: `${systemStats.cpuUsage}%` }}
                />
              </div>
              <div className="meter-value">
                {systemStats.cpuUsage.toFixed(1)}%
              </div>
            </div>

            <div className="resource-meter">
              <div className="meter-label">メモリ</div>
              <div className="meter-bar">
                <div
                  className="meter-fill"
                  style={{ width: `${systemStats.memoryUsage}%` }}
                />
              </div>
              <div className="meter-value">
                {systemStats.memoryUsage.toFixed(1)}%
              </div>
            </div>

            <div className="resource-meter">
              <div className="meter-label">ディスク</div>
              <div className="meter-bar">
                <div
                  className="meter-fill"
                  style={{ width: `${systemStats.diskUsage}%` }}
                />
              </div>
              <div className="meter-value">
                {systemStats.diskUsage.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="update-time">
            最終更新: {new Date(systemStats.timestamp).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};
