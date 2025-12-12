// Import des services nécessaires
import api from './api.js';         // Service API pour construire les URLs d'images
import ui from './ui.js';           // Service UI pour les messages
import storage from './storage.js'; // Service de stockage local pour récupérer les favoris
import search from './search.js';   // Service de recherche

/**
 * Classe gérant la page favoris (favorites.html)
 * Affiche tous les films et séries ajoutés aux favoris par l'utilisateur
 * Les données sont stockées dans le localStorage du navigateur
 */
class FavoritesPage {
    /**
     * Constructeur: initialise les références DOM
     */
    constructor() {
        // Référence vers la grille d'affichage des favoris
        this.favoritesGrid = document.getElementById('favoritesGrid');
    }

    /**
     * Initialise la page favoris
     * Configure la recherche et charge les favoris
     */
    async init() {
        // Initialisation du système de recherche dans le header
        search.init();

        // Chargement des favoris depuis le localStorage
        // Pas besoin d'await car c'est synchrone (pas d'appel API)
        this.loadFavorites();
    }

    /**
     * Charge et affiche les favoris depuis le localStorage
     * Récupère les données locales et crée les cartes visuelles
     */
    loadFavorites() {
        // Récupération du tableau des favoris depuis le localStorage
        // Cette fonction est synchrone (pas d'appel réseau)
        const favorites = storage.getFavorites();

        // Nettoyage de la grille avant affichage
        this.favoritesGrid.innerHTML = '';

        // Si aucun favori, afficher un message explicatif
        if (favorites.length === 0) {
            ui.showNoResults(this.favoritesGrid, 'Aucun favori pour le moment. Ajoutez des films et séries à vos favoris !');
            return; // Sortie anticipée de la fonction
        }

        // Tri des favoris par date d'ajout (plus récent en premier)
        // sort() modifie le tableau en place
        // new Date() convertit la chaîne ISO en objet Date pour comparer
        // La soustraction de dates retourne la différence en millisecondes
        // Si b - a > 0, b est plus récent et vient avant a
        favorites.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

        // Création d'une carte pour chaque favori
        favorites.forEach(item => {
            // Création de la carte visuelle personnalisée pour les favoris
            const card = this.createFavoriteCard(item);
            // Ajout de la carte à la grille
            this.favoritesGrid.appendChild(card);
        });
    }

    /**
     * Crée une carte visuelle pour un favori
     * Similaire à ui.createMediaCard mais avec gestion spécifique des favoris
     * @param {Object} item - Objet favori depuis le localStorage
     * @returns {HTMLElement} - Élément div.media-card
     */
    createFavoriteCard(item) {
        // Création de la div conteneur
        const card = document.createElement('div');
        card.className = 'media-card';
        
        // Construction de l'URL de l'affiche
        // item.poster contient le chemin (pas l'URL complète)
        const posterUrl = api.getImageUrl(item.poster);
        
        // Formatage de la note avec 1 décimale
        // toFixed(1) arrondit à 1 chiffre après la virgule
        const rating = item.rating ? item.rating.toFixed(1) : 'N/A';

        // Construction du HTML de la carte
        // Bouton favori toujours actif (coeur plein) sur cette page
        // data-id et data-type stockent les infos pour la suppression
        // Affiche du film/série avec lazy loading
        // Opérateur || pour afficher 'N/A' si pas de date
        card.innerHTML = `
            <button class="favorite-btn active" data-id="${item.id}" data-type="${item.type}">
                ❤️
            </button>
            <img src="${posterUrl}" alt="${item.title}" loading="lazy">
            <div class="media-card-content">
                <h3>${item.title}</h3>
                <div class="rating">⭐ ${rating}</div>
                <div class="date">${item.date || 'N/A'}</div>
            </div>
        `;

        // === GESTION DU CLIC SUR LA CARTE ===
        // Redirection vers la page détail
        card.addEventListener('click', (e) => {
            // Si on n'a PAS cliqué sur le bouton favori
            if (!e.target.closest('.favorite-btn')) {
                // Navigation vers la page détail avec paramètres URL
                window.location.href = `detail.html?id=${item.id}&type=${item.type}`;
            }
        });

        // === GESTION DU BOUTON FAVORI ===
        // Sur cette page, cliquer le coeur retire le favori
        const favoriteBtn = card.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            // Empêcher la propagation pour ne pas déclencher le clic de la carte
            e.stopPropagation();
            
            // Suppression du favori du localStorage
            storage.removeFromFavorites(item.id, item.type);
            
            // Suppression visuelle de la carte (animation via CSS possible)
            // remove() enlève l'élément du DOM immédiatement
            card.remove();

            // Si c'était le dernier favori, afficher un message
            if (storage.getFavorites().length === 0) {
                ui.showNoResults(this.favoritesGrid, 'Aucun favori pour le moment. Ajoutez des films et séries à vos favoris !');
            }
        });

        // Retour de la carte complète et fonctionnelle
        return card;
    }
}

// === POINT D'ENTRÉE DU SCRIPT ===
// Initialisation automatique au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Création d'une instance de la page favoris
    const favoritesPage = new FavoritesPage();
    
    // Démarrage de l'initialisation
    favoritesPage.init();
});
