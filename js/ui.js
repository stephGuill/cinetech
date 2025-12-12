// Import du service API pour construire les URLs d'images
import api from './api.js';
// Import du service de stockage pour gérer les favoris
import storage from './storage.js';

/**
 * Classe UI (User Interface) pour gérer tous les composants d'interface
 * Cette classe centralise la création et la manipulation des éléments visuels
 * Elle crée les cartes de films, commentaires, messages d'erreur, etc.
 */
class UI {
    /**
     * Crée une carte visuelle pour afficher un film ou une série
     * Cette carte contient l'affiche, le titre, la note et un bouton favori
     * @param {Object} item - Objet contenant toutes les données du média (depuis l'API)
     * @param {string} type - Type du média: 'movie' pour film, 'tv' pour série
     * @returns {HTMLElement} - Élément DOM div.media-card prêt à être inséré
     */
    createMediaCard(item, type) {
        // Création d'un élément div qui contiendra toute la carte
        const card = document.createElement('div');
        // Ajout de la classe CSS 'media-card' pour le styling
        card.className = 'media-card';
        
        // Extraction du titre: 'title' pour les films, 'name' pour les séries
        // L'opérateur || retourne la première valeur qui n'est pas null/undefined
        const title = item.title || item.name;
        
        // Extraction de la date: 'release_date' pour films, 'first_air_date' pour séries
        // Si aucune date, afficher 'N/A' (Not Available)
        const date = item.release_date || item.first_air_date || 'N/A';
        
        // Formatage de la note sur 10: toFixed(1) arrondit à 1 décimale
        // Exemple: 7.543 devient "7.5"
        const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
        
        // Construction de l'URL complète de l'affiche via le service API
        const posterUrl = api.getImageUrl(item.poster_path);
        
        // Vérification si ce média est déjà dans les favoris de l'utilisateur
        const isFavorite = storage.isFavorite(item.id, type);

        // Construction du HTML interne de la carte avec template literals (backticks)
        // Les ${} permettent d'insérer des variables JavaScript dans le HTML
        // Bouton favori positionné en haut à droite de la carte
        // La classe 'active' est ajoutée si déjà en favori (ternaire: condition ? si_vrai : si_faux)
        // data-id et data-type sont des attributs HTML personnalisés pour stocker des infos
        // Émoji différent selon l'état: coeur plein si favori, coeur vide sinon
        // Image de l'affiche avec lazy loading (chargement différé pour optimiser)
        // Conteneur pour les informations textuelles (titre, note, date)
        card.innerHTML = `
            <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}" data-type="${type}">
                ${isFavorite ? '❤️' : '🤍'}
            </button>
            <img src="${posterUrl}" alt="${title}" loading="lazy">
            <div class="media-card-content">
                <h3>${title}</h3>
                <div class="rating">⭐ ${rating}</div>
                <div class="date">${date}</div>
            </div>
        `;

        // Ajout d'un écouteur d'événement pour le clic sur toute la carte
        // addEventListener attache une fonction à exécuter lors du clic
        card.addEventListener('click', (e) => {
            // e.target = élément cliqué, closest() cherche l'ancêtre le plus proche
            // Si on n'a PAS cliqué sur le bouton favori (pour éviter conflit)
            if (!e.target.closest('.favorite-btn')) {
                // Redirection vers la page détail avec paramètres URL
                // Exemple: detail.html?id=123&type=movie
                window.location.href = `detail.html?id=${item.id}&type=${type}`;
            }
        });

        // Sélection du bouton favori dans la carte
        // querySelector trouve le premier élément correspondant au sélecteur CSS
        const favoriteBtn = card.querySelector('.favorite-btn');
        
        // Écouteur spécifique pour le bouton favori
        favoriteBtn.addEventListener('click', (e) => {
            // stopPropagation empêche l'événement de remonter au parent (la carte)
            // Sans ça, cliquer le bouton déclencherait aussi le clic de la carte
            e.stopPropagation();
            
            // Appel de la méthode pour basculer l'état favori
            this.toggleFavorite(item, type, favoriteBtn);
        });

        // Retour de l'élément carte complet et fonctionnel
        return card;
    }

    /**
     * Bascule (toggle) l'état favori: ajoute si pas présent, retire si déjà présent
     * Met à jour visuellement le bouton et le localStorage
     * @param {Object} item - Objet média complet avec toutes ses données
     * @param {string} type - Type du média ('movie' ou 'tv')
     * @param {HTMLElement} button - Élément bouton HTML à mettre à jour visuellement
     */
    toggleFavorite(item, type, button) {
        // Vérification de l'état actuel dans le localStorage
        const isFavorite = storage.isFavorite(item.id, type);
        
        // Structure conditionnelle: faire l'inverse de l'état actuel
        if (isFavorite) {
            // Si déjà en favori, le retirer
            storage.removeFromFavorites(item.id, type);
            // Retirer la classe CSS 'active' (change la couleur/style)
            button.classList.remove('active');
            // Changer l'émoji pour coeur vide
            button.textContent = '🤍';
        } else {
            // Si pas en favori, l'ajouter
            // Spread operator {...item} copie toutes les propriétés de item
            // puis ajoute/écrase la propriété type
            storage.addToFavorites({ ...item, type });
            // Ajouter la classe CSS 'active'
            button.classList.add('active');
            // Changer l'émoji pour coeur plein
            button.textContent = '❤️';
        }
    }

    /**
     * Affiche un indicateur de chargement pendant les requêtes asynchrones
     * Feedback visuel pour l'utilisateur qu'une opération est en cours
     * @param {HTMLElement} container - Élément DOM où afficher le message
     */
    showLoading(container) {
        // Remplacement du contenu HTML par un message de chargement
        // innerHTML remplace tout le contenu de l'élément
        container.innerHTML = '<div class="loading">Chargement...</div>';
    }

    /**
     * Affiche un message quand aucune donnée n'est disponible
     * Utilisé pour les recherches sans résultat, favoris vides, etc.
     * @param {HTMLElement} container - Élément DOM où afficher le message
     * @param {string} message - Message personnalisé (valeur par défaut fournie)
     */
    showNoResults(container, message = 'Aucun résultat trouvé') {
        // Paramètre par défaut: si message n'est pas fourni, utilise le texte par défaut
        container.innerHTML = `<div class="no-results">${message}</div>`;
    }

    /**
     * Affiche un message d'erreur quand une opération échoue
     * Feedback visuel en cas de problème API, réseau, etc.
     * @param {HTMLElement} container - Élément DOM où afficher l'erreur
     * @param {string} message - Message d'erreur personnalisé
     */
    showError(container, message = 'Une erreur est survenue') {
        // Ajout d'un émoji croix rouge pour indiquer visuellement l'erreur
        container.innerHTML = `<div class="no-results">❌ ${message}</div>`;
    }

    /**
     * Formate une date ISO en format français lisible
     * Exemple: "2025-12-01" devient "1 décembre 2025"
     * @param {string} dateString - Date au format ISO (YYYY-MM-DD)
     * @returns {string} - Date formatée en français ou 'N/A'
     */
    formatDate(dateString) {
        // Si pas de date fournie, retourner 'N/A'
        if (!dateString) return 'N/A';
        
        // Création d'un objet Date JavaScript à partir de la chaîne ISO
        const date = new Date(dateString);
        
        // toLocaleDateString formate selon les conventions locales
        // 'fr-FR' = format français de France
        return date.toLocaleDateString('fr-FR', { 
            year: 'numeric',  // Année en chiffres complets (2025)
            month: 'long',    // Mois en toutes lettres (décembre)
            day: 'numeric'    // Jour en chiffres (1)
        });
    }

    /**
     * Convertit une durée en minutes vers format "heures et minutes"
     * Exemple: 142 minutes devient "2h 22min"
     * @param {number} minutes - Durée totale en minutes
     * @returns {string} - Durée formatée "Xh Ymin" ou 'N/A'
     */
    formatRuntime(minutes) {
        // Si pas de durée fournie, retourner 'N/A'
        if (!minutes) return 'N/A';
        
        // Math.floor arrondit vers le bas pour obtenir les heures complètes
        // Exemple: 142 / 60 = 2.36... -> Math.floor = 2
        const hours = Math.floor(minutes / 60);
        
        // Opérateur modulo % retourne le reste de la division
        // Exemple: 142 % 60 = 22 (les minutes restantes)
        const mins = minutes % 60;
        
        // Construction de la chaîne avec template literal
        return `${hours}h ${mins}min`;
    }

    /**
     * Crée un élément HTML pour afficher un commentaire
     * Gère les commentaires TMDB (API) et les commentaires locaux (localStorage)
     * Inclut les boutons répondre et supprimer, formulaire de réponse
     * @param {Object} comment - Objet commentaire avec author, content, date, etc.
     * @param {number} mediaId - ID du film/série concerné
     * @param {string} mediaType - Type du média ('movie' ou 'tv')
     * @returns {HTMLElement} - Élément div.comment complet et interactif
     */
    createCommentElement(comment, mediaId, mediaType) {
        // Création de la div conteneur du commentaire
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        
        // dataset permet de stocker des données personnalisées dans l'élément HTML
        // Accessible via HTML: data-comment-id="123"
        // Accessible via JS: element.dataset.commentId
        commentDiv.dataset.commentId = comment.id;

        // Formatage de la date avec notre méthode
        // created_at pour commentaires TMDB, date pour commentaires locaux
        const date = this.formatDate(comment.created_at || comment.date);
        
        // Récupération du nom d'auteur avec plusieurs fallbacks
        // Optional chaining ?. évite les erreurs si author_details est undefined
        const author = comment.author || comment.author_details?.username || 'Utilisateur';
        
        // Contenu textuel du commentaire
        const content = comment.content;

        // Construction du HTML du commentaire avec template literal
        commentDiv.innerHTML = `
            // En-tête avec nom d'auteur et date
            <div class="comment-header">
                <span class="comment-author">${author}</span>
                <span class="comment-date">${date}</span>
            </div>
            // Contenu textuel du commentaire
            <div class="comment-content">${content}</div>
            // Actions possibles sur le commentaire
            <div class="comment-actions">
                // Bouton répondre (toujours présent)
                <button class="comment-btn reply-btn">Répondre</button>
                // Bouton supprimer (seulement pour commentaires locaux)
                // Ternaire conditionnel: affiche le bouton si isLocal est true
                ${comment.isLocal ? '<button class="comment-btn delete-btn">Supprimer</button>' : ''}
            </div>
            // Formulaire de réponse (caché par défaut via CSS)
            <div class="reply-form">
                <textarea placeholder="Votre réponse..."></textarea>
                <button class="btn submit-reply">Publier</button>
            </div>
            // Conteneur pour afficher les réponses à ce commentaire
            <div class="comment-replies"></div>
        `;

        // === GESTION DES INTERACTIONS DU COMMENTAIRE ===
        
        // Sélection des éléments pour gérer les réponses
        const replyBtn = commentDiv.querySelector('.reply-btn');
        const replyForm = commentDiv.querySelector('.reply-form');
        const submitReply = commentDiv.querySelector('.submit-reply');
        const replyTextarea = commentDiv.querySelector('.reply-form textarea');

        // Clic sur "Répondre": affiche/cache le formulaire de réponse
        replyBtn.addEventListener('click', () => {
            // toggle bascule la classe: ajoute si absente, retire si présente
            // La classe 'active' rend le formulaire visible via CSS
            replyForm.classList.toggle('active');
        });

        // Clic sur "Publier" dans le formulaire de réponse
        submitReply.addEventListener('click', () => {
            // Récupération et nettoyage du texte (trim enlève espaces début/fin)
            const replyContent = replyTextarea.value.trim();
            
            // Si le contenu n'est pas vide
            if (replyContent) {
                // Ajout de la réponse au localStorage avec comment.id comme parentId
                // Cela crée une relation parent-enfant entre commentaires
                const reply = storage.addComment(mediaId, mediaType, replyContent, comment.id);
                
                // Sélection du conteneur des réponses
                const repliesContainer = commentDiv.querySelector('.comment-replies');
                
                // Création et ajout de l'élément visuel de la réponse (récursif!)
                // createCommentElement s'appelle elle-même pour créer la réponse
                repliesContainer.appendChild(this.createCommentElement(reply, mediaId, mediaType));
                
                // Réinitialisation du formulaire
                replyTextarea.value = '';
                replyForm.classList.remove('active');
            }
        });

        // === GESTION DE LA SUPPRESSION ===
        // Seulement pour les commentaires locaux (isLocal = true)
        if (comment.isLocal) {
            const deleteBtn = commentDiv.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                // confirm() affiche une boîte de dialogue de confirmation
                // Retourne true si OK, false si Annuler
                if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
                    // Suppression du localStorage
                    storage.deleteComment(mediaId, mediaType, comment.id);
                    // Suppression du DOM (élément visuel)
                    // remove() enlève l'élément de la page
                    commentDiv.remove();
                }
            });
        }

        // Retour de l'élément commentaire complet et fonctionnel
        return commentDiv;
    }
}

// Export d'une instance unique de la classe UI (Singleton)
// Permet d'utiliser les mêmes méthodes partout sans recréer d'instance
// Usage: import ui from './ui.js'; puis ui.createMediaCard(...)
export default new UI();
