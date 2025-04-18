@echo off
chcp 65001 > nul
echo [INFO] ローカルAIエージェントシステムを起動しています...

REM Dockerの確認
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Dockerがインストールされていません。インストールしてください。
    exit /b 1
)

where docker-compose >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Docker Composeがインストールされていません。インストールしてください。
    exit /b 1
)

REM ollamaディレクトリの確認と作成（Windowsユーザー向け）
set OLLAMA_DIR=%USERPROFILE%\.ollama
if not exist "%OLLAMA_DIR%" (
    echo [INFO] .ollamaディレクトリが存在しないため作成します...
    mkdir "%OLLAMA_DIR%"
    echo [SUCCESS] %OLLAMA_DIR% を作成しました
)

REM コンテナをビルド・起動
echo [INFO] Dockerコンテナをビルドしています...
docker-compose build

echo [INFO] Dockerコンテナを起動しています...
docker-compose up -d

echo [INFO] サービスの起動を待機しています...
timeout /t 10 /nobreak >nul

REM サービスのヘルスチェック
echo [INFO] 各サービスのヘルスチェックを実行しています...

REM Ollamaサーバーのチェック
curl -s http://localhost:11434/api/tags >nul
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Ollamaサーバーは正常に動作しています
) else (
    echo [ERROR] Ollamaサーバーに接続できません。ログを確認してください:
    docker-compose logs local-agent | findstr /i ollama
)

REM バックエンドAPIのチェック
curl -s http://localhost:3000/api >nul
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] バックエンドAPIは正常に動作しています
) else (
    echo [ERROR] バックエンドAPIに接続できません。ログを確認してください:
    docker-compose logs local-agent | findstr /i "Server is running"
)

REM フロントエンドサーバーのチェック
curl -s -I http://localhost:3001 | findstr /i "200 OK" >nul
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] フロントエンドサーバーは正常に動作しています
) else (
    echo [ERROR] フロントエンドサーバーに接続できません。ログを確認してください:
    docker-compose logs local-agent | findstr /i next
)

echo.
echo [INFO] システムにアクセスするには:
echo - フロントエンドUI: http://localhost:3001
echo - バックエンドAPI: http://localhost:3000/api
echo - Ollama API: http://localhost:11434/api
echo.
echo [INFO] ログを表示するには: docker-compose logs -f
echo [INFO] システムを停止するには: docker-compose down

pause