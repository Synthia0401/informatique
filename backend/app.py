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
                is_admin INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # Table salles de cinéma
        cursor.execute('''
            CREATE TABLE theatres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                capacity INTEGER NOT NULL,
                rows INTEGER NOT NULL,
                seats_per_row INTEGER NOT NULL
            )
        ''')

        # Table séances (showtimes)
        cursor.execute('''
            CREATE TABLE showtimes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                film_title TEXT NOT NULL,
                film_date TEXT NOT NULL,
                film_time TEXT NOT NULL,
                theatre_id INTEGER NOT NULL,
                available_seats INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(theatre_id) REFERENCES theatres(id),
                UNIQUE(film_date, film_time, theatre_id)
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
                theatre_id INTEGER,
                showtime_id INTEGER,
                seat_categories TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(theatre_id) REFERENCES theatres(id),
                FOREIGN KEY(showtime_id) REFERENCES showtimes(id)
            )
        ''')

        # Table des sièges réservés
        cursor.execute('''
            CREATE TABLE seat_bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reservation_id INTEGER NOT NULL,
                theatre_id INTEGER NOT NULL,
                showtime_id INTEGER NOT NULL,
                row_letter TEXT NOT NULL,
                seat_number INTEGER NOT NULL,
                category TEXT,
                FOREIGN KEY(reservation_id) REFERENCES reservations(id),
                FOREIGN KEY(theatre_id) REFERENCES theatres(id),
                FOREIGN KEY(showtime_id) REFERENCES showtimes(id)
            )
        ''')

        # Table des films
        cursor.execute('''
            CREATE TABLE movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT UNIQUE NOT NULL,
                director TEXT NOT NULL,
                cast TEXT NOT NULL,
                description TEXT NOT NULL,
                duration INTEGER NOT NULL,
                ratings TEXT NOT NULL,
                poster TEXT NOT NULL,
                trailer TEXT,
                color TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        conn.commit()
        conn.close()

init_db()

# Create test user account
def create_test_user():
    """Create a test user and admin user for demonstration"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if test user already exists
        cursor.execute("SELECT id FROM users WHERE email = ?", ("test@cinema.com",))
        if cursor.fetchone() is None:
            hashed_password = generate_password_hash("test1234")
            cursor.execute(
                "INSERT INTO users (email, password, nom, prenom, sexe, ville, habitation, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ("test@cinema.com", hashed_password, "Test", "User", "M", "Paris", "123 Rue de la Paix", 0)
            )
            conn.commit()

        # Create admin user
        cursor.execute("SELECT id FROM users WHERE email = ?", ("admin@cinema.com",))
        if cursor.fetchone() is None:
            hashed_password = generate_password_hash("admin1234")
            cursor.execute(
                "INSERT INTO users (email, password, nom, prenom, sexe, ville, habitation, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                ("admin@cinema.com", hashed_password, "Admin", "User", "M", "Paris", "123 Rue de la Paix", 1)
            )
            conn.commit()

        conn.close()
    except Exception as e:
        pass

create_test_user()

# Initialize movies in database
def init_movies():
    """Initialize movies in the database from MOVIES constant"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if movies table has data
        cursor.execute("SELECT COUNT(*) FROM movies")
        if cursor.fetchone()[0] == 0:
            # Movies will be inserted after MOVIES constant is defined
            pass
        conn.close()
    except Exception as e:
        print(f"Error initializing movies: {e}")

# Create test theatres and showtimes
def create_test_data():
    """Create 10 theatres and populate with showtimes"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if theatres already exist
        cursor.execute("SELECT COUNT(*) FROM theatres")
        if cursor.fetchone()[0] == 0:
            # Create 10 theatres
            for i in range(1, 11):
                cursor.execute(
                    "INSERT INTO theatres (name, capacity, rows, seats_per_row) VALUES (?, ?, ?, ?)",
                    (f"Salle {i}", 96, 8, 12)
                )
            conn.commit()

            # Get theatre IDs
            cursor.execute("SELECT id FROM theatres ORDER BY id")
            theatre_ids = [row[0] for row in cursor.fetchall()]

            # Create showtimes for different movies in different theatres
            from datetime import datetime, timedelta
            today = datetime.now().date()

            movies = [
                "Inside Out 2",
                "Moana 2",
                "Despicable Me 4",
                "Deadpool & Wolverine",
                "Dune: Part Two",
                "Wicked",
                "Twisters",
                "Furiosa: A Mad Max Saga",
                "Godzilla x Kong: The New Empire",
                "Kung Fu Panda 4"
            ]

            showtimes_list = [
                ["14:00", "17:30", "20:45"],
                ["13:15", "16:00", "19:00"],
                ["15:00", "18:30", "22:00"],
                ["12:45", "15:30", "20:15"],
                ["16:00", "19:45", "23:00"],
                ["11:30", "14:30", "18:00"],
                ["13:00", "17:00", "21:00"],
                ["12:00", "15:00", "18:30"],
                ["17:15", "20:30"],
                ["10:45", "14:15", "19:30"]
            ]

            # Assign one movie to each theatre for the next 3 days
            for day_offset in range(3):
                current_date = (today + timedelta(days=day_offset)).isoformat()

                for theatre_idx, movie in enumerate(movies):
                    theatre_id = theatre_ids[theatre_idx]
                    showtimes = showtimes_list[theatre_idx]

                    for showtime in showtimes:
                        # Ensure no duplicate (film_date, film_time, theatre_id)
                        cursor.execute(
                            "INSERT OR IGNORE INTO showtimes (film_title, film_date, film_time, theatre_id, available_seats) VALUES (?, ?, ?, ?, ?)",
                            (movie, current_date, showtime, theatre_id, 96)
                        )

            conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error creating test data: {e}")

create_test_data()

# Sample data for the cinema
PRICES = {
    "adult": 9.0,
    "child": 6.0,
    "senior": 7.0,
    "student": 7.5,
    "disabled": 6.5,
    "unemployed": 6.5,
}

# Movie showtimes by weekday (0=Monday to 6=Sunday)
SHOWTIMES_BY_DAY = {
    "Inside Out 2": {
        0: ["14:00", "17:30", "20:45"],      # Monday
        1: ["14:00", "17:30", "20:45"],      # Tuesday
        2: ["14:00", "17:30", "20:45"],      # Wednesday
        3: ["15:00", "18:00", "21:00"],      # Thursday
        4: ["13:00", "16:00", "19:00", "22:00"],  # Friday
        5: ["10:00", "13:00", "16:00", "19:00", "22:00"],  # Saturday
        6: ["10:00", "13:00", "16:00", "19:00"]   # Sunday
    },
    "Moana 2": {
        0: ["13:15", "16:00", "19:00"],
        1: ["13:15", "16:00", "19:00"],
        2: ["13:15", "16:00", "19:00"],
        3: ["14:00", "17:00", "20:00"],
        4: ["12:00", "15:00", "18:00", "21:00"],
        5: ["09:00", "12:00", "15:00", "18:00", "21:00"],
        6: ["09:00", "12:00", "15:00", "18:00"]
    },
    "Despicable Me 4": {
        0: ["15:00", "18:30", "22:00"],
        1: ["15:00", "18:30", "22:00"],
        2: ["15:00", "18:30", "22:00"],
        3: ["14:30", "17:30", "20:30"],
        4: ["14:00", "17:00", "20:00", "23:00"],
        5: ["10:30", "13:30", "16:30", "19:30", "22:30"],
        6: ["10:30", "13:30", "16:30", "19:30"]
    },
    "Deadpool & Wolverine": {
        0: ["12:45", "15:30", "20:15"],
        1: ["12:45", "15:30", "20:15"],
        2: ["12:45", "15:30", "20:15"],
        3: ["13:30", "16:15", "21:00"],
        4: ["11:30", "14:30", "17:30", "20:30"],
        5: ["11:00", "14:00", "17:00", "20:00", "23:00"],
        6: ["11:00", "14:00", "17:00", "20:00"]
    },
    "Dune: Part Two": {
        0: ["16:00", "19:45", "23:00"],
        1: ["16:00", "19:45", "23:00"],
        2: ["16:00", "19:45", "23:00"],
        3: ["16:30", "20:00"],
        4: ["14:00", "17:30", "21:00"],
        5: ["13:00", "16:30", "20:00", "23:30"],
        6: ["13:00", "16:30", "20:00"]
    },
    "Wicked": {
        0: ["11:30", "14:30", "18:00"],
        1: ["11:30", "14:30", "18:00"],
        2: ["11:30", "14:30", "18:00"],
        3: ["12:00", "15:00", "18:30"],
        4: ["11:00", "14:00", "17:00", "20:00"],
        5: ["10:00", "13:00", "16:00", "19:00", "22:00"],
        6: ["10:00", "13:00", "16:00", "19:00"]
    },
    "Twisters": {
        0: ["13:00", "17:00", "21:00"],
        1: ["13:00", "17:00", "21:00"],
        2: ["13:00", "17:00", "21:00"],
        3: ["13:30", "17:30", "20:30"],
        4: ["12:30", "16:00", "19:30", "23:00"],
        5: ["10:30", "14:00", "17:30", "21:00"],
        6: ["10:30", "14:00", "17:30"]
    },
    "Furiosa: A Mad Max Saga": {
        0: ["12:00", "15:00", "18:30"],
        1: ["12:00", "15:00", "18:30"],
        2: ["12:00", "15:00", "18:30"],
        3: ["12:30", "16:00", "19:30"],
        4: ["11:30", "14:30", "17:30", "20:30"],
        5: ["10:00", "13:00", "16:00", "19:00", "22:00"],
        6: ["10:00", "13:00", "16:00", "19:00"]
    },
    "Godzilla x Kong: The New Empire": {
        0: ["17:15", "20:30"],
        1: ["17:15", "20:30"],
        2: ["17:15", "20:30"],
        3: ["17:00", "20:00"],
        4: ["16:00", "19:00", "22:00"],
        5: ["14:00", "17:00", "20:00", "23:00"],
        6: ["14:00", "17:00", "20:00"]
    },
    "Kung Fu Panda 4": {
        0: ["10:45", "14:15", "19:30"],
        1: ["10:45", "14:15", "19:30"],
        2: ["10:45", "14:15", "19:30"],
        3: ["11:00", "14:30", "18:00"],
        4: ["10:00", "13:30", "17:00", "20:00"],
        5: ["09:00", "12:30", "15:30", "18:30", "21:30"],
        6: ["09:00", "12:30", "15:30", "18:30"]
    }
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

# Insert initial movies into database
def populate_movies_db():
    """Insert MOVIES data into the movies table"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Check if movies table already has data
        cursor.execute("SELECT COUNT(*) FROM movies")
        if cursor.fetchone()[0] == 0:
            for movie in MOVIES:
                cursor.execute(
                    "INSERT OR IGNORE INTO movies (title, director, cast, description, duration, ratings, poster, trailer, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (
                        movie['title'],
                        movie['director'],
                        movie['cast'],
                        movie['description'],
                        movie['duration'],
                        movie['ratings'],
                        movie['poster'],
                        movie.get('trailer'),
                        movie.get('color')
                    )
                )
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"Error populating movies: {e}")

populate_movies_db()

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

# Get showtimes for a movie on a specific date
def get_showtimes_for_date(movie_title, date_str):
    """
    Get showtimes for a specific movie on a specific date.
    date_str format: "YYYY-MM-DD"
    """
    try:
        # Parse the date to get the weekday (0=Monday, 6=Sunday)
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        weekday = date_obj.weekday()

        # Get the showtimes for this movie on this weekday
        if movie_title in SHOWTIMES_BY_DAY:
            showtimes = SHOWTIMES_BY_DAY[movie_title].get(weekday, [])
            return showtimes
        else:
            # Fallback to default showtimes if not found
            for movie in MOVIES:
                if movie['title'] == movie_title:
                    return movie['showtimes']
            return []
    except Exception as e:
        return []


def get_movies_from_db():
    """Fetch all movies from database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute('SELECT id, title, director, "cast", description, duration, ratings, poster, trailer, color FROM movies ORDER BY id')
        rows = cursor.fetchall()
        conn.close()

        movies = []
        for row in rows:
            movies.append({
                "id": row[0],
                "title": row[1],
                "director": row[2],
                "cast": row[3],
                "description": row[4],
                "duration": row[5],
                "ratings": row[6],
                "poster": row[7],
                "trailer": row[8],
                "color": row[9],
                "showtimes": []
            })
        return movies
    except Exception as e:
        print(f"Error fetching movies: {e}")
        return MOVIES

@app.route("/")
def home():
    movies = get_movies_from_db()
    return render_template(
        "index.html",
        movies=movies,
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

        cursor.execute("SELECT id, password, nom, prenom, is_admin FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        conn.close()

        if not user or not check_password_hash(user[1], password):
            return jsonify({"success": False, "error": "Email ou mot de passe incorrect"}), 401

        user_id, _, nom, prenom, is_admin = user
        session["user_id"] = user_id
        session["email"] = email
        session["nom"] = nom
        session["prenom"] = prenom
        session["is_admin"] = is_admin

        return jsonify({
            "success": True,
            "user": {"id": user_id, "email": email, "nom": nom, "prenom": prenom, "is_admin": is_admin}
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
            "prenom": session.get("prenom"),
            "is_admin": session.get("is_admin", 0)
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
    seat_categories = data.get("seat_categories", [])
    selected_seats = data.get("selected_seats", [])  # Format: [{"row": "A", "seat": 1, "category": "adult"}, ...]
    showtime_id = data.get("showtime_id")
    theatre_id = data.get("theatre_id")

    # Calculate total price based on seat categories
    total_price = 0
    if seat_categories and len(seat_categories) == int(seats):
        for category in seat_categories:
            total_price += float(PRICES.get(category, PRICES["adult"]))
    else:
        # Fallback: use adult price if no categories provided
        total_price = float(PRICES["adult"]) * int(seats)

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Store seat_categories as JSON string
        seat_categories_json = json.dumps(seat_categories) if seat_categories else json.dumps([])

        cursor.execute(
            "INSERT INTO reservations (user_id, film_title, film_date, film_time, seats, total_price, theatre_id, showtime_id, seat_categories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (user_id, film_title, film_date, film_time, seats, total_price, theatre_id, showtime_id, seat_categories_json)
        )
        conn.commit()
        booking_id = cursor.lastrowid

        # Insert individual seat bookings
        if selected_seats and theatre_id and showtime_id:
            for seat_info in selected_seats:
                cursor.execute(
                    "INSERT INTO seat_bookings (reservation_id, theatre_id, showtime_id, row_letter, seat_number, category) VALUES (?, ?, ?, ?, ?, ?)",
                    (booking_id, theatre_id, showtime_id, seat_info.get("row"), seat_info.get("seat"), seat_info.get("category", "adult"))
                )

            # Update available_seats count
            cursor.execute(
                "UPDATE showtimes SET available_seats = available_seats - ? WHERE id = ?",
                (len(selected_seats), showtime_id)
            )

        conn.commit()
        conn.close()

        return jsonify({
            "success": True,
            "booking": {
                "id": booking_id,
                "film_title": film_title,
                "film_date": film_date,
                "film_time": film_time,
                "seats": seats,
                "total_price": total_price,
                "seat_categories": seat_categories,
                "selected_seats": selected_seats
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


@app.route("/api/booking/<int:booking_id>", methods=["PUT"])
def update_booking(booking_id):
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    data = request.get_json()
    user_id = session["user_id"]
    film_title = data.get("film_title")
    film_date = data.get("film_date")
    film_time = data.get("film_time")
    seats = data.get("seats", 1)
    seat_categories = data.get("seat_categories", [])

    # Calculate total price based on seat categories
    total_price = 0
    if seat_categories and len(seat_categories) == int(seats):
        for category in seat_categories:
            total_price += float(PRICES.get(category, PRICES["adult"]))
    else:
        # Fallback: use adult price if no categories provided
        total_price = float(PRICES["adult"]) * int(seats)

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Vérifier que la réservation appartient à l'utilisateur
        cursor.execute("SELECT user_id FROM reservations WHERE id = ?", (booking_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"success": False, "error": "Réservation non trouvée"}), 404

        if result[0] != user_id:
            return jsonify({"success": False, "error": "Non autorisé"}), 403

        # Mettre à jour la réservation
        cursor.execute(
            "UPDATE reservations SET film_title = ?, film_date = ?, film_time = ?, seats = ?, total_price = ? WHERE id = ?",
            (film_title, film_date, film_time, seats, total_price, booking_id)
        )
        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "Réservation mise à jour"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/booking/<int:booking_id>", methods=["DELETE"])
def delete_booking(booking_id):
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    user_id = session["user_id"]

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Vérifier que la réservation appartient à l'utilisateur
        cursor.execute("SELECT user_id FROM reservations WHERE id = ?", (booking_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"success": False, "error": "Réservation non trouvée"}), 404

        if result[0] != user_id:
            return jsonify({"success": False, "error": "Non autorisé"}), 403

        # Supprimer la réservation
        cursor.execute("DELETE FROM reservations WHERE id = ?", (booking_id,))
        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "Réservation supprimée"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/payment", methods=["POST"])
def process_payment():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    user_id = session["user_id"]
    data = request.get_json()

    try:
        booking_id = data.get("booking_id")
        amount = data.get("amount")

        if not booking_id or not amount:
            return jsonify({"success": False, "error": "Données manquantes"}), 400

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Vérifier que la réservation appartient à l'utilisateur et existe
        cursor.execute("SELECT id, total_price FROM reservations WHERE id = ? AND user_id = ?", (booking_id, user_id))
        result = cursor.fetchone()

        if not result:
            conn.close()
            return jsonify({"success": False, "error": "Réservation non trouvée ou non autorisée"}), 404

        # Valider le montant
        if float(amount) != float(result[1]):
            conn.close()
            return jsonify({"success": False, "error": "Montant incorrect"}), 400

        # Simuler le paiement réussi
        # En production, on appellerait un service de paiement (Stripe, PayPal, etc.)
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Paiement de {amount}€ effectué avec succès",
            "booking_id": booking_id,
            "amount": amount
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/showtimes/<film_date>", methods=["GET"])
def get_showtimes_by_date(film_date):
    """Get all available showtimes for a specific date"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
            SELECT id, film_title, film_time, theatre_id, available_seats
            FROM showtimes
            WHERE film_date = ?
            ORDER BY film_time
        """, (film_date,))

        showtimes = []
        for row in cursor.fetchall():
            showtimes.append({
                "id": row[0],
                "film_title": row[1],
                "film_time": row[2],
                "theatre_id": row[3],
                "available_seats": row[4]
            })

        conn.close()
        return jsonify({"success": True, "showtimes": showtimes})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/seats/<int:showtime_id>", methods=["GET"])
def get_seats(showtime_id):
    """Get seat layout for a specific showtime"""
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Get theatre info
        cursor.execute("""
            SELECT t.id, t.rows, t.seats_per_row, s.film_title
            FROM showtimes s
            JOIN theatres t ON s.theatre_id = t.id
            WHERE s.id = ?
        """, (showtime_id,))

        theatre_info = cursor.fetchone()
        if not theatre_info:
            return jsonify({"success": False, "error": "Showtime not found"}), 404

        theatre_id, num_rows, seats_per_row, film_title = theatre_info

        # Get booked seats for this showtime
        cursor.execute("""
            SELECT row_letter, seat_number FROM seat_bookings WHERE showtime_id = ?
        """, (showtime_id,))

        booked_seats = set()
        for row in cursor.fetchall():
            booked_seats.add((row[0], row[1]))

        conn.close()

        # Build seat layout
        rows = []
        for i in range(num_rows):
            row_letter = chr(65 + i)  # A, B, C, ...
            seats = []
            for seat_num in range(1, seats_per_row + 1):
                is_booked = (row_letter, seat_num) in booked_seats
                seats.append({
                    "number": seat_num,
                    "booked": is_booked
                })
            rows.append({
                "row": row_letter,
                "seats": seats
            })

        return jsonify({
            "success": True,
            "showtime_id": showtime_id,
            "film_title": film_title,
            "theatre_id": theatre_id,
            "rows": rows
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/showtimes", methods=["GET"])
def get_showtimes():
    """Get showtimes for a movie on a specific date"""
    movie_title = request.args.get('movie')
    date = request.args.get('date')

    if not movie_title or not date:
        return jsonify({"success": False, "error": "movie and date parameters required"}), 400

    showtimes = get_showtimes_for_date(movie_title, date)
    return jsonify({"success": True, "showtimes": showtimes})


# ========================================
# ADMIN ROUTES
# ========================================

@app.route("/api/admin/movie", methods=["POST"])
def add_movie():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    if not session.get("is_admin"):
        return jsonify({"success": False, "error": "Accès refusé - administrateur requis"}), 403

    data = request.get_json()
    title = data.get("title")
    director = data.get("director")
    cast = data.get("cast")
    description = data.get("description")
    duration = data.get("duration")
    ratings = data.get("ratings")
    poster = data.get("poster")
    trailer = data.get("trailer")
    color = data.get("color")

    if not all([title, director, cast, description, duration, ratings, poster]):
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400

    try:
        duration = int(duration)
    except (ValueError, TypeError):
        return jsonify({"success": False, "error": "La durée doit être un nombre"}), 400

    try:
        print(f"[ADD MOVIE] Attempting to add: {title} by {director}")
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO movies (title, director, cast, description, duration, ratings, poster, trailer, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (title, director, cast, description, duration, ratings, poster, trailer, color)
        )
        conn.commit()
        movie_id = cursor.lastrowid
        print(f"[ADD MOVIE] Successfully inserted movie with ID: {movie_id}")
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Film '{title}' ajouté avec succès",
            "movie": {
                "id": movie_id,
                "title": title,
                "director": director,
                "cast": cast,
                "description": description,
                "duration": duration,
                "ratings": ratings,
                "poster": poster,
                "trailer": trailer,
                "color": color
            }
        })
    except sqlite3.IntegrityError as e:
        print(f"[ADD MOVIE] IntegrityError: {e}")
        return jsonify({"success": False, "error": f"Le film '{title}' existe déjà"}), 400
    except Exception as e:
        print(f"[ADD MOVIE] Exception: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/movies", methods=["GET"])
def get_all_movies():
    """Get all movies from database"""
    movies = get_movies_from_db()
    return jsonify({"success": True, "movies": movies})


@app.route("/api/admin/showtime", methods=["POST"])
def add_showtime():
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401

    if not session.get("is_admin"):
        return jsonify({"success": False, "error": "Accès refusé - administrateur requis"}), 403

    data = request.get_json()
    film_title = data.get("film_title")
    film_date = data.get("film_date")
    film_time = data.get("film_time")
    theatre_id = data.get("theatre_id")

    if not all([film_title, film_date, film_time, theatre_id]):
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute(
            "INSERT INTO showtimes (film_title, film_date, film_time, theatre_id, available_seats) VALUES (?, ?, ?, ?, ?)",
            (film_title, film_date, film_time, theatre_id, 96)
        )
        conn.commit()
        showtime_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Séance ajoutée avec succès",
            "showtime": {
                "id": showtime_id,
                "film_title": film_title,
                "film_date": film_date,
                "film_time": film_time,
                "theatre_id": theatre_id,
                "available_seats": 96
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
