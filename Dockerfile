FROM ollama/ollama:latest

# NodeJSとその他必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    git \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Node.jsのバージョン確認
RUN node --version && npm --version

# 作業ディレクトリの設定
WORKDIR /app

# バックエンドの依存関係をインストール
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# フロントエンドの依存関係をインストール
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# アプリケーションのソースコードをコピー
COPY . .

# フロントエンドをビルド
RUN cd frontend && npm run build

# 起動スクリプトを作成
RUN echo '#!/bin/bash\n\
echo "Starting Ollama server..."\n\
ollama serve &\n\
sleep 5\n\
echo "Checking for deepcoder model..."\n\
if ! ollama list | grep -q "deepcoder:14b"; then\n\
  echo "Pulling deepcoder model..."\n\
  ollama pull deepcoder:14b\n\
else\n\
  echo "deepcoder model already exists in mounted volume."\n\
fi\n\
echo "Loading deepcoder:14b model into memory..."\n\
curl -s -X POST http://localhost:11434/api/generate -d "{\\"model\\": \\"deepcoder:14b\\"}" -H "Content-Type: application/json" > /dev/null\n\
echo "Model loaded successfully."\n\
echo "Starting backend server..."\n\
cd /app/backend && node src/index.js &\n\
echo "Starting frontend server..."\n\
cd /app/frontend && npm start\n' > /start.sh && chmod +x /start.sh

# ENTRYPOINTを指定して、/start.shを実行可能にする
ENTRYPOINT ["/bin/bash"]
CMD ["/start.sh"]

# ポートを公開（ollama API、バックエンドサーバー、フロントエンドサーバー用）
EXPOSE 11434 3000 3001