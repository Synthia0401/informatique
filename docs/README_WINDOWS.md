# CinéMax - Windows Guide

**Système de réservation de cinéma - Guide d'installation et d'utilisation pour Windows**

---

## Table des matières

1. Installation rapide
2. Installation manuelle
3. Dépendances Python
4. Comptes de test
5. Démarrage du serveur
6. Dépannage

---

## Installation rapide (RECOMMANDÉ)

Ouvrez PowerShell dans le dossier du projet et exécutez :

```powershell
.\setup.bat setup
.\setup.bat run
```

Le serveur démarre automatiquement à `http://localhost:5000`

---

## Installation manuelle

### Étape 1 - Vérifier Python

Ouvrez PowerShell ou Command Prompt et vérifiez que Python 3.8+ est installé :

```powershell
python --version
```

Si Python n'est pas reconnu :
- Téléchargez Python depuis https://www.python.org/downloads/
- IMPORTANT : Cochez "Add Python to PATH" lors de l'installation
- Redémarrez PowerShell

### Étape 2 - Autoriser l'exécution des scripts (PowerShell)

Une seule fois - Si vous obtenez l'erreur "cannot be loaded because running scripts is disabled" :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Tapez `Y` et appuyez sur Entrée.

### Étape 3 - Créer et activer l'environnement virtuel

Créer l'environnement virtuel :

```powershell
python -m venv venv
```

Activer l'environnement (PowerShell) :

```powershell
.\venv\Scripts\Activate.ps1
```

Activer l'environnement (Command Prompt) :

```cmd
venv\Scripts\activate.bat
```

Vous devez voir `(venv)` au début de chaque ligne du terminal.

### Étape 4 - Installer les dépendances

```powershell
pip install -r backend/requirements.txt
```

Cela peut prendre 1-2 minutes.

### Étape 5 - Lancer le serveur

```powershell
.\setup.bat run
```

Vous devez voir :

```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Étape 6 - Ouvrir dans le navigateur

Ouvrez votre navigateur et allez à : http://localhost:5000

---

### C'est quoi ces bibliothèques ?

Les **bibliothèques Python** sont des collections de code réutilisable qui ajoutent des fonctionnalités à Python. Elles vous permettent de faire des choses sans réinventer la roue.

#### Les bibliothèques requises pour CinéMax :

| Bibliothèque | Version | C'est quoi ? | Utilisation |
|---|---|---|---|
| **Flask** | 2.3.3 | Framework web Python | Crée le serveur web et gère les pages |
| **Werkzeug** | 2.3.7 | Outils de sécurité | Crypte les mots de passe (hash sécurisé) |
| **qrcode** | 7.4.2 | Génération de codes QR | Crée les codes QR pour les tickets |
| **reportlab** | 4.0.7 | Création de PDF | Génère les PDF des réservations |
| **Pillow** | 10.0.0 | Traitement d'images | Traite les images des films |

### Installation automatique (recommandée)

C'est inclus dans `.\setup.bat setup` :
```powershell
.\setup.bat setup
```

Cela installe automatiquement toutes les bibliothèques listées dans `requirements.txt`

### Installation manuelle

Si vous préférez installer manuellement (optionnel) :
```powershell
pip install Flask==2.3.3
pip install Werkzeug==2.3.7
pip install qrcode==7.4.2
pip install reportlab==4.0.7
pip install Pillow==10.0.0
```

Ou en une seule commande :
```powershell
pip install Flask==2.3.3 Werkzeug==2.3.7 qrcode==7.4.2 reportlab==4.0.7 Pillow==10.0.0
```

### Vérifier que tout est bien installé

Après l'installation, vous pouvez vérifier :
```powershell
pip list
```

Vous devez voir tous les packages avec leur version.

---

## Comptes de test

Deux comptes de démonstration sont créés automatiquement :

Utilisateur standard :
- Email : test@cinema.com
- Mot de passe : test1234

Administrateur :
- Email : admin@cinema.com
- Mot de passe : admin1234

---

## Démarrage du serveur

Première utilisation :

```powershell
.\setup.bat setup
.\setup.bat run
```

Utilisation suivante :

```powershell
.\setup.bat run
```

Pour arrêter le serveur : Appuyez sur `Ctrl + C`

---

## Dépannage

### Erreur : Python n'est pas reconnu

Solution :
- Réinstallez Python depuis https://www.python.org/downloads/
- IMPORTANT : Cochez "Add Python to PATH"
- Redémarrez PowerShell

### Erreur : Cannot be loaded because running scripts is disabled

Solution :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Erreur : Flask not found

Solution :

```powershell
.\venv\Scripts\Activate.ps1
pip install flask
```

### Erreur : Port 5000 already in use

Trouvez et arrêtez le processus :

```powershell
netstat -ano | findstr :5000
taskkill /PID <numero_affiche> /F
```

### Impossible de créer venv

Solution :

```powershell
python -m pip install --upgrade pip
python -m venv venv
```

### Erreur lors de l'installation des dépendances

Solution :

```powershell
pip install --upgrade pip setuptools
pip install -r backend/requirements.txt
```

---

## Astuces utiles

Vérifier que tout fonctionne :

```powershell
.\venv\Scripts\Activate.ps1
pip list
```

Réinitialiser la base de données :

Supprimez le fichier `backend/cinema.db` et relancez l'application.

---

## Structure du projet

```
informatique/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── cinema.db
├── frontend/
│   ├── templates/
│   │   └── index.html
│   └── static/
│       ├── app.js
│       └── style.css
├── setup.bat
└── requirements.txt
```

---

## Checklist de démarrage

- Python 3.8+ installé
- PowerShell autorisant l'exécution de scripts
- Environnement virtuel créé (venv/)
- Dépendances installées
- Serveur lancé (.\setup.bat run)
- Navigateur accessible à http://localhost:5000
- Connexion avec test@cinema.com / test1234 réussie

---

**Dernière mise à jour** : 19 décembre 2025
