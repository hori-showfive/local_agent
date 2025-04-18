const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const { checkOllamaServer } = require('./utils/common');
const { OLLAMA_API_URL } = require('./services/ollamaService');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());

// 静的ファイルの提供
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// メインページへのルーティング
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

// APIルートを登録
app.use('/api', apiRoutes);

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Ollama API URL: ${OLLAMA_API_URL}`);
  console.log(`Web interface: http://localhost:${PORT}`);
  
  // サーバー起動後にモデルをチェック
  setTimeout(checkModelsOnStartup, 2000);
});

// 初期起動時にモデルをチェック
async function checkModelsOnStartup() {
  try {
    console.log('Checking available models...');
    const status = await checkOllamaServer(OLLAMA_API_URL);
    
    if (status.running) {
      const models = status.models;
      console.log('Available models:', models.map(m => m.name).join(', '));
      
      const hasDeepCoder = models.some(model => model.name.includes('deepcoder'));
      if (!hasDeepCoder) {
        console.warn('Warning: deepcoder model not found. You may need to pull it manually with "ollama pull deepcoder:14b"');
      } else {
        console.log('deepcoder model is available.');
      }
    } else {
      console.error('Error checking models on startup:', status.error);
      console.log('Make sure ollama service is running on the expected URL:', OLLAMA_API_URL);
    }
  } catch (error) {
    console.error('Error during startup check:', error.message);
  }
}