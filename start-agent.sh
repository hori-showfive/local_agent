#!/bin/bash

# システムの起動スクリプト

echo "🚀 ローカルAIエージェントシステムを起動しています..."

# Dockerの確認
if ! command -v docker &> /dev/null; then
    echo "❌ Dockerがインストールされていません。インストールしてください。"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Composeがインストールされていません。インストールしてください。"
    exit 1
fi

# Nvidia-dockerの確認（GPUサポートのため）
if ! docker info | grep -i nvidia > /dev/null; then
    echo "⚠️ Nvidia Dockerサポートが検出されませんでした。GPUが利用できない可能性があります。"
    echo "詳細: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html"
fi

# ollamaディレクトリの確認と作成
OLLAMA_DIR="$HOME/.ollama"
if [ ! -d "$OLLAMA_DIR" ]; then
    echo "📁 .ollamaディレクトリが存在しないため作成します..."
    mkdir -p "$OLLAMA_DIR"
    echo "✅ $OLLAMA_DIR を作成しました"
fi

# コンテナをビルド・起動
echo "🏗️ Dockerコンテナをビルドしています..."
docker-compose build

echo "🔄 Dockerコンテナを起動しています..."
docker-compose up -d

echo "⏳ サービスの起動を待機しています..."
sleep 10

# サービスのヘルスチェック
echo "🔍 各サービスのヘルスチェックを実行しています..."

# Ollamaサーバーのチェック
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollamaサーバーは正常に動作しています"
else
    echo "❌ Ollamaサーバーに接続できません。ログを確認してください:"
    docker-compose logs local-agent | grep -i ollama
fi

# バックエンドAPIのチェック
if curl -s http://localhost:3000/api > /dev/null; then
    echo "✅ バックエンドAPIは正常に動作しています"
else
    echo "❌ バックエンドAPIに接続できません。ログを確認してください:"
    docker-compose logs local-agent | grep -i "Server is running"
fi

# フロントエンドサーバーのチェック
if curl -s -I http://localhost:3001 | grep -q "200 OK"; then
    echo "✅ フロントエンドサーバーは正常に動作しています"
else
    echo "❌ フロントエンドサーバーに接続できません。ログを確認してください:"
    docker-compose logs local-agent | grep -i next
fi

echo ""
echo "🌐 システムにアクセスするには:"
echo "- フロントエンドUI: http://localhost:3001"
echo "- バックエンドAPI: http://localhost:3000/api"
echo "- Ollama API: http://localhost:11434/api"
echo ""
echo "📝 ログを表示するには: docker-compose logs -f"
echo "🛑 システムを停止するには: docker-compose down"