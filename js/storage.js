/**
 * Service pour gérer le stockage local (localStorage)
 * Cette classe gère la persistance des données côté client (favoris, commentaires)
 * Le localStorage permet de conserver les données même après fermeture du navigateur
 */
class StorageService {
    /**
     * Récupère la liste des favoris depuis le localStorage
     * @returns {Array} - Tableau des favoris ou tableau vide si aucun favori
     */
    getFavorites() {
        // Récupération de la chaîne JSON stockée sous la clé 'cinetech_favorites'
        const favorites = localStorage.getItem('cinetech_favorites');
        
        // Si des favoris existent, les parser de JSON vers objet JavaScript
        // Sinon retourner un tableau vide []
        // L'opérateur ternaire ? : est un if...else condensé
        return favorites ? JSON.parse(favorites) : [];
    }

    /**
     * Sauvegarde la liste des favoris dans le localStorage
     * @param {Array} favorites - Tableau complet des favoris à sauvegarder
     */
    saveFavorites(favorites) {
        // Conversion du tableau JavaScript en chaîne JSON
        // puis stockage dans le localStorage sous la clé 'cinetech_favorites'
        // JSON.stringify convertit un objet/tableau en texte JSON
        localStorage.setItem('cinetech_favorites', JSON.stringify(favorites));
    }

    /**
     * Ajoute un film ou une série aux favoris
     * @param {Object} item - Objet contenant les infos du média à ajouter
     * @returns {boolean} - true si ajouté, false si déjà existant
     */
    addToFavorites(item) {
        // Récupération des favoris actuels
        const favorites = this.getFavorites();
        
        // Vérification si l'élément existe déjà dans les favoris
        // find() retourne l'élément trouvé ou undefined
        // On compare à la fois l'ID et le type (car un film et une série peuvent avoir le même ID)
        const exists = favorites.find(fav => fav.id === item.id && fav.type === item.type);
        
        // Si l'élément n'existe pas encore
        if (!exists) {
            // Ajout du nouvel élément avec uniquement les données nécessaires
            favorites.push({
                id: item.id,                                    // ID unique du média
                type: item.type,                                // 'movie' ou 'tv'
                title: item.title || item.name,                 // Titre (films) ou nom (séries)
                poster: item.poster_path,                       // Chemin vers l'affiche
                rating: item.vote_average,                      // Note moyenne
                date: item.release_date || item.first_air_date, // Date de sortie
                addedAt: new Date().toISOString()              // Timestamp d'ajout aux favoris
            });
            
            // Sauvegarde du tableau mis à jour
            this.saveFavorites(favorites);
            return true; // Succès de l'ajout
        }
        return false; // Déjà dans les favoris, pas d'ajout
    }

    /**
     * Retire un élément des favoris
     * @param {number} id - ID du média à retirer
     * @param {string} type - Type du média ('movie' ou 'tv')
     */
    removeFromFavorites(id, type) {
        // Récupération des favoris actuels
        const favorites = this.getFavorites();
        
        // Filtrage: garde tous les favoris SAUF celui à supprimer
        // filter() crée un nouveau tableau avec les éléments qui passent le test
        // !(condition) = NOT condition (inverse le résultat)
        const filtered = favorites.filter(fav => !(fav.id === id && fav.type === type));
        
        // Sauvegarde du tableau filtré (sans l'élément supprimé)
        this.saveFavorites(filtered);
    }

    /**
     * Vérifie si un média est dans les favoris
     * @param {number} id - ID du média à vérifier
     * @param {string} type - Type du média ('movie' ou 'tv')
     * @returns {boolean} - true si dans les favoris, false sinon
     */
    isFavorite(id, type) {
        // Récupération des favoris
        const favorites = this.getFavorites();
        
        // some() retourne true si AU MOINS UN élément satisfait la condition
        // Vérifie s'il existe un favori avec cet ID et ce type
        return favorites.some(fav => fav.id === id && fav.type === type);
    }

    /**
     * Récupère les commentaires pour un média spécifique depuis le localStorage
     * @param {number} id - ID du film ou série
     * @param {string} type - Type du média ('movie' ou 'tv')
     * @returns {Array} - Tableau des commentaires ou tableau vide
     */
    getComments(id, type) {
        // Construction d'une clé unique pour chaque média
        // Exemple: 'cinetech_comments_movie_123' ou 'cinetech_comments_tv_456'
        // Cela permet de séparer les commentaires de chaque film/série
        const key = `cinetech_comments_${type}_${id}`;
        
        // Récupération depuis le localStorage avec cette clé unique
        const comments = localStorage.getItem(key);
        
        // Parse JSON si existe, sinon retourner tableau vide
        return comments ? JSON.parse(comments) : [];
    }

    /**
     * Sauvegarde les commentaires d'un média dans le localStorage
     * @param {number} id - ID du média
     * @param {string} type - Type du média ('movie' ou 'tv')
     * @param {Array} comments - Tableau complet des commentaires à sauvegarder
     */
    saveComments(id, type, comments) {
        // Construction de la même clé unique que dans getComments
        const key = `cinetech_comments_${type}_${id}`;
        
        // Conversion en JSON et stockage dans le localStorage
        localStorage.setItem(key, JSON.stringify(comments));
    }

    /**
     * Ajoute un nouveau commentaire pour un média
     * @param {number} id - ID du média
     * @param {string} type - Type du média ('movie' ou 'tv')
     * @param {string} content - Texte du commentaire saisi par l'utilisateur
     * @param {number} parentId - ID du commentaire parent (null si commentaire principal)
     * @returns {Object} - Le nouveau commentaire créé
     */
    addComment(id, type, content, parentId = null) {
        // Récupération des commentaires existants pour ce média
        const comments = this.getComments(id, type);
        
        // Création du nouvel objet commentaire
        const newComment = {
            id: Date.now(),                    // ID unique basé sur timestamp (millisecondes)
            author: 'Utilisateur',             // Nom de l'auteur (fixe car pas d'authentification)
            content: content,                  // Texte du commentaire
            date: new Date().toISOString(),   // Date au format ISO (2025-12-01T10:30:00.000Z)
            parentId: parentId,                // null pour commentaire principal, ID pour réponse
            isLocal: true                      // Flag pour différencier des commentaires TMDB
        };
        
        // Ajout du nouveau commentaire au tableau
        comments.push(newComment);
        
        // Sauvegarde du tableau mis à jour
        this.saveComments(id, type, comments);
        
        // Retour du commentaire créé (utile pour l'afficher immédiatement)
        return newComment;
    }

    /**
     * Supprime un commentaire local
     * @param {number} id - ID du média
     * @param {string} type - Type du média ('movie' ou 'tv')
     * @param {number} commentId - ID du commentaire à supprimer
     */
    deleteComment(id, type, commentId) {
        // Récupération des commentaires du média
        const comments = this.getComments(id, type);
        
        // Filtrage: garde tous les commentaires SAUF celui à supprimer
        // Supprime aussi les réponses liées (ayant ce commentaire comme parent)
        const filtered = comments.filter(comment => comment.id !== commentId);
        
        // Sauvegarde du tableau filtré
        this.saveComments(id, type, filtered);
    }
}

// Export d'une instance unique (Singleton pattern)
// Permet d'utiliser le même service partout dans l'application
// Usage: import storage from './storage.js'; puis storage.getFavorites()
export default new StorageService();
