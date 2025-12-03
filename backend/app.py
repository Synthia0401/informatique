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
                sexe TEXT,
                ville TEXT,
                habitation TEXT,
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

# Create test user account
def create_test_user():
    """Create a test user for demonstration"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if test user already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", ("test@cinema.com",))
        if cursor.fetchone() is None:
            hashed_password = generate_password_hash("test1234")
            cursor.execute(
                "INSERT INTO users (email, password, nom, prenom, sexe, ville, habitation) VALUES (?, ?, ?, ?, ?, ?, ?)",
                ("test@cinema.com", hashed_password, "Test", "User", "M", "Paris", "123 Rue de la Paix")
            )
            conn.commit()
        conn.close()
    except Exception as e:
        pass

create_test_user()

# Sample data for the cinema
PRICES = {
    "adult": 9.0,
    "child": 6.0,
    "senior": 7.0,
}

MOVIES = [
    {
        "id": 1,
        "title": "Inside Out 2",
        "director": "Kelsey Mann",
        "cast": "Amy Poehler, Phyllis Smith, Tony Hale",
        "description": "Riley, maintenant adolescente, voit arriver de nouvelles émotions — un portrait touchant de l'adolescence et de la vie intérieure.",
        "duration": 93,
        "ratings": "Tous publics",
        "showtimes": ["14:00", "17:30", "20:45"],
        "poster": "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/03/inside-out-2-poster-showing-joy-and-the-other-emotions-squished-together.jpeg",
        "trailer": "https://www.youtube.com/watch?v=ttdNckgKcq4",
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
        "id": 2,
        "title": "Moana 2",
        "director": "David Derrick Jr., Jason Hand, Dana Ledoux Miller",
        "cast": "Dwayne Johnson, Auli'i Cravalho, Rachel House",
        "description": "Moana et Maui repartent en mer pour trouver l'île perdue de Motufetu et lever une malédiction pour reconnecter les peuples de l'océan.",
        "duration": 100,
        "ratings": "Tous publics",
        "showtimes": ["13:15", "16:00", "19:00"],
        "poster": "https://pics.filmaffinity.com/moana_2-862180530-large.jpg",
        "trailer": "https://www.youtube.com/watch?v=fCX_cdqkvPI",
        "color": "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
        "id": 3,
        "title": "Despicable Me 4",
        "director": "Chris Renaud",
        "cast": "Steve Carell, Kristen Wiig, Pierre Coffin",
        "description": "Gru et les Minions reviennent pour une nouvelle aventure pleine d'humour, d'action et de chaos.",
        "duration": 94,
        "ratings": "Tous publics",
        "showtimes": ["15:00", "18:30", "22:00"],
        "poster": "https://tse1.mm.bing.net/th/id/OIP.7Gc8gXSWuNcfgVYqrqsocQHaJQ?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
        "trailer": "https://www.youtube.com/watch?v=2i776vPid38",
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
        "id": 4,
        "title": "Deadpool & Wolverine",
        "director": "Shawn Levy",
        "cast": "Ryan Reynolds, Hugh Jackman, Emma Corrin",
        "description": "Deadpool est recruté par la TVA pour sauver le multivers — il fait équipe avec Wolverine pour tenter de sauver leur univers.",
        "duration": 127,
        "ratings": "12+",
        "showtimes": ["12:45", "15:30", "20:15"],
        "poster": "https://image.tmdb.org/t/p/w1280/jbwYaoYWZwxtPP76AZnfYKQjCEB.jpg",
        "trailer": "https://www.youtube.com/watch?v=L7AX0BD-sAU",
        "color": "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
        "id": 5,
        "title": "Dune: Part Two",
        "director": "Denis Villeneuve",
        "cast": "Timothée Chalamet, Zendaya, Rebecca Ferguson",
        "description": "Paul Atreides s'allie aux Fremen pour libérer Arrakis et mener une guerre contre la Maison Harkonnen.",
        "duration": 166,
        "ratings": "12+",
        "showtimes": ["16:00", "19:45", "23:00"],
        "poster": "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=Tc-AM9F0gK8",
        "color": "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
        "id": 6,
        "title": "Wicked",
        "director": "Jon M. Chu",
        "cast": "Cynthia Erivo, Ariana Grande, Jeff Goldblum",
        "description": "Une réimagination de l'univers d'Oz : avant le Magicien d'Oz, l'histoire des sorcières Elphaba et Glinda.",
        "duration": 160,
        "ratings": "Tous publics",
        "showtimes": ["11:30", "14:30", "18:00"],
        "poster": "https://m.media-amazon.com/images/M/MV5BN2Q4Yjk0YTQtZjYyMC00YTczLWFhZDktOWQyYzRlYzgwMWM1XkEyXkFqcGc@._V1_.jpg",
        "trailer": "https://www.youtube.com/watch?v=6Rsg9G-6ZFo",
        "color": "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
    {
        "id": 7,
        "title": "Twisters",
        "director": "Lee Isaac Chung",
        "cast": "Daisy Edgar-Jones, Glen Powell, Anthony Ramos",
        "description": "Un groupe de personnes tente de survivre à une série de tornades dévastatrices — action, survie et chaos climatique.",
        "duration": 123,
        "ratings": "12+",
        "showtimes": ["13:00", "17:00", "21:00"],
        "poster": "https://m.media-amazon.com/images/S/pv-target-images/e52894a5aebb68b977e8d61145e5b555653ef5a6ac8d162a05cc13469b24d8e0.jpg",
        "trailer": "https://www.youtube.com/watch?v=Zcp8L7NBKiI",
        "color": "linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)",
    },
    {
        "id": 8,
        "title": "Furiosa: A Mad Max Saga",
        "director": "George Miller",
        "cast": "Anya Taylor-Joy, Chris Hemsworth, Tom Burke",
        "description": "Préquelle post-apocalyptique de Mad Max: Fury Road — origine de Furiosa, survie, désert, violence.",
        "duration": 148,
        "ratings": "12+",
        "showtimes": ["12:00", "15:00", "18:30"],
        "poster": "https://posterspy.com/wp-content/uploads/2023/12/FURIOSA-a-mad-max-saga.jpg",
        "trailer": "https://www.youtube.com/watch?v=g3tHGZVKE6c",
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    },
    {
        "id": 9,
        "title": "Godzilla x Kong: The New Empire",
        "director": "Adam Wingard",
        "cast": "Rebecca Hall, Brian Tyree Henry, Dan Stevens",
        "description": "Suite du crossover Godzilla/Kong — monstres titanesques, batailles épiques, chaos monumental.",
        "duration": 145,
        "ratings": "12+",
        "showtimes": ["17:15", "20:30"],
        "poster": "https://static1.srcdn.com/wordpress/wp-content/uploads/2024/07/godzilla-x-kong-the-new-empire-film-poster.jpg",
        "trailer": "https://www.youtube.com/watch?v=_NKsmb5R0CU",
        "color": "linear-gradient(135deg, #2e2e78 0%, #16213e 100%)",
    },
    {
        "id": 10,
        "title": "Kung Fu Panda 4",
        "director": "Mike Mitchell",
        "cast": "Jack Black, Furious Five, Ian McShane (voix)",
        "description": "Po, le guerrier-dragon, doit désormais trouver un successeur et guider la Vallée de la Paix — humour, aventure et action.",
        "duration": 94,
        "ratings": "Tous publics",
        "showtimes": ["10:45", "14:15", "19:30"],
        "poster": "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
        "trailer": "https://www.youtube.com/watch?v=lN4gEmC0FUo",
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
    sexe = data.get("sexe")
    ville = data.get("ville")
    habitation = data.get("habitation")

    if not all([email, password, nom, prenom]):
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        hashed_password = generate_password_hash(password)
        cursor.execute(
            "INSERT INTO users (email, password, nom, prenom, sexe, ville, habitation) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (email, hashed_password, nom, prenom, sexe, ville, habitation)
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
