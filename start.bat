@echo off
chcp 932 > nul
REM �X�N���v�g�̏ꏊ���J�����g�f�B���N�g���ɐݒ�
cd /d "%~dp0"

echo ===================================
echo ���[�J��AI�G�[�W�F���g�V�X�e�����N��
echo ===================================
echo.

echo ���݂̃f�B���N�g��: %cd%
echo.

echo .ollama�f�B���N�g�����m�F���Ă��܂�...
if not exist .\.ollama (
    echo .ollama�f�B���N�g�������݂��܂���B�쐬���܂�...
    mkdir .ollama
    echo .ollama�f�B���N�g�����쐬���܂����B
) else (
    echo .ollama�f�B���N�g���͊��ɑ��݂��܂��B
)
echo.

echo Docker Compose�ŃV�X�e�����r���h�E�N�����Ă��܂�...
echo (�I������ɂ� Ctrl+C �������Ă�������)
echo.
docker compose up --build

echo.
echo �V�X�e�����I�����܂����B
pause