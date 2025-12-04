# 👨‍💻 CinéMax - Guide de développement

Guide pour les développeurs qui veulent contribuer ou modifier le projet.

---

## 📋 Table des matières

- [Arborescence du projet](#arborescence-du-projet)
- [Architecture](#architecture)
- [Modification du code](#modification-du-code)
- [Ajouter une nouvelle fonctionnalité](#ajouter-une-nouvelle-fonctionnalité)
- [Tester les modifications](#tester-les-modifications)
- [Base de données](#base-de-données)
- [Bonnes pratiques](#bonnes-pratiques)

---

## 📁 Arborescence du projet

```
Informatique/
│
├── backend/
│   ├── app.py                 # 🔴 Point d'entrée principal - Flask
│   ├── cinema.db              # 💾 Base de données SQLite
│   ├── requirements.txt        # 📦 Dépendances Python
│   └── __pycache__/
│
├── frontend/
│   ├── templates/
│   │   └── index.html         # 🟢 Page HTML principale (Jinja2)
│   │
│   └── static/
│       ├── app.js             # 🟡 Logique JavaScript
│       └── style.css          # 🔵 Styles CSS
│
├── venv/                       # 🔧 Environnement virtuel Python
│
├── run.bat & run.sh           # 🚀 Scripts de lancement
├── README.md                  # 📚 Documentation principale
├── DEVELOPPEMENT.md           # 📖 Ce fichier
│
└── .gitignore                 # ⚙️ Fichiers à ignorer
```

---

## 🏗️ Architecture

### Backend (Python/Flask)

**Fichier principal :** `backend/app.py`

```
Flask App
├── Routes (GET/POST)
│   ├── / (Page accueil)
│   ├── /api/login (Authentification)
│   ├── /api/register (Inscription)
│   ├── /api/booking (Réservation)
│   └── /api/my-bookings (Historique)
│
├── Base de données (SQLite)
│   ├── Table users
│   └── Table reservations
│
└── Configuration
    └── Port 5000
```

### Frontend (HTML/CSS/JavaScript)

**Fichier principal :** `frontend/templates/index.html`

```
HTML Page
├── Navigation (navbar)
├── Hero Section
├── Date Selection (Calendrier)
├── Movies Grid
├── Prices Table
└── Footer

Stylisation : style.css
Logique : app.js
```

---

## 🔧 Modification du code

### Ajouter une nouvelle route Flask

**Fichier :** `backend/app.py`

```python
@app.route("/api/ma-nouvelle-route", methods=["GET", "POST"])
def ma_nouvelle_route():
    if request.method == "POST":
        data = request.get_json()
        # Votre logique ici
        return jsonify({"success": True})

    return jsonify({"success": False, "error": "Method not allowed"}), 405
```

### Modifier le CSS

**Fichier :** `frontend/static/style.css`

```css
/* Ajouter une nouvelle classe */
.ma-nouvelle-classe {
    background: linear-gradient(135deg, #ff8c42 0%, #ffb347 100%);
    padding: 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.ma-nouvelle-classe:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}
```

### Modifier le JavaScript

**Fichier :** `frontend/static/app.js`

```javascript
// Ajouter une nouvelle fonction
function maNouvelleFonction() {
    console.log("Ma nouvelle fonction");
    // Votre logique ici
}

// Ajouter un event listener
document.getElementById("mon-element").addEventListener("click", function() {
    maNouvelleFonction();
});
```

---

## 🆕 Ajouter une nouvelle fonctionnalité

### Exemple : Ajouter une système de commentaires

#### 1️⃣ Créer la table en base de données

**Fichier :** `backend/app.py` (dans la fonction `init_db()`)

```python
cursor.execute('''
    CREATE TABLE comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        booking_id INTEGER NOT NULL,
        text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(booking_id) REFERENCES reservations(id)
    )
''')
```

#### 2️⃣ Créer une route API

```python
@app.route("/api/comment", methods=["POST"])
def add_comment():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    data = request.get_json()
    user_id = session["user_id"]
    booking_id = data.get("booking_id")
    text = data.get("text")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO comments (user_id, booking_id, text) VALUES (?, ?, ?)",
        (user_id, booking_id, text)
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True})
```

#### 3️⃣ Ajouter du HTML

```html
<form id="comment-form">
    <textarea id="comment-text" placeholder="Votre commentaire..."></textarea>
    <button type="submit">Envoyer</button>
</form>
```

#### 4️⃣ Ajouter du JavaScript

```javascript
document.getElementById("comment-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("comment-text").value;

    const response = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: 1, text: text })
    });

    const data = await response.json();
    if (data.success) {
        console.log("Commentaire ajouté !");
    }
});
```

---

## 🧪 Tester les modifications

### 1. Tester en local

```bash
# Activer l'environnement virtuel
source venv/bin/activate  # macOS/Linux
# ou
.\venv\Scripts\Activate.ps1  # Windows

# Lancer le serveur
python backend/app.py

# Ouvrir http://localhost:5000
```

### 2. Tester les API avec curl

```bash
# Teste l'authentification
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@cinema.com","password":"test1234"}'

# Teste une réservation
curl -X POST http://localhost:5000/api/booking \
  -H "Content-Type: application/json" \
  -d '{"film_title":"Inside Out 2","film_date":"2024-12-05","film_time":"14:00","seats":2}'
```

### 3. Tester avec Postman

1. Téléchargez Postman
2. Créez une collection pour CinéMax
3. Testez chaque endpoint

---

## 💾 Base de données

### Accéder à la base de données

```bash
# Ouvrir la console SQLite
sqlite3 backend/cinema.db

# Voir toutes les tables
.tables

# Voir la structure d'une table
.schema users

# Afficher tous les utilisateurs
SELECT * FROM users;

# Afficher toutes les réservations
SELECT * FROM reservations;

# Quitter
.quit
```

### Réinitialiser la base de données

```bash
# Supprimer la base de données
rm backend/cinema.db  # macOS/Linux
# ou
del backend\cinema.db  # Windows CMD

# Relancer l'application
python backend/app.py
```

---

## 📝 Bonnes pratiques

### Code Python

```python
# ✅ BON
def create_booking(film_title, seats):
    """Crée une nouvelle réservation."""
    total_price = PRICES["adult"] * seats
    return jsonify({"success": True, "total_price": total_price})

# ❌ MAUVAIS
def cb(ft,s):
    return jsonify({"success":True,"total_price":PRICES["adult"]*s})
```

### Code JavaScript

```javascript
// ✅ BON
function updateSelectedDate() {
    const dateObj = new Date(selectedDate);
    selectedDateDisplay.textContent = dateObj.toLocaleDateString('fr-FR');
}

// ❌ MAUVAIS
function upd() {
    document.getElementById("selected-date-display").textContent = new Date().toLocaleDateString();
}
```

### Code CSS

```css
/* ✅ BON */
.movie-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    padding: 20px;
    border-radius: 8px;
    transition: all 0.3s ease;
}

/* ❌ MAUVAIS */
.mc {
    background: #5a1a1a;
    border: 1px solid #8b3a3a;
    padding: 20px;
}
```

---

## 🔐 Sécurité

### Points importants

✅ **Toujours valider les entrées utilisateur**
```python
if not email or "@" not in email:
    return jsonify({"error": "Email invalide"}), 400
```

✅ **Utiliser des sessions Flask**
```python
session["user_id"] = user_id
```

✅ **Hacher les mots de passe**
```python
hashed_password = generate_password_hash(password)
```

✅ **Utiliser les requêtes préparées SQLite**
```python
cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
```

❌ **Ne pas concaténer les requêtes SQL**
```python
# DANGER !
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")
```

---

## 📦 Ajouter une dépendance

```bash
# Installer un package
pip install nom-du-package

# Sauvegarder dans requirements.txt
pip freeze > backend/requirements.txt
```

---

## 🐛 Déboguer

### Activer le mode debug (déjà activé)

```python
# Dans backend/app.py
if __name__ == "__main__":
    app.run(debug=True)  # Mode debug activé
```

### Ajouter des logs

```python
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

logger.debug("Message de debug")
logger.info("Information")
logger.error("Erreur")
```

### Utiliser la console du navigateur

```javascript
console.log("Mon message de debug");
console.error("Erreur détectée");
```

---

## 📚 Structure des fichiers modifiés

Quand vous modifiez du code, documentez vos changements :

```
📝 CHANGELOG.md (à créer si nécessaire)

## [1.1.0] - 2024-12-04
### Ajouté
- Nouveau système de commentaires
- Pagination des films

### Modifié
- Amélioration du calendrier
- Optimisation du CSS

### Supprimé
- Ancienne page de tarifs
```

---

## 🎯 Workflow recommandé

1. **Créer une branche Git**
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```

2. **Développer et tester**
   ```bash
   # Modifier les fichiers
   # Tester en local
   ```

3. **Valider les changements**
   ```bash
   git add .
   git commit -m "Ajouter ma nouvelle fonctionnalité"
   ```

4. **Merger vers main**
   ```bash
   git checkout main
   git merge feature/ma-nouvelle-fonctionnalite
   ```

---

## 🚀 Déploiement en production

### Points importants

1. **Désactiver le debug**
   ```python
   app.run(debug=False)
   ```

2. **Utiliser un serveur WSGI**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 backend.app:app
   ```

3. **Utiliser HTTPS**
   - Installer un certificat SSL
   - Rediriger HTTP vers HTTPS

4. **Sauvegarder la base de données**
   ```bash
   # Backups réguliers
   cp backend/cinema.db backend/cinema.db.backup
   ```

---

## 📞 Questions ?

Consultez :
- `README.md` - Documentation complète
- `INSTALLATION_*.md` - Guides d'installation
- Le code source commenté

---

**Dernière mise à jour :** Décembre 2024

**Bon développement ! 🚀**
