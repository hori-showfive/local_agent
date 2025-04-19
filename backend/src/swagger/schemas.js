/**
 * @swagger
 * components:
 *   schemas:
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         message:
 *           type: string
 *           example: AI Agent system API is running
 *     
 *     ModelCheckResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         models:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: deepcoder:14b
 *         hasDeepCoder:
 *           type: boolean
 *           example: true
 *     
 *     AvailableModelsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         models:
 *           type: array
 *           items:
 *             type: string
 *           example: ["llama3.2", "deepcoder:14b", "phi3:14b", "gemma:7b"]
 *         hasDeepCoder:
 *           type: boolean
 *           example: true
 *     
 *     GenerateTextRequest:
 *       type: object
 *       required:
 *         - prompt
 *       properties:
 *         prompt:
 *           type: string
 *           example: こんにちは、AIエージェント。自己紹介をしてください。
 *         model:
 *           type: string
 *           example: deepcoder:14b
 *     
 *     GenerateTextResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         response:
 *           type: string
 *           example: こんにちは！私はローカルLLMを利用したAIエージェントです。さまざまなタスクをお手伝いできます。
 *     
 *     ExecuteCommandRequest:
 *       type: object
 *       required:
 *         - command
 *       properties:
 *         command:
 *           type: string
 *           example: echo Hello World
 *     
 *     ExecuteCommandResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         output:
 *           type: string
 *           example: Hello World
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Internal server error
 * 
 *     LoadModelRequest:
 *       type: object
 *       required:
 *         - model
 *       properties:
 *         model:
 *           type: string
 *           example: llama3.2
 *           description: ロードするモデル名
 *         options:
 *           type: object
 *           description: モデルパラメーターを指定します
 *           properties:
 *             temperature:
 *               type: number
 *               example: 0.7
 *               description: モデルの温度パラメーター
 *             top_k:
 *               type: number
 *               example: 40
 *               description: top_kパラメーター
 *             top_p:
 *               type: number
 *               example: 0.9
 *               description: top_pパラメーター
 *             min_p:
 *               type: number
 *               example: 0.05
 *               description: min_pパラメーター
 *             repeat_penalty:
 *               type: number
 *               example: 1.1
 *               description: 繰り返しペナルティ
 *             num_ctx:
 *               type: integer
 *               example: 4096
 *               description: コンテキストウィンドウのサイズ
 *             num_predict:
 *               type: integer
 *               example: 128
 *               description: 生成トークン数の上限
 *             seed:
 *               type: integer
 *               example: 42
 *               description: 乱数シード値
 * 
 *     LoadModelResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         message:
 *           type: string
 *           example: Model llama3.2 successfully loaded into memory
 *         metadata:
 *           type: object
 *           properties:
 *             model:
 *               type: string
 *               example: llama3.2
 *             created_at:
 *               type: string
 *               example: 2024-04-20T10:22:45.499127Z
 * 
 *     UnloadModelRequest:
 *       type: object
 *       required:
 *         - model
 *       properties:
 *         model:
 *           type: string
 *           example: llama3.2
 *           description: アンロードするモデル名
 * 
 *     UnloadModelResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         message:
 *           type: string
 *           example: Model llama3.2 successfully unloaded from memory
 * 
 *     RunningModelsResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         runningModels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: llama3.2
 *               model:
 *                 type: string
 *                 example: llama3.2:latest
 *               size:
 *                 type: number
 *                 example: 5137025024
 *               size_vram:
 *                 type: number
 *                 example: 5137025024
 *               expires_at:
 *                 type: string
 *                 example: 2025-04-20T14:38:31.83753-07:00
 */