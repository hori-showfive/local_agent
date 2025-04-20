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
COPY ./backend ./backend
RUN cd backend && npm install

# フロントエンドの依存関係をインストール
COPY ./frontend ./frontend
RUN cd frontend && npm install

# フロントエンドをビルド
RUN cd frontend && npm run build

# 起動スクリプトを作成
RUN echo '#!/bin/bash\n\
echo "Starting Ollama server..."\n\
ollama serve &\n\
sleep 5\n\
echo "Checking for gemma3 model..."\n\
if ! ollama list | grep -q "gemma3:12b"; then\n\
  echo "Pulling gemma3 model..."\n\
  ollama pull gemma3:12b\n\
else\n\
  echo "gemma3 model already exists in mounted volume."\n\
fi\n\
echo "Loading gemma3:12b model into memory..."\n\
curl -s -X POST http://localhost:11434/api/generate -d "{\\"model\\": \\"gemma3:12b\\"}" -H "Content-Type: application/json" > /dev/null\n\
echo "Model loaded successfully."\n\
echo "Starting backend server..."\n\
cd /app/backend && node src/index.js &\n\
echo "Starting frontend server..."\n\
cd /app/frontend && npm run start\n' > /start.sh && chmod +x /start.sh

ENV CUDA_VISIBLE_DEVICES=0

# ENTRYPOINTを指定して、/start.shを実行可能にする
ENTRYPOINT ["/bin/bash"]
CMD ["/start.sh"]

# ポートを公開（ollama API、バックエンドサーバー、フロントエンドサーバー用）
EXPOSE 11434 3000 3001