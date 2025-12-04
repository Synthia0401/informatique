# 🎬 CinéMax - Guide d'Installation Windows

Guide détaillé pour installer et lancer CinéMax sur Windows.

---

## ⚡ Installation rapide (RECOMMANDÉ)

### Option 1 : Double-cliquez sur `run.bat` ✨

C'est la méthode la plus facile ! Le script fait tout automatiquement :

1. **Localisez** `run.bat` à la racine du projet
2. **Double-cliquez** sur le fichier
3. **Attendez** que les dépendances s'installent
4. **Voilà !** Le navigateur s'ouvrira automatiquement à `http://localhost:5000`

Le serveur restera actif tant que vous ne fermerez pas la fenêtre.

---

## 📝 Installation manuelle (PowerShell)

### Étape 1 : Ouvrir PowerShell

**Méthode 1 :**
- Appuyez sur `Win + R`
- Tapez `powershell`
- Appuyez sur `Entrée`

**Méthode 2 :**
- Faites `Clic droit` dans le dossier du projet
- Sélectionnez "Open PowerShell window here"

### Étape 2 : Vérifier Python

Tapez :
```powershell
python --version
```

Vous devez voir `Python 3.x.x` (3.8 minimum).

Si vous voyez une erreur `python: The term 'python' is not recognized`, réinstallez Python en cochant **"Add Python to PATH"**.

### Étape 3 : Configurer l'exécution des scripts

⚠️ **Une seule fois :** Si vous obtenez l'erreur "cannot be loaded because running scripts is disabled", exécutez :

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Tapez `Y` et appuyez sur `Entrée`.

### Étape 4 : Créer l'environnement virtuel

```powershell
python -m venv venv
```

Cela crée un dossier `venv/` (quelques secondes).

### Étape 5 : Activer l'environnement virtuel

```powershell
.\venv\Scripts\Activate.ps1
```

Vous devriez voir `(venv)` au début de chaque ligne du terminal.

### Étape 6 : Installer les dépendances

```powershell
pip install -r backend/requirements.txt
```

Les dépendances s'installent (cela peut prendre 1-2 minutes).

### Étape 7 : Lancer le serveur

```powershell
python backend/app.py
```

Vous devez voir :
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### Étape 8 : Ouvrir dans le navigateur

Ouvrez votre navigateur et allez à : **http://localhost:5000**

---

## 📱 Installation manuelle (Command Prompt)

La procédure est identique à PowerShell, sauf :

### Activation de l'environnement virtuel (CMD) :
```cmd
venv\Scripts\activate.bat
```

Le reste est identique.

---

## 🚀 Relancer après fermeture

Après la première installation, pour relancer :

**PowerShell :**
```powershell
.\venv\Scripts\Activate.ps1
python backend/app.py
```

**Command Prompt :**
```cmd
venv\Scripts\activate.bat
python backend/app.py
```

---

## 🐛 Dépannage

### ❌ Erreur : "Python n'est pas reconnu"

**Solution :**
1. Réinstallez Python depuis [python.org](https://www.python.org/downloads/)
2. **IMPORTANT** : Cochez **"Add Python to PATH"** lors de l'installation
3. Redémarrez PowerShell

### ❌ Erreur : "Cannot be loaded because running scripts is disabled"

**Solution :**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ Erreur : "Flask not found"

**Solution :**
Vérifiez que l'environnement virtuel est activé (vous devez voir `(venv)` au début de chaque ligne).

Si ce n'est pas le cas :
```powershell
.\venv\Scripts\Activate.ps1
pip install flask
```

### ❌ Erreur : "Port 5000 already in use"

**Solution :**
Un autre processus utilise le port 5000. Tuez-le :

```powershell
# Trouver le processus
netstat -ano | findstr :5000

# Terminer le processus (remplacer PID)
taskkill /PID <numero_affiche> /F
```

### ❌ Impossible de créer venv

**Solution :**
```powershell
python -m pip install --upgrade pip
python -m venv venv
```

---

## 💡 Astuces

### Créer un raccourci pour démarrer plus vite

1. **Clic droit** sur `run.bat`
2. Sélectionnez "Send to" → "Desktop (create shortcut)"
3. Maintenant double-cliquez sur le raccourci pour lancer !

### Arrêter le serveur proprement

Appuyez sur `Ctrl + C` dans le terminal.

### Vérifier que tout fonctionne

```powershell
.\venv\Scripts\Activate.ps1
pip list
```

Vous devez voir `Flask` dans la liste.

---

## 📞 Besoin d'aide supplémentaire ?

Consultez le fichier `README.md` principal pour :
- La structure du projet
- Les technologies utilisées
- La documentation complète
- Plus de solutions de dépannage

---

**Dernière mise à jour :** Décembre 2024
