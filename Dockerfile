# --- Builder Stage ---
# Use a specific Node.js version known to work, e.g., node:20-slim
FROM node:20-slim as builder

WORKDIR /app

# Install backend dependencies
# Copy only package files first to leverage Docker cache
COPY ./backend/package.json ./backend/package-lock.json* ./backend/
RUN cd backend && npm install --production --ignore-scripts

# Install frontend dependencies
COPY ./frontend/package.json ./frontend/package-lock.json* ./frontend/
RUN cd frontend && npm install --ignore-scripts

# Copy source code AFTER dependency installation
COPY ./backend ./backend
COPY ./frontend ./frontend

# Build frontend
RUN cd frontend && npm run build

# --- Final Stage ---
FROM ollama/ollama:latest

# Install runtime dependencies (curl, gpg, Node.js 20 + npm)

# Install essential tools first and clean up apt lists
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Add NodeSource repository and install Node.js
RUN mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && NODE_MAJOR=20 \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built artifacts and necessary files from builder stage
COPY --from=builder /app/backend ./backend
# Copy the main build output directory
COPY --from=builder /app/frontend/.next ./frontend/.next
# Copy the public directory containing static assets
COPY --from=builder /app/frontend/public ./frontend/public
# Copy package.json needed for `next start`
COPY --from=builder /app/frontend/package.json ./frontend/package.json
# Copy node_modules needed for `next start`
COPY --from=builder /app/frontend/node_modules ./frontend/node_modules

# Create and copy startup script using an environment variable for the model
RUN echo '#!/bin/bash\n\
echo "Starting Ollama server..."\n\
ollama serve &\n\
sleep 5\n\
# Use environment variable OLLAMA_MODEL, default to qwen3 if not set\n\
MODEL_NAME=${OLLAMA_MODEL:-qwen3}\n\
echo "Checking for $MODEL_NAME model..."\n\
# Use double quotes for grep and pull to handle potential spaces or special chars\n\
if ! ollama list | grep -q "$MODEL_NAME"; then\n\
  echo "Pulling $MODEL_NAME model..."\n\
  ollama pull "$MODEL_NAME"\n\
else\n\
  echo "$MODEL_NAME model already exists in mounted volume."\n\
fi\n\
echo "Loading $MODEL_NAME model into memory..."\n\
# Escape double quotes within the JSON string for the curl command\n\
curl -s -X POST http://localhost:11434/api/generate -d "{\\"model\\": \\"$MODEL_NAME\\"}" -H "Content-Type: application/json" > /dev/null\n\
echo "Model loaded successfully."\n\
echo "Starting backend server..."\n\
cd /app/backend && node src/index.js &\n\
echo "Starting frontend server..."\n\
cd /app/frontend && npm run start\n' > /start.sh && chmod +x /start.sh

# Set the default model name as an environment variable
ENV CUDA_VISIBLE_DEVICES=0

# ENTRYPOINT and CMD remain the same
ENTRYPOINT ["/bin/bash"]
CMD ["/start.sh"]

EXPOSE 11434 3000 3001