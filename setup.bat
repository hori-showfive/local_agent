@echo off
chcp 932 > nul
REM �X�N���v�g�̏ꏊ���J�����g�f�B���N�g���ɐݒ�
cd /d "%~dp0"

echo ===================================
echo ���[�J��AI�G�[�W�F���g�V�X�e���Z�b�g�A�b�v
echo ===================================
echo.

REM �Ǘ��Ҍ����`�F�b�N
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ���̃X�N���v�g�͊Ǘ��Ҍ����Ŏ��s����K�v������܂��B
    echo �E�N���b�N���āu�Ǘ��҂Ƃ��Ď��s�v��I�����Ă��������B
    pause
    exit /b 1
)

REM Docker�����݂��邩�m�F
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker��������܂���B�C���X�g�[�����܂�...
    echo https://docs.docker.com/desktop/install/windows-install/ ����蓮�ŃC���X�g�[�����Ă��������B
    start https://docs.docker.com/desktop/install/windows-install/
    echo.
    echo �C���X�g�[��������������A���̃X�N���v�g���ēx���s���Ă��������B
    pause
    exit /b 1
)

REM Docker Compose�����݂��邩�m�F�iDocker�Ɋ܂܂�Ă���ꍇ�������j
docker compose version >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker Compose��������܂���B
    echo Docker Desktop���ŐV�łɂ��邩�ADocker Compose���C���X�g�[�����Ă��������B
    echo https://docs.docker.com/compose/install/
    start https://docs.docker.com/compose/install/
    echo.
    echo �C���X�g�[��������������A���̃X�N���v�g���ēx���s���Ă��������B
    pause
    exit /b 1
)

echo �O������̊m�F���������܂����B
echo.

REM �o�[�W��������\��
echo Docker version:
docker --version
echo.

echo Docker Compose version:
docker compose version
echo.

REM ���݂̃f�B���N�g����\��
echo ���݂̃f�B���N�g��: %cd%
echo.

REM .ollama�f�B���N�g���̊m�F�ƍ쐬
echo .ollama�f�B���N�g�����m�F���Ă��܂�...
if not exist .\.ollama (
    echo .ollama�f�B���N�g�������݂��܂���B�쐬���܂�...
    mkdir .ollama
    echo .ollama�f�B���N�g�����쐬���܂����B
) else (
    echo .ollama�f�B���N�g���͊��ɑ��݂��܂��B
)
echo.

echo.
echo ===================================
echo �Z�b�g�A�b�v���������܂����I
echo ===================================
echo.
echo �V�X�e�����N������ɂ� start.bat �����s���Ă��������B
echo.
echo start.bat ���쐬���Ă��܂�...

REM start.bat�̍쐬
echo @echo off > start.bat
echo chcp 932 ^> nul >> start.bat
echo REM �X�N���v�g�̏ꏊ���J�����g�f�B���N�g���ɐݒ� >> start.bat
echo cd /d "%%~dp0" >> start.bat
echo. >> start.bat
echo echo ���[�J��AI�G�[�W�F���g�V�X�e�����N�����Ă��܂�... >> start.bat
echo echo. >> start.bat
echo echo ���݂̃f�B���N�g��: %%cd%% >> start.bat
echo echo. >> start.bat
echo echo .ollama�f�B���N�g�����m�F���Ă��܂�... >> start.bat
echo if not exist .\.ollama ( >> start.bat
echo     echo .ollama�f�B���N�g�������݂��܂���B�쐬���܂�... >> start.bat
echo     mkdir .\.ollama >> start.bat
echo     echo .ollama�f�B���N�g�����쐬���܂����B >> start.bat
echo ) else ( >> start.bat
echo     echo .ollama�f�B���N�g���͊��ɑ��݂��܂��B >> start.bat
echo ) >> start.bat
echo echo. >> start.bat
echo echo Docker Compose�ŃV�X�e�����r���h�E�N�����Ă��܂�... >> start.bat
echo docker compose up --build >> start.bat
echo. >> start.bat
echo echo. >> start.bat
echo echo �V�X�e�����I�����܂����B >> start.bat
echo pause >> start.bat

echo start.bat ���쐬����܂����B
echo.
echo �Z�b�g�A�b�v���������܂����B
echo 'start.bat' �����s���ăV�X�e�����N���ł��܂��B
echo Docker���ł� gemma3:12b ���f�����g�p����܂��B

pause