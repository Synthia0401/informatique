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
        "poster": "https://via.placeholder.com/300x450?text=Les+%C3%89toiles+Oubli%C3%A9es",
    },
    {
        "id": 2,
        "title": "La Mélodie du Lac",
        "description": "Une histoire d'amitié et de musique dans un village côtier.",
        "duration": 98,
        "ratings": "Tous publics",
        "showtimes": ["13:15", "16:00", "19:00"],
        "poster": "https://via.placeholder.com/300x450?text=La+M%C3%A9lodie+du+Lac",
    },
    {
        "id": 3,
        "title": "Course Contre le Temps",
        "description": "Thriller haletant où chaque seconde compte.",
        "duration": 110,
        "ratings": "PG-13",
        "showtimes": ["15:00", "18:30", "22:00"],
        "poster": "https://via.placeholder.com/300x450?text=Course+Contre+le+Temps",
    },
    {
        "id": 4,
        "title": "Les Enfants du Vent",
        "description": "Portrait d'une famille et des secrets qu'elle garde.",
        "duration": 105,
        "ratings": "Tous publics",
        "showtimes": ["12:45", "15:30", "20:15"],
        "poster": "https://via.placeholder.com/300x450?text=Les+Enfants+du+Vent",
    },
    {
        "id": 5,
        "title": "Nuit Blanche",
        "description": "Enquête urbaine à couper le souffle.",
        "duration": 118,
        "ratings": "PG-13",
        "showtimes": ["16:00", "19:45", "23:00"],
        "poster": "https://via.placeholder.com/300x450?text=Nuit+Blanche",
    },
    {
        "id": 6,
        "title": "La Route des Rêves",
        "description": "Aventure poétique sur fond de road-trip.",
        "duration": 132,
        "ratings": "Tous publics",
        "showtimes": ["11:30", "14:30", "18:00"],
        "poster": "https://via.placeholder.com/300x450?text=La+Route+des+R%C3%AAves",
    },
    {
        "id": 7,
        "title": "Opération Minuit",
        "description": "Action non-stop et retournements inattendus.",
        "duration": 107,
        "ratings": "PG-13",
        "showtimes": ["13:00", "17:00", "21:00"],
        "poster": "https://via.placeholder.com/300x450?text=Op%C3%A9ration+Minuit",
    },
    {
        "id": 8,
        "title": "Coeurs en Hiver",
        "description": "Comédie romantique tendre et légère.",
        "duration": 95,
        "ratings": "Tous publics",
        "showtimes": ["12:00", "15:00", "18:30"],
        "poster": "https://via.placeholder.com/300x450?text=Coeurs+en+Hiver",
    },
    {
        "id": 9,
        "title": "Mémoires Perdues",
        "description": "Drame psychologique et quête d'identité.",
        "duration": 140,
        "ratings": "16+",
        "showtimes": ["17:15", "20:30"],
        "poster": "https://via.placeholder.com/300x450?text=M%C3%A9moires+Perdues",
    },
    {
        "id": 10,
        "title": "Rivages lointains",
        "description": "Épopée maritime et destin croisé.",
        "duration": 123,
        "ratings": "Tous publics",
        "showtimes": ["10:45", "14:15", "19:30"],
        "poster": "https://via.placeholder.com/300x450?text=Rivages+lointains",
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
