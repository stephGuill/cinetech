// Import des services nécessaires
import api from './api.js';
import ui from './ui.js';
import search from './search.js';

/**
 * Classe gérant la page Nouveautés
 * Affiche les nouveaux films et séries
 */
class NewReleasesPage {
    constructor() {
        // Références DOM
        this.nowPlayingGrid = document.getElementById('nowPlayingGrid');
        this.upcomingGrid = document.getElementById('upcomingGrid');
        this.airingTodayGrid = document.getElementById('airingTodayGrid');
        this.onTheAirGrid = document.getElementById('onTheAirGrid');
    }

    /**
     * Initialise la page
     */
    async init() {
        // Initialisation du système de recherche
        search.init();
        
        // Configuration des onglets
        this.setupTabs();
        
        // Chargement de toutes les données
        await Promise.all([
            this.loadNowPlaying(),
            this.loadUpcoming(),
            this.loadAiringToday(),
            this.loadOnTheAir()
        ]);
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
                
                // Retirer la classe active
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Ajouter la classe active
                btn.classList.add('active');
                document.getElementById(`${tabName}Tab`).classList.add('active');
            });
        });
    }

    /**
     * Charge les films actuellement en salle
     */
    async loadNowPlaying() {
        try {
            ui.showLoading(this.nowPlayingGrid);
            
            const data = await api.getNewMovies();
            
            this.nowPlayingGrid.innerHTML = '';
            
            for (const movie of data.results) {
                const card = await ui.createMediaCard(movie, 'movie');
                if (card instanceof Node) {
                    this.nowPlayingGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Erreur chargement films en salle:', error);
            ui.showError(this.nowPlayingGrid);
        }
    }

    /**
     * Charge les films à venir
     */
    async loadUpcoming() {
        try {
            ui.showLoading(this.upcomingGrid);
            
            const data = await api.getUpcomingMovies();
            
            this.upcomingGrid.innerHTML = '';
            
            for (const movie of data.results) {
                const card = await ui.createMediaCard(movie, 'movie');
                if (card instanceof Node) {
                    this.upcomingGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Erreur chargement films à venir:', error);
            ui.showError(this.upcomingGrid);
        }
    }

    /**
     * Charge les séries diffusées aujourd'hui
     */
    async loadAiringToday() {
        try {
            ui.showLoading(this.airingTodayGrid);
            
            const data = await api.getAiringTodaySeries();
            
            this.airingTodayGrid.innerHTML = '';
            
            for (const serie of data.results) {
                const card = await ui.createMediaCard(serie, 'tv');
                if (card instanceof Node) {
                    this.airingTodayGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Erreur chargement séries du jour:', error);
            ui.showError(this.airingTodayGrid);
        }
    }

    /**
     * Charge les séries en cours de diffusion
     */
    async loadOnTheAir() {
        try {
            ui.showLoading(this.onTheAirGrid);
            
            const data = await api.getOnTheAirSeries();
            
            this.onTheAirGrid.innerHTML = '';
            
            for (const serie of data.results) {
                const card = await ui.createMediaCard(serie, 'tv');
                if (card instanceof Node) {
                    this.onTheAirGrid.appendChild(card);
                }
            }
        } catch (error) {
            console.error('Erreur chargement séries en cours:', error);
            ui.showError(this.onTheAirGrid);
        }
    }
}

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const page = new NewReleasesPage();
    page.init();
});
