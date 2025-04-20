@echo off
chcp 932 > nul
REM スクリプトの場所をカレントディレクトリに設定
cd /d "%~dp0"

echo ===================================
echo ローカルAIエージェントシステムセットアップ
echo ===================================
echo.

REM 管理者権限チェック
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo このスクリプトは管理者権限で実行する必要があります。
    echo 右クリックして「管理者として実行」を選択してください。
    pause
    exit /b 1
)

REM Dockerが存在するか確認
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo Dockerが見つかりません。インストールします...
    echo https://docs.docker.com/desktop/install/windows-install/ から手動でインストールしてください。
    start https://docs.docker.com/desktop/install/windows-install/
    echo.
    echo インストールが完了したら、このスクリプトを再度実行してください。
    pause
    exit /b 1
)

REM Docker Composeが存在するか確認（Dockerに含まれている場合が多い）
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Composeが見つかりません。
    echo Docker Desktopを最新版にするか、Docker Composeをインストールしてください。
    echo https://docs.docker.com/compose/install/
    start https://docs.docker.com/compose/install/
    echo.
    echo インストールが完了したら、このスクリプトを再度実行してください。
    pause
    exit /b 1
)

echo 前提条件の確認が完了しました。
echo.

REM バージョン情報を表示
echo Docker version:
docker --version
echo.

echo Docker Compose version:
docker compose version
echo.

REM 現在のディレクトリを表示
echo 現在のディレクトリ: %cd%
echo.

REM .ollamaディレクトリの確認と作成
echo .ollamaディレクトリを確認しています...
if not exist .\.ollama (
    echo .ollamaディレクトリが存在しません。作成します...
    mkdir .ollama
    echo .ollamaディレクトリを作成しました。
) else (
    echo .ollamaディレクトリは既に存在します。
)
echo.

echo.
echo ===================================
echo セットアップが完了しました！
echo ===================================
echo.
echo システムを起動するには start.bat を実行してください。
echo.
echo start.bat を作成しています...

REM start.batの作成
echo @echo off > start.bat
echo chcp 932 ^> nul >> start.bat
echo REM スクリプトの場所をカレントディレクトリに設定 >> start.bat
echo cd /d "%%~dp0" >> start.bat
echo. >> start.bat
echo echo ローカルAIエージェントシステムを起動しています... >> start.bat
echo echo. >> start.bat
echo echo 現在のディレクトリ: %%cd%% >> start.bat
echo echo. >> start.bat
echo echo .ollamaディレクトリを確認しています... >> start.bat
echo if not exist .\.ollama ( >> start.bat
echo     echo .ollamaディレクトリが存在しません。作成します... >> start.bat
echo     mkdir .\.ollama >> start.bat
echo     echo .ollamaディレクトリを作成しました。 >> start.bat
echo ) else ( >> start.bat
echo     echo .ollamaディレクトリは既に存在します。 >> start.bat
echo ) >> start.bat
echo echo. >> start.bat
echo echo Docker Composeでシステムをビルド・起動しています... >> start.bat
echo docker compose up --build >> start.bat
echo. >> start.bat
echo echo. >> start.bat
echo echo システムが終了しました。 >> start.bat
echo pause >> start.bat

echo start.bat が作成されました。
echo.
echo セットアップが完了しました。
echo 'start.bat' を実行してシステムを起動できます。
echo Docker環境では gemma3:12b モデルが使用されます。

pause