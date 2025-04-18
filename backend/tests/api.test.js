const axios = require('axios');
const { executeTestCommand } = require('./utils');

// Expressサーバーのエンドポイントをテスト
describe('Express API Endpoints', () => {
  const API_BASE_URL = 'http://localhost:3000/api';
  
  // テストの前にテスト用のサーバーを起動する方法もありますが、
  // ここではサーバーが既に起動していることを前提としています
  
  // この部分は実際のサーバーに依存するため、サーバーが起動していない場合はスキップ
  // 実際の統合テストでは、テスト用のサーバーをプログラム的に起動・停止するべきです
  beforeAll(async () => {
    try {
      await axios.get(`${API_BASE_URL}`, { timeout: 1000 });
    } catch (error) {
      console.warn('Warning: API server not running, tests will be skipped');
    }
  });
  
  // APIサーバーが起動していればtestを実行、そうでなければtestをスキップ
  const conditionalTest = (name, fn) => {
    test(name, async () => {
      try {
        await axios.get(`${API_BASE_URL}`, { timeout: 1000 });
        await fn();
      } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          console.warn(`Skipping test "${name}" - API server not running`);
          return;
        }
        throw error;
      }
    });
  };

  conditionalTest('ヘルスチェックエンドポイントが正常に応答すること', async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    expect(response.data).toHaveProperty('status', 'ok');
    expect(response.data).toHaveProperty('message');
  });

  conditionalTest('モデルチェックエンドポイントが正常に応答すること', async () => {
    const response = await axios.get(`${API_BASE_URL}/check-model`);
    expect(response.data).toHaveProperty('status', 'ok');
    expect(response.data).toHaveProperty('models');
    // deepcoderモデルがあるかどうかは環境によって異なるため、テストでは検証しない
  });

  conditionalTest('generate APIが正常にレスポンスを返すこと', async () => {
    const prompt = 'テスト用のプロンプト';
    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        prompt,
        model: 'deepcoder:14b'
      });
      
      expect(response.data).toHaveProperty('status', 'ok');
      expect(response.data).toHaveProperty('response');
    } catch (error) {
      // ollamaサーバーが動いていない場合は、エラーが返る
      if (error.response && error.response.data) {
        expect(error.response.data).toHaveProperty('status', 'error');
        expect(error.response.data).toHaveProperty('message');
      } else {
        throw error;
      }
    }
  });

  conditionalTest('execute-command APIが正常にコマンドを実行すること', async () => {
    // 安全なテストコマンド
    const command = 'echo "テストコマンド実行"';
    const response = await axios.post(`${API_BASE_URL}/execute-command`, {
      command
    });
    
    expect(response.data).toHaveProperty('status', 'ok');
    expect(response.data).toHaveProperty('output');
    expect(response.data.output).toContain('テストコマンド実行');
  });

  conditionalTest('不正なリクエストに対して適切なエラーレスポンスを返すこと', async () => {
    try {
      await axios.post(`${API_BASE_URL}/generate`, {});
      // ここには到達しないはず（例外が発生するため）
      expect(true).toBe(false);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toHaveProperty('status', 'error');
      expect(error.response.data).toHaveProperty('message');
    }
  });
});