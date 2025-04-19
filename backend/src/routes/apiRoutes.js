const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

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

module.exports = router;