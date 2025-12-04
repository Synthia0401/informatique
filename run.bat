@echo off
REM ========================================
REM CinéMax - Script de lancement automatique
REM Windows Batch (.bat)
REM ========================================

setlocal enabledelayedexpansion

REM Couleurs (simples pour CMD)
color 0B

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║                                                    ║
echo ║   CinéMax - Plateforme de Réservation de Cinéma  ║
echo ║          🎬 Lancement automatique 🎬             ║
echo ║                                                    ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Vérifier si Python est installé
echo [1/4] Vérification de Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERREUR : Python n'est pas installé ou non accessible !
    echo.
    echo Téléchargez Python 3.8+ depuis : https://www.python.org/downloads/
    echo ✅ Assurez-vous de cocher "Add Python to PATH" lors de l'installation
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo ✅ %PYTHON_VERSION% détecté
echo.

REM Vérifier et créer l'environnement virtuel
echo [2/4] Configuration de l'environnement virtuel...
if not exist "venv" (
    echo Création de l'environnement virtuel...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ ERREUR : Impossible de créer l'environnement virtuel
        pause
        exit /b 1
    )
    echo ✅ Environnement virtuel créé
) else (
    echo ✅ Environnement virtuel existant détecté
)
echo.

REM Activer l'environnement virtuel
echo [3/4] Installation des dépendances...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ❌ ERREUR : Impossible d'activer l'environnement virtuel
    pause
    exit /b 1
)

REM Installer les dépendances
pip install -r backend/requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Attention : Certaines dépendances n'ont pas pu être installées
    echo Tentative manuelle...
    pip install flask
) else (
    echo ✅ Dépendances installées avec succès
)
echo.

REM Lancer le serveur Flask
echo [4/4] Lancement du serveur Flask...
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║                                                    ║
echo ║   🚀 Le serveur démarre...                        ║
echo ║                                                    ║
echo ║   📍 Adresse : http://localhost:5000             ║
echo ║                                                    ║
echo ║   Appuyez sur Ctrl+C pour arrêter le serveur      ║
echo ║                                                    ║
echo ╚════════════════════════════════════════════════════╝
echo.

REM Lancer Python
python backend/app.py

REM Si le serveur s'arrête, afficher un message
echo.
echo Le serveur s'est arrêté.
pause
