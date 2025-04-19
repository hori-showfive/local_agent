const swaggerJSDoc = require('swagger-jsdoc');

// Swaggerの設定オプション
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Local Agent API',
      version: '1.0.0',
      description: 'ローカルLLMを使った自律AIエージェントシステムのAPI仕様',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: '開発サーバー'
      }
    ]
  },
  // APIルートのJSDocコメントを含むパス
  apis: [
    './src/routes/*.js', 
    './src/controllers/*.js',
    './src/swagger/*.js'
  ]
};

// Swagger仕様を生成
const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;