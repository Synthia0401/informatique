@echo off
REM ================================
REM CinéMax Booking System - Setup Script
REM ================================

setlocal enabledelayedexpansion

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="install" goto install
if "%1"=="run" goto run
if "%1"=="dev" goto dev
if "%1"=="setup" goto setup
if "%1"=="clean" goto clean
if "%1"=="stop" goto stop
if "%1"=="test" goto test

echo Unknown command: %1
goto help

:help
cls
echo ================================
echo CinéMax Booking System - Setup Script
echo ================================
echo.
echo Usage: setup [command]
echo.
echo Available commands:
echo   help       - Show this help message
echo   install    - Install dependencies (Python packages)
echo   run        - Run the Flask development server
echo   dev        - Run the server in development mode (with debug)
echo   clean      - Clean up temporary files and cache
echo   stop       - Stop the Flask server (if running)
echo   test       - Run tests (if available)
echo   setup      - Full setup (install dependencies)
echo.
goto end

:install
echo Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% equ 0 (
    echo Dependencies installed successfully!
) else (
    echo Error installing dependencies!
    exit /b 1
)
goto end

:run
echo Starting CinéMax Flask server...
cd backend
python app.py
cd ..
echo Server stopped.
goto end

:dev
echo Starting CinéMax in development mode...
echo Flask will automatically reload on code changes.
cd backend
python app.py --debug
cd ..
echo Server stopped.
goto end

:setup
echo Running full setup...
call :install
if %errorlevel% equ 0 (
    echo.
    echo Setup complete! You can now run 'setup run' to start the server.
) else (
    echo Setup failed!
    exit /b 1
)
goto end

:clean
echo Cleaning up temporary files...
REM Remove __pycache__ directories
for /d /r . %%d in (__pycache__) do (
    if exist "%%d" (
        echo Removing %%d
        rmdir /s /q "%%d"
    )
)
REM Remove .pyc files
for /r . %%f in (*.pyc) do (
    if exist "%%f" (
        echo Removing %%f
        del "%%f"
    )
)
echo Cleaning complete!
goto end

:stop
echo Stopping Flask server...
taskkill /f /im python.exe /fi "windowtitle eq CinéMax*" 2>nul
if %errorlevel% equ 0 (
    echo Flask server stopped.
) else (
    echo No Flask process found.
)
goto end

:test
echo Running tests...
if exist tests\ (
    cd tests
    pytest . -v
    cd ..
) else (
    echo No tests directory found. Create a 'tests' folder to add tests.
)
goto end

:end
