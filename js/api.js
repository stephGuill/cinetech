// Import des constantes de configuration depuis config.js
// Ces constantes contiennent la clé API et les URLs de base
import { API_KEY, BASE_URL, IMAGE_BASE_URL, IMAGE_SIZE } from './config.js';

/**
 * Service pour gérer les appels à l'API TMDB
 * Cette classe centralise toutes les interactions avec l'API TMDB
 * Elle fournit des méthodes pour récupérer films, séries, détails, etc.
 */
class TMDBService {
    /**
     * Méthode principale pour effectuer une requête à l'API TMDB
     * Cette méthode générique est utilisée par toutes les autres méthodes
     * @param {string} endpoint - L'endpoint de l'API (ex: '/movie/popular')
     * @param {Object} params - Paramètres additionnels de la requête (ex: {page: 1})
     * @returns {Promise<Object>} - Promesse contenant les données JSON de l'API
     */
    async fetchData(endpoint, params = {}) {
        // Création d'un objet URL pour construire l'URL complète
        // Exemple: https://api.themoviedb.org/3/movie/popular
        const url = new URL(`${BASE_URL}${endpoint}`);
        
        // Ajout de la clé API comme paramètre obligatoire
        // Toutes les requêtes TMDB nécessitent cette clé pour l'authentification
        url.searchParams.append('api_key', API_KEY);
        
        // Ajout du paramètre de langue pour obtenir les résultats en français
        // 'fr-FR' = Français de France (titres, descriptions, etc.)
        url.searchParams.append('language', 'fr-FR');
        
        // Parcours et ajout de tous les paramètres additionnels
        // Object.keys() retourne un tableau des clés de l'objet params
        Object.keys(params).forEach(key => {
            // Ajout de chaque paramètre à l'URL (ex: page=1, query=matrix)
            url.searchParams.append(key, params[key]);
        });

        // Bloc try-catch pour gérer les erreurs de requête
        try {
            // Fetch API - Effectue la requête HTTP GET de manière asynchrone
            // await attend que la promesse soit résolue avant de continuer
            const response = await fetch(url);
            
            // Vérification du statut de la réponse HTTP
            // response.ok est true si le code HTTP est 200-299
            if (!response.ok) {
                // Si erreur, lancer une exception avec le code HTTP
                throw new Error(`Erreur API: ${response.status}`);
            }
            
            // Conversion de la réponse en JSON et retour des données
            // await car response.json() retourne aussi une promesse
            return await response.json();
        } catch (error) {
            // Capture et affichage de toute erreur dans la console
            console.error('Erreur lors de la requête:', error);
            // Re-lance l'erreur pour que l'appelant puisse la gérer
            throw error;
        }
    }

    /**
     * Récupère les films populaires du moment
     * @param {number} page - Numéro de la page (défaut: 1). TMDB pagine les résultats par 20
     * @returns {Promise<Object>} - Objet contenant {results: [], page, total_pages, total_results}
     */
    async getPopularMovies(page = 1) {
        // Appel de l'endpoint /movie/popular avec le numéro de page
        // Retourne les films triés par popularité décroissante
        return this.fetchData('/movie/popular', { page });
    }

    /**
     * Récupère les séries TV populaires du moment
     * @param {number} page - Numéro de la page (défaut: 1)
     * @returns {Promise<Object>} - Objet contenant la liste des séries populaires
     */
    async getPopularSeries(page = 1) {
        // Appel de l'endpoint /tv/popular pour les séries
        // Même structure de réponse que getPopularMovies
        return this.fetchData('/tv/popular', { page });
    }

    /**
     * Récupère les films en tendance (trending)
     * @param {string} timeWindow - 'day' ou 'week' (défaut: 'week')
     * @returns {Promise<Object>} - Films tendance de la période
     */
    async getTrendingMovies(timeWindow = 'week') {
        // Endpoint /trending/movie/{time_window}
        return this.fetchData(`/trending/movie/${timeWindow}`);
    }

    /**
     * Récupère les séries en tendance (trending)
     * @param {string} timeWindow - 'day' ou 'week' (défaut: 'week')
     * @returns {Promise<Object>} - Séries tendance de la période
     */
    async getTrendingSeries(timeWindow = 'week') {
        // Endpoint /trending/tv/{time_window}
        return this.fetchData(`/trending/tv/${timeWindow}`);
    }

    /**
     * Récupère les nouveautés films (sorties récentes)
     * @param {number} page - Numéro de la page
     * @returns {Promise<Object>} - Nouveaux films sortis récemment
     */
    async getNewMovies(page = 1) {
        // Utilise now_playing pour les films actuellement en salle
        return this.fetchData('/movie/now_playing', { page });
    }

    /**
     * Récupère les films à venir (upcoming)
     * @param {number} page - Numéro de la page
     * @returns {Promise<Object>} - Films à venir prochainement
     */
    async getUpcomingMovies(page = 1) {
        return this.fetchData('/movie/upcoming', { page });
    }

    /**
     * Récupère les séries diffusées aujourd'hui
     * @param {number} page - Numéro de la page
     * @returns {Promise<Object>} - Séries avec de nouveaux épisodes aujourd'hui
     */
    async getAiringTodaySeries(page = 1) {
        return this.fetchData('/tv/airing_today', { page });
    }

    /**
     * Récupère les séries actuellement diffusées
     * @param {number} page - Numéro de la page
     * @returns {Promise<Object>} - Séries en cours de diffusion
     */
    async getOnTheAirSeries(page = 1) {
        return this.fetchData('/tv/on_the_air', { page });
    }

    /**
     * Récupère tous les détails d'un film spécifique
     * @param {number} movieId - ID unique du film dans la base TMDB
     * @returns {Promise<Object>} - Objet détaillé du film avec crédits, avis et suggestions
     */
    async getMovieDetails(movieId) {
        // Appel de l'endpoint /movie/{id} avec des données supplémentaires
        // append_to_response permet de récupérer plusieurs infos en une seule requête
        return this.fetchData(`/movie/${movieId}`, { 
            // credits: cast et crew (acteurs, réalisateurs, etc.)
            // reviews: avis et critiques des utilisateurs TMDB
            // similar: films similaires à celui-ci
            append_to_response: 'credits,reviews,similar' 
        });
    }

    /**
     * Récupère tous les détails d'une série TV spécifique
     * @param {number} seriesId - ID unique de la série dans la base TMDB
     * @returns {Promise<Object>} - Objet détaillé de la série avec toutes les infos
     */
    async getSeriesDetails(seriesId) {
        // Même principe que getMovieDetails mais pour les séries TV
        // Endpoint /tv/{id} au lieu de /movie/{id}
        return this.fetchData(`/tv/${seriesId}`, { 
            append_to_response: 'credits,reviews,similar' 
        });
    }

    /**
     * Recherche des films et séries en fonction d'un terme
     * @param {string} query - Terme de recherche saisi par l'utilisateur
     * @returns {Promise<Object>} - Résultats mixtes (films, séries, personnes)
     */
    async searchMulti(query) {
        // Endpoint /search/multi effectue une recherche dans tous les types de médias
        // Retourne films, séries TV et personnes correspondant à la recherche
        return this.fetchData('/search/multi', { query });
    }

    /**
     * Recherche uniquement des films par mot-clé
     * @param {string} query - Terme de recherche
     * @returns {Promise<Object>} - Résultats de films uniquement
     */
    async searchMovies(query) {
        // Endpoint /search/movie pour rechercher uniquement dans les films
        return this.fetchData('/search/movie', { query });
    }

    /**
     * Recherche uniquement des séries par mot-clé
     * @param {string} query - Terme de recherche
     * @returns {Promise<Object>} - Résultats de séries uniquement
     */
    async searchSeries(query) {
        // Endpoint /search/tv pour rechercher uniquement dans les séries
        return this.fetchData('/search/tv', { query });
    }

    /**
     * Recherche des mots-clés/genres correspondant à une requête
     * @param {string} query - Terme de recherche
     * @returns {Promise<Object>} - Liste de mots-clés suggérés
     */
    async searchKeywords(query) {
        // Endpoint /search/keyword pour l'autocomplétion intelligente
        return this.fetchData('/search/keyword', { query });
    }

    /**
     * Récupère la liste de tous les genres de films
     * @returns {Promise<Object>} - Liste des genres avec ID et nom
     */
    async getMovieGenres() {
        return this.fetchData('/genre/movie/list');
    }

    /**
     * Récupère la liste de tous les genres de séries
     * @returns {Promise<Object>} - Liste des genres avec ID et nom
     */
    async getTVGenres() {
        return this.fetchData('/genre/tv/list');
    }

    /**
     * Récupère les films similaires à un film donné
     * @param {number} movieId - ID du film de référence
     * @returns {Promise<Object>} - Liste de films similaires (même genre, thèmes, etc.)
     */
    async getSimilarMovies(movieId) {
        // TMDB utilise un algorithme pour trouver des films similaires
        // Basé sur les genres, mots-clés, et préférences des utilisateurs
        return this.fetchData(`/movie/${movieId}/similar`);
    }

    /**
     * Récupère les séries similaires à une série donnée
     * @param {number} seriesId - ID de la série de référence
     * @returns {Promise<Object>} - Liste de séries TV similaires
     */
    async getSimilarSeries(seriesId) {
        // Même principe que getSimilarMovies mais pour les séries
        return this.fetchData(`/tv/${seriesId}/similar`);
    }

    /**
     * Construit l'URL complète d'une image TMDB
     * @param {string} path - Chemin de l'image fourni par l'API (ex: "/abc123.jpg")
     * @param {string} size - Taille souhaitée (défaut: 'w500' pour les posters)
     * @returns {string} - URL complète de l'image ou placeholder si pas d'image
     */
    getImageUrl(path, size = IMAGE_SIZE.poster) {
        // Si pas de chemin d'image, retourner une image placeholder
        // via.placeholder.com génère des images de remplacement
        if (!path) return 'https://via.placeholder.com/500x750?text=Pas+d\'image';
        
        // Construction de l'URL: base + taille + chemin
        // Exemple: https://image.tmdb.org/t/p/w500/abc123.jpg
        return `${IMAGE_BASE_URL}/${size}${path}`;
    }
}

// Export d'une instance unique de la classe (pattern Singleton)
// Cela permet d'utiliser le même service partout sans créer plusieurs instances
// Usage: import api from './api.js'; puis api.getPopularMovies()
export default new TMDBService();
