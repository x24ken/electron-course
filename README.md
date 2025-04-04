# Electron System Monitor

TypeScript と React を使用した、タイプセーフな IPC 通信を実装した Electron アプリケーションです。

## 機能

- システム情報の表示（プラットフォーム、CPU、メモリなど）
- リアルタイムのリソース使用率モニタリング（CPU、メモリ、ディスク）
- カスタムタイトルバー（最小化、最大化、閉じるボタン）
- 型安全な IPC 通信

## プロジェクト構造

```
src/
│
├── shared/          # メインプロセスとレンダラープロセスで共有する型定義
│   └── ipc/
│       ├── channels.ts   # IPCチャンネル名の定義
│       └── payloads.ts   # 各チャンネルのペイロード型定義
│
├── main/            # Electronメインプロセス関連
│   ├── main.ts      # アプリケーションのエントリーポイント
│   ├── preload.js   # コンテキストブリッジを使ったpreloadスクリプト
│   ├── ipc/
│   │   └── ipcMain.ts   # 型安全なIPC通信実装
│   └── handlers/
│       ├── windowHandlers.ts   # ウィンドウ操作関連の処理
│       └── systemHandlers.ts   # システム情報関連の処理
│
└── renderer/        # Reactレンダラープロセス関連
    ├── App.tsx      # メインReactコンポーネント
    ├── App.css      # アプリ全体のスタイル
    └── components/
        ├── TitleBar.tsx     # カスタムタイトルバー
        ├── TitleBar.css     # タイトルバーのスタイル
        ├── SystemMonitor.tsx  # システム情報表示
        └── SystemMonitor.css  # システム情報表示のスタイル
```

## 開発方法

```bash
# 依存関係のインストール
npm install

# 開発モードでの実行
npm run dev

# ビルド
npm run build

# パッケージング (macOS)
npm run dist:mac

# パッケージング (Windows)
npm run dist:win

# パッケージング (Linux)
npm run dist:linux
```

## 型安全な IPC 通信

このプロジェクトでは、TypeScript の型システムを使用して Electron の IPC 通信を型安全に実装しています。これにより、以下のメリットがあります：

- チャンネル名のタイプミスを防止
- リクエスト/レスポンスのペイロード型を強制
- 自動補完によるコーディング効率の向上
- コンパイル時のエラー検出

Shared API パターンを採用し、メインプロセスとレンダラープロセス間で型定義を共有しています。
