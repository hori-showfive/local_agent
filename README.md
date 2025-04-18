# Local Agent

*Language: [English](README.md) | [日本語](docs/readme/README-jp.md) | [中文](docs/readme/README-cn.md)*

An autonomous AI agent system that uses locally running Large Language Models (LLMs) to freely execute commands in a virtual environment. This system is fully contained within a Docker environment, aiming to create a sandbox where even if the AI destroys the environment, there's no real damage. GPU-accelerated inference support is planned.

## Overview

This project provides an integrated system with a frontend for sending instructions to AI and executing shell commands, and a backend that connects AI with shell operations. It runs an Ollama server in a local environment, currently using the latest deep learning model "deepcoder" as an example.

### Features

- **Fully Local Execution**: All processing takes place in your local environment, ensuring data privacy.
- **Docker Container Integration**: All necessary components operate within a single Docker container. (There is a non-zero possibility of switching to microservice architecture)
- **Browser UI Interface**: Send instructions to AI and execute shell commands through an easy-to-use web UI.
- **GPU Acceleration**: Support for high-speed inference using NVIDIA GPUs is planned.
- **Simple Startup**: Easily launch the system using startup scripts.

## System Requirements

- Docker and Docker Compose
- NVIDIA GPU (recommended) and CUDA toolkit (not required currently as GPU inference is not yet implemented)
- Windows or Linux environment (Run command prompt with administrator privileges on Windows)

## Quick Start

### Starting on Windows

1. Clone the repository:
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. Run the startup script:
```
start-agent.bat
```

### Starting on Linux

1. Clone the repository:
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. Add execution permissions to the startup script:
```
chmod +x start-agent.sh
```

3. Run the startup script:
```
./start-agent.sh
```

## System Architecture

The system consists of three main components:

1. **Ollama Server**: Runs the deepcoder model and provides AI inference capabilities.
2. **Backend Server**: An Express server implemented in Node.js that mediates between Ollama and the frontend UI.
3. **Frontend UI**: A web UI implemented with Next.js and TypeScript that enables interaction between users and the AI agent.

### Port Configuration

- `11434`: Ollama API
- `3000`: Backend Server
- `3001`: Frontend Server

## Main Features

- **Sending Instructions to AI**: Send natural language instructions to the AI agent from your browser.
- **Shell Command Execution**: Execute shell commands from the UI and display the results.
- **Model Status Check**: Check available models and server status.

## Development Information

### Technology Stack

- **Ollama**: Local LLM execution environment
- **Node.js/Express**: Backend API
- **Next.js/TypeScript/TailwindCSS**: Frontend UI
- **Docker**: Container environment
- **NVIDIA CUDA**: GPU acceleration

### Project Structure

```
local-agent/
├── docker-compose.yml     # Docker container configuration
├── Dockerfile             # Container build definition
├── start-agent.bat        # Windows startup script
├── start-agent.sh         # Linux startup script
├── backend/               # Backend server
│   ├── src/               # Source code
│   └── tests/             # Test code
├── frontend/              # Frontend UI
│   ├── src/               # Source code
│   │   └── app/           # Next.js application
│   └── public/            # Static files
├── tests/                 # Integration tests
└── docs/                  # Documentation
```

### Running Tests

To run backend tests:

```bash
cd backend
npm test
```

To run integration tests:

```bash
node tests/run-tests.js
```

## Troubleshooting

### If Services Don't Start

1. Verify that Docker is properly installed
2. Check the logs: `docker-compose logs -f`
3. If there are GPU support issues, verify that NVIDIA drivers and CUDA are correctly installed

### If Model Download Fails

Check your internet connection and download the model manually if needed:

```bash
docker exec -it local-agent bash -c "ollama pull deepcoder:14b"
```

## Future Plans

- Backend implementation
- GPU inference support
- Frontend UI improvements