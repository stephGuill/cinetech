// Import des services nécessaires
import api from './api.js';      // Service pour les appels API TMDB
import ui from './ui.js';        // Service pour créer les éléments visuels
import search from './search.js'; // Service pour la barre de recherche

/**
 * Classe gérant la page d'accueil (index.html)
 * Affiche une sélection de films et séries populaires
 * Première page vue par l'utilisateur en arrivant sur le site
 */
class HomePage {
    /**
     * Constructeur: initialise les références aux conteneurs DOM
     * Stocke les éléments où afficher films et séries
     */
    constructor() {
        // Référence vers la grille d'affichage des films populaires
        // getElementById récupère l'élément avec id="popularMovies"
        this.popularMoviesContainer = document.getElementById('popularMovies');
        
        // Référence vers la grille d'affichage des séries populaires
        // getElementById récupère l'élément avec id="popularSeries"
        this.popularSeriesContainer = document.getElementById('popularSeries');
    }

    /**
     * Initialise la page d'accueil
     * Méthode principale appelée au chargement de la page
     * Coordonne toutes les opérations de chargement
     */
    async init() {
        // Initialisation du système de recherche dans le header
        // Configure les écouteurs d'événements pour la barre de recherche
        search.init();

        // Chargement asynchrone des films populaires
        // await attend que le chargement soit terminé avant de continuer
        await this.loadPopularMovies();

        // Chargement asynchrone des séries populaires
        // S'exécute après le chargement des films (grâce à await ci-dessus)
        await this.loadPopularSeries();
    }

    /**
     * Charge et affiche les films populaires du moment
     * Récupère les données de l'API et crée les cartes visuelles
     */
    async loadPopularMovies() {
        // Bloc try-catch pour gérer les erreurs potentielles
        try {
            // Affichage d'un indicateur de chargement pendant la requête API
            ui.showLoading(this.popularMoviesContainer);
            
            // Appel API asynchrone pour récupérer les films populaires (page 1 par défaut)
            const data = await api.getPopularMovies();
            
            // Nettoyage du conteneur (retrait du message de chargement)
            this.popularMoviesContainer.innerHTML = '';
            
            // Limitation à 12 films pour ne pas surcharger la page d'accueil
            // slice(0, 12) extrait les 12 premiers éléments du tableau results
            const movies = data.results.slice(0, 12);
            
            // Parcours de chaque film pour créer et ajouter sa carte
            // forEach exécute une fonction pour chaque élément du tableau
            movies.forEach(movie => {
                // Création de la carte visuelle du film via le service UI
                const card = ui.createMediaCard(movie, 'movie');
                
                // Ajout de la carte au conteneur (à la fin)
                // appendChild insère l'élément comme dernier enfant
                this.popularMoviesContainer.appendChild(card);
            });
        } catch (error) {
            // En cas d'erreur (API down, réseau, etc.)
            console.error('Erreur lors du chargement des films:', error);
            
            // Affichage d'un message d'erreur à l'utilisateur
            ui.showError(this.popularMoviesContainer);
        }
    }

    /**
     * Charge et affiche les séries TV populaires du moment
     * Même logique que loadPopularMovies mais pour les séries
     */
    async loadPopularSeries() {
        // Structure identique à loadPopularMovies
        try {
            // Indicateur de chargement
            ui.showLoading(this.popularSeriesContainer);
            
            // Appel API pour les séries populaires
            const data = await api.getPopularSeries();
            
            // Nettoyage du conteneur
            this.popularSeriesContainer.innerHTML = '';
            
            // Limitation à 12 séries pour l'affichage d'accueil
            const series = data.results.slice(0, 12);
            
            // Création et ajout de chaque carte de série
            series.forEach(serie => {
                // Type 'tv' pour les séries (vs 'movie' pour les films)
                const card = ui.createMediaCard(serie, 'tv');
                this.popularSeriesContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des séries:', error);
            ui.showError(this.popularSeriesContainer);
        }
    }
}

// === POINT D'ENTRÉE DU SCRIPT ===
// Initialisation de la page au chargement complet du DOM
// DOMContentLoaded se déclenche quand le HTML est entièrement chargé et parsé
document.addEventListener('DOMContentLoaded', () => {
    // Création d'une instance de la classe HomePage
    const homePage = new HomePage();
    
    // Démarrage de l'initialisation de la page
    // Lance le chargement des films et séries
    homePage.init();
});
