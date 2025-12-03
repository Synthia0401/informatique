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
    },
    {
        "id": 2,
        "title": "La Mélodie du Lac",
        "description": "Une histoire d'amitié et de musique dans un village côtier.",
        "duration": 98,
        "ratings": "Tous publics",
        "showtimes": ["13:15", "16:00", "19:00"],
    },
    {
        "id": 3,
        "title": "Course Contre le Temps",
        "description": "Thriller haletant où chaque seconde compte.",
        "duration": 110,
        "ratings": "PG-13",
        "showtimes": ["15:00", "18:30", "22:00"],
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
