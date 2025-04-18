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

// テキスト生成コントローラー
async function generateText(req, res) {
  const { prompt, model = ollamaService.DEFAULT_MODEL } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ status: 'error', message: 'Prompt is required' });
  }
  
  const result = await ollamaService.generateWithOllama(prompt, model);
  
  if (result.success) {
    res.json({ status: 'ok', response: result.response });
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

module.exports = {
  healthCheck,
  checkModel,
  generateText,
  executeCommandHandler
};