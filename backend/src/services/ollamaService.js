const axios = require('axios');

// ollamaサービス設定
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'deepcoder:14b';

// 単純なollamaへのリクエスト関数
async function generateWithOllama(prompt, model = DEFAULT_MODEL) {
  try {
    console.log(`Sending request to Ollama with model: ${model}`);
    console.log(`Prompt: ${prompt}`);
    
    const response = await axios.post(`${OLLAMA_API_URL}/generate`, {
      model,
      prompt,
      stream: false
    });
    
    return { 
      success: true, 
      response: response.data.response 
    };
  } catch (error) {
    console.error('Error calling Ollama:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return { 
      success: false, 
      error: `Ollama API error: ${error.message}` 
    };
  }
}

// ollamaのモデル一覧を取得
async function getAvailableModels() {
  try {
    const response = await axios.get(`${OLLAMA_API_URL}/tags`);
    const models = response.data.models || [];
    const hasDeepCoder = models.some(model => model.name.includes('deepcoder'));
    
    return {
      success: true,
      models: models.map(m => m.name),
      hasDeepCoder
    };
  } catch (error) {
    console.error('Error checking models:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  generateWithOllama,
  getAvailableModels,
  OLLAMA_API_URL,
  DEFAULT_MODEL
};