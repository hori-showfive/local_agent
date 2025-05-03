/**
 * LLMモデルの設定パラメータ
 * 
 * このファイルでは、AIモデルのデフォルト設定とシステムプロンプトを定義します
 */

const promptLoader = require('../utils/promptLoader');

// 環境変数の読み込み状況をログ出力
console.log(`[modelConfig] Reading process.env.DEFAULT_MODEL: "${process.env.DEFAULT_MODEL || '未設定'}"`);

// デフォルトのプロンプト文字列（プロンプトファイルがない場合のフォールバック）
const DEFAULT_PROMPT_TEXT = 'あなたは優秀なプログラマーアシスタントです。ユーザーからの質問に対して、正確で簡潔かつ実用的な回答を提供してください。';
const READFILE_TOOL_PROMPT_TEXT = 'あなたはファイル読み込み操作を支援するアシスタントです。';

// テンプレートからプロンプトを取得（存在しない場合はデフォルトテキストを使用）
const _DEFAULT_SYSTEM_PROMPT = promptLoader.loadPrompt('templates/system') || DEFAULT_PROMPT_TEXT;
const READFILE_TOOL_PROMPT = promptLoader.loadPrompt('tools/readfile') || READFILE_TOOL_PROMPT_TEXT;

// 使用可能なプロンプトの一覧（カテゴリ別）
const AVAILABLE_PROMPTS = promptLoader.listAllPrompts();

// デフォルトの設定値
const defaultConfig = {
  // デフォルトのモデル名
  DEFAULT_MODEL: process.env.DEFAULT_MODEL ||  '',
  
  // デフォルトのシステムプロンプト
  DEFAULT_SYSTEM_PROMPT: process.env.DEFAULT_SYSTEM_PROMPT || _DEFAULT_SYSTEM_PROMPT,
  
  // ツールプロンプト
  TOOL_PROMPTS: {
    READFILE: READFILE_TOOL_PROMPT
  },
  
  // 使用可能なプロンプト一覧（カテゴリ別）
  AVAILABLE_PROMPTS,
  
  // 使用可能なカテゴリ一覧
  PROMPT_CATEGORIES: promptLoader.listCategories(),
  
  /**
   * プロンプトの取得関数
   * @param {string} name - プロンプト名（'カテゴリ/名前'形式）
   * @param {Object} variables - テンプレート変数（テンプレートの場合のみ使用）
   * @returns {string} プロンプト内容、見つからない場合はデフォルトのシステムプロンプト
   */
  getPrompt: (name, variables = {}) => {
    // promptLoader.getPrompt関数を使用してプロンプトを取得
    const prompt = promptLoader.loadPrompt(name, variables);
    
    // プロンプトが見つからない場合はデフォルトのシステムプロンプトを返す
    return prompt || defaultConfig.DEFAULT_SYSTEM_PROMPT;
  },
  
  // デフォルトのモデルパラメータ
  DEFAULT_PARAMETERS: {
    num_ctx: 4096,        // コンテキストウィンドウサイズ
    num_predict: 64     // 生成トークン数の上限
  }
};

module.exports = defaultConfig;