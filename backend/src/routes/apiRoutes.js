const express = require('express');
const router = express.Router();
const apiController = require('../controllers/ollamaApiController');

/**
 * @swagger
 * /api:
 *   get:
 *     summary: API正常性チェック
 *     description: APIサーバーが正常に動作しているか確認します
 *     tags:
 *       - システム
 *     responses:
 *       200:
 *         description: APIが正常に動作しています
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
router.get('/', apiController.healthCheck);

/**
 * @swagger
 * /api/check-model:
 *   get:
 *     summary: モデル状態チェック
 *     description: 利用可能なollamaモデルを確認します
 *     tags:
 *       - システム
 *     responses:
 *       200:
 *         description: モデル情報を返却
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ModelCheckResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/check-model', apiController.checkModel);

/**
 * @swagger
 * /api/models:
 *   get:
 *     summary: 利用可能なモデル一覧
 *     description: 利用可能なすべてのollamaモデルを一覧表示します
 *     tags:
 *       - システム
 *     responses:
 *       200:
 *         description: モデル一覧情報
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AvailableModelsResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/models', apiController.getAvailableModels);

/**
 * @swagger
 * /api/generate:
 *   post:
 *     summary: テキスト生成
 *     description: 指定されたプロンプトからテキストを生成します
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateTextRequest'
 *     responses:
 *       200:
 *         description: 生成されたテキスト
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateTextResponse'
 *       400:
 *         description: 入力エラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/generate', apiController.generateText);

/**
 * @swagger
 * /api/execute-command:
 *   post:
 *     summary: コマンド実行
 *     description: システムコマンドを実行して結果を返します
 *     tags:
 *       - システム
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExecuteCommandRequest'
 *     responses:
 *       200:
 *         description: コマンド実行結果
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExecuteCommandResponse'
 *       400:
 *         description: 入力エラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/execute-command', apiController.executeCommandHandler);

/**
 * @swagger
 * /api/running-models:
 *   get:
 *     summary: 実行中のモデル一覧取得
 *     description: 現在メモリにロードされている実行中のOllamaモデルの情報を取得します
 *     tags:
 *       - システム
 *     responses:
 *       200:
 *         description: 実行中のモデル情報
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RunningModelsResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/running-models', apiController.getRunningModels);

/**
 * @swagger
 * /api/load-model:
 *   post:
 *     summary: モデルのロード
 *     description: 指定されたモデルをメモリにロードします。モデルパラメータの指定も可能です。
 *     tags:
 *       - システム
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoadModelRequest'
 *     responses:
 *       200:
 *         description: モデルが正常にロードされました
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoadModelResponse'
 *       400:
 *         description: 入力エラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: モデルが見つかりません
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/load-model', apiController.loadModel);

/**
 * @swagger
 * /api/unload-model:
 *   post:
 *     summary: モデルのアンロード
 *     description: 指定されたモデルをメモリからアンロードします
 *     tags:
 *       - システム
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnloadModelRequest'
 *     responses:
 *       200:
 *         description: モデルが正常にアンロードされました
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnloadModelResponse'
 *       400:
 *         description: 入力エラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: サーバーエラー
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/unload-model', apiController.unloadModel);

module.exports = router;