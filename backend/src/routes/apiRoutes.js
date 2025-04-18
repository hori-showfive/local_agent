const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// APIヘルスチェックエンドポイント
router.get('/', apiController.healthCheck);

// ollamaモデルチェックエンドポイント
router.get('/check-model', apiController.checkModel);

// テキスト生成エンドポイント
router.post('/generate', apiController.generateText);

// コマンド実行エンドポイント
router.post('/execute-command', apiController.executeCommandHandler);

module.exports = router;