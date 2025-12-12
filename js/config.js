/**
 * Configuration de l'API TMDB (The Movie Database)
 * Ce fichier centralise toutes les constantes de configuration pour l'API
 * IMPORTANT: Remplacez 'VOTRE_CLE_API' par votre clé API TMDB
 * Obtenez votre clé API sur: https://www.themoviedb.org/settings/api
 */

// Clé API TMDB - Identifiant unique pour accéder aux services TMDB
// Cette clé est nécessaire pour authentifier toutes les requêtes à l'API
const API_KEY = 'dfd771c988c7481f3bd37af51d939990';

// URL de base de l'API TMDB version 3
// Toutes les requêtes API commenceront par cette URL
const BASE_URL = 'https://api.themoviedb.org/3';

// URL de base pour récupérer les images depuis TMDB
// Les images (posters, backdrops, profils) sont hébergées sur un CDN séparé
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Objet définissant les tailles d'images disponibles
// TMDB propose différentes résolutions pour optimiser le chargement
const IMAGE_SIZE = {
    poster: 'w500',      // Largeur 500px pour les affiches de films/séries
    backdrop: 'original', // Taille originale pour les images de fond (haute qualité)
    profile: 'w185'      // Largeur 185px pour les photos de profil des acteurs
};

// Export des constantes pour les rendre disponibles dans les autres modules
// Utilisation de la syntaxe ES6 modules pour l'import/export
export { API_KEY, BASE_URL, IMAGE_BASE_URL, IMAGE_SIZE };
