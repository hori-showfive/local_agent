'use client';

import { useState } from 'react';
import { sendPrompt } from './api/client';

// メッセージの型定義
type Message = {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    // ユーザーメッセージを追加
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      // AIにプロンプトを送信
      const result = await sendPrompt(prompt);
      
      // AIのレスポンスを追加
      const aiMessage: Message = {
        role: 'ai',
        content: result.response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setPrompt(''); // 入力欄をクリア
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知のエラーが発生しました');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">ローカルAIエージェント</h1>
        
        {/* メッセージ履歴 */}
        <div className="mb-6 border border-gray-200 rounded-md p-4 bg-gray-50 h-96 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-32">
              <p>AIエージェントとの会話を開始しましょう</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  message.role === 'user' ? 'bg-blue-100 ml-8' : 'bg-green-50 mr-8'
                }`}
              >
                <div className="font-medium mb-1">
                  {message.role === 'user' ? 'あなた:' : 'AI:'}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
          
          {/* ローディングインジケーター */}
          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <div className="animate-pulse text-gray-500">AI応答を待っています...</div>
            </div>
          )}
        </div>
        
        {/* エラーメッセージ */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p>エラー: {error}</p>
          </div>
        )}
        
        {/* プロンプト送信フォーム */}
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex flex-col md:flex-row gap-2">
            <textarea
              id="prompt"
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="AIに指示を入力してください..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 min-w-20"
            >
              {isLoading ? '送信中...' : '送信'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
