# 📚 CinéMax - Index de la Documentation

Bienvenue ! Voici tous les fichiers de documentation disponibles pour CinéMax.

---

## 🚀 Par où commencer ?

### Je veux démarrer rapidement
→ **Lisez [`QUICK_START.md`](QUICK_START.md)** (1 minute)

### Je suis sous Windows
→ **Double-cliquez sur `run.bat`** (automatique)
→ Ou lisez [`INSTALLATION_WINDOWS.md`](INSTALLATION_WINDOWS.md) pour plus de détails

### Je suis sous macOS / Linux
→ **Exécutez `./run.sh`** (automatique)
→ Ou lisez [`INSTALLATION_MACOS_LINUX.md`](INSTALLATION_MACOS_LINUX.md) pour plus de détails

---

## 📖 Documentation complète

| Fichier | Description | Durée de lecture |
|---------|-------------|------------------|
| **[README.md](README.md)** | Documentation complète du projet | 15 min |
| **[QUICK_START.md](QUICK_START.md)** | Démarrage rapide en 30 secondes | 1 min |
| **[INSTALLATION_WINDOWS.md](INSTALLATION_WINDOWS.md)** | Guide complet pour Windows | 10 min |
| **[INSTALLATION_MACOS_LINUX.md](INSTALLATION_MACOS_LINUX.md)** | Guide complet pour macOS/Linux | 10 min |

---

## 🛠️ Scripts et commandes

| Fichier | Utilité | Plateforme |
|---------|---------|-----------|
| **[run.bat](run.bat)** | Lanceur automatique | Windows |
| **[run.sh](run.sh)** | Lanceur automatique | macOS/Linux |
| **[COMMANDES_WINDOWS.ps1](COMMANDES_WINDOWS.ps1)** | Commandes PowerShell utiles | Windows |
| **[commandes_macos_linux.sh](commandes_macos_linux.sh)** | Commandes Bash utiles | macOS/Linux |

---

## 📁 Structure du projet

```
Informatique/
│
├── 📚 DOCUMENTATION
│   ├── README.md                      # Documentation complète
│   ├── QUICK_START.md                 # Démarrage rapide
│   ├── INSTALLATION_WINDOWS.md        # Guide Windows
│   ├── INSTALLATION_MACOS_LINUX.md   # Guide macOS/Linux
│   ├── COMMANDES_WINDOWS.ps1         # Commandes PowerShell
│   ├── commandes_macos_linux.sh      # Commandes Bash
│   └── INDEX.md                       # Ce fichier
│
├── 🚀 SCRIPTS DE LANCEMENT
│   ├── run.bat                        # Lanceur Windows
│   └── run.sh                         # Lanceur macOS/Linux
│
├── 🎨 FRONTEND
│   └── frontend/
│       ├── templates/
│       │   └── index.html             # Page principale
│       └── static/
│           ├── app.js                 # Logique JavaScript
│           └── style.css              # Styles CSS
│
├── 🔧 BACKEND
│   └── backend/
│       ├── app.py                     # Serveur Flask
│       ├── cinema.db                  # Base de données SQLite
│       └── requirements.txt           # Dépendances Python
│
└── ⚙️ CONFIGURATION
    └── .gitignore                     # Fichiers à ignorer
```

---

## 🎯 Guide de sélection

### Question : Quel système d'exploitation utilisez-vous ?

**Windows 🪟**
1. Double-cliquez sur `run.bat`
2. Ouvrez `http://localhost:5000`
3. C'est tout ! 🎉

**macOS 🍎**
1. Ouvrez le Terminal
2. Exécutez : `cd ~/Informatique && chmod +x run.sh && ./run.sh`
3. Ouvrez `http://localhost:5000`

**Linux 🐧**
1. Ouvrez le Terminal
2. Exécutez : `cd ~/Informatique && chmod +x run.sh && ./run.sh`
3. Ouvrez `http://localhost:5000`

---

## 📖 Choisir la bonne documentation

### Je veux juste démarrer rapidement
→ [`QUICK_START.md`](QUICK_START.md)

### Je rencontre des problèmes avec l'installation
→ [`INSTALLATION_WINDOWS.md`](INSTALLATION_WINDOWS.md) ou [`INSTALLATION_MACOS_LINUX.md`](INSTALLATION_MACOS_LINUX.md)

### Je veux comprendre le projet en détail
→ [`README.md`](README.md)

### Je veux utiliser des commandes PowerShell (Windows)
→ [`COMMANDES_WINDOWS.ps1`](COMMANDES_WINDOWS.ps1)

### Je veux utiliser des commandes Bash (macOS/Linux)
→ [`commandes_macos_linux.sh`](commandes_macos_linux.sh)

---

## ⚡ Démarrage rapide

### Windows
```batch
double-cliquez sur run.bat
```

### macOS / Linux
```bash
./run.sh
```

### Accès à l'application
```
http://localhost:5000
```

### Compte de test
- **Email :** `test@cinema.com`
- **Mot de passe :** `test1234`

---

## 🐛 En cas de problème

1. **Vérifiez que Python est installé** : `python --version` (Windows) ou `python3 --version` (macOS/Linux)
2. **Consultez la section Dépannage** dans [`README.md`](README.md)
3. **Consultez le guide d'installation** correspondant à votre système
4. **Lisez les commandes disponibles** pour diagnostiquer les problèmes

---

## 📞 Informations essentielles

| Information | Détail |
|-------------|--------|
| **Langage principal** | Python + Flask |
| **Base de données** | SQLite |
| **Frontend** | HTML5 + CSS3 + JavaScript |
| **Port** | 5000 (http://localhost:5000) |
| **Python requis** | 3.8 minimum |
| **Dépendances principales** | Flask, werkzeug |

---

## ✅ Checklist de démarrage

- [ ] Python 3.8+ installé
- [ ] Dossier du projet téléchargé
- [ ] Script `run.bat` ou `run.sh` exécuté
- [ ] Serveur Flask lancé (voir "Running on http://...")
- [ ] Navigateur ouvert sur `http://localhost:5000`
- [ ] Page du cinéma visible
- [ ] Compte de test accessible (`test@cinema.com` / `test1234`)

---

## 🔗 Liens utiles

- [Python.org](https://www.python.org) - Télécharger Python
- [Flask Documentation](https://flask.palletsprojects.com/) - Documentation Flask
- [SQLite Documentation](https://www.sqlite.org) - Documentation SQLite
- [GitHub du projet](.) - Repository Git

---

## 💡 Conseils

1. **Lisez d'abord** [`QUICK_START.md`](QUICK_START.md) pour un démarrage rapide
2. **Gardez** [`README.md`](README.md) à portée de main pour les références
3. **Utilisez les scripts** `run.bat` ou `run.sh` pour démarrer facilement
4. **Consultez les commandes** si vous avez besoin de diagnostiquer des problèmes
5. **Signalez les bugs** si vous en découvrez

---

## 🎯 Prochaines étapes

1. Lancez l'application avec le script correspondant à votre système
2. Créez un compte utilisateur
3. Réservez une place de cinéma
4. Explorez toutes les fonctionnalités
5. Consultez le code source si vous êtes curieux !

---

**Dernière mise à jour :** Décembre 2024

**Créé avec ❤️ pour le projet CinéMax**
