const { checkOllamaServer, executeTestCommand } = require('./utils');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// テスト用の環境変数設定
process.env.NODE_ENV = 'test';

// APIサーバーのURL
const API_BASE_URL = 'http://localhost:3000/api';

// 基本的なテスト実行関数
async function runTest(name, testFn) {
  try {
    console.log(`\n✓ Running test: ${name}`);
    await testFn();
    console.log(`✓ Test passed: ${name}`);
    return true;
  } catch (error) {
    console.error(`✗ Test failed: ${name}`);
    console.error(`  Error: ${error.message}`);
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error(`  Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

// すべてのテストを実行
async function runAllTests() {
  console.log('🧪 Starting API and Integration tests...');
  
  let passedTests = 0;
  let failedTests = 0;
  
  // Ollamaサーバーの状態をチェック
  const ollamaStatus = await checkOllamaServer();
  console.log(`\nOllama server status: ${ollamaStatus.running ? 'Running' : 'Not running'}`);
  if (ollamaStatus.running) {
    console.log(`Available models: ${ollamaStatus.models.map(m => m.name).join(', ')}`);
  } else {
    console.warn(`Ollama server error: ${ollamaStatus.error}`);
  }
  
  // APIサーバーの状態をチェック
  let apiRunning = false;
  try {
    await axios.get(API_BASE_URL, { timeout: 2000 });
    apiRunning = true;
    console.log('API server status: Running');
  } catch (error) {
    console.warn('API server status: Not running');
    console.warn(`Error: ${error.message}`);
  }
  
  // テストを実行
  if (apiRunning) {
    // ヘルスチェックのテスト
    const healthCheckPassed = await runTest('API Health Check', async () => {
      const response = await axios.get(API_BASE_URL);
      if (response.data.status !== 'ok') {
        throw new Error('Health check failed');
      }
    });
    healthCheckPassed ? passedTests++ : failedTests++;
    
    // モデルチェックのテスト
    const modelCheckPassed = await runTest('Model Check', async () => {
      const response = await axios.get(`${API_BASE_URL}/check-model`);
      if (response.data.status !== 'ok') {
        throw new Error('Model check failed');
      }
      console.log(`  Found models: ${response.data.models.join(', ')}`);
    });
    modelCheckPassed ? passedTests++ : failedTests++;
    
    // シェルコマンド実行のテスト
    const execCommandPassed = await runTest('Execute Command', async () => {
      const command = 'echo "Test command execution"';
      const response = await axios.post(`${API_BASE_URL}/execute-command`, { command });
      if (response.data.status !== 'ok' || !response.data.output.includes('Test command execution')) {
        throw new Error('Command execution failed');
      }
      console.log(`  Command output: ${response.data.output.trim()}`);
    });
    execCommandPassed ? passedTests++ : failedTests++;
    
    // Ollama APIが利用可能であればテキスト生成のテスト
    if (ollamaStatus.running) {
      const generatePassed = await runTest('Generate Text', async () => {
        const prompt = 'What is the capital of Japan?';
        const response = await axios.post(`${API_BASE_URL}/generate`, { 
          prompt,
          model: ollamaStatus.models.length > 0 ? ollamaStatus.models[0].name : 'gemma3:12b'
        });
        if (response.data.status !== 'ok' || !response.data.response) {
          throw new Error('Text generation failed');
        }
        console.log(`  Generated response: "${response.data.response.substring(0, 100)}${response.data.response.length > 100 ? '...' : ''}"`);
      });
      generatePassed ? passedTests++ : failedTests++;
    } else {
      console.warn('Skipping text generation test - Ollama server not running');
    }
  } else {
    console.warn('Skipping API tests - API server not running');
  }
  
  // テスト結果のサマリー
  console.log('\n🧮 Test Summary:');
  console.log(`Total tests: ${passedTests + failedTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  
  if (failedTests === 0 && passedTests > 0) {
    console.log('\n✅ All tests passed!');
  } else if (failedTests > 0) {
    console.log('\n❌ Some tests failed');
  } else {
    console.log('\n⚠️ No tests were executed');
  }
  
  return {
    total: passedTests + failedTests,
    passed: passedTests,
    failed: failedTests
  };
}

// テストを実行
runAllTests()
  .then(() => {
    console.log('\nTests completed');
  })
  .catch(error => {
    console.error('Error running tests:', error);
  });