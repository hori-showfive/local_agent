#!/bin/bash

# Docker環境内でテストを実行するためのスクリプト

echo "🧪 Docker環境内テスト開始..."

# 各サーバーのステータスチェック
echo "1️⃣ Ollamaサーバーのステータスチェック..."
curl -s http://localhost:11434/api/tags || { echo "❌ Ollamaサーバーに接続できません"; exit 1; }
echo "✅ Ollamaサーバーは正常に動作しています"

echo "2️⃣ バックエンドAPIのステータスチェック..."
curl -s http://localhost:3000/api || { echo "❌ バックエンドAPIに接続できません"; exit 1; }
echo "✅ バックエンドAPIは正常に動作しています"

echo "3️⃣ フロントエンドサーバーのステータスチェック..."
curl -s -I http://localhost:3001 | grep -q "200 OK" || { echo "❌ フロントエンドサーバーに接続できません"; exit 1; }
echo "✅ フロントエンドサーバーは正常に動作しています"

# APIテストの実行
echo "4️⃣ APIテストの実行..."
cd /app/tests && node run-tests.js

echo "🎉 全てのサービスが正常に動作しています！"