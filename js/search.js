// Import du service API pour effectuer les recherches
import api from './api.js';
// Import du service UI (utilisé pour les méthodes utilitaires si nécessaire)
import ui from './ui.js';

/**
 * Classe pour gérer la recherche avec autocomplétion asynchrone
 * Implémente un système de recherche en temps réel avec debounce
 * pour optimiser les appels API et améliorer l'expérience utilisateur
 */
class Search {
    /**
     * Constructeur: initialise les propriétés de la classe
     * Appelé automatiquement lors de la création d'une instance
     */
    constructor() {
        // Référence vers l'input de recherche (sera définie dans init)
        this.searchInput = null;
        
        // Référence vers le conteneur des résultats (sera définie dans init)
        this.searchResults = null;
        
        // Timer pour le debounce (éviter trop de requêtes API)
        // Stocke l'ID du setTimeout pour pouvoir l'annuler
        this.debounceTimer = null;
    }

    /**
     * Initialise le système de recherche
     * Configure les écouteurs d'événements et les références DOM
     * Doit être appelée après le chargement du DOM
     */
    init() {
        // Récupération des éléments DOM par leur ID
        // getElementById retourne l'élément ou null si non trouvé
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');

        // Si les éléments n'existent pas dans le DOM, arrêter l'initialisation
        // Guard clause pour éviter les erreurs
        if (!this.searchInput || !this.searchResults) return;

        // === ÉCOUTEUR PRINCIPAL: SAISIE DANS L'INPUT ===
        // 'input' se déclenche à chaque modification du champ
        this.searchInput.addEventListener('input', (e) => {
            // Annulation du timer précédent pour le debounce
            // Si l'utilisateur tape rapidement, seule la dernière saisie déclenchera la recherche
            clearTimeout(this.debounceTimer);
            
            // e.target = l'élément input, .value = texte saisi
            // trim() enlève les espaces au début et à la fin
            const query = e.target.value.trim();

            // Si moins de 2 caractères, ne pas chercher
            // Évite les recherches trop vagues et économise des appels API
            if (query.length < 2) {
                this.hideResults();
                return; // Sortie anticipée de la fonction
            }

            // Mise en place du debounce: attendre 300ms avant de chercher
            // Si l'utilisateur retape avant 300ms, le timer est réinitialisé
            // Cela évite de faire une requête API à chaque touche pressée
            this.debounceTimer = setTimeout(() => {
                // Après 300ms sans nouvelle saisie, lancer la recherche
                this.performSearch(query);
            }, 300); // 300 millisecondes = 0.3 seconde
        });

        // === ÉCOUTEUR GLOBAL: FERMER LES RÉSULTATS SI CLIC EXTÉRIEUR ===
        // Améliore l'UX en cachant les résultats quand on clique ailleurs
        document.addEventListener('click', (e) => {
            // closest() cherche l'ancêtre le plus proche avec cette classe
            // Si le clic n'est PAS dans le conteneur de recherche
            if (!e.target.closest('.search-container')) {
                // Cacher les résultats
                this.hideResults();
            }
        });
    }

    /**
     * Effectue une recherche asynchrone via l'API TMDB
     * @param {string} query - Terme de recherche saisi par l'utilisateur
     */
    async performSearch(query) {
        // Bloc try-catch pour gérer les erreurs réseau ou API
        try {
            // Appel asynchrone à l'API de recherche multi (films + séries + personnes)
            // await attend que la promesse soit résolue avant de continuer
            const data = await api.searchMulti(query);
            
            // Affichage des résultats reçus
            // data.results contient le tableau des résultats
            this.displayResults(data.results);
        } catch (error) {
            // En cas d'erreur (réseau, API down, etc.), log dans la console
            console.error('Erreur lors de la recherche:', error);
            // On pourrait aussi afficher un message d'erreur à l'utilisateur ici
        }
    }

    /**
     * Affiche les résultats de recherche dans le dropdown d'autocomplétion
     * @param {Array} results - Tableau des résultats retournés par l'API
     */
    displayResults(results) {
        // Si aucun résultat ou tableau vide
        if (!results || results.length === 0) {
            // Afficher un message "Aucun résultat"
            this.searchResults.innerHTML = '<div class="search-item">Aucun résultat</div>';
            this.showResults(); // Afficher le dropdown
            return; // Sortie de la fonction
        }

        // Filtrage des résultats pour ne garder que films et séries
        // L'API peut aussi retourner des personnes (acteurs), on les exclut
        const filtered = results.filter(item => 
            // filter() garde les éléments qui retournent true
            item.media_type === 'movie' || item.media_type === 'tv'
        ).slice(0, 5); // slice(0, 5) garde seulement les 5 premiers résultats

        // Vider le conteneur de résultats précédents
        this.searchResults.innerHTML = '';

        // Parcours de chaque résultat filtré
        // forEach exécute une fonction pour chaque élément du tableau
        filtered.forEach(item => {
            // Création de l'élément visuel pour ce résultat
            const searchItem = this.createSearchItem(item);
            // Ajout de l'élément au conteneur
            this.searchResults.appendChild(searchItem);
        });

        // Affichage du dropdown de résultats
        this.showResults();
    }

    /**
     * Crée un élément HTML pour un résultat de recherche individuel
     * @param {Object} item - Objet média retourné par l'API
     * @returns {HTMLElement} - Élément div.search-item cliquable
     */
    createSearchItem(item) {
        // Création de la div conteneur
        const div = document.createElement('div');
        div.className = 'search-item';

        // Extraction des données avec fallbacks
        const title = item.title || item.name; // Films ont 'title', séries ont 'name'
        const date = item.release_date || item.first_air_date || ''; // Date de sortie
        // Extraction de l'année depuis la date si disponible
        const year = date ? new Date(date).getFullYear() : '';
        // Conversion du type de média en français
        const type = item.media_type === 'movie' ? 'Film' : 'Série';
        // Construction de l'URL de l'affiche
        const posterUrl = api.getImageUrl(item.poster_path);

        // Construction du HTML interne
        div.innerHTML = `
            // Mini affiche (50x75px)
            <img src="${posterUrl}" alt="${title}">
            <div class="search-item-info">
                // Titre du film/série
                <h4>${title}</h4>
                // Type et année: ternaire pour afficher l'année seulement si disponible
                <p>${type}${year ? ` (${year})` : ''}</p>
            </div>
        `;

        // Ajout d'un écouteur de clic sur tout l'élément
        div.addEventListener('click', () => {
            // Redirection vers la page détail avec les bons paramètres
            // media_type de l'API est directement utilisé ('movie' ou 'tv')
            window.location.href = `detail.html?id=${item.id}&type=${item.media_type}`;
        });

        // Retour de l'élément complet
        return div;
    }

    /**
     * Affiche le dropdown des résultats de recherche
     * Ajoute la classe CSS 'active' qui le rend visible
     */
    showResults() {
        // classList.add() ajoute une classe CSS à l'élément
        // La classe 'active' a un display: block dans le CSS
        this.searchResults.classList.add('active');
    }

    /**
     * Cache le dropdown des résultats de recherche
     * Retire la classe CSS 'active' qui le rend invisible
     */
    hideResults() {
        // classList.remove() retire une classe CSS de l'élément
        this.searchResults.classList.remove('active');
    }
}

// Export d'une instance unique (Singleton)
// On crée directement l'objet au lieu d'exporter la classe
// Usage: import search from './search.js'; puis search.init()
export default new Search();
