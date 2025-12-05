.PHONY: help install run clean stop dev test

help:
	@echo ================================
	@echo CinéMax Booking System - Makefile
	@echo ================================
	@echo.
	@echo Usage: make [target]
	@echo.
	@echo Available targets:
	@echo   help       - Show this help message
	@echo   install    - Install dependencies (Python packages)
	@echo   run        - Run the Flask development server
	@echo   dev        - Run the server in development mode (with hot reload)
	@echo   clean      - Clean up temporary files and cache
	@echo   stop       - Stop the Flask server (if running)
	@echo   test       - Run tests (if available)
	@echo   setup      - Full setup (install dependencies and initialize database)
	@echo.

install:
	@echo Installing Python dependencies...
	pip install -r requirements.txt
	@echo Dependencies installed successfully!

run:
	@echo Starting CinéMax Flask server...
	cd backend && python app.py
	@echo Server stopped.

dev:
	@echo Starting CinéMax in development mode...
	@echo Flask will automatically reload on code changes.
	cd backend && python app.py --debug
	@echo Server stopped.

setup: install
	@echo Setup complete! You can now run 'make run' to start the server.

clean:
	@echo Cleaning up temporary files...
	@REM Remove Python cache files
	@for /d /r . %%d in (__pycache__) do @if exist "%%d" rmdir /s /q "%%d"
	@REM Remove .pyc files
	@for /r . %%f in (*.pyc) do @if exist "%%f" del "%%f"
	@echo Cleaning complete!

stop:
	@echo Stopping Flask server...
	taskkill /f /im python.exe /fi "windowtitle eq CinéMax*" 2>nul || echo No Flask process found.
	@echo Done.

test:
	@echo Running tests...
	@if exist tests\ (
		pytest tests/ -v
	) else (
		@echo No tests directory found. Create a 'tests' folder to add tests.
	)

.DEFAULT_GOAL := help
