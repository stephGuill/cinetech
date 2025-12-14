// Import des services nécessaires
import api from './api.js';
import ui from './ui.js';
import search from './search.js';

/**
 * Classe gérant la page Trending
 * Affiche les films et séries en tendance de la semaine
 */
class TrendingPage {
    constructor() {
        // Références DOM
        this.trendingMoviesGrid = document.getElementById('trendingMoviesGrid');
        this.trendingSeriesGrid = document.getElementById('trendingSeriesGrid');
        
        // Onglets actuellement actif
        this.activeTab = 'movies';
    }

    /**
     * Initialise la page Trending
     */
    async init() {
        // Initialisation du système de recherche
        search.init();
        
        // Configuration des onglets
        this.setupTabs();
        
        // Chargement des données
        await this.loadTrendingMovies();
        await this.loadTrendingSeries();
    }

    /**
     * Configure le système d'onglets
     */
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Retirer la classe active de tous les boutons
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Ajouter la classe active au bouton et contenu cliqué
                btn.classList.add('active');
                document.getElementById(`${tabName}Tab`).classList.add('active');
                
                this.activeTab = tabName;
            });
        });
    }

    /**
     * Charge les films en tendance
     */
    async loadTrendingMovies() {
        try {
            ui.showLoading(this.trendingMoviesGrid);
            const data = await api.getTrendingMovies('week');
            this.trendingMoviesGrid.innerHTML = '';
            for (const movie of data.results) {
                const card = await ui.createMediaCard(movie, 'movie');
                if (card instanceof Node) {
                    this.trendingMoviesGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des films trending:', error);
            ui.showError(this.trendingMoviesGrid);
        }
    }

    /**
     * Charge les séries en tendance
     */
    async loadTrendingSeries() {
        try {
            ui.showLoading(this.trendingSeriesGrid);
            const data = await api.getTrendingSeries('week');
            this.trendingSeriesGrid.innerHTML = '';
            for (const serie of data.results) {
                const card = await ui.createMediaCard(serie, 'tv');
                if (card instanceof Node) {
                    this.trendingSeriesGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Erreur lors du chargement des séries trending:', error);
            ui.showError(this.trendingSeriesGrid);
        }
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const page = new TrendingPage();
    page.init();
});
