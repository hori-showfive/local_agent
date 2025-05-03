/**
 * バックエンドAPIとの通信を行うクライアントモジュール
 */

// APIのベースURL - バックエンドサーバーのポート3000を指定
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * AIにプロンプトを送信し、レスポンスを取得する
 * @param prompt ユーザープロンプト
 * @param model モデル名（デフォルトはgemma3:12b）
 * @returns レスポンスオブジェクト
 */
export async function sendPrompt(prompt: string, model?: string) {
  try {
    let body: { prompt: string; model?: string } = { prompt };
    if (model) {
      body = { ...body, model };
    }
    console.log('Sending prompt to API:', body);
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'APIリクエストが失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('AIとの通信中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * 利用可能なモデルの一覧を取得する
 * @returns モデル一覧
 */
export async function getAvailableModels() {
  try {
    const response = await fetch(`${API_BASE_URL}/models`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'モデル一覧の取得に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('モデル一覧取得中にエラーが発生しました:', error);
    throw error;
  }
}

/**
 * コマンドを実行する
 * @param command 実行するコマンド
 * @returns コマンド実行結果
 */
export async function executeCommand(command: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/execute-command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'コマンド実行に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('コマンド実行中にエラーが発生しました:', error);
    throw error;
  }
}