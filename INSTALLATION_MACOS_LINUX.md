# 🎬 CinéMax - Guide d'Installation macOS / Linux

Guide détaillé pour installer et lancer CinéMax sur macOS ou Linux.

---

## ⚡ Installation rapide (RECOMMANDÉ)

### Exécutez le script automatique

1. **Ouvrez le Terminal**
   - macOS : `Cmd + Espace` → tapez `terminal`
   - Linux : Ouvrez votre terminal

2. **Naviguez vers le projet**
   ```bash
   cd /path/to/Informatique
   ```

3. **Rendez le script exécutable**
   ```bash
   chmod +x run.sh
   ```

4. **Exécutez le script**
   ```bash
   ./run.sh
   ```

5. **Attendez** que les dépendances s'installent et que le serveur démarre

Le serveur restera actif jusqu'à ce que vous fermiez le terminal.

---

## 📝 Installation manuelle

### Étape 1 : Ouvrir le Terminal

**macOS :**
- Appuyez sur `Cmd + Espace`
- Tapez `terminal`
- Appuyez sur `Entrée`

**Linux :**
- Utilisez `Ctrl + Alt + T` (Ubuntu/Debian)
- Ou ouvrez le menu des applications → Terminal

### Étape 2 : Vérifier Python

```bash
python3 --version
```

Vous devez voir `Python 3.x.x` (3.8 minimum).

Si Python n'est pas installé :

**macOS (Homebrew) :**
```bash
brew install python3
```

**Linux (Ubuntu/Debian) :**
```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip
```

### Étape 3 : Naviguer vers le projet

```bash
cd /path/to/Informatique
```

Remplacez `/path/to/Informatique` par le chemin réel de votre projet.

### Étape 4 : Créer l'environnement virtuel

```bash
python3 -m venv venv
```

Cela crée un dossier `venv/` (quelques secondes).

### Étape 5 : Activer l'environnement virtuel

```bash
source venv/bin/activate
```

Vous devriez voir `(venv)` au début de chaque ligne du terminal.

### Étape 6 : Installer les dépendances

```bash
pip install -r backend/requirements.txt
```

Les dépendances s'installent (cela peut prendre 1-2 minutes).

### Étape 7 : Lancer le serveur

```bash
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

## 🚀 Relancer après fermeture

Après la première installation, pour relancer le serveur :

```bash
source venv/bin/activate
python backend/app.py
```

Pour une utilisation plus rapide, vous pouvez ajouter un alias à votre `.bashrc` ou `.zshrc` :

```bash
echo "alias cinemax='cd /path/to/Informatique && source venv/bin/activate && python backend/app.py'" >> ~/.bashrc
source ~/.bashrc
```

Ensuite, tapez simplement `cinemax` pour lancer le serveur !

---

## 🐛 Dépannage

### ❌ Erreur : "python3: command not found"

**Solution :**

**macOS :**
```bash
brew install python3
```

**Linux (Ubuntu/Debian) :**
```bash
sudo apt install python3
```

**Linux (Fedora/RHEL) :**
```bash
sudo dnf install python3
```

### ❌ Erreur : "No module named venv"

**Solution :**

**Ubuntu/Debian :**
```bash
sudo apt install python3-venv
```

**Fedora/RHEL :**
```bash
sudo dnf install python3-venv
```

### ❌ Erreur : "Flask not found"

**Solution :**
Vérifiez que l'environnement virtuel est activé (vous devez voir `(venv)` au début de chaque ligne).

Si ce n'est pas le cas :
```bash
source venv/bin/activate
pip install flask
```

### ❌ Erreur : "Port 5000 already in use"

**Solution :**
Un autre processus utilise le port 5000. Terminez-le :

```bash
# Trouver le processus qui utilise le port 5000
lsof -i :5000

# Terminer le processus (remplacer PID)
kill -9 <PID>
```

### ❌ Erreur de permission sur run.sh

**Solution :**
```bash
chmod +x run.sh
```

---

## 💡 Astuces

### Utiliser le script run.sh régulièrement

Rendre le script permanent :
```bash
chmod +x run.sh
./run.sh
```

### Créer un alias de commande

Ajoutez à votre `.bashrc` (ou `.zshrc` sur macOS) :

```bash
alias start-cinemax='cd ~/Informatique && ./run.sh'
```

Rechargez ensuite :
```bash
source ~/.bashrc
```

Maintenant tapez `start-cinemax` pour lancer !

### Vérifier que tout fonctionne

```bash
source venv/bin/activate
pip list
```

Vous devez voir `Flask` dans la liste.

### Arrêter le serveur proprement

Appuyez sur `Ctrl + C` dans le terminal.

---

## 📦 Installation des dépendances individuellement

Si `pip install -r backend/requirements.txt` ne fonctionne pas :

```bash
pip install flask
pip install werkzeug
```

---

## 🎯 Structure des fichiers attendue

Après l'installation, vous devez avoir :

```
Informatique/
├── venv/                    # ✅ Créé après `python3 -m venv venv`
├── backend/
│   ├── app.py
│   ├── cinema.db
│   └── requirements.txt
├── frontend/
│   ├── static/
│   │   ├── app.js
│   │   └── style.css
│   └── templates/
│       └── index.html
├── run.sh                   # ✅ Script de lancement
├── README.md
└── INSTALLATION_MACOS_LINUX.md
```

---

## 📞 Besoin d'aide supplémentaire ?

Consultez le fichier `README.md` principal pour :
- La structure complète du projet
- Les technologies utilisées
- La documentation complète
- Plus de solutions de dépannage

---

**Dernière mise à jour :** Décembre 2024
