const axios = require('axios');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// ollamaサーバーが起動しているかチェック
async function checkOllamaServer(ollamaUrl) {
  try {
    const response = await axios.get(`${ollamaUrl}/tags`, { timeout: 5000 });
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

// シェルコマンドを実行する関数
async function executeCommand(command) {
  try {
    console.log(`Executing command: ${command}`);
    const { stdout, stderr } = await execPromise(command);
    if (stderr) {
      console.warn(`Command stderr: ${stderr}`);
    }
    return { success: true, output: stdout };
  } catch (error) {
    console.error(`Command execution error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = {
  checkOllamaServer,
  executeCommand
};