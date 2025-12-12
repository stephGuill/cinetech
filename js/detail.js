// Import des services nécessaires
import api from './api.js';         // Service API pour les appels TMDB
import ui from './ui.js';           // Service UI pour créer les éléments visuels
import storage from './storage.js'; // Service de stockage pour favoris et commentaires
import search from './search.js';   // Service de recherche

/**
 * Classe gérant la page détail (detail.html)
 * Affiche toutes les informations complètes d'un film ou d'une série
 * Inclut: infos détaillées, cast, suggestions similaires, commentaires
 * Page la plus complexe car elle agrège plusieurs sources de données
 */
class DetailPage {
    /**
     * Constructeur: initialise les références DOM et récupère les paramètres URL
     * Les paramètres URL déterminent quel média afficher
     */
    constructor() {
        // Référence vers le conteneur principal du détail
        this.detailContent = document.getElementById('detailContent');
        
        // Référence vers le conteneur des médias similaires
        this.similarMedia = document.getElementById('similarMedia');
        
        // Référence vers le conteneur de la liste des commentaires
        this.commentsList = document.getElementById('commentsList');
        
        // Référence vers le bouton de soumission de commentaire
        this.submitCommentBtn = document.getElementById('submitComment');
        
        // Référence vers le textarea du commentaire
        this.commentText = document.getElementById('commentText');
        
        // === RÉCUPÉRATION DES PARAMÈTRES URL ===
        // URLSearchParams analyse les paramètres après le ? dans l'URL
        // Exemple: detail.html?id=123&type=movie
        const urlParams = new URLSearchParams(window.location.search);
        
        // Extraction de l'ID du média depuis l'URL
        // get('id') retourne la valeur du paramètre 'id' ou null
        this.mediaId = urlParams.get('id');
        
        // Extraction du type de média ('movie' ou 'tv')
        this.mediaType = urlParams.get('type');
    }

    /**
     * Initialise la page détail
     * Coordonne le chargement de toutes les sections
     */
    async init() {
        // Initialisation du système de recherche dans le header
        search.init();

        // === VALIDATION DES PARAMÈTRES ===
        // Si l'ID ou le type est manquant dans l'URL, rediriger vers l'accueil
        // Guard clause pour éviter les erreurs
        if (!this.mediaId || !this.mediaType) {
            window.location.href = 'index.html';
            return; // Arrêt de l'initialisation
        }

        // Chargement des détails du média (infos principales)
        // await attend la fin du chargement avant de continuer
        await this.loadDetails();

        // Chargement des suggestions de médias similaires
        await this.loadSimilar();

        // Chargement des commentaires (API + locaux)
        // Pas d'await car c'est une méthode synchrone
        this.loadComments();

        // === CONFIGURATION DE L'ÉVÉNEMENT COMMENTAIRE ===
        // Écouteur sur le bouton "Publier" pour ajouter un commentaire
        // Fonction fléchée pour conserver le contexte 'this'
        this.submitCommentBtn.addEventListener('click', () => this.addComment());
    }

    /**
     * Charge les détails complets du média depuis l'API
     * Appelle l'endpoint approprié selon le type (film ou série)
     */
    async loadDetails() {
        // Gestion des erreurs avec try-catch
        try {
            // Affichage d'un indicateur de chargement
            ui.showLoading(this.detailContent);
            
            // Variable pour stocker les données reçues de l'API
            let data;
            
            // Appel API différent selon le type de média
            if (this.mediaType === 'movie') {
                // Appel pour un film avec toutes les infos (crédits, avis, similaires)
                data = await api.getMovieDetails(this.mediaId);
            } else {
                // Appel pour une série avec toutes les infos
                // Les séries ont des champs différents (nombre d'épisodes, saisons, etc.)
                data = await api.getSeriesDetails(this.mediaId);
            }

            // Affichage des données reçues
            // Création de toute l'interface visuelle détaillée
            this.displayDetails(data);
        } catch (error) {
            // En cas d'erreur (réseau, API, ID invalide, etc.)
            console.error('Erreur lors du chargement des détails:', error);
            // Affichage d'un message d'erreur à l'utilisateur
            ui.showError(this.detailContent);
        }
    }

    /**
     * Affiche toutes les informations détaillées du média
     * Construit l'interface complète avec toutes les sections
     * @param {Object} data - Objet de données complet retourné par l'API
     */
    displayDetails(data) {
        // === EXTRACTION ET FORMATAGE DES DONNÉES ===
        
        // Titre: 'title' pour films, 'name' pour séries
        const title = data.title || data.name;
        
        // URL de l'affiche (poster) en résolution moyenne (w500)
        const posterUrl = api.getImageUrl(data.poster_path);
        
        // URL de l'image de fond (backdrop) en résolution originale (haute qualité)
        // Utilisée comme hero image en haut de la page
        const backdropUrl = api.getImageUrl(data.backdrop_path, 'original');
        
        // Note moyenne formatée avec 1 décimale (ex: 7.5/10)
        const rating = data.vote_average ? data.vote_average.toFixed(1) : 'N/A';
        
        // Date de sortie formatée en français
        const date = ui.formatDate(data.release_date || data.first_air_date);
        
        // Durée: différent pour films et séries
        // Films: runtime en minutes (ex: 142)
        // Séries: episode_run_time est un tableau, on prend le premier élément
        const runtime = data.runtime ? ui.formatRuntime(data.runtime) : 
                       data.episode_run_time && data.episode_run_time[0] ? 
                       `${data.episode_run_time[0]} min/épisode` : 'N/A';
        
        // Genres: tableau d'objets {id, name}
        // map() extrait les noms, join() les combine en une chaîne séparée par virgules
        // Exemple: "Action, Science-Fiction, Aventure"
        const genres = data.genres ? data.genres.map(g => g.name).join(', ') : 'N/A';
        
        // Synopsis: description du film/série
        const overview = data.overview || 'Aucune description disponible.';
        
        // Vérification si ce média est dans les favoris de l'utilisateur
        // Conversion en nombre car les IDs d'URL sont des strings
        const isFavorite = storage.isFavorite(this.mediaId, this.mediaType);

        // Hero section avec backdrop
        const heroSection = document.createElement('div');
        heroSection.className = 'detail-hero';
        heroSection.style.backgroundImage = `url('${backdropUrl}')`;
        
        const detailContentDiv = document.createElement('div');
        detailContentDiv.className = 'detail-content';

        const container = document.createElement('div');
        container.className = 'container';

        const mainDiv = document.createElement('div');
        mainDiv.className = 'detail-main';

        mainDiv.innerHTML = `
            <div class="detail-poster">
                <img src="${posterUrl}" alt="${title}">
                <button class="btn favorite-btn-detail ${isFavorite ? 'active' : ''}" 
                        data-id="${this.mediaId}" 
                        data-type="${this.mediaType}">
                    ${isFavorite ? '❤️ Retirer des favoris' : '🤍 Ajouter aux favoris'}
                </button>
            </div>
            <div class="detail-info">
                <h1>${title}</h1>
                <div class="detail-meta">
                    <span class="detail-rating">⭐ ${rating}/10</span>
                    <span>📅 ${date}</span>
                    <span>⏱️ ${runtime}</span>
                </div>
                <div class="detail-genres">
                    <strong>Genres:</strong> ${genres}
                </div>
                <div class="detail-overview">
                    <h3>Synopsis</h3>
                    <p>${overview}</p>
                </div>
                ${data.production_countries && data.production_countries.length > 0 ? 
                    `<div><strong>Pays d'origine:</strong> ${data.production_countries.map(c => c.name).join(', ')}</div>` : ''}
            </div>
        `;

        // Section acteurs
        if (data.credits && data.credits.cast && data.credits.cast.length > 0) {
            const castSection = document.createElement('div');
            castSection.innerHTML = '<h2>Acteurs principaux</h2>';
            const castGrid = document.createElement('div');
            castGrid.className = 'detail-credits';

            data.credits.cast.slice(0, 6).forEach(actor => {
                const actorDiv = document.createElement('div');
                actorDiv.className = 'credit-item';
                const profileUrl = api.getImageUrl(actor.profile_path, 'w185');
                actorDiv.innerHTML = `
                    <img src="${profileUrl}" alt="${actor.name}">
                    <h4>${actor.name}</h4>
                    <p>${actor.character}</p>
                `;
                castGrid.appendChild(actorDiv);
            });

            castSection.appendChild(castGrid);
            mainDiv.querySelector('.detail-info').appendChild(castSection);
        }

        container.appendChild(mainDiv);
        detailContentDiv.appendChild(heroSection);
        detailContentDiv.appendChild(container);
        this.detailContent.innerHTML = '';
        this.detailContent.appendChild(detailContentDiv);

        // Gestion du bouton favori
        const favoriteBtn = this.detailContent.querySelector('.favorite-btn-detail');
        favoriteBtn.addEventListener('click', () => {
            const isFav = storage.isFavorite(this.mediaId, this.mediaType);
            
            if (isFav) {
                storage.removeFromFavorites(parseInt(this.mediaId), this.mediaType);
                favoriteBtn.classList.remove('active');
                favoriteBtn.textContent = '🤍 Ajouter aux favoris';
            } else {
                storage.addToFavorites({ 
                    id: parseInt(this.mediaId), 
                    type: this.mediaType,
                    ...data 
                });
                favoriteBtn.classList.add('active');
                favoriteBtn.textContent = '❤️ Retirer des favoris';
            }
        });
    }

    /**
     * Charge les suggestions similaires
     */
    async loadSimilar() {
        try {
            ui.showLoading(this.similarMedia);
            
            let data;
            if (this.mediaType === 'movie') {
                data = await api.getSimilarMovies(this.mediaId);
            } else {
                data = await api.getSimilarSeries(this.mediaId);
            }

            this.similarMedia.innerHTML = '';

            if (data.results && data.results.length > 0) {
                const similar = data.results.slice(0, 6);
                similar.forEach(item => {
                    const card = ui.createMediaCard(item, this.mediaType);
                    this.similarMedia.appendChild(card);
                });
            } else {
                ui.showNoResults(this.similarMedia, 'Aucune suggestion disponible');
            }
        } catch (error) {
            console.error('Erreur lors du chargement des suggestions:', error);
            ui.showError(this.similarMedia);
        }
    }

    /**
     * Charge les commentaires
     */
    async loadComments() {
        try {
            this.commentsList.innerHTML = '';

            // Charger les commentaires de l'API
            let apiComments = [];
            let data;
            
            if (this.mediaType === 'movie') {
                data = await api.getMovieDetails(this.mediaId);
            } else {
                data = await api.getSeriesDetails(this.mediaId);
            }

            if (data.reviews && data.reviews.results) {
                apiComments = data.reviews.results;
            }

            // Charger les commentaires locaux
            const localComments = storage.getComments(this.mediaId, this.mediaType);

            // Combiner les commentaires
            const allComments = [...apiComments, ...localComments];

            if (allComments.length === 0) {
                ui.showNoResults(this.commentsList, 'Aucun commentaire pour le moment. Soyez le premier à commenter !');
                return;
            }

            // Afficher les commentaires parents
            const parentComments = allComments.filter(c => !c.parentId);
            parentComments.forEach(comment => {
                const commentElement = ui.createCommentElement(comment, this.mediaId, this.mediaType);
                
                // Afficher les réponses
                const replies = allComments.filter(c => c.parentId === comment.id);
                const repliesContainer = commentElement.querySelector('.comment-replies');
                replies.forEach(reply => {
                    repliesContainer.appendChild(ui.createCommentElement(reply, this.mediaId, this.mediaType));
                });

                this.commentsList.appendChild(commentElement);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des commentaires:', error);
            ui.showError(this.commentsList);
        }
    }

    /**
     * Ajoute un commentaire
     */
    addComment() {
        const content = this.commentText.value.trim();
        
        if (!content) {
            alert('Veuillez saisir un commentaire');
            return;
        }

        const comment = storage.addComment(this.mediaId, this.mediaType, content);
        
        // Ajouter le commentaire à la liste
        const commentElement = ui.createCommentElement(comment, this.mediaId, this.mediaType);
        this.commentsList.insertBefore(commentElement, this.commentsList.firstChild);

        // Réinitialiser le champ
        this.commentText.value = '';

        // Si c'est le premier commentaire, retirer le message "aucun commentaire"
        const noResults = this.commentsList.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
}

// Initialiser la page au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    const detailPage = new DetailPage();
    detailPage.init();
});
