/**
 * Module de sécurité pour MCQED
 * Gère l'authentification et la protection des pages
 */

class SecurityManager {
    constructor() {
        this.config = {
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            warningTime: 5 * 60 * 1000, // 5 minutes avant expiration
            checkInterval: 30 * 1000, // Vérification toutes les 30 secondes
            inactivityTimeout: 15 * 60 * 1000 // 15 minutes d'inactivité
        };
        
        this.sessionCheckInterval = null;
        this.inactivityTimer = null;
        this.isInitialized = false;
    }

    /**
     * Initialise le gestionnaire de sécurité
     */
    init() {
        if (this.isInitialized) return;
        
        // Vérifier la session au chargement
        if (!this.checkSession()) {
            this.redirectToLogin();
            return false;
        }
        
        this.startSessionMonitoring();
        this.startInactivityMonitoring();
        this.isInitialized = true;
        
        return true;
    }

    /**
     * Vérifie si la session est valide
     */
    checkSession() {
        const sessionData = sessionStorage.getItem('mcqed_session');
        if (!sessionData) {
            return false;
        }

        try {
            const session = JSON.parse(sessionData);
            const now = Date.now();
            
            if (session.expiresAt <= now) {
                // Session expirée
                sessionStorage.removeItem('mcqed_session');
                return false;
            }
            
            return true;
        } catch (e) {
            sessionStorage.removeItem('mcqed_session');
            return false;
        }
    }

    /**
     * Démarre la surveillance de session
     */
    startSessionMonitoring() {
        this.updateSessionTimer();
        this.sessionCheckInterval = setInterval(() => {
            this.updateSessionTimer();
        }, this.config.checkInterval);
    }

    /**
     * Met à jour le timer de session
     */
    updateSessionTimer() {
        const sessionData = this.getSessionData();
        if (!sessionData) return;
        
        const now = Date.now();
        const timeLeft = sessionData.expiresAt - now;
        
        if (timeLeft <= 0) {
            // Session expirée
            this.clearTimers();
            this.showSessionExpiredMessage();
            this.redirectToLogin();
            return;
        }
        
        // Mettre à jour l'affichage du timer si l'élément existe
        const timerElement = document.getElementById('session-timer');
        if (timerElement) {
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            timerElement.textContent = timeString;
            
            // Avertissement si la session expire bientôt
            if (timeLeft <= this.config.warningTime) {
                timerElement.style.color = '#dc3545';
                if (timeLeft <= 60000) { // 1 minute
                    timerElement.style.fontWeight = 'bold';
                }
            }
        }
    }

    /**
     * Démarre la surveillance d'inactivité
     */
    startInactivityMonitoring() {
        this.resetInactivityTimer();
        
        // Écouter les événements d'interaction utilisateur
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.resetInactivityTimer();
            }, true);
        });
    }

    /**
     * Réinitialise le timer d'inactivité
     */
    resetInactivityTimer() {
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
        }
        
        this.inactivityTimer = setTimeout(() => {
            if (this.checkSession()) {
                this.showInactivityMessage();
                this.logout();
            }
        }, this.config.inactivityTimeout);
    }

    /**
     * Obtient les données de session
     */
    getSessionData() {
        const sessionData = sessionStorage.getItem('mcqed_session');
        if (!sessionData) return null;
        
        try {
            return JSON.parse(sessionData);
        } catch (e) {
            return null;
        }
    }

    /**
     * Prolonge la session
     */
    extendSession() {
        const sessionData = this.getSessionData();
        if (!sessionData) return false;
        
        sessionData.expiresAt = Date.now() + this.config.sessionTimeout;
        sessionStorage.setItem('mcqed_session', JSON.stringify(sessionData));
        
        this.updateSessionTimer();
        this.showSuccessMessage('Session prolongée avec succès !');
        
        return true;
    }

    /**
     * Déconnecte l'utilisateur
     */
    logout() {
        this.clearTimers();
        sessionStorage.removeItem('mcqed_session');
        this.redirectToLogin();
    }

    /**
     * Nettoie tous les timers
     */
    clearTimers() {
        if (this.sessionCheckInterval) {
            clearInterval(this.sessionCheckInterval);
            this.sessionCheckInterval = null;
        }
        
        if (this.inactivityTimer) {
            clearTimeout(this.inactivityTimer);
            this.inactivityTimer = null;
        }
    }

    /**
     * Redirige vers la page de connexion
     */
    redirectToLogin() {
        window.location.href = 'login.html';
    }

    /**
     * Affiche un message de session expirée
     */
    showSessionExpiredMessage() {
        this.showMessage('Votre session a expiré. Vous allez être redirigé vers la page de connexion.', 'warning');
    }

    /**
     * Affiche un message d'inactivité
     */
    showInactivityMessage() {
        this.showMessage('Session expirée due à l\'inactivité. Vous allez être redirigé.', 'warning');
    }

    /**
     * Affiche un message de succès
     */
    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    /**
     * Affiche un message
     */
    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);';
        
        const icon = type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle';
        toast.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    isAuthenticated() {
        return this.checkSession();
    }

    /**
     * Obtient le nom d'utilisateur
     */
    getUsername() {
        const sessionData = this.getSessionData();
        return sessionData ? sessionData.userId : null;
    }

    /**
     * Obtient les informations de session
     */
    getSessionInfo() {
        const sessionData = this.getSessionData();
        if (!sessionData) return null;
        
        return {
            username: sessionData.userId,
            loginTime: new Date(sessionData.loginTime),
            expiresAt: new Date(sessionData.expiresAt),
            sessionId: sessionData.sessionId,
            userAgent: sessionData.userAgent
        };
    }
}

// Instance globale du gestionnaire de sécurité
const securityManager = new SecurityManager();

// Initialisation automatique au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    securityManager.init();
});

// Gestion de la fermeture de l'onglet/fenêtre
window.addEventListener('beforeunload', function() {
    securityManager.clearTimers();
});

// Fonctions globales pour l'utilisation dans les pages
window.logout = function() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        securityManager.logout();
    }
};

window.extendSession = function() {
    securityManager.extendSession();
};

window.showSessionInfo = function() {
    const sessionInfo = securityManager.getSessionInfo();
    if (!sessionInfo) {
        alert('Aucune session active');
        return;
    }
    
    const info = `
        Utilisateur : ${sessionInfo.username}
        Heure de connexion : ${sessionInfo.loginTime.toLocaleString('fr-FR')}
        Expiration : ${sessionInfo.expiresAt.toLocaleString('fr-FR')}
        ID de session : ${sessionInfo.sessionId.substring(0, 8)}...
    `;
    
    alert(info);
}; 