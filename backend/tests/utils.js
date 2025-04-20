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

/**
 * Ollama APIレスポンスのモック生成
 * @param {string} prompt ユーザーからのプロンプト
 * @returns モック化されたOllamaレスポンス
 */
function createMockOllamaResponse(prompt) {
  return {
    model: "gemma3:12b",
    created_at: "2024-04-20T15:32:45.810329Z",
    response: `これはテスト用の応答です。あなたの質問: "${prompt}"`,
    done: true,
    total_duration: 589357083,
    load_duration: 62750,
    prompt_eval_count: 23,
    prompt_eval_duration: 290076000,
    eval_count: 52,
    eval_duration: 298292000
  };
}

/**
 * シェルコマンドの実行をシミュレート
 * @param {string} command 実行するコマンド
 * @returns {Promise<{exitCode: number, stdout: string, stderr: string}>} 
 */
async function executeTestCommand(command) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        exitCode: 0,
        stdout: `Command executed: ${command}`,
        stderr: ''
      });
    }, 100);
  });
}

module.exports = {
  checkOllamaServer,
  createMockOllamaResponse,
  executeTestCommand
};