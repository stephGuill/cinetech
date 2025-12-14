// Import des services nécessaires
import api from './api.js';
import ui from './ui.js';
import search from './search.js';

/**
 * Classe gérant la page des résultats de recherche
 * Affiche tous les films et séries correspondant à un mot-clé
 */
class SearchResultsPage {
    constructor() {
        // Référence vers la grille d'affichage des résultats
        this.resultsGrid = document.getElementById('resultsGrid');
        
        // Référence vers le titre de la page
        this.searchTitle = document.getElementById('searchTitle');
        
        // Référence vers le message "aucun résultat"
        this.noResults = document.getElementById('noResults');
        
        // Récupération du mot-clé depuis l'URL
        const urlParams = new URLSearchParams(window.location.search);
        this.query = urlParams.get('q') || '';
    }

    /**
     * Initialise la page de résultats
     */
    async init() {
        // Initialisation du système de recherche dans le header
        search.init();
        
        // Pré-remplir l'input de recherche avec le mot-clé actuel
        const searchInput = document.getElementById('searchInput');
        if (searchInput && this.query) {
            searchInput.value = this.query;
        }

        // Si pas de mot-clé, afficher un message
        if (!this.query) {
            this.searchTitle.textContent = 'Aucun mot-clé de recherche';
            this.noResults.style.display = 'block';
            return;
        }

        // Mise à jour du titre avec le mot-clé recherché
        this.searchTitle.textContent = `Résultats pour "${this.query}"`;

        // Chargement des résultats
        await this.loadResults();
    }

    /**
     * Charge tous les résultats pour le mot-clé
     * Effectue des recherches sur films et séries en parallèle
     */
    async loadResults() {
        try {
            // Affichage d'un indicateur de chargement
            ui.showLoading(this.resultsGrid);

            // Recherche dans les films et séries en parallèle
            const [moviesData, seriesData] = await Promise.all([
                api.searchMovies(this.query),
                api.searchSeries(this.query)
            ]);

            // Combinaison des résultats
            const allResults = [];
            
            // Ajout des films avec leur type
            if (moviesData.results) {
                moviesData.results.forEach(movie => {
                    movie.media_type = 'movie';
                    allResults.push(movie);
                });
            }
            
            // Ajout des séries avec leur type
            if (seriesData.results) {
                seriesData.results.forEach(serie => {
                    serie.media_type = 'tv';
                    allResults.push(serie);
                });
            }

            // Nettoyage de la grille
            this.resultsGrid.innerHTML = '';

            // Si aucun résultat trouvé
            if (allResults.length === 0) {
                this.noResults.style.display = 'block';
                return;
            }

            // Masquer le message "aucun résultat"
            this.noResults.style.display = 'none';

            // Tri des résultats par popularité décroissante
            allResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

            // Création d'une carte pour chaque résultat
            for (const item of allResults) {
                const card = await ui.createMediaCard(item, item.media_type);
                if (card instanceof Node) {
                    this.resultsGrid.appendChild(card);
                }
            }

        } catch (error) {
            console.error('Erreur lors du chargement des résultats:', error);
            ui.showError(this.resultsGrid);
        }
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const page = new SearchResultsPage();
    page.init();
});
