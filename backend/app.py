from flask import Flask, render_template, url_for, request, jsonify, session
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import json

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)

app.secret_key = "votre_clé_secrète_cinema_2024"  # À changer en production
DB_PATH = os.path.join(os.path.dirname(__file__), "cinema.db")

# Initialiser la base de données
def init_db():
    if not os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Table utilisateurs
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                nom TEXT NOT NULL,
                prenom TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Table réservations
        cursor.execute('''
            CREATE TABLE reservations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                film_title TEXT NOT NULL,
                film_date TEXT NOT NULL,
                film_time TEXT NOT NULL,
                seats INTEGER NOT NULL,
                total_price REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        ''')

        conn.commit()
        conn.close()

init_db()

# Sample data for the cinema
PRICES = {
    "adult": 9.0,
    "child": 6.0,
    "senior": 7.0,
}

MOVIES = [
    {
        "id": 1,
        "title": "Les Étoiles Oubliées",
        "description": "Un voyage émouvant à travers l'espace et la mémoire.",
        "duration": 125,
        "ratings": "PG-13",
        "showtimes": ["14:00", "17:30", "20:45"],
        "poster": "https://picsum.photos/300/450?random=1",
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
        "id": 2,
        "title": "La Mélodie du Lac",
        "description": "Une histoire d'amitié et de musique dans un village côtier.",
        "duration": 98,
        "ratings": "Tous publics",
        "showtimes": ["13:15", "16:00", "19:00"],
        "poster": "https://picsum.photos/300/450?random=2",
        "color": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
        "id": 3,
        "title": "Course Contre le Temps",
        "description": "Thriller haletant où chaque seconde compte.",
        "duration": 110,
        "ratings": "PG-13",
        "showtimes": ["15:00", "18:30", "22:00"],
        "poster": "https://picsum.photos/300/450?random=3",
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
        "id": 4,
        "title": "Les Enfants du Vent",
        "description": "Portrait d'une famille et des secrets qu'elle garde.",
        "duration": 105,
        "ratings": "Tous publics",
        "showtimes": ["12:45", "15:30", "20:15"],
        "poster": "https://picsum.photos/300/450?random=4",
        "color": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
        "id": 5,
        "title": "Nuit Blanche",
        "description": "Enquête urbaine à couper le souffle.",
        "duration": 118,
        "ratings": "PG-13",
        "showtimes": ["16:00", "19:45", "23:00"],
        "poster": "https://picsum.photos/300/450?random=5",
        "color": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
        "id": 6,
        "title": "La Route des Rêves",
        "description": "Aventure poétique sur fond de road-trip.",
        "duration": 132,
        "ratings": "Tous publics",
        "showtimes": ["11:30", "14:30", "18:00"],
        "poster": "https://picsum.photos/300/450?random=6",
        "color": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
        "id": 7,
        "title": "Opération Minuit",
        "description": "Action non-stop et retournements inattendus.",
        "duration": 107,
        "ratings": "PG-13",
        "showtimes": ["13:00", "17:00", "21:00"],
        "poster": "https://picsum.photos/300/450?random=7",
        "color": "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
    },
    {
        "id": 8,
        "title": "Coeurs en Hiver",
        "description": "Comédie romantique tendre et légère.",
        "duration": 95,
        "ratings": "Tous publics",
        "showtimes": ["12:00", "15:00", "18:30"],
        "poster": "https://picsum.photos/300/450?random=8",
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    {
        "id": 9,
        "title": "Mémoires Perdues",
        "description": "Drame psychologique et quête d'identité.",
        "duration": 140,
        "ratings": "16+",
        "showtimes": ["17:15", "20:30"],
        "poster": "https://picsum.photos/300/450?random=9",
        "color": "linear-gradient(135deg, #2e2e78 0%, #16213e 100%)",
    },
    {
        "id": 10,
        "title": "Rivages lointains",
        "description": "Épopée maritime et destin croisé.",
        "duration": 123,
        "ratings": "Tous publics",
        "showtimes": ["10:45", "14:15", "19:30"],
        "poster": "https://picsum.photos/300/450?random=10",
        "color": "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
    },
]

# Prepare a few dates for which the cinema proposes séances (today + 4 jours)
def get_available_dates(days=5):
    today = datetime.now()
    result = []
    for d in range(days):
        dt = today.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=d)
        result.append({
            "iso": dt.strftime("%Y-%m-%d"),
            "label": dt.strftime("%a %d %b"),
        })
    return result



@app.route("/")
def home():
    return render_template(
        "index.html",
        movies=MOVIES,
        prices=PRICES,
        current_year=datetime.now().year,
        available_dates=get_available_dates(5),
    )


# ========================================
# ROUTES D'AUTHENTIFICATION
# ========================================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    nom = data.get("nom")
    prenom = data.get("prenom")

    if not all([email, password, nom, prenom]):
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        hashed_password = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (email, password, nom, prenom) VALUES (?, ?, ?, ?)",
            (email, hashed_password, nom, prenom)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()

        session["user_id"] = user_id
        session["email"] = email
        session["nom"] = nom
        session["prenom"] = prenom

        return jsonify({
            "success": True,
            "user": {"id": user_id, "email": email, "nom": nom, "prenom": prenom}
        })

    except sqlite3.IntegrityError:
        return jsonify({"success": False, "error": "Cet email existe déjà"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "error": "Email et mot de passe requis"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("SELECT id, password, nom, prenom FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()

        if not user or not check_password_hash(user[1], password):
            return jsonify({"success": False, "error": "Email ou mot de passe incorrect"}), 401

        user_id, _, nom, prenom = user
        session["user_id"] = user_id
        session["email"] = email
        session["nom"] = nom
        session["prenom"] = prenom

        return jsonify({
            "success": True,
            "user": {"id": user_id, "email": email, "nom": nom, "prenom": prenom}
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})


@app.route("/api/user", methods=["GET"])
def get_user():
    if "user_id" not in session:
        return jsonify({"success": False, "user": None}), 401

    return jsonify({
        "success": True,
        "user": {
            "id": session.get("user_id"),
            "email": session.get("email"),
            "nom": session.get("nom"),
            "prenom": session.get("prenom")
        }
    })


@app.route("/api/booking", methods=["POST"])
def create_booking():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    data = request.get_json()
    user_id = session["user_id"]
    film_title = data.get("film_title")
    film_date = data.get("film_date")
    film_time = data.get("film_time")
    seats = data.get("seats", 1)
    total_price = float(PRICES["adult"]) * int(seats)

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO reservations (user_id, film_title, film_date, film_time, seats, total_price) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, film_title, film_date, film_time, seats, total_price)
        )
        conn.commit()
        booking_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "booking": {
                "id": booking_id,
                "film_title": film_title,
                "film_date": film_date,
                "film_time": film_time,
                "seats": seats,
                "total_price": total_price
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/my-bookings", methods=["GET"])
def my_bookings():
    if "user_id" not in session:
        return jsonify({"success": False, "bookings": []}), 401

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id, film_title, film_date, film_time, seats, total_price, created_at FROM reservations WHERE user_id = ? ORDER BY created_at DESC",
            (session["user_id"],)
        )
        bookings = cursor.fetchall()
        conn.close()

        booking_list = [
            {
                "id": b[0],
                "film_title": b[1],
                "film_date": b[2],
                "film_time": b[3],
                "seats": b[4],
                "total_price": b[5],
                "created_at": b[6]
            }
            for b in bookings
        ]

        return jsonify({"success": True, "bookings": booking_list})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
