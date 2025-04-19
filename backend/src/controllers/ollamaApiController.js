const ollamaService = require('../services/ollamaService');
const { executeCommand } = require('../utils/common');

// APIヘルスチェックコントローラー
function healthCheck(req, res) {
  res.json({ status: 'ok', message: 'AI Agent system API is running' });
}

// ollamaモデルチェックコントローラー
async function checkModel(req, res) {
  const result = await ollamaService.getAvailableModels();
  
  if (result.success) {
    res.json({
      status: 'ok',
      models: result.models,
      hasDeepCoder: result.hasDeepCoder
    });
  } else {
    res.status(500).json({ status: 'error', message: result.error });
  }
}

// 利用可能なモデル一覧を取得するコントローラー
async function getAvailableModels(req, res) {
  const result = await ollamaService.getAvailableModels();
  
  if (result.success) {
    res.json({
      status: 'ok',
      models: result.models,
      hasDeepCoder: result.hasDeepCoder
    });
  } else {
    res.status(500).json({ status: 'error', message: result.error });
  }
}

// テキスト生成コントローラー
async function generateText(req, res) {
  const { 
    prompt, 
    model = ollamaService.DEFAULT_MODEL,
    system,
    options = {}
  } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt is required' });
  }
  
  // オプションパラメータの設定
  const modelOptions = {
    // systemプロンプトの設定（任意）
    system,
    
    // オプションパラメータ（任意）
    options: {
      // 温度パラメータ（デフォルトは0.8）
      temperature: options.temperature,
      
      // top_kパラメータ (デフォルトは40)
      top_k: options.top_k,
      
      // top_pパラメータ (デフォルトは0.9)
      top_p: options.top_p,
      
      // min_pパラメータ (デフォルトは0.05)
      min_p: options.min_p,
      
      // 繰り返しペナルティ (デフォルトは1.1)
      repeat_penalty: options.repeat_penalty,
      
      // コンテキストウィンドウサイズ (デフォルトは2048)
      num_ctx: options.num_ctx,
      
      // 生成トークン数の上限 (デフォルトは無制限)
      num_predict: options.num_predict,
      
      // ストップトークン（生成を停止する文字列のリスト）
      stop: options.stop,
      
      // 乱数シード（再現性のために使用）
      seed: options.seed,
    }
  };
  
  // 値が未定義のプロパティをフィルタリング
  Object.keys(modelOptions.options).forEach(key => {
    if (modelOptions.options[key] === undefined) {
      delete modelOptions.options[key];
    }
  });
  
  // オプションが空の場合は削除
  if (Object.keys(modelOptions.options).length === 0) {
    delete modelOptions.options;
  }
  
  const result = await ollamaService.generateWithOllama(prompt, model, modelOptions);
  
  if (result.success) {
    res.json({ 
      status: 'ok', 
      response: result.response,
      // 追加のレスポンスデータがあれば返す
      ...(result.metadata && { metadata: result.metadata })
    });
  } else {
    res.status(500).json({ status: 'error', message: result.error });
  }
}

// コマンド実行コントローラー
async function executeCommandHandler(req, res) {
  const { command } = req.body;
  
  if (!command) {
    return res.status(400).json({ status: 'error', message: 'Command is required' });
  }
  
  const result = await executeCommand(command);
  
  if (result.success) {
    res.json({ status: 'ok', output: result.output });
  } else {
    res.status(500).json({ status: 'error', error: result.error });
  }
}

// 実行中のモデルのステータスを取得するコントローラー
async function getRunningModels(req, res) {
  const result = await ollamaService.getRunningModels();
  
  if (result.success) {
    res.json({
      status: 'ok',
      runningModels: result.runningModels
    });
  } else {
    res.status(500).json({ status: 'error', message: result.error });
  }
}

// モデルをメモリにロードするコントローラー
async function loadModel(req, res) {
  const { model, options = {} } = req.body;
  
  if (!model) {
    return res.status(400).json({ status: 'error', message: 'Model name is required' });
  }
  
  // まず利用可能なモデルのリストを取得
  const availableModels = await ollamaService.getAvailableModels();
  
  // モデルがリストに存在しない場合はエラー
  if (availableModels.success && !availableModels.models.includes(model)) {
    return res.status(404).json({ 
      status: 'error', 
      message: `Model '${model}' not found in the available models list. Please pull the model first.`,
      availableModels: availableModels.models 
    });
  }
  
  const result = await ollamaService.loadModel(model, options);
  
  if (result.success) {
    res.json({
      status: 'ok',
      message: result.message,
      metadata: result.metadata
    });
  } else {
    const statusCode = result.notFound ? 404 : 500;
    res.status(statusCode).json({ 
      status: 'error', 
      message: result.error 
    });
  }
}

// モデルをアンロードするコントローラー
async function unloadModel(req, res) {
  const { model } = req.body;
  
  if (!model) {
    return res.status(400).json({ status: 'error', message: 'Model name is required' });
  }
  
  const result = await ollamaService.unloadModel(model);
  
  if (result.success) {
    res.json({
      status: 'ok',
      message: result.message,
      metadata: result.metadata
    });
  } else {
    res.status(500).json({ 
      status: 'error', 
      message: result.error 
    });
  }
}

module.exports = {
  healthCheck,
  checkModel,
  generateText,
  executeCommandHandler,
  getRunningModels,
  loadModel,
  unloadModel,
  getAvailableModels
};