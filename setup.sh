#!/bin/bash

echo "==================================="
echo "ローカルAIエージェントシステムセットアップ"
echo "==================================="
echo

# 必要なコマンドの存在確認
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "$1 が見つかりません。インストールが必要です。"
    return 1
  fi
  return 0
}

# Dockerの確認
if ! check_command docker; then
  echo "Dockerをインストールする必要があります。"
  echo "インストール手順は https://docs.docker.com/engine/install/ を参照してください。"
  echo "インストール後、このスクリプトを再度実行してください。"
  exit 1
fi

# Docker Composeの確認
if ! docker compose version &> /dev/null; then
  echo "Docker Composeをインストールする必要があります。"
  echo "インストール手順は https://docs.docker.com/compose/install/ を参照してください。"
  echo "インストール後、このスクリプトを再度実行してください。"
  exit 1
fi

echo "前提条件の確認が完了しました。"
echo

# バージョン情報を表示
echo "Docker version:"
docker --version
echo

echo "Docker Compose version:"
docker compose version
echo

# .ollamaディレクトリの確認と作成
echo ".ollamaディレクトリを確認しています..."
if [ ! -d "./.ollama" ]; then
  echo ".ollamaディレクトリが存在しません。作成します..."
  mkdir -p ./.ollama
  echo ".ollamaディレクトリを作成しました。"
else
  echo ".ollamaディレクトリは既に存在します。"
fi
echo

echo
echo "==================================="
echo "セットアップが完了しました！"
echo "==================================="
echo
echo "システムを起動するには start.sh を実行してください。"
echo
echo "start.sh を作成しています..."

# start.shの作成
cat > start.sh << 'EOF'
#!/bin/bash

echo "ローカルAIエージェントシステムを起動しています..."
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
docker compose up --build

echo
echo "システムが終了しました。"
EOF

# 作成したstart.shに実行権限を付与
chmod +x start.sh

echo "start.sh が作成されました。"
echo
echo "セットアップが完了しました。"
echo "./start.sh を実行してシステムを起動できます。"
echo "Docker環境では gemma3:12b モデルが使用されます。"