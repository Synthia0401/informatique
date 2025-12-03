from flask import Flask, render_template, url_for
from datetime import datetime, timedelta

app = Flask(
    __name__,
    template_folder="../frontend/templates",
    static_folder="../frontend/static",
)

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


if __name__ == "__main__":
    app.run(debug=True)
