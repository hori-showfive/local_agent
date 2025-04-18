const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// ollamaサーバーが起動しているかチェック
async function checkOllamaServer() {
  try {
    const response = await axios.get('http://localhost:11434/api/tags', { timeout: 5000 });
    return {
      running: true,
      models: response.data.models || []
    };
  } catch (error) {
    return {
      running: false,
      error: error.message
    };
  }
}

// モックollamaレスポンスを生成
function createMockOllamaResponse(prompt) {
  return {
    model: 'deepcoder:14b',
    created_at: new Date().toISOString(),
    response: `これはテスト用の応答です。プロンプト: "${prompt}"`,
    done: true
  };
}

// テスト用のコマンド実行
async function executeTestCommand(command) {
  try {
    const { stdout, stderr } = await execPromise(command);
    return {
      success: true,
      output: stdout,
      error: stderr
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  checkOllamaServer,
  createMockOllamaResponse,
  executeTestCommand
};