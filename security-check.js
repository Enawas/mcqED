// Script de vérification d'authentification côté client
// À inclure dans toutes les pages protégées

(function() {
    'use strict';
    
    // Fonction de vérification de session
    function checkSession() {
        const sessionData = sessionStorage.getItem('mcqed_session');
        if (!sessionData) {
            redirectToLogin('Session non trouvée');
            return false;
        }

        try {
            const session = JSON.parse(sessionData);
            const now = Date.now();
            
            if (session.expiresAt <= now) {
                // Session expirée
                sessionStorage.removeItem('mcqed_session');
                redirectToLogin('Session expirée');
                return false;
            }
            
            return true;
        } catch (e) {
            // Erreur de parsing JSON
            sessionStorage.removeItem('mcqed_session');
            redirectToLogin('Session invalide');
            return false;
        }
    }

    // Fonction de redirection vers la page de connexion
    function redirectToLogin(reason) {
        console.warn('Redirection vers la page de connexion:', reason);
        
        // Afficher un message à l'utilisateur
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc3545;
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        message.innerHTML = `
            <strong>Accès non autorisé</strong><br>
            ${reason}. Redirection vers la page de connexion...
        `;
        document.body.appendChild(message);
        
        // Rediriger après 2 secondes
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    }

    // Fonction de vérification d'URL autorisée
    function isPublicPage() {
        const publicPages = ['/login', '/', ''];
        const currentPath = window.location.pathname;
        return publicPages.includes(currentPath);
    }

    // Vérification immédiate au chargement de la page
    document.addEventListener('DOMContentLoaded', function() {
        // Si ce n'est pas une page publique, vérifier l'authentification
        if (!isPublicPage()) {
            if (!checkSession()) {
                return; // La redirection sera gérée par checkSession
            }
            
            // Session valide, continuer le chargement normal
            console.log('Session valide, accès autorisé');
        }
    });

    // Vérification lors de la navigation
    window.addEventListener('beforeunload', function() {
        // Optionnel : nettoyer les intervalles si nécessaire
    });

    // Exposer les fonctions globalement pour utilisation dans d'autres scripts
    window.SecurityCheck = {
        checkSession: checkSession,
        redirectToLogin: redirectToLogin,
        isPublicPage: isPublicPage
    };

})(); 