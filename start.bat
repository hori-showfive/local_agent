@echo off
chcp 932 > nul
REM スクリプトの場所をカレントディレクトリに設定
cd /d "%~dp0"

echo ===================================
echo ローカルAIエージェントシステムを起動
echo ===================================
echo.

echo 現在のディレクトリ: %cd%
echo.

echo .ollamaディレクトリを確認しています...
if not exist .\.ollama (
    echo .ollamaディレクトリが存在しません。作成します...
    mkdir .ollama
    echo .ollamaディレクトリを作成しました。
) else (
    echo .ollamaディレクトリは既に存在します。
)
echo.

echo Docker Composeでシステムをビルド・起動しています...
echo (終了するには Ctrl+C を押してください)
echo.
docker compose up --build

echo.
echo システムが終了しました。
pause