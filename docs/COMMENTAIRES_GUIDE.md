# 📝 Guide des Commentaires du Code

Ce fichier explique les commentaires ajoutés au code Python du projet CinéMax.

---

## Style de Commentaires

Les commentaires ont été écrits comme si un **étudiant expliquait son code**. C'est-à-dire:
- **Concis** mais **explicatif**
- Pas trop verbeux
- Explique le "pourquoi" plutôt que le "quoi"
- Commente les sections logiques, pas chaque ligne

---

## Fichiers Commentés

### 1. `backend/app.py` (Fichier principal)

#### Section: Imports et Configuration
```python
# Import des bibliothèques nécessaires
from flask import Flask, render_template, url_for, request, jsonify, session, send_file
# ... commentaires expliquant à quoi servent les bibliothèques
```

**Commentaires clés:**
- Explique l'utilité de chaque import important
- Indique pourquoi utiliser `werkzeug` pour la sécurité
- Explique la génération de codes QR et PDF

#### Section: Initialisation de la Base de Données
```python
# =========== INITIALISATION DE LA BASE DE DONNÉES ===========
def init_db():
    # Commente chaque table
    cursor.execute('''
        CREATE TABLE users (
            ...
            is_admin INTEGER DEFAULT 0,  -- 0 = user normal, 1 = admin
            ...
        )
    ''')
```

**Commentaires clés:**
- Chaque table a un en-tête explicatif
- Les colonnes importantes ont des explications inline
- Indique les relations entre tables (FOREIGN KEY)

#### Section: Gestion des Comptes
```python
def create_test_user():
    # Commente le hachage du mot de passe
    hashed_password = generate_password_hash("test1234")  # Hash du mot de passe
```

**Commentaires clés:**
- Explique pourquoi on hache les mots de passe
- Indique qu'il faut créer des comptes de test au démarrage

#### Section: Routes d'Authentification
```python
@app.route("/api/register", methods=["POST"])
def register():
    # Vérifier que tous les champs obligatoires sont remplis
    if not all([email, password, nom, prenom]):
        return jsonify({"success": False, "error": "Tous les champs sont requis"}), 400
    
    # Hacher le mot de passe pour la sécurité
    hashed_password = generate_password_hash(password)
```

**Commentaires clés:**
- Explique chaque étape du processus d'inscription
- Indique pourquoi hacher les mots de passe
- Explique les erreurs possibles

#### Section: Routes de Réservation
```python
@app.route("/api/booking", methods=["POST"])
def create_booking():
    # Vérifier que l'utilisateur est connecté
    if "user_id" not in session:
        return jsonify({"success": False, "error": "Non authentifié"}), 401
    
    # Catégories de chaque place
    seat_categories = data.get("seat_categories", [])
    
    # Calculer le prix total selon les catégories
    total_price = 0
    if seat_categories and len(seat_categories) == int(seats):
        for category in seat_categories:
            total_price += float(PRICES.get(category, PRICES["adult"]))
```

**Commentaires clés:**
- Explique l'authentification requise
- Détaille le calcul du prix par catégorie
- Commente la conversion JSON en base de données

---

### 2. `test_booking.py` (Tests d'intégration)

#### Configuration
```python
# Script de test pour vérifier le flux de réservation complet
import requests  # Pour faire des appels HTTP
import json
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"  # Adresse du serveur Flask
TEST_DATE = "2025-12-04"  # Date à tester
TEST_EMAIL = "test@cinema.com"  # Compte de test
```

**Commentaires clés:**
- Explique le but du script
- Indique les constantes importantes
- Explique l'utilité de chaque import

#### Étapes du Test
```python
# Créer une session pour conserver les cookies (authentification)
session = requests.Session()

# ÉTAPE 1: Se connecter
# ... code de connexion

# ÉTAPE 2: Récupérer les séances disponibles
# ... code pour récupérer les showtimes

# ÉTAPE 3: Récupérer le plan de la salle
# ... code pour obtenir le plan

# ÉTAPE 4: Créer une réservation avec sièges sélectionnés
# Simuler la sélection de 2 sièges: A-1 et A-2
# ... code de réservation

# ÉTAPE 5: Vérifier que les sièges sont bien réservés
# Vérifier que A-1 et A-2 sont marqués comme réservés
```

**Commentaires clés:**
- Chaque étape est clairement identifiée
- Explique la raison de chaque action
- Indique ce qui est simulé (sélection de sièges)

---

## Bonnes Pratiques Utilisées

### 1. Commentaires sur les Blocs Logiques
```python
# =========== INITIALISATION DE LA BASE DE DONNÉES ===========
# Identifie clairement les sections du code
```

### 2. Explications Inline
```python
is_admin INTEGER DEFAULT 0,  -- 0 = user normal, 1 = admin
```

### 3. Commentaires Explicatifs
```python
# Hacher le mot de passe pour la sécurité
hashed_password = generate_password_hash(password)
```

### 4. Pas de Commentaires Inutiles
❌ Mauvais:
```python
i = i + 1  # Incrémenter i
```

✅ Bon:
```python
# Passer à la prochaine séance de la boucle
```

---

## Principes Appliqués

| Principe | Exemple |
|----------|---------|
| **Expliquer le pourquoi** | "Hacher le mot de passe pour la sécurité" |
| **Identifier les sections** | "=========== AUTHENTIFICATION ===========" |
| **Clarifier les étapes** | "ÉTAPE 1: Se connecter" |
| **Documenter les types** | "-- 0 = user normal, 1 = admin" |
| **Expliquer les formats** | "Format JSON des catégories" |

---

## À Améliorer

Pour continuer à améliorer les commentaires:

1. **Ajouter des docstrings** aux fonctions plus complexes
2. **Documenter les paramètres** de chaque fonction
3. **Expliquer les cas limites** (empty lists, None values, etc.)
4. **Ajouter des exemples** d'utilisation pour les fonctions publiques
5. **Commenter les algorithmes** complexes étape par étape

Exemple de docstring à ajouter:
```python
def create_booking():
    """
    Crée une nouvelle réservation pour un utilisateur connecté.
    
    Paramètres attendus (JSON):
        - film_title: Titre du film
        - film_date: Date de la séance (YYYY-MM-DD)
        - seats: Nombre de places
        - seat_categories: Liste des catégories (adulte, enfant...)
    
    Retourne:
        JSON avec success=True et booking_id, ou erreur
    """
```

---

**Dernière mise à jour** : 19 décembre 2025
