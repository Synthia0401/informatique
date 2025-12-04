# CinéMax - Plateforme de Réservation de Cinéma 🎬

Une application web moderne pour réserver des places de cinéma avec authentification utilisateur, gestion de réservations et une interface intuitive.

## 📋 Table des matières
- [Caractéristiques](#caractéristiques)
- [Prérequis](#prérequis)
- [Installation rapide](#installation-rapide)
- [Lancement du projet](#lancement-du-projet)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Dépannage](#dépannage)

---

## ✨ Caractéristiques

✅ **Authentification utilisateur** - Inscription et connexion sécurisées
✅ **Gestion des réservations** - Réserver des places pour les films
✅ **Calendrier interactif** - Sélection de dates avec popup modal
✅ **Base de données SQLite** - Persistance des données utilisateurs et réservations
✅ **Interface responsive** - Design moderne et mobile-friendly
✅ **10 films disponibles** - Avec descriptions, horaires et bandes-annonces
✅ **Historique des réservations** - Consulter vos réservations passées

---

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Python 3.8 ou supérieur** ([Télécharger ici](https://www.python.org/downloads/))
  - ✅ Cochez "Add Python to PATH" pendant l'installation
- **Git** (optionnel, pour cloner le projet) ([Télécharger ici](https://git-scm.com/))

### Vérifier votre installation Python

Ouvrez un terminal PowerShell et tapez :

```powershell
python --version
```

Vous devriez voir `Python 3.x.x` (version 3.8 ou supérieure).

---

## 📦 Installation rapide

### Méthode 1 : Script automatique (Windows) - **RECOMMANDÉ** ⭐

1. **Téléchargez le dossier du projet**
2. **Double-cliquez sur `run.bat`** (situé à la racine du projet)
3. **Le script va automatiquement :**
   - Créer un environnement virtuel Python
   - Installer les dépendances requises
   - Lancer le serveur Flask
   - Ouvrir le navigateur à `http://localhost:5000`

Le script `run.bat` fera tout automatiquement ! ✨

---

### Méthode 2 : Installation manuelle (Windows PowerShell ou CMD)

#### Étape 1 : Ouvrir le terminal
- Appuyez sur `Win + R`
- Tapez `powershell` ou `cmd`
- Naviguez vers le dossier du projet :
  ```powershell
  cd "C:\path\to\Informatique"
  ```

#### Étape 2 : Créer un environnement virtuel
```powershell
python -m venv venv
```

#### Étape 3 : Activer l'environnement virtuel

**Sur PowerShell :**
```powershell
.\venv\Scripts\Activate.ps1
```

⚠️ **Si vous obtenez une erreur "cannot be loaded"**, exécutez ceci une seule fois :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Sur Command Prompt (CMD) :**
```cmd
venv\Scripts\activate.bat
```

#### Étape 4 : Installer les dépendances
```powershell
pip install -r backend/requirements.txt
```

#### Étape 5 : Lancer le serveur
```powershell
python backend/app.py
```

Vous devriez voir :
```
 * Running on http://127.0.0.1:5000
```

#### Étape 6 : Accéder à l'application
Ouvrez votre navigateur et allez à : **http://localhost:5000**

---

### Méthode 3 : Installation manuelle (macOS / Linux)

#### Étape 1 : Ouvrir le terminal
```bash
cd /path/to/Informatique
```

#### Étape 2 : Créer un environnement virtuel
```bash
python3 -m venv venv
```

#### Étape 3 : Activer l'environnement virtuel
```bash
source venv/bin/activate
```

#### Étape 4 : Installer les dépendances
```bash
pip install -r backend/requirements.txt
```

#### Étape 5 : Lancer le serveur
```bash
python backend/app.py
```

#### Étape 6 : Accéder à l'application
Ouvrez votre navigateur et allez à : **http://localhost:5000**

---

## 🚀 Lancement du projet

### Mode rapide (après première installation)

**Windows PowerShell :**
```powershell
.\venv\Scripts\Activate.ps1
python backend/app.py
```

**Windows CMD :**
```cmd
venv\Scripts\activate.bat
python backend/app.py
```

**macOS / Linux :**
```bash
source venv/bin/activate
python backend/app.py
```

### Arrêter le serveur
Appuyez sur `Ctrl + C` dans le terminal

---

## 💻 Utilisation

### Compte de test
Un compte de démonstration est déjà créé :
- **Email :** `test@cinema.com`
- **Mot de passe :** `test1234`

### Fonctionnalités principales

#### 1️⃣ **Parcourir les films**
- Voir la liste de 10 films disponibles
- Lire les descriptions, horaires et informations
- Accéder aux bandes-annonces

#### 2️⃣ **Créer un compte**
- Cliquez sur l'icône 👤 en haut à droite
- Remplissez le formulaire d'inscription
- Vos données sont sauvegardées dans la base de données

#### 3️⃣ **Sélectionner une date**
- Utilisez les boutons "Aujourd'hui" ou "Demain" pour sélection rapide
- Cliquez sur l'icône 📅 pour ouvrir le calendrier complet
- Naviguez entre les mois et sélectionnez votre date

#### 4️⃣ **Réserver une place**
- Cliquez sur un horaire de film
- Sélectionnez le nombre de places (1-6)
- Confirmez votre réservation
- Une notification de confirmation s'affiche

#### 5️⃣ **Voir vos réservations**
- Cliquez sur "Mes réservations" dans le menu compte
- Consultez l'historique de toutes vos réservations

#### 6️⃣ **Se déconnecter**
- Cliquez sur "Déconnexion" pour terminer votre session

---

## 📁 Structure du projet

```
Informatique/
├── backend/
│   ├── app.py                 # Serveur Flask (point d'entrée principal)
│   ├── cinema.db              # Base de données SQLite
│   ├── requirements.txt        # Dépendances Python
│   └── __pycache__/          # Fichiers de cache Python
│
├── frontend/
│   ├── static/
│   │   ├── app.js             # Logique JavaScript (calendrier, modales, API)
│   │   └── style.css          # Feuille de styles CSS
│   │
│   └── templates/
│       └── index.html         # Modèle HTML principal
│
├── venv/                       # Environnement virtuel Python (créé après installation)
├── run.bat                     # Script de lancement automatique (Windows)
├── run.sh                      # Script de lancement automatique (macOS/Linux)
└── README.md                   # Ce fichier
```

---

## 🛠️ Technologies utilisées

### **Backend**
- **Python 3.8+** - Langage de programmation
- **Flask** - Framework web Python
- **SQLite** - Base de données
- **werkzeug** - Gestion des mots de passe hachés

### **Frontend**
- **HTML5** - Structure
- **CSS3** - Styles avec gradients et animations
- **JavaScript (Vanilla)** - Logique interactive
- **Jinja2** - Templating côté serveur

### **Design**
- **Responsive Design** - Mobile-first approach
- **Animations CSS** - Transitions fluides
- **Flexbox/Grid** - Mise en page moderne
- **Fonts Google** - Poppins et Playfair Display

---

## ⚙️ Fonctionnalités détaillées

### **Authentification**
- ✅ Inscription avec validation des champs
- ✅ Connexion avec session sécurisée
- ✅ Hachage des mots de passe avec werkzeug
- ✅ Persistance des données utilisateur

### **Gestion des réservations**
- ✅ Création de réservations
- ✅ Stockage en base de données
- ✅ Calcul automatique du prix (9€ par adulte)
- ✅ Historique des réservations consultable

### **Calendrier**
- ✅ Sélection rapide (Aujourd'hui, Demain)
- ✅ Popup modal pour sélection de dates avancée
- ✅ Navigation entre mois/années
- ✅ Désactivation des dates passées
- ✅ Affichage du jour actuel surligné

### **Interface utilisateur**
- ✅ Menu de compte avec dropdown
- ✅ Recherche de films en temps réel
- ✅ Modales interactives
- ✅ Notifications de confirmation
- ✅ Design responsive (mobile, tablet, desktop)

---

## 🎥 Films disponibles

1. **Inside Out 2** - Kelsey Mann
2. **Moana 2** - David Derrick Jr., Jason Hand, Dana Ledoux Miller
3. **Despicable Me 4** - Chris Renaud
4. **Deadpool & Wolverine** - Shawn Levy
5. **Dune: Part Two** - Denis Villeneuve
6. **Wicked** - Jon M. Chu
7. **Twisters** - Lee Isaac Chung
8. **Furiosa: A Mad Max Saga** - George Miller
9. **Godzilla x Kong: The New Empire** - Adam Wingard
10. **Kung Fu Panda 4** - Mike Mitchell

---

## 💾 Base de données

### **Tables créées automatiquement**

#### Table `users`
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (hashé)
- nom
- prenom
- sexe
- ville
- habitation
- created_at (timestamp)
```

#### Table `reservations`
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- film_title
- film_date
- film_time
- seats
- total_price
- created_at (timestamp)
```

La base de données se crée automatiquement au premier lancement ! 🔄

---

## 🐛 Dépannage

### ❌ **Erreur : "Python n'est pas reconnu"**
**Solution :** Python n'est pas dans le PATH
1. Réinstallez Python
2. ✅ Cochez "Add Python to PATH"
3. Redémarrez votre terminal

### ❌ **Erreur : "Module Flask non trouvé"**
**Solution :** Assurez-vous que l'environnement virtuel est activé
```powershell
.\venv\Scripts\Activate.ps1
pip install flask
```

### ❌ **Erreur : "Le port 5000 est déjà utilisé"**
**Solution :** Un autre processus utilise le port
```powershell
# Trouver le processus qui utilise le port 5000
netstat -ano | findstr :5000
# Terminer le processus (remplacer PID par le numéro affiché)
taskkill /PID <PID> /F
```

### ❌ **PowerShell : "Cannot be loaded because running scripts is disabled"**
**Solution :** Exécutez une seule fois :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ❌ **Le navigateur ne s'ouvre pas automatiquement**
**Solution :** Ouvrez manuellement `http://localhost:5000`

### ❌ **Les styles CSS ne s'affichent pas**
**Solution :** Videz le cache du navigateur (Ctrl + Maj + Suppr) et rechargez

### ❌ **Les données de réservation ne sont pas sauvegardées**
**Solution :** Vérifiez que `cinema.db` existe dans le dossier `backend/`
```powershell
ls backend/cinema.db
```

---

## 📝 Variables d'environnement (optionnel)

Pour la production, créez un fichier `.env` :

```env
FLASK_ENV=development
FLASK_SECRET_KEY=votre_clé_secrète_ici
DATABASE_PATH=backend/cinema.db
```

---

## 🔒 Sécurité

- ✅ Mots de passe hachés avec werkzeug
- ✅ Sessions Flask avec clé secrète
- ✅ Protection contre l'injection SQL (requêtes préparées)
- ⚠️ Mode debug activé (à désactiver en production)

---

## 🚀 Déploiement en production

Pour déployer en production :

1. Changez `debug=False` dans `backend/app.py`
2. Utilisez un serveur WSGI (Gunicorn)
3. Utilisez un reverse proxy (Nginx)
4. Activez HTTPS

---

## 📞 Support

En cas de problème :
1. Vérifiez que Python 3.8+ est installé
2. Vérifiez que l'environnement virtuel est activé
3. Vérifiez que Flask est installé : `pip list`
4. Consultez les logs dans le terminal

---

## 📄 Licence

Ce projet est à usage personnel/éducatif.

---

## 👨‍💻 Auteur

Créé avec ❤️ pour le projet CinéMax

**Dernière mise à jour :** Décembre 2024
