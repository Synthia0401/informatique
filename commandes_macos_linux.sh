#!/bin/bash

# ========================================
# CinéMax - Commandes utiles
# macOS / Linux (Bash)
# ========================================

# 📝 Ce fichier contient les commandes les plus utiles pour développer avec CinéMax

# Pour utiliser :
# - Copiez-collez une ligne à la fois dans votre terminal
# - Ou rendez ce fichier exécutable : chmod +x commandes_macos_linux.sh
# - Et tapez la commande

# ========================================
# ✅ LANCEMENT ET ARRÊT
# ========================================

# Activer l'environnement virtuel
source venv/bin/activate

# Lancer le serveur Flask
python backend/app.py

# Lancer le script d'installation automatique
./run.sh

# Arrêter le serveur : Ctrl + C


# ========================================
# 🔧 CONFIGURATION DE L'ENVIRONNEMENT
# ========================================

# Créer un nouvel environnement virtuel
python3 -m venv venv

# Installer les dépendances
pip install -r backend/requirements.txt

# Mettre à jour les dépendances
pip install --upgrade -r backend/requirements.txt

# Ajouter une nouvelle dépendance
pip install <nom_package>

# Sauvegarder les dépendances actuelles
pip freeze > backend/requirements.txt


# ========================================
# 🐛 DÉPANNAGE
# ========================================

# Vérifier la version de Python
python3 --version

# Vérifier les dépendances installées
pip list

# Vérifier que Flask est installé
pip show flask

# Vider le cache pip
pip cache purge

# Réinstaller les dépendances (forcer la réinstallation)
pip install --force-reinstall -r backend/requirements.txt

# Vérifier quel processus utilise le port 5000
lsof -i :5000

# Tuer le processus qui utilise le port 5000 (remplacer PID)
kill -9 <numero_PID>


# ========================================
# 🗂️ GESTION DES FICHIERS
# ========================================

# Lister les fichiers du projet
ls -la

# Aller dans le dossier backend
cd backend

# Retour au dossier racine
cd ..

# Afficher la structure du projet
tree -L 2

# Ou sans tree :
find . -type f -name "*.py" -o -name "*.html" -o -name "*.css" | head -20


# ========================================
# 💾 BASE DE DONNÉES
# ========================================

# Vérifier que la base de données existe
ls -la backend/cinema.db

# Supprimer la base de données (réinitialiser les données)
rm backend/cinema.db

# Afficher le contenu de la base de données (avec sqlite3)
sqlite3 backend/cinema.db "SELECT * FROM users;"

# Accéder à la console SQLite interactive
sqlite3 backend/cinema.db


# ========================================
# 📦 GESTION GIT
# ========================================

# Vérifier le statut Git
git status

# Ajouter tous les fichiers
git add .

# Commit avec message
git commit -m "Votre message"

# Voir l'historique
git log --oneline

# Annuler les modifications non sauvegardées
git checkout .

# Voir les différences
git diff


# ========================================
# 🧹 NETTOYAGE
# ========================================

# Nettoyer les fichiers de cache Python
find . -type d -name __pycache__ -exec rm -r {} + 2>/dev/null

# Nettoyer les fichiers .pyc
find . -name "*.pyc" -delete

# Supprimer le dossier venv (pour recommencer)
rm -rf venv

# Supprimer les fichiers de cache du système
find . -name ".DS_Store" -delete  # macOS
find . -name "Thumbs.db" -delete  # Windows


# ========================================
# 📊 INFORMATIONS UTILES
# ========================================

# Afficher le répertoire courant
pwd

# Obtenir l'heure actuelle
date

# Afficher les informations système
uname -a

# Copier un fichier
cp source.txt destination.txt

# Créer un nouveau dossier
mkdir nouveau_dossier

# Afficher le contenu d'un fichier
cat filename.txt

# Éditer un fichier (nano)
nano filename.txt

# Éditer un fichier (vim)
vim filename.txt


# ========================================
# 🚀 RACCOURCIS UTILES
# ========================================

# Créer un alias temporaire pour démarrer CinéMax
alias start-cinemax='cd ~/Informatique && source venv/bin/activate && python backend/app.py'

# Créer un alias permanent (ajouter à ~/.bashrc ou ~/.zshrc) :
# echo "alias start-cinemax='cd ~/Informatique && source venv/bin/activate && python backend/app.py'" >> ~/.bashrc
# source ~/.bashrc


# ========================================
# 💡 EXEMPLES D'UTILISATION
# ========================================

# Exemple 1 : Installation complète
# cd ~/Informatique
# python3 -m venv venv
# source venv/bin/activate
# pip install -r backend/requirements.txt
# python backend/app.py

# Exemple 2 : Redémarrer rapidement
# source venv/bin/activate
# python backend/app.py

# Exemple 3 : Nettoyer et recommencer
# rm -rf venv
# rm backend/cinema.db
# python3 -m venv venv
# source venv/bin/activate
# pip install -r backend/requirements.txt
# python backend/app.py
