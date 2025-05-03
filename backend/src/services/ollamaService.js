const axios = require('axios');
const modelConfig = require('../config/modelConfig');

// ollamaサービス設定
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
const DEFAULT_MODEL = modelConfig.DEFAULT_MODEL;
const DEFAULT_SYSTEM_PROMPT = modelConfig.DEFAULT_SYSTEM_PROMPT;
const DEFAULT_PARAMETERS = modelConfig.DEFAULT_PARAMETERS;

// 実行中のモデルステータスを取得
async function getRunningModels() {
  try {
    console.log('Fetching running models status from Ollama');
    const response = await axios.get(`${OLLAMA_API_URL}/ps`);
    const models = response.data.models || [];
    
    return {
      success: true,
      runningModels: models.map(m => ({
        name: m.name,
        model: m.model,
        size: m.size,
        size_vram: m.size_vram,
        expires_at: m.expires_at,
        details: m.details
      }))
    };
  } catch (error) {
    console.error('Error fetching running models:', error.message);
    return {
      success: false,
      error: `Failed to get running models: ${error.message}`
    };
  }
}

// モデルをメモリに読み込む
async function loadModel(model, options = {}) {
  try {
    console.log(`Loading model into memory: ${model}`);
    
    // デフォルトパラメータとマージ
    const mergedOptions = { ...DEFAULT_PARAMETERS, ...options };
    
    // オプションを含むリクエストボディを構築
    const requestBody = {
      model,
      options: mergedOptions
    };
    
    // /generateエンドポイントに空のプロンプトでリクエストを送信
    const response = await axios.post(`${OLLAMA_API_URL}/generate`, requestBody);
    
    return {
      success: true,
      message: `Model ${model} successfully loaded into memory`,
      metadata: {
        model: response.data.model,
        created_at: response.data.created_at
      }
    };
  } catch (error) {
    console.error(`Error loading model ${model}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // モデルが存在しない場合の処理
      if (error.response.status === 404) {
        return {
          success: false,
          error: `Model '${model}' not found. Make sure it is pulled and available locally.`,
          notFound: true
        };
      }
    }
    return {
      success: false,
      error: `Failed to load model: ${error.message}`
    };
  }
}

// モデルをアンロードする
async function unloadModel(model) {
  try {
    console.log(`Unloading model from memory: ${model}`);
    
    const requestBody = {
      model,
      keep_alive: 0 // 0に設定するとメモリからアンロードされる
    };
    
    const response = await axios.post(`${OLLAMA_API_URL}/generate`, requestBody);
    
    return {
      success: true,
      message: `Model ${model} successfully unloaded from memory`,
      metadata: {
        model: response.data.model,
        created_at: response.data.created_at
      }
    };
  } catch (error) {
    console.error(`Error unloading model ${model}:`, error.message);
    return {
      success: false,
      error: `Failed to unload model: ${error.message}`
    };
  }
}

// ollamaへのリクエスト関数 (拡張版)
async function generateWithOllama(prompt, model = DEFAULT_MODEL, parameters = {}) {
  try {
    console.log(`[ollamaService] generateWithOllama called with model: ${model}`);
    console.log(`[ollamaService]  ${DEFAULT_MODEL}`);
    console.log(`Sending request to Ollama with model: ${model}`);
    
    // 送信するリクエストボディを構築
    const requestBody = {
      model,
      prompt,
      stream: false,
    };

    // システムプロンプトの設定
    if (!parameters.system) {
      // システムプロンプトが指定されていない場合はデフォルトを使用
      requestBody.system = DEFAULT_SYSTEM_PROMPT;
      console.log(`Using default system prompt`);
    } else {
      requestBody.system = parameters.system;
      console.log(`Using custom system prompt: ${parameters.system.substring(0, 50)}...`);
    }

    // オプションパラメータの設定
    if (parameters.options && Object.keys(parameters.options).length > 0) {
      // カスタムオプションとデフォルトパラメータをマージ
      requestBody.options = { ...DEFAULT_PARAMETERS, ...parameters.options };
      console.log(`Using merged options parameters`);
    } else {
      // 指定しない
    }
    
    console.log(`Prompt: ${prompt.substring(0, 50)}...`);
    
    const response = await axios.post(`${OLLAMA_API_URL}/generate`, requestBody);
    
    // 追加のメタデータを返す
    const metadata = {
      total_duration: response.data.total_duration,
      load_duration: response.data.load_duration,
      eval_count: response.data.eval_count,
      eval_duration: response.data.eval_duration
    };
    
    return { 
      success: true, 
      response: response.data.response,
      metadata
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
    const hasGemma3 = models.some(model => model.name.includes('gemma3'));
    
    return {
      success: true,
      models: models.map(m => m.name),
      hasGemma3
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
  getRunningModels,
  loadModel,
  unloadModel,
  OLLAMA_API_URL,
  DEFAULT_MODEL,
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_PARAMETERS
};