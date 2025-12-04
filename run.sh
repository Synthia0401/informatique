#!/bin/bash

# ========================================
# CinéMax - Script de lancement automatique
# macOS / Linux (Bash)
# ========================================

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_header() {
    echo -e "\n${BLUE}╔════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}   CinéMax - Plateforme de Réservation de Cinéma  ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}          🎬 Lancement automatique 🎬             ${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} ${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date '+%H:%M:%S')]${NC} ${RED}✗ ERREUR${NC} : $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date '+%H:%M:%S')]${NC} ${YELLOW}⚠${NC} $1"
}

# Afficher l'en-tête
print_header

# Vérifier si Python est installé
echo -e "${BLUE}[1/4]${NC} Vérification de Python..."
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 n'est pas installé !"
    echo -e "\nTéléchargez Python 3.8+ depuis : ${BLUE}https://www.python.org/downloads/${NC}"
    echo -e "Ou installez via Homebrew (macOS) : ${BLUE}brew install python3${NC}"
    echo -e "Ou via apt (Linux) : ${BLUE}sudo apt install python3${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version)
print_step "$PYTHON_VERSION détecté"
echo

# Vérifier et créer l'environnement virtuel
echo -e "${BLUE}[2/4]${NC} Configuration de l'environnement virtuel..."
if [ ! -d "venv" ]; then
    echo "Création de l'environnement virtuel..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        print_error "Impossible de créer l'environnement virtuel"
        exit 1
    fi
    print_step "Environnement virtuel créé"
else
    print_step "Environnement virtuel existant détecté"
fi
echo

# Activer l'environnement virtuel
source venv/bin/activate
if [ $? -ne 0 ]; then
    print_error "Impossible d'activer l'environnement virtuel"
    exit 1
fi

# Installer les dépendances
echo -e "${BLUE}[3/4]${NC} Installation des dépendances..."
pip install -r backend/requirements.txt > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_warning "Certaines dépendances n'ont pas pu être installées"
    echo "Tentative manuelle..."
    pip install flask
else
    print_step "Dépendances installées avec succès"
fi
echo

# Lancer le serveur Flask
echo -e "${BLUE}[4/4]${NC} Lancement du serveur Flask..."
echo
echo -e "${BLUE}╔════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   🚀 Le serveur démarre...                        ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   📍 Adresse : ${GREEN}http://localhost:5000${BLUE}             ║${NC}"
echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}   Appuyez sur Ctrl+C pour arrêter le serveur      ${BLUE}║${NC}"
echo -e "${BLUE}║${NC}                                                    ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════╝${NC}"
echo

# Lancer Python
python backend/app.py

# Si le serveur s'arrête, afficher un message
echo
print_step "Le serveur s'est arrêté."
