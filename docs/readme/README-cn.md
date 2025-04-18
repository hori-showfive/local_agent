# 本地代理

*语言: [English](../../README.md) | [日本語](README-jp.md) | [中文](README-cn.md)*

一个使用本地运行的大型语言模型（LLM）在虚拟环境中自由执行命令的自主AI代理系统。该系统完全包含在Docker环境中，旨在创建一个沙盒环境，即使AI破坏了环境，也不会造成实际损害。计划支持GPU加速推理。

## 概述

本项目提供了一个集成系统，包括用于向AI发送指令并执行shell命令的前端，以及连接AI与shell操作的后端。它在本地环境中运行Ollama服务器，目前以最新的深度学习模型"deepcoder"为例。

### 特点

- **完全本地执行**：所有处理都在本地环境中进行，确保数据隐私。
- **Docker容器集成**：所有必要组件都在单个Docker容器内运行。（有可能切换到微服务架构）
- **浏览器UI界面**：通过易用的Web UI向AI发送指令并执行shell命令。
- **GPU加速**：计划支持使用NVIDIA GPU的高速推理。
- **简单启动**：使用启动脚本轻松启动系统。

## 系统要求

- Docker和Docker Compose
- NVIDIA GPU（推荐）和CUDA工具包（目前不需要，因为尚未实现GPU推理）
- Windows或Linux环境（Windows上需要以管理员权限运行命令提示符）

## 快速开始

### Windows上启动

1. 克隆仓库：
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. 运行启动脚本：
```
start-agent.bat
```

### Linux上启动

1. 克隆仓库：
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. 添加启动脚本的执行权限：
```
chmod +x start-agent.sh
```

3. 运行启动脚本：
```
./start-agent.sh
```

## 系统架构

系统由三个主要组件组成：

1. **Ollama服务器**：运行deepcoder模型并提供AI推理能力。
2. **后端服务器**：使用Node.js实现的Express服务器，作为Ollama和前端UI之间的中介。
3. **前端UI**：使用Next.js和TypeScript实现的Web UI，实现用户与AI代理的交互。

### 端口配置

- `11434`：Ollama API
- `3000`：后端服务器
- `3001`：前端服务器

## 主要功能

- **向AI发送指令**：从浏览器向AI代理发送自然语言指令。
- **执行Shell命令**：从UI执行shell命令并显示结果。
- **检查模型状态**：检查可用模型和服务器状态。

## 开发信息

### 技术栈

- **Ollama**：本地LLM执行环境
- **Node.js/Express**：后端API
- **Next.js/TypeScript/TailwindCSS**：前端UI
- **Docker**：容器环境
- **NVIDIA CUDA**：GPU加速

### 项目结构

```
local-agent/
├── docker-compose.yml     # Docker容器配置
├── Dockerfile             # 容器构建定义
├── start-agent.bat        # Windows启动脚本
├── start-agent.sh         # Linux启动脚本
├── backend/               # 后端服务器
│   ├── src/               # 源代码
│   └── tests/             # 测试代码
├── frontend/              # 前端UI
│   ├── src/               # 源代码
│   │   └── app/           # Next.js应用程序
│   └── public/            # 静态文件
├── tests/                 # 集成测试
└── docs/                  # 文档
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
docker exec -it local-agent bash -c "ollama pull deepcoder:14b"
```

## 未来计划

- 后端实现
- GPU推理支持
- 前端UI改进