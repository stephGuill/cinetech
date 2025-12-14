import search from './search.js';

/**
 * Gestion du formulaire de contact
 */
class ContactPage {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.formMessage = document.getElementById('formMessage');
    }

    init() {
        // Initialisation de la recherche
        search.init();
        
        // Écouteur du formulaire
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    /**
     * Gestion de la soumission du formulaire
     */
    handleSubmit(e) {
        e.preventDefault();
        
        // Récupération des données du formulaire
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Simulation d'envoi (dans un vrai projet, envoyer à un backend)
        console.log('Données du formulaire:', formData);
        
        // Affichage du message de succès
        this.showMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Réinitialisation du formulaire
        this.form.reset();
    }

    /**
     * Affiche un message de retour
     */
    showMessage(text, type = 'success') {
        this.formMessage.textContent = text;
        this.formMessage.className = `form-message ${type}`;
        this.formMessage.style.display = 'block';
        
        // Masquer après 5 secondes
        setTimeout(() => {
            this.formMessage.style.display = 'none';
        }, 5000);
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const page = new ContactPage();
    page.init();
});
