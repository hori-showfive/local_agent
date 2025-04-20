#!/bin/bash

echo "==================================="
echo "ローカルAIエージェントシステムを起動"
echo "==================================="
echo

echo "現在のディレクトリ: $(pwd)"
echo

echo ".ollamaディレクトリを確認しています..."
if [ ! -d "./.ollama" ]; then
  echo ".ollamaディレクトリが存在しません。作成します..."
  mkdir -p ./.ollama
  echo ".ollamaディレクトリを作成しました。"
else
  echo ".ollamaディレクトリは既に存在します。"
fi
echo

echo "Docker Composeでシステムをビルド・起動しています..."
echo "(終了するには Ctrl+C を押してください)"
echo
docker compose up --build

echo
echo "システムが終了しました。"