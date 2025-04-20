# 本地代理

*语言: [English](../../README.md) | [日本語](README-jp.md) | [中文](README-cn.md)*

一个使用本地运行的大型语言模型（LLM）在虚拟环境中自由执行命令的自主AI代理系统。该系统完全包含在Docker环境中，旨在创建一个沙盒环境，即使AI破坏了环境，也不会造成实际损害。支持GPU加速推理。

## 概述

本项目提供了一个集成系统，包括用于向AI发送指令并执行shell命令的前端，以及连接AI与shell操作的后端。它在本地环境中运行Ollama服务器，目前使用具有先进代码理解和生成能力的Gemma 3模型（gemma3:12b）。

### 特点

- **完全本地执行**：所有处理都在本地环境中进行，确保数据隐私。
- **Docker容器集成**：所有必要组件都在单个Docker容器内运行。
- **浏览器UI界面**：通过易用的Web UI向AI发送指令并执行shell命令。
- **GPU加速**：支持使用NVIDIA GPU的高速推理。
- **模型管理**：通过API加载、卸载和检查不同LLM模型的状态。
- **API文档**：为所有可用端点提供完整的Swagger文档。
- **简单启动**：使用Docker Compose轻松启动系统。

## 系统要求

- Docker和Docker Compose
- NVIDIA GPU（推荐）和CUDA工具包用于GPU加速
- Windows或Linux环境（Windows上需要以管理员权限运行命令提示符）

## 快速开始

### 使用Docker Compose启动

1. 克隆仓库：
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. 构建并启动容器：
```
docker-compose up --build
```

3. 访问Web UI：`http://localhost:3001`

## 系统架构

系统由三个主要组件组成：

1. **Ollama服务器**：运行Gemma 3模型并提供AI推理能力。
2. **后端服务器**：使用Node.js实现的Express服务器，作为Ollama和前端UI之间的中介。
3. **前端UI**：实现用户与AI代理交互的Web UI。

### 端口配置

- `11434`：Ollama API
- `3000`：后端服务器
- `3001`：前端服务器

## 主要功能

- **向AI发送指令**：从浏览器向AI代理发送自然语言指令。
- **执行Shell命令**：从UI执行shell命令并显示结果。
- **模型管理**：加载、卸载和检查不同LLM模型的状态。
- **API文档**：访问Swagger文档：`http://localhost:3000/api-docs`。

## API端点

后端服务器提供以下API端点：

- `GET /api`：API服务器健康检查
- `GET /api/check-model`：检查可用模型和与Ollama的连接
- `GET /api/models`：列出所有可用模型
- `POST /api/generate`：从提示生成文本
- `POST /api/execute-command`：执行系统命令
- `GET /api/running-models`：获取当前加载模型的信息
- `POST /api/load-model`：将模型加载到内存中
- `POST /api/unload-model`：从内存中卸载模型

## 开发信息

### 技术栈

- **Ollama**：本地LLM执行环境
- **Node.js/Express**：后端API
- **HTML/CSS/JavaScript**：前端UI
- **Docker**：容器环境
- **NVIDIA CUDA**：GPU加速
- **Swagger**：API文档

### 项目结构

```
local-agent/
├── docker-compose.yml     # Docker容器配置
├── Dockerfile             # 容器构建定义
├── backend/               # 后端服务器
│   ├── src/               # 源代码
│   │   ├── controllers/   # API控制器
│   │   ├── routes/        # API路由
│   │   ├── services/      # 服务层（与Ollama交互）
│   │   ├── config/        # 配置文件
│   │   ├── prompts/       # 系统提示和模板
│   │   └── swagger/       # Swagger文档
│   └── tests/             # 测试代码
├── frontend/              # 前端UI
│   ├── src/               # 源代码
│   │   └── app/           # Next.js应用程序
│   └── public/            # 静态文件
├── tests/                 # 集成测试
└── docs/                  # 文档
    └── readme/            # 翻译的README文件
```

### 运行测试

运行后端测试：

```bash
cd backend
npm test
```

运行集成测试：

```bash
node tests/run-tests.js
```

## 故障排除

### 如果服务无法启动

1. 验证Docker是否正确安装
2. 检查日志：`docker-compose logs -f`
3. 如果有GPU支持问题，请验证NVIDIA驱动和CUDA是否正确安装

### 如果模型下载失败

检查您的互联网连接，必要时手动下载模型：

```bash
docker exec -it local-agent bash -c "ollama pull gemma3:12b"
```

## 未来计划

- 从AI模型流式传输响应
- UI中支持多个模型
- 更高级的shell命令执行功能
- 用户可配置的系统提示