# ローカルエージェント

*言語: [English](../../README.md) | [日本語](README-jp.md) | [中文](README-cn.md)*

ローカルで動作するLLM（Large Language Model）を使用し、仮想環境内で自由にコマンド操作を実行できる自律型AIエージェントシステムです。Docker環境内で完結するシステムで、最悪の場合AIが環境を破壊ことになったとしても大丈夫なサンドボックス環境の構築を目指します。

## 概要

このプロジェクトは、ローカル環境でOllamaサーバーを実行し、先進的なコード理解と生成機能を持つGemma 3モデル（gemma3:12b）を使用して、AIへの指示とシェルコマンドを実行できるフロントエンドと、AIとシェルを連携させるバックエンドを統合したシステムを提供します。

### 特徴

- **完全ローカル実行**: すべての処理がローカル環境で行われるため、データのプライバシーが保証されます。
- **Dockerコンテナ統合**: 必要なコンポーネントがすべて単一のDockerコンテナ内で動作します。
- **ブラウザUIインターフェース**: 使いやすいWeb UIからAIに指示を送信したり、シェルコマンドを実行できます。
- **簡単セットアップ**: WindowsおよびLinux/Mac用の自動化スクリプトによる簡単なセットアップ。
- **モデル管理**: APIを通じて異なるLLMモデルのロード、アンロード、状態確認が可能です。
- **API文書**: 利用可能なすべてのエンドポイントに関する完全なSwaggerドキュメントが提供されています。
- **シンプルな起動方法**: Docker Composeを使用して簡単にシステムを立ち上げることができます。

> **注意:** 設定にはGPU関連の設定が含まれていますが、GPU高速化の機能は十分にテストされていません。現在の実装は主にCPU使用を想定しています。

## システム要件

- Docker および Docker Compose
- Windows、Linux、またはmacOS環境
  - Windowsでは管理者権限でコマンドプロンプトを実行してください

## クイックスタート

### セットアップスクリプトを使用する方法（推奨）

1. リポジトリをクローンします:
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. セットアップスクリプトを実行します:

**Windows:**
```
setup.bat
```
（右クリックして「管理者として実行」を選択）

**Linux/macOS:**
```
chmod +x setup.sh
./setup.sh
```

3. セットアップ完了後、起動スクリプトを実行します:

**Windows:**
```
start.bat
```

**Linux/macOS:**
```
./start.sh
```

4. Web UIにアクセスします: `http://localhost:3001`

### Docker Composeを直接使用する方法

1. リポジトリをクローンします
2. プロジェクトのルートディレクトリに `.ollama` ディレクトリを作成します
3. コンテナをビルドして起動します:
```
docker-compose up --build
```

4. Web UIにアクセスします: `http://localhost:3001`

## システムアーキテクチャ

システムは以下の3つの主要コンポーネントで構成されています:

1. **Ollamaサーバー**: Gemma 3モデルを実行し、AIの推論機能を提供します。
2. **バックエンドサーバー**: Node.jsで実装されたExpressサーバーで、OllamaとフロントエンドUIの間の仲介を行います。
3. **フロントエンドUI**: ユーザーとAIエージェントのインタラクションを可能にするWeb UIです。

### ポート構成

- `11434`: Ollama API
- `3000`: バックエンドサーバー
- `3001`: フロントエンドサーバー

## 主な機能

- **AIへの指示送信**: ブラウザからAIエージェントへ自然言語で指示を送信できます。
- **シェルコマンド実行**: UIからシェルコマンドを実行し、結果を表示できます。
- **モデル管理**: 異なるLLMモデルのロード、アンロード、状態確認が可能です。
- **APIドキュメント**: Swaggerドキュメントにアクセスできます: `http://localhost:3000/api-docs`

## APIエンドポイント

バックエンドサーバーは以下のAPIエンドポイントを提供しています:

- `GET /api`: APIサーバーの正常性チェック
- `GET /api/check-model`: 利用可能なモデルとOllamaへの接続を確認
- `GET /api/models`: 利用可能なすべてのモデルを一覧表示
- `POST /api/generate`: プロンプトからテキストを生成
- `POST /api/execute-command`: システムコマンドを実行
- `GET /api/running-models`: 現在ロードされているモデルの情報を取得
- `POST /api/load-model`: モデルをメモリにロード
- `POST /api/unload-model`: モデルをメモリからアンロード

## 開発情報

### 技術スタック

- **Ollama**: ローカルLLMの実行環境
- **Node.js/Express**: バックエンドAPI
- **Next.js/TypeScript/TailwindCSS**: フロントエンドUI
- **Docker**: コンテナ環境
- **Swagger**: APIドキュメント

### プロジェクト構造

```
local-agent/
├── docker-compose.yml     # Dockerコンテナ構成
├── Dockerfile             # コンテナビルド定義
├── setup.bat              # Windows用セットアップスクリプト
├── setup.sh               # Linux/Mac用セットアップスクリプト
├── start.bat              # Windows用起動スクリプト
├── start.sh               # Linux/Mac用起動スクリプト
├── backend/               # バックエンドサーバー
│   ├── src/               # ソースコード
│   │   ├── controllers/   # APIコントローラ
│   │   ├── routes/        # APIルート
│   │   ├── services/      # サービス層（Ollama連携）
│   │   ├── config/        # 設定ファイル
│   │   ├── prompts/       # システムプロンプトとテンプレート
│   │   └── swagger/       # Swaggerドキュメント
│   └── tests/             # テストコード
├── frontend/              # フロントエンドUI
│   ├── src/               # ソースコード
│   │   └── app/           # Next.js アプリケーション
│   └── public/            # 静的ファイル
├── tests/                 # 統合テスト
└── docs/                  # ドキュメント
    └── readme/            # 翻訳されたREADME
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
3. プロジェクトのルートディレクトリに `.ollama` ディレクトリが存在することを確認します

### モデルのダウンロードに失敗する場合

インターネット接続を確認し、必要に応じて手動でモデルをダウンロードします:

```bash
docker exec -it local-agent bash -c "ollama pull gemma3:12b"
```

## 今後の展望

- AIモデルからのストリーミングレスポンス
- UI上での複数モデルサポート
- より高度なシェルコマンド実行機能
- ユーザーによるシステムプロンプトのカスタマイズ機能
