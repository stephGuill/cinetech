// Import des services nécessaires
import api from './api.js';      // Service API pour récupérer les films
import ui from './ui.js';        // Service UI pour créer les cartes visuelles
import search from './search.js'; // Service de recherche

/**
 * Classe gérant la page films (movies.html)
 * Affiche tous les films populaires avec un système de pagination
 * Permet de naviguer à travers des milliers de films
 */
class MoviesPage {
    /**
     * Constructeur: initialise les propriétés et références DOM
     * Configure les variables pour gérer la pagination
     */
    constructor() {
        // Référence vers la grille d'affichage des films
        this.moviesGrid = document.getElementById('moviesGrid');
        
        // Référence vers le bouton "Précédent"
        this.prevBtn = document.getElementById('prevPage');
        
        // Référence vers le bouton "Suivant"
        this.nextBtn = document.getElementById('nextPage');
        
        // Référence vers l'élément affichant "Page X sur Y"
        this.pageInfo = document.getElementById('pageInfo');
        
        // Numéro de la page actuelle (commence à 1)
        this.currentPage = 1;
        
        // Nombre total de pages disponibles (sera mis à jour après l'appel API)
        this.totalPages = 1;
    }

    /**
     * Initialise la page films
     * Configure les écouteurs et charge les données initiales
     */
    async init() {
        // Initialisation du système de recherche dans le header
        search.init();

        // Chargement de la première page de films
        // await attend la fin du chargement avant de continuer
        await this.loadMovies();

        // Configuration des écouteurs d'événements pour la pagination
        // Fonction fléchée () => pour conserver le contexte 'this'
        this.prevBtn.addEventListener('click', () => this.goToPreviousPage());
        this.nextBtn.addEventListener('click', () => this.goToNextPage());
    }

    /**
     * Charge les films de la page actuelle
     * Récupère les données API et crée toutes les cartes visuelles
     * Charge 24 films au total (20 de la page actuelle + 4 de la suivante)
     */
    async loadMovies() {
        // Gestion des erreurs avec try-catch
        try {
            // Affichage d'un indicateur de chargement pendant la requête
            ui.showLoading(this.moviesGrid);
            
            // Appel API avec le numéro de page actuel
            // L'API TMDB retourne 20 films par page
            const data = await api.getPopularMovies(this.currentPage);
            
            // Mise à jour du nombre total de pages depuis la réponse API
            // Permet de savoir combien de pages sont disponibles
            this.totalPages = data.total_pages;
            
            // Récupération des 4 premiers films de la page suivante
            let additionalMovies = [];
            if (this.currentPage < this.totalPages) {
                const nextPageData = await api.getPopularMovies(this.currentPage + 1);
                additionalMovies = nextPageData.results.slice(0, 4);
            }
            
            // Combinaison des 20 films + 4 supplémentaires = 24 au total
            const allMovies = [...data.results, ...additionalMovies];
            
            // Mise à jour de l'interface de pagination
            this.updatePagination();

            // Nettoyage de la grille (retrait des films précédents)
            this.moviesGrid.innerHTML = '';
            
            // Création d'une carte pour chaque film reçu (24 au total)
            for (const movie of allMovies) {
                const card = await ui.createMediaCard(movie, 'movie');
                if (card instanceof Node) {
                    this.moviesGrid.appendChild(card);
                }
            }

            // Scroll automatique vers le haut de la page
            // behavior: 'smooth' = animation fluide au lieu de saut instantané
            // Améliore l'UX lors du changement de page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            // En cas d'erreur (réseau, API, etc.)
            console.error('Erreur lors du chargement des films:', error);
            // Affichage d'un message d'erreur à l'utilisateur
            ui.showError(this.moviesGrid);
        }
    }

    /**
     * Met à jour l'interface de pagination
     * Active/désactive les boutons et affiche le numéro de page
     */
    updatePagination() {
        // Mise à jour du texte "Page X sur Y"
        // textContent remplace le texte de l'élément
        this.pageInfo.textContent = `Page ${this.currentPage} sur ${this.totalPages}`;
        
        // Désactiver le bouton "Précédent" si on est sur la page 1
        // disabled = true rend le bouton non cliquable et grisé
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
            // Opérateur -- diminue de 1
            this.currentPage--;
            // Rechargement avec le nouveau numéro de page
            this.loadMovies();
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
            // Opérateur ++ augmente de 1
            this.currentPage++;
            // Rechargement avec le nouveau numéro de page
            this.loadMovies();
        }
    }
}

// === POINT D'ENTRÉE DU SCRIPT ===
// Initialisation automatique au chargement du DOM
// DOMContentLoaded se déclenche quand le HTML est entièrement chargé
document.addEventListener('DOMContentLoaded', () => {
    // Création d'une instance de la page films
    const moviesPage = new MoviesPage();
    
    // Démarrage de l'initialisation
    // Lance le chargement et configure les événements
    moviesPage.init();
});
