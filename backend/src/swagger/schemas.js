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
 */