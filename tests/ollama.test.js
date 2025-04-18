const axios = require('axios');
const { createMockOllamaResponse } = require('./utils');

// ollamaのAPIをモック化
jest.mock('axios');

describe('Ollama API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('モデルの一覧を正常に取得できること', async () => {
    // モックレスポンスを設定
    axios.get.mockResolvedValueOnce({
      data: {
        models: [
          { name: 'deepcoder:14b' },
          { name: 'llama2:7b' }
        ]
      }
    });

    // テスト対象のエンドポイントを呼び出し
    const response = await axios.get('http://localhost:11434/api/tags');
    
    // 期待される結果を検証
    expect(response.data.models).toHaveLength(2);
    expect(response.data.models[0].name).toBe('deepcoder:14b');
    expect(axios.get).toHaveBeenCalledWith('http://localhost:11434/api/tags');
  });

  test('プロンプトに対して正常にレスポンスを生成できること', async () => {
    const prompt = 'Javascriptで配列の合計を計算する方法を教えてください';
    const expectedResponse = createMockOllamaResponse(prompt);
    
    // モックレスポンスを設定
    axios.post.mockResolvedValueOnce({
      data: expectedResponse
    });

    // テスト対象のエンドポイントを呼び出し
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'deepcoder:14b',
      prompt,
      stream: false
    });
    
    // 期待される結果を検証
    expect(response.data).toEqual(expectedResponse);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:11434/api/generate', {
      model: 'deepcoder:14b',
      prompt,
      stream: false
    });
  });

  test('エラー時にレスポンスが返ること', async () => {
    const prompt = 'エラーを発生させるプロンプト';
    
    // モックでエラーを発生させる
    axios.post.mockRejectedValueOnce(new Error('API connection failed'));

    // テスト対象のエンドポイントを呼び出し、エラーハンドリングを検証
    await expect(
      axios.post('http://localhost:11434/api/generate', {
        model: 'deepcoder:14b',
        prompt,
        stream: false
      })
    ).rejects.toThrow('API connection failed');
  });
});