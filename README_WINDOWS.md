# 🎬 CinéMax - Windows Guide

Système de réservation de cinéma. Guide d'installation et d'utilisation pour Windows.

---

## 📋 Sommaire

1. [Installation rapide](#-installation-rapide)
2. [Installation manuelle](#-installation-manuelle)
3. [Dépendances Python](#-dépendances-python)
4. [Comptes de test](#-comptes-de-test)
5. [Démarrage du serveur](#-démarrage-du-serveur)
6. [Dépannage](#-dépannage)

---

## ⚡ Installation rapide

### Option 1 : Double-cliquez sur `run.bat` (RECOMMANDÉ)

La méthode la plus simple pour démarrer l'application :

1. Localisez le fichier `run.bat` à la racine du projet
2. Double-cliquez sur le fichier
3. Attendez que les dépendances s'installent
4. Le navigateur s'ouvrira automatiquement à `http://localhost:5000`
5. Utilisez les [comptes de test](#-comptes-de-test) pour vous connecter

---

## 📝 Installation manuelle

### Étape 1 : Vérifier Python

Ouvrez PowerShell ou Command Prompt et vérifiez que Python 3.8+ est installé :

```powershell
python --version
```

**Si Python n'est pas reconnu :**
- Téléchargez Python depuis [python.org](https://www.python.org/downloads/)
- **IMPORTANT** : Cochez "Add Python to PATH" lors de l'installation
- Redémarrez PowerShell

### Étape 2 : Autoriser l'exécution des scripts (PowerShell)

⚠️ Une seule fois - Si vous obtenez l'erreur "cannot be loaded because running scripts is disabled" :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Tapez `Y` et appuyez sur `Entrée`.

### Étape 3 : Créer et activer l'environnement virtuel

**Créer l'environnement virtuel :**
```powershell
python -m venv venv
```

**Activer l'environnement (PowerShell) :**
```powershell
.\venv\Scripts\Activate.ps1
```

**Activer l'environnement (Command Prompt) :**
```cmd
venv\Scripts\activate.bat
```

Vous devez voir `(venv)` au début de chaque ligne du terminal.

### Étape 4 : Installer les dépendances

```powershell
pip install -r backend/requirements.txt
```

Cela peut prendre 1-2 minutes.

### Étape 5 : Lancer le serveur

```powershell
python backend/app.py
```

Vous devez voir :
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Étape 6 : Ouvrir dans le navigateur

Ouvrez votre navigateur et allez à : **http://localhost:5000**

---

## 📦 Dépendances Python

Les bibliothèques requises pour Windows :

| Bibliothèque | Version | Description |
|---|---|---|
| **Flask** | 2.3.3 | Framework web Python |
| **Werkzeug** | 2.3.7 | Utilitaire de sécurité (hash des mots de passe) |
| **qrcode** | 7.4.2 | Génération de codes QR |
| **reportlab** | 4.0.7 | Génération de PDF |
| **Pillow** | 10.0.0 | Traitement d'images |

**Installation manuelle des dépendances :**
```powershell
pip install Flask==2.3.3
pip install Werkzeug==2.3.7
pip install qrcode==7.4.2
pip install reportlab==4.0.7
pip install Pillow==10.0.0
```

**Ou installer en masse :**
```powershell
pip install Flask==2.3.3 Werkzeug==2.3.7 qrcode==7.4.2 reportlab==4.0.7 Pillow==10.0.0
```

---

## 👥 Comptes de test

Deux comptes de démonstration sont créés automatiquement :

### Compte utilisateur standard
- **Email** : `test@cinema.com`
- **Mot de passe** : `test1234`
- **Rôle** : Utilisateur normal
- **Fonctionnalités** : Réserver des films, voir l'historique

### Compte administrateur
- **Email** : `admin@cinema.com`
- **Mot de passe** : `admin1234`
- **Rôle** : Administrateur
- **Fonctionnalités** : Accès complet au système, gestion des réservations

---

## 🚀 Démarrage du serveur

### Première fois
```powershell
.\venv\Scripts\Activate.ps1
python backend/app.py
```

### Fois suivantes
L'environnement virtuel se réactive automatiquement, il suffit de relancer l'application :
```powershell
.\venv\Scripts\Activate.ps1
python backend/app.py
```

### Pour arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

---

## 🐛 Dépannage

### ❌ Erreur : "Python n'est pas reconnu"

**Solution :**
1. Réinstallez Python depuis [python.org](https://www.python.org/downloads/)
2. **IMPORTANT** : Cochez "Add Python to PATH"
3. Redémarrez PowerShell

### ❌ Erreur : "Cannot be loaded because running scripts is disabled"

**Solution :**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Erreur : "Flask not found"

**Solution :**
Vérifiez que l'environnement virtuel est activé (présence de `(venv)` dans le terminal) :
```powershell
.\venv\Scripts\Activate.ps1
pip install flask
```

### ❌ Erreur : "Port 5000 already in use"

**Solution :**
Trouver et arrêter le processus :
```powershell
# Trouver le processus utilisant le port 5000
netstat -ano | findstr :5000

# Arrêter le processus (remplacer PID par le numéro affiché)
taskkill /PID <numero_affiche> /F
```

### ❌ Impossible de créer venv

**Solution :**
```powershell
python -m pip install --upgrade pip
python -m venv venv
```

### ❌ Erreur lors de l'installation des dépendances

**Solution :**
```powershell
pip install --upgrade pip setuptools
pip install -r backend/requirements.txt
```

---

## 💡 Astuces utiles

### Vérifier que tout fonctionne

```powershell
.\venv\Scripts\Activate.ps1
pip list
```

Vous devez voir `Flask`, `Werkzeug`, `qrcode`, `reportlab`, et `Pillow` dans la liste.

### Créer un raccourci de démarrage

1. Clic droit sur `run.bat`
2. Sélectionnez "Send to" → "Desktop (create shortcut)"
3. Double-cliquez sur le raccourci pour lancer l'application

### Réinitialiser la base de données

Supprimez le fichier `backend/cinema.db` et relancez l'application.

---

## 📍 Structure du projet

```
informatique/
├── backend/
│   ├── app.py              # Application Flask principale
│   ├── requirements.txt     # Dépendances Python
│   └── cinema.db           # Base de données (créée automatiquement)
├── frontend/
│   ├── templates/
│   │   └── index.html      # Interface utilisateur
│   └── static/
│       ├── app.js          # Logique JavaScript
│       └── style.css       # Styles CSS
├── run.bat                 # Démarrage rapide Windows
└── requirements.txt        # Dépendances principales
```

---

## 🔐 Sécurité

⚠️ **Production** :
- Changez la clé secrète Flask dans `backend/app.py` (ligne 20)
- N'utilisez pas les comptes de test en production
- Utilisez une base de données MySQL/PostgreSQL au lieu de SQLite
- Activez HTTPS

---

## ✅ Checklist de démarrage

- [ ] Python 3.8+ installé
- [ ] PowerShell autorisant l'exécution de scripts
- [ ] Environnement virtuel créé (`venv/`)
- [ ] Dépendances installées
- [ ] Serveur lancé (`python backend/app.py`)
- [ ] Navigateur accessible à `http://localhost:5000`
- [ ] Connexion avec `test@cinema.com` / `test1234` réussie

---

## 📞 Support

Pour toute question ou problème :
1. Consultez la section [Dépannage](#-dépannage)
2. Vérifiez que tous les prérequis sont installés
3. Réinstallez les dépendances si nécessaire

---

**Dernière mise à jour** : 5 décembre 2025
