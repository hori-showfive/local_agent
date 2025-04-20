/**
 * プロンプトローダーユーティリティ
 * 
 * マークダウン形式のシステムプロンプトファイルを読み込むための機能を提供します
 * ディレクトリ構造を用途別（templates, tools）で管理します
 */

const fs = require('fs');
const path = require('path');

// プロンプトディレクトリのパス
const PROMPT_DIR = path.join(__dirname, '../prompts');

// プロンプトのカテゴリ
const CATEGORIES = {
  TOOLS: 'tools',
  TEMPLATES: 'templates'
};

/**
 * 特定のカテゴリとプロンプト名からプロンプトを読み込む
 * @param {string} category - プロンプトのカテゴリ (templates, toolsなど)
 * @param {string} promptName - プロンプトファイル名（拡張子なし）
 * @returns {string|null} プロンプトの内容またはnull（エラー時）
 */
function loadPromptByCategory(category, promptName) {
  try {
    const promptPath = path.join(PROMPT_DIR, category, `${promptName}.md`);
    // ファイルが存在するか確認
    if (!fs.existsSync(promptPath)) {
      console.error(`プロンプトファイルが見つかりません: ${promptPath}`);
      return null;
    }
    
    // ファイル内容を読み込む
    const promptContent = fs.readFileSync(promptPath, 'utf8');
    return promptContent;
  } catch (error) {
    console.error(`プロンプト読み込みエラー (${category}/${promptName}): ${error.message}`);
    return null;
  }
}


/**
 * テンプレートからプロンプトを構築する関数
 * @param {string} template - テンプレート文字列
 * @param {Object} variables - 置き換え変数オブジェクト
 * @returns {string} 構築されたプロンプト
 */
function buildPromptFromTemplate(template, variables = {}) {
  // テンプレート内の変数を置き換え
  let result = template;
  
  // 変数の置き換え（{{変数名}} 形式の変数を置き換える）
  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(placeholder, value);
  });
  
  return result;
}

/**
 * プロンプト名からプロンプトを取得する
 * カテゴリを自動判別し、テンプレートの場合は変数置き換えを行う
 * @param {string} promptName - プロンプト名（カテゴリ/名前 形式）
 * @param {Object} variables - テンプレート変数（テンプレートの場合のみ使用）
 * @returns {string|null} プロンプト内容またはnull
 */
function loadPrompt(promptName, variables = {}) {
  // カテゴリと名前の分離
  const parts = promptName.split('/');
  
  if (parts.length !== 2) {
    console.error(`無効なプロンプト指定形式です。'カテゴリ/名前'形式で指定してください: ${promptName}`);
    return null;
  }
  
  const [category, name] = parts;
  
  // カテゴリの検証
  if (!Object.values(CATEGORIES).includes(category)) {
    console.error(`無効なカテゴリです: ${category}`);
    return null;
  }
  
  // プロンプトの読み込み
  const prompt = loadPromptByCategory(category, name);
  if (!prompt) return null;
  
  // テンプレートカテゴリの場合、変数置き換えを行う
  if (category === CATEGORIES.TEMPLATES) {
    return buildPromptFromTemplate(prompt, variables);
  }
  
  // 通常のプロンプトをそのまま返す
  return prompt;
}

/**
 * 特定のカテゴリの利用可能なプロンプトファイル名のリストを取得
 * @param {string} category - プロンプトのカテゴリ
 * @returns {string[]} - プロンプトファイル名のリスト（拡張子なし）
 */
function listPromptsByCategory(category) {
  try {
    const categoryPath = path.join(PROMPT_DIR, category);
    if (!fs.existsSync(categoryPath)) {
      console.error(`カテゴリディレクトリが見つかりません: ${categoryPath}`);
      return [];
    }
    
    const files = fs.readdirSync(categoryPath);
    // .mdファイルのみをフィルタリングし、拡張子を除去
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch (error) {
    console.error(`${category}カテゴリのプロンプト一覧取得エラー: ${error.message}`);
    return [];
  }
}

/**
 * 利用可能なすべてのプロンプトファイル名のリストをカテゴリごとに取得
 * @returns {Object} - カテゴリごとのプロンプトファイル名のオブジェクト
 */
function listAllPrompts() {
  const result = {};
  
  // 各カテゴリごとにプロンプトを取得
  Object.values(CATEGORIES).forEach(category => {
    result[category] = listPromptsByCategory(category);
  });
  
  return result;
}

/**
 * 利用可能なプロンプトカテゴリのリストを取得
 * @returns {string[]} - カテゴリ名のリスト
 */
function listCategories() {
  return Object.values(CATEGORIES);
}

module.exports = {
  // 基本的な読み込み関数
  loadPromptByCategory,
  
  // テンプレート関連
  buildPromptFromTemplate,
  loadPrompt,
  
  // リスト取得関数
  listPromptsByCategory,
  listAllPrompts,
  listCategories,
  
  // カテゴリ定数
  CATEGORIES
};