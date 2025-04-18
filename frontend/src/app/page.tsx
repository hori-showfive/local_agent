'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

// APIのベースURL
const API_BASE_URL = 'http://localhost:3000/api';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('結果がここに表示されます...');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<{status: string, message: string, models?: string[]}>({
    status: 'checking',
    message: 'サーバーの状態を確認中...'
  });

  // サーバーの状態をチェック
  useEffect(() => {
    checkServerStatus();
  }, []);

  // サーバーの状態をチェックする関数
  const checkServerStatus = async () => {
    try {
      setServerStatus({ status: 'checking', message: 'サーバーの状態を確認中...' });
      const response = await axios.get(`${API_BASE_URL}/check-model`, { timeout: 5000 });
      if (response.data.status === 'ok') {
        setServerStatus({ 
          status: 'ok', 
          message: '接続成功！', 
          models: response.data.models 
        });
      } else {
        setServerStatus({ status: 'error', message: '予期せぬレスポンス' });
      }
    } catch (error) {
      console.error('サーバー接続エラー:', error);
      setServerStatus({ 
        status: 'error', 
        message: 'サーバーに接続できません。サーバーが起動していることを確認してください。' 
      });
    }
  };

  // AIに指示を送信
  const handleGenerateClick = async () => {
    if (!prompt.trim()) {
      alert('AIエージェントへの指示を入力してください');
      return;
    }

    setLoading(true);
    setResponse('AIからの応答を待機中...');

    try {
      const response = await axios.post(`${API_BASE_URL}/generate`, {
        prompt: prompt.trim(),
        model: serverStatus.models ? serverStatus.models[0] : 'deepcoder:14b'
      });

      if (response.data.status === 'ok') {
        setResponse(response.data.response);
      } else {
        throw new Error(response.data.message || '不明なエラー');
      }
    } catch (error: any) {
      setResponse(`エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // コマンドを実行
  const handleExecuteClick = async () => {
    if (!prompt.trim()) {
      alert('実行するコマンドを入力してください');
      return;
    }

    setLoading(true);
    setResponse('コマンドを実行中...');

    try {
      const response = await axios.post(`${API_BASE_URL}/execute-command`, {
        command: prompt.trim()
      });

      if (response.data.status === 'ok') {
        setResponse(response.data.output || 'コマンド実行成功（出力なし）');
      } else {
        throw new Error(response.data.error || '不明なエラー');
      }
    } catch (error: any) {
      setResponse(`エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
          ローカルAIエージェントシステム
        </h1>
        
        {/* サーバーステータス表示 */}
        <div className={`mb-4 p-3 rounded-md w-full max-w-lg text-left ${
          serverStatus.status === 'ok' ? 'bg-green-100 border-l-4 border-green-500' : 
          serverStatus.status === 'error' ? 'bg-red-100 border-l-4 border-red-500' : 
          'bg-yellow-100 border-l-4 border-yellow-500'
        }`}>
          <div className="font-semibold">{serverStatus.status === 'ok' ? '✅' : serverStatus.status === 'error' ? '❌' : '⏳'} {serverStatus.message}</div>
          {serverStatus.models && (
            <div className="text-sm mt-1">利用可能なモデル: {serverStatus.models.join(', ')}</div>
          )}
          {serverStatus.status !== 'ok' && (
            <button 
              onClick={checkServerStatus}
              className="mt-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
            >
              再接続
            </button>
          )}
        </div>
        
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">AIエージェントへの指示</h2>
          <textarea 
            className="w-full h-32 p-3 border border-gray-300 rounded mb-4 resize-none"
            placeholder="AIエージェントへの指示またはコマンドを入力してください..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded flex items-center justify-center"
              onClick={handleGenerateClick}
              disabled={loading || serverStatus.status !== 'ok'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  処理中...
                </>
              ) : (
                'AIに指示を送信'
              )}
            </button>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded flex items-center justify-center"
              onClick={handleExecuteClick}
              disabled={loading || serverStatus.status !== 'ok'}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  実行中...
                </>
              ) : (
                'コマンドを実行'
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-3 text-left">結果</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 min-h-[150px] max-h-[400px] overflow-y-auto text-left whitespace-pre-wrap">
            {response}
          </div>
        </div>
      </main>
      
      <footer className="w-full text-center border-t border-gray-200 p-4 mt-8">
        <p className="text-sm text-gray-600">
          ローカルLLMを使った自律AIエージェントシステム © 2025
        </p>
      </footer>
    </div>
  );
}