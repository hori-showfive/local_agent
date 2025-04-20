# Local Agent

*Language: [English](README.md) | [日本語](docs/readme/README-jp.md) | [中文](docs/readme/README-cn.md)*

An autonomous AI agent system that uses locally running Large Language Models (LLMs) to freely execute commands in a virtual environment. This system is fully contained within a Docker environment, aiming to create a sandbox where even if the AI destroys the environment, there's no real damage.

## Overview

This project provides an integrated system with a frontend for sending instructions to AI and executing shell commands, and a backend that connects AI with shell operations. It runs an Ollama server in a local environment, currently using the Gemma 3 model (gemma3:12b) for advanced code understanding and generation capabilities.

### Features

- **Fully Local Execution**: All processing takes place in your local environment, ensuring data privacy.
- **Docker Container Integration**: All necessary components operate within a single Docker container.
- **Browser UI Interface**: Send instructions to AI and execute shell commands through an easy-to-use web UI.
- **Simple Setup**: Easy setup process with automated scripts for Windows and Linux/Mac.
- **Model Management**: Load, unload, and check the status of different LLM models through the API.
- **API Documentation**: Complete Swagger documentation for all available endpoints.
- **Simple Startup**: Easily launch the system using Docker Compose.

> **Note:** While the configuration includes GPU settings, GPU acceleration has not been fully tested. The current implementation primarily targets CPU usage.

## System Requirements

- Docker and Docker Compose
- Windows, Linux, or macOS environment
  - Run command prompt with administrator privileges on Windows

## Quick Start

### Using Setup Scripts (Recommended)

1. Clone the repository:
```
git clone https://github.com/yourusername/local-agent.git
cd local-agent
```

2. Run the setup script:

**Windows:**
```
setup.bat
```
(Right-click and select "Run as administrator")

**Linux/macOS:**
```
chmod +x setup.sh
./setup.sh
```

3. After the setup is complete, run the start script:

**Windows:**
```
start.bat
```

**Linux/macOS:**
```
./start.sh
```

4. Access the web UI at `http://localhost:3001`

### Manual Setup with Docker Compose

1. Clone the repository
2. Create a `.ollama` directory in the project root
3. Build and start the containers:
```
docker-compose up --build
```

4. Access the web UI at `http://localhost:3001`

## System Architecture

The system consists of three main components:

1. **Ollama Server**: Runs the Gemma 3 model and provides AI inference capabilities.
2. **Backend Server**: An Express server implemented in Node.js that mediates between Ollama and the frontend UI.
3. **Frontend UI**: A web UI that enables interaction between users and the AI agent.

### Port Configuration

- `11434`: Ollama API
- `3000`: Backend Server
- `3001`: Frontend Server

## Main Features

- **Sending Instructions to AI**: Send natural language instructions to the AI agent from your browser.
- **Shell Command Execution**: Execute shell commands from the UI and display the results.
- **Model Management**: Load, unload, and check the status of different LLM models.
- **API Documentation**: Access the Swagger documentation at `http://localhost:3000/api-docs`.

## API Endpoints

The backend server provides the following API endpoints:

- `GET /api`: Health check for the API server
- `GET /api/check-model`: Check available models and connection to Ollama
- `GET /api/models`: List all available models
- `POST /api/generate`: Generate text from a prompt
- `POST /api/execute-command`: Execute a system command
- `GET /api/running-models`: Get information about currently loaded models
- `POST /api/load-model`: Load a model into memory
- `POST /api/unload-model`: Unload a model from memory

## Development Information

### Technology Stack

- **Ollama**: Local LLM execution environment
- **Node.js/Express**: Backend API
- **Next.js/TypeScript/TailwindCSS**: Frontend UI
- **Docker**: Container environment
- **Swagger**: API documentation

### Project Structure

```
local-agent/
├── docker-compose.yml     # Docker container configuration
├── Dockerfile             # Container build definition
├── setup.bat              # Windows setup script
├── setup.sh               # Linux/Mac setup script  
├── start.bat              # Windows startup script
├── start.sh               # Linux/Mac startup script
├── backend/               # Backend server
│   ├── src/               # Source code
│   │   ├── controllers/   # API controllers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Service layer (Ollama interaction)
│   │   ├── config/        # Configuration files
│   │   ├── prompts/       # System prompts and templates
│   │   └── swagger/       # Swagger documentation
│   └── tests/             # Test code
├── frontend/              # Frontend UI
│   ├── src/               # Source code
│   │   └── app/           # Next.js application
│   └── public/            # Static files
├── tests/                 # Integration tests
└── docs/                  # Documentation
    └── readme/            # Translated READMEs
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
3. Make sure the `.ollama` directory exists in the project root

### If Model Download Fails

Check your internet connection and download the model manually if needed:

```bash
docker exec -it local-agent bash -c "ollama pull gemma3:12b"
```

## Future Plans

- Backend implementation
- GPU inference support
- Frontend UI improvements
