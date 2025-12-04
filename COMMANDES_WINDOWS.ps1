# ========================================
# CinéMax - Commandes PowerShell utiles
# Windows PowerShell
# ========================================

# 📝 Ce fichier contient les commandes les plus utiles pour développer avec CinéMax

# ========================================
# ✅ LANCEMENT ET ARRÊT
# ========================================

# Activer l'environnement virtuel
.\venv\Scripts\Activate.ps1

# Lancer le serveur Flask
python backend/app.py

# Arrêter le serveur : Ctrl + C


# ========================================
# 🔧 CONFIGURATION DE L'ENVIRONNEMENT
# ========================================

# Créer un nouvel environnement virtuel
python -m venv venv

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
python --version

# Vérifier les dépendances installées
pip list

# Vérifier que Flask est installé
pip show flask

# Vider le cache pip
pip cache purge

# Réinstaller les dépendances (forcer la réinstallation)
pip install --force-reinstall -r backend/requirements.txt

# Vérifier quel processus utilise le port 5000
netstat -ano | findstr :5000

# Tuer le processus qui utilise le port 5000 (remplacer PID)
taskkill /PID <numero> /F


# ========================================
# 🗂️ GESTION DES FICHIERS
# ========================================

# Lister les fichiers du projet
ls

# Aller dans le dossier backend
cd backend

# Retour au dossier racine
cd ..

# Afficher la structure du projet
tree /F /A


# ========================================
# 💾 BASE DE DONNÉES
# ========================================

# Vérifier que la base de données existe
ls backend/cinema.db

# Supprimer la base de données (réinitialiser les données)
Remove-Item backend/cinema.db

# Afficher le contenu de la base de données (avec sqlite3)
sqlite3 backend/cinema.db "SELECT * FROM users;"


# ========================================
# 🔐 PERMISSIONS (PowerShell)
# ========================================

# Permettre l'exécution des scripts (une seule fois)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Vérifier la politique actuelle
Get-ExecutionPolicy


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


# ========================================
# 🧹 NETTOYAGE
# ========================================

# Nettoyer les fichiers de cache Python
Get-ChildItem -Path . -Include __pycache__ -Recurse | Remove-Item -Recurse -Force

# Nettoyer les fichiers .pyc
Get-ChildItem -Path . -Include *.pyc -Recurse | Remove-Item -Force

# Supprimer le dossier venv (pour recommencer)
Remove-Item -Recurse -Force venv


# ========================================
# 📊 INFORMATIONS UTILES
# ========================================

# Afficher la variable d'environnement PATH
$env:PATH

# Afficher le répertoire courant
pwd

# Obtenir l'heure actuelle
Get-Date

# Afficher les informations système
systeminfo

# Copier un fichier
Copy-Item -Path "source.txt" -Destination "destination.txt"

# Créer un nouveau dossier
New-Item -ItemType Directory -Name "nouveau_dossier"


# ========================================
# 🎯 UTILISATION
# ========================================

# Pour utiliser ces commandes, copiez-collez une ligne à la fois dans PowerShell
# Exemple :
# PS C:\path\to\Informatique> .\venv\Scripts\Activate.ps1
# (venv) PS C:\path\to\Informatique> python backend/app.py
