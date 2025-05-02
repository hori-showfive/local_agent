const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const apiRoutes = require('./routes/apiRoutes');
const { checkOllamaServer } = require('./utils/common');
const { OLLAMA_API_URL } = require('./services/ollamaService');

const app = express();
const PORT = process.env.PORT || 3000;

// ミドルウェア設定
app.use(cors());
app.use(express.json());

// Swagger UIの設定
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.1.0/swagger-ui.css',
  explorer: true
}));

// API仕様をJSONとして提供
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// APIルートを登録
app.use('/api', apiRoutes);

// サーバーを起動
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Ollama API URL: ${OLLAMA_API_URL}`);
  console.log(`API documentation: http://localhost:${PORT}/api-docs`);
  
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
      
      const hasGemma3 = models.some(model => model.name.includes('gemma3'));
      if (!hasGemma3) {
        console.warn('Warning: gemma3 model not found. You may need to pull it manually with "ollama pull gemma3:12b"');
      } else {
        console.log('gemma3 model is available.');
      }
    } else {
      console.error('Error checking models on startup:', status.error);
      console.log('Make sure ollama service is running on the expected URL:', OLLAMA_API_URL);
    }
  } catch (error) {
    console.error('Error during startup check:', error.message);
  }
}