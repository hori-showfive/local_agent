# ローカルエージェント

*言語: [English](../../README.md) | [日本語](README-jp.md) | [中文](README-cn.md)*

ローカルで動作するLLM（Large Language Model）を使用し、仮想環境内で自由にコマンド操作を実行できる自律型AIエージェントシステムです。Docker環境内で完結するシステムで、最悪の場合AIが環境を破壊ことになったとしても大丈夫なサンドボックス環境の構築を目指します。GPUによる高速な推論をサポートする予定です。

## 概要

このプロジェクトは、ローカル環境でOllamaサーバーを実行し、例として現時点で最新の深層学習モデル「deepcoder」を使用して、AIへの指示とシェルコマンドを実行できるフロントエンドと、AIとシェルを連携させるバックエンドを統合したシステムを提供します。

### 特徴

- **完全ローカル実行**: すべての処理がローカル環境で行われるため、データのプライバシーが保証されます。
- **Dockerコンテナ統合**: 必要なコンポーネントがすべて単一のDockerコンテナ内で動作します。(マイクロサービスアーキテクチャに変更する可能性は0ではない)
- **ブラウザUIインターフェース**: 使いやすいWeb UIからAIに指示を送信したり、シェルコマンドを実行できます。
- **GPU高速化**: NVIDIAのGPUを活用した高速推論をサポートする予定です。
- **シンプルな起動方法**: 起動スクリプトで簡単にシステムを立ち上げることができます。

## システム要件

- Docker および Docker Compose
- NVIDIA GPU（推奨）とCUDAツールキット(現在はgpu推論未実装のため不要)
- WindowsまたはLinux環境（Windowsでは管理者権限でコマンドプロンプトを実行）

## クイックスタート

### Windowsでの起動

1. リポジトリをクローンします:
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. 起動スクリプトを実行します:
```
start-agent.bat
```

### Linuxでの起動

1. リポジトリをクローンします:
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. 起動スクリプトに実行権限を付与します:
```
chmod +x start-agent.sh
```

3. 起動スクリプトを実行します:
```
./start-agent.sh
```

## システムアーキテクチャ

システムは以下の3つの主要コンポーネントで構成されています:

1. **Ollamaサーバー**: deepcoderモデルを実行し、AIの推論機能を提供します。
2. **バックエンドサーバー**: Node.jsで実装されたExpressサーバーで、OllamaとフロントエンドUIの間の仲介を行います。
3. **フロントエンドUI**: Next.jsとTypeScriptで実装されたWeb UIで、ユーザーとAIエージェントのインタラクションを可能にします。

### ポート構成

- `11434`: Ollama API
- `3000`: バックエンドサーバー
- `3001`: フロントエンドサーバー

## 主な機能

- **AIへの指示送信**: ブラウザからAIエージェントへ自然言語で指示を送信できます。
- **シェルコマンド実行**: UIからシェルコマンドを実行し、結果を表示できます。
- **モデル状態確認**: 使用可能なモデルとサーバー状態の確認が可能です。

## 開発情報

### 技術スタック

- **Ollama**: ローカルLLMの実行環境
- **Node.js/Express**: バックエンドAPI
- **Next.js/TypeScript/TailwindCSS**: フロントエンドUI
- **Docker**: コンテナ環境
- **NVIDIA CUDA**: GPU高速化

### プロジェクト構造

```
local-agent/
├── docker-compose.yml     # Dockerコンテナ構成
├── Dockerfile             # コンテナビルド定義
├── start-agent.bat        # Windows用起動スクリプト
├── start-agent.sh         # Linux用起動スクリプト
├── backend/               # バックエンドサーバー
│   ├── src/               # ソースコード
│   └── tests/             # テストコード
├── frontend/              # フロントエンドUI
│   ├── src/               # ソースコード
│   │   └── app/           # Next.js アプリケーション
│   └── public/            # 静的ファイル
├── tests/                 # 統合テスト
└── docs/                  # ドキュメント
```

### テスト実行

バックエンドのテストを実行するには:

```bash
cd backend
npm test
```

統合テストを実行するには:

```bash
node tests/run-tests.js
```

## トラブルシューティング

### サービスが起動しない場合

1. Dockerが正しくインストールされていることを確認します
2. ログを確認します: `docker-compose logs -f`
3. GPUサポートに問題がある場合は、NVIDIAドライバーとCUDAが正しくインストールされていることを確認します

### モデルのダウンロードに失敗する場合

インターネット接続を確認し、必要に応じて手動でモデルをダウンロードします:

```bash
docker exec -it local-agent bash -c "ollama pull deepcoder:14b"
```

## 今後の展望

- バックエンドの実装
- gpu推論のサポート
- フロントエンドUIの改善
