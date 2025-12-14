// Import des services nécessaires
import api from './api.js';      // Service API pour récupérer les séries TV
import ui from './ui.js';        // Service UI pour créer les cartes visuelles
import search from './search.js'; // Service de recherche

/**
 * Classe gérant la page séries (series.html)
 * Affiche toutes les séries TV populaires avec pagination
 * Structure identique à MoviesPage mais pour les séries
 */
class SeriesPage {
    /**
     * Constructeur: initialise les propriétés et références DOM
     * Configure les variables pour gérer la pagination
     */
    constructor() {
        // Référence vers la grille d'affichage des séries
        this.seriesGrid = document.getElementById('seriesGrid');
        
        // Référence vers le bouton "Précédent"
        this.prevBtn = document.getElementById('prevPage');
        
        // Référence vers le bouton "Suivant"
        this.nextBtn = document.getElementById('nextPage');
        
        // Référence vers l'élément affichant "Page X sur Y"
        this.pageInfo = document.getElementById('pageInfo');
        
        // Numéro de la page actuelle (débute à 1)
        this.currentPage = 1;
        
        // Nombre total de pages (mis à jour après l'appel API)
        this.totalPages = 1;
    }

    /**
     * Initialise la page séries
     * Configure les écouteurs et charge les données initiales
     */
    async init() {
        // Initialisation du système de recherche dans le header
        search.init();

        // Chargement de la première page de séries
        // await attend la fin du chargement avant de continuer
        await this.loadSeries();

        // Configuration des écouteurs d'événements pour la pagination
        // Fonction fléchée () => pour conserver le contexte 'this'
        this.prevBtn.addEventListener('click', () => this.goToPreviousPage());
        this.nextBtn.addEventListener('click', () => this.goToNextPage());
    }

    /**
     * Charge les séries de la page actuelle
     * Récupère les données API et crée toutes les cartes visuelles
     * Charge 24 séries au total (20 de la page actuelle + 4 de la suivante)
     */
    async loadSeries() {
        // Gestion des erreurs avec try-catch
        try {
            // Affichage d'un indicateur de chargement pendant la requête
            ui.showLoading(this.seriesGrid);
            
            // Appel API avec le numéro de page actuel
            // L'API TMDB retourne 20 séries par page
            const data = await api.getPopularSeries(this.currentPage);
            
            // Mise à jour du nombre total de pages depuis la réponse API
            this.totalPages = data.total_pages;
            
            // Récupération des 4 premières séries de la page suivante
            let additionalSeries = [];
            if (this.currentPage < this.totalPages) {
                const nextPageData = await api.getPopularSeries(this.currentPage + 1);
                additionalSeries = nextPageData.results.slice(0, 4);
            }
            
            // Combinaison des 20 séries + 4 supplémentaires = 24 au total
            const allSeries = [...data.results, ...additionalSeries];
            
            // Mise à jour de l'interface de pagination
            this.updatePagination();

            // Nettoyage de la grille (retrait des séries précédentes)
            this.seriesGrid.innerHTML = '';
            
            // Création d'une carte pour chaque série reçue (24 au total)
            for (const serie of allSeries) {
                const card = await ui.createMediaCard(serie, 'tv');
                if (card instanceof Node) {
                    this.seriesGrid.appendChild(card);
                }
            }

            // Scroll automatique vers le haut de la page
            // behavior: 'smooth' = animation fluide pour une meilleure UX
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            // En cas d'erreur (réseau, API, etc.)
            console.error('Erreur lors du chargement des séries:', error);
            // Affichage d'un message d'erreur à l'utilisateur
            ui.showError(this.seriesGrid);
        }
    }

    /**
     * Met à jour l'interface de pagination
     * Active/désactive les boutons et affiche le numéro de page
     */
    updatePagination() {
        // Mise à jour du texte "Page X sur Y"
        this.pageInfo.textContent = `Page ${this.currentPage} sur ${this.totalPages}`;
        
        // Désactiver le bouton "Précédent" si on est sur la page 1
        this.prevBtn.disabled = this.currentPage === 1;
        
        // Désactiver le bouton "Suivant" si on est sur la dernière page
        this.nextBtn.disabled = this.currentPage === this.totalPages;
    }

    /**
     * Navigue vers la page précédente
     * Décrémente le numéro de page et recharge
     */
    goToPreviousPage() {
        // Vérification qu'on n'est pas déjà sur la première page
        if (this.currentPage > 1) {
            // Décrémentation du numéro de page
            this.currentPage--;
            // Rechargement avec le nouveau numéro de page
            this.loadSeries();
        }
    }

    /**
     * Navigue vers la page suivante
     * Incrémente le numéro de page et recharge
     */
    goToNextPage() {
        // Vérification qu'on n'est pas déjà sur la dernière page
        if (this.currentPage < this.totalPages) {
            // Incrémentation du numéro de page
            this.currentPage++;
            // Rechargement avec le nouveau numéro de page
            this.loadSeries();
        }
    }
}

// === POINT D'ENTRÉE DU SCRIPT ===
// Initialisation automatique au chargement du DOM
// DOMContentLoaded se déclenche quand le HTML est entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Création d'une instance de la page séries
    const seriesPage = new SeriesPage();
    
    // Démarrage de l'initialisation
    // Lance le chargement et configure les événements
    seriesPage.init();
});
