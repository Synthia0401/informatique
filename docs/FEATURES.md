# CinéMax - Fonctionnalités

**Plateforme complète de réservation de cinéma en ligne**

---

## Table des matières

| Section | Contenu |
|---------|---------|
| Compte Utilisateur | Inscription, connexion, profil |
| Catalogue Films | Films à l'affiche avec détails |
| Séances & Horaires | Gestion des horaires |
| Réservation | Sélection places et sièges |
| Paiement | Paiement sécurisé |
| Tickets | Génération PDF et codes QR |
| Mes Réservations | Historique et gestion |
| Tarification | Grille de prix |
| Recherche | Recherche films |
| Admin | Gestion complète |

---

## 1. Compte Utilisateur

### Inscription & Connexion
- Créer un compte avec email et mot de passe
- Connexion sécurisée
- Déconnexion
- Profil utilisateur avec informations personnelles
- Gestion des sessions

### Données Utilisateur stockées
- Email unique
- Nom et prénom
- Genre
- Ville et adresse
- Mot de passe hashé (sécurité maximale)

---

## 2. Catalogue de Films

### Découverte
- Liste complète des films à l'affiche
- Affiche du film avec poster haute résolution
- Description détaillée
- Acteurs et réalisateur
- Durée du film
- Classification (tous publics, 12+, etc.)
- Bande-annonce YouTube intégrée
- Recherche rapide par titre

### Design
- Carte film avec gradient personnalisé
- Images optimisées en lazy loading
- Effets visuels au survol

---

## 3. Séances & Horaires

### Gestion des Séances
- Plusieurs salles de cinéma
- Horaires variés par jour et film
- Dates disponibles (5 jours à l'avance)
- Capacité différente par salle
- Mise à jour des places disponibles en temps réel

### Caractéristiques
- Horaires par jour de la semaine (différents selon le jour)
- Places disponibles affichées en direct
- Séance unique par date/heure/salle

---

## 4. Système de Réservation

### Réserver une Place
- Sélectionner un film
- Choisir la date et l'heure
- Sélectionner les sièges dans la salle
- Choisir la catégorie de prix (adulte, enfant, senior, etc.)
- Voir le prix total en temps réel
- Confirmer la réservation

### Visualisation de la Salle
- Plan interactif de la salle avec sièges
- Sièges disponibles marqués
- Sièges réservés marqués
- Sièges en cours de sélection marqués
- Tarif selon catégorie (adulte, enfant, senior, étudiant, handicapé, sans emploi)

### Gestion de Réservation
- Modifier la réservation existante
- Annuler et obtenir un remboursement

---

## 5. Paiement

### Processus de Paiement
- Paiement en ligne sécurisé
- Confirmation immédiate du paiement
- Données sensibles protégées

### Confirmation de Commande
- Email de confirmation envoyé
- Récapitulatif de la commande inclus

---

## 6. Tickets & Documents

### Génération de Tickets
- Ticket PDF téléchargeable
- Récapitulatif complet incluant:
  - Titre du film
  - Date et heure de la séance
  - Numéro de sièges
  - Catégorie de place
  - Prix payé
  - Numéro de réservation

### Codes QR
- Code QR généré pour chaque ticket
- Vérification à l'entrée du cinéma
- Lien vers les informations de réservation

---

## 7. Mes Réservations

### Historique Complet
- Toutes les réservations passées et futures
- Détails complets de chaque réservation
- Prix payé pour chaque réservation
- Titre et horaire du film
- Numéro des sièges réservés

### Actions Disponibles
- Télécharger le ticket PDF
- Afficher le code QR
- Modifier la réservation
- Annuler la réservation

---

## 💰 Tarification

| Catégorie | Prix |
|-----------|------|
| **Adulte** | 12,50 € |
| **Enfants** | 8,00 € |
| **Seniors** | 9,50 € |
| **Étudiants** | 9,00 € |
| **Handicapés** | 8,50 € |
| **Sans emploi** | 7,50 € |

---

## 9. Recherche & Filtrage

### Recherche Avancée
- Recherche par titre de film
- Suggestions en temps réel
- Résultats instantanés

---

## 10. Espace Administrateur

### Gestion des Films
- Ajouter un nouveau film
- Modifier les informations du film
- Supprimer un film
- Télécharger affiche et poster

### Gestion des Séances
- Ajouter une nouvelle séance
- Choisir la salle
- Définir l'heure et la date
- Définir la capacité
- Modifier les détails d'une séance

### Gestion des Réservations
- Vue complète de toutes les réservations
- Rechercher une réservation
- Modifier une réservation
- Annuler une réservation

### Statistiques
- Nombre de réservations
- Chiffre d'affaires
- Places vendues vs disponibles

---

## 11. Sécurité

### Protection des Données
- Mots de passe hashés avec Werkzeug
- Sessions sécurisées avec clés secrètes
- Authentification requise pour certaines actions
- Validation des données côté serveur

### Contrôle d'Accès
- Utilisateur normal : réserver, consulter historique
- Administrateur : gestion complète du cinéma
- Routes protégées nécessitant authentification

---

## 12. Interface Utilisateur

### Design Moderne
- Interface responsive (desktop, tablette, mobile)
- Animations fluides
- Thème noir et dégradés colorés
- Navigation intuitive

### Composants Principaux
- Barre de navigation avec recherche
- Menu compte utilisateur
- Galerie de films interactive
- Modal de réservation
- Tableau des tarifs

---

## 13. Base de Données

### Tables Principales
- **users** : Comptes utilisateurs
- **movies** : Catalogue de films
- **showtimes** : Séances disponibles
- **theatres** : Salles de cinéma
- **reservations** : Historique des réservations
- **seat_bookings** : Détail des sièges réservés
- **payments** : Historique des paiements

---

## 14. Technologies Utilisées

### Backend
- Python 3.8+
- Flask 2.3.3
- SQLite
- Werkzeug (hachage passwords)

### Frontend
- HTML5
- CSS3 (moderne, responsive)
- JavaScript vanilla
- Images optimisées

### Bibliothèques Supplémentaires
- QR Code (qrcode 7.4.2)
- PDF (reportlab 4.0.7)
- Images (Pillow 10.0.0)

---

## 15. Performance

- Chargement rapide des images (lazy loading)
- Requêtes API optimisées
- Mises à jour en temps réel des places
- Base de données indexée

---

## 📋 Résumé des Fonctionnalités

| Fonctionnalité | Utilisateur | Admin |
|---|---|---|
| Consulter films | ✅ | ✅ |
| Rechercher films | ✅ | ✅ |
| Voir séances | ✅ | ✅ |
| Réserver places | ✅ | ✅ |
| Voir réservations | ✅ | ✅ |
| Modifier réservation | ✅ | ✅ |
| Annuler réservation | ✅ | ✅ |
| Télécharger ticket | ✅ | ✅ |
| Ajouter film | ❌ | ✅ |
| Modifier film | ❌ | ✅ |
| Ajouter séance | ❌ | ✅ |
| Gérer réservations | ❌ | ✅ |

---

**Dernière mise à jour** : 19 décembre 2025
