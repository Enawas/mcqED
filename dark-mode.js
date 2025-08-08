/* ===== GESTIONNAIRE MODE SOMBRE - MCQED ===== */

// Classe pour gérer le thème
class ThemeManager {
    constructor() {
        this.theme = this.getStoredTheme();
        this.init();
    }

    // Initialiser le thème
    init() {
        this.applyTheme();
        this.createThemeToggle();
        this.setupEventListeners();
    }

    // Obtenir le thème stocké
    getStoredTheme() {
        return localStorage.getItem('mcqed_theme') || 'light';
    }

    // Sauvegarder le thème
    saveTheme(theme) {
        localStorage.setItem('mcqed_theme', theme);
        this.theme = theme;
    }

    // Appliquer le thème
    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Mettre à jour l'icône du bouton de thème
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = this.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        }

        // Mettre à jour le titre de la page pour l'accessibilité
        document.title = document.title.replace(/🌙|☀️/g, '') + (this.theme === 'dark' ? ' 🌙' : ' ☀️');
    }

    // Créer le bouton de basculement du thème
    createThemeToggle() {
        // Vérifier si le bouton existe déjà
        if (document.getElementById('theme-toggle')) {
            return;
        }

        // Trouver la navbar
        const navbar = document.querySelector('.navbar-nav');
        if (!navbar) {
            console.warn('Navbar non trouvée pour ajouter le bouton de thème');
            return;
        }

        // Créer le bouton de thème
        const themeToggle = document.createElement('div');
        themeToggle.className = 'nav-item';
        themeToggle.innerHTML = `
            <button class="nav-link theme-toggle" id="theme-toggle" title="Basculer le mode sombre">
                <i class="fas ${this.theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
            </button>
        `;

        // Insérer le bouton avant le dropdown utilisateur
        const userDropdown = navbar.querySelector('.dropdown');
        if (userDropdown) {
            navbar.insertBefore(themeToggle, userDropdown);
        } else {
            navbar.appendChild(themeToggle);
        }
    }

    // Configurer les écouteurs d'événements
    setupEventListeners() {
        // Écouteur pour le bouton de thème
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) {
                this.toggleTheme();
            }
        });

        // Écouteur pour les raccourcis clavier
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T pour basculer le thème
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Basculer le thème
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme(newTheme);
        this.applyTheme();
        
        // Afficher une notification
        this.showThemeNotification(newTheme);
        
        // Animation du bouton
        this.animateThemeToggle();
    }

    // Afficher une notification de changement de thème
    showThemeNotification(theme) {
        const message = theme === 'dark' ? 
            'Mode sombre activé' : 'Mode clair activé';
        
        // Utiliser la fonction de notification existante si disponible
        if (typeof showNotification === 'function') {
            showNotification(message, 'info');
        } else {
            // Notification simple si la fonction n'existe pas
            this.createSimpleNotification(message, theme);
        }
    }

    // Créer une notification simple
    createSimpleNotification(message, theme) {
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i class="fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}"></i>
            <span>${message}</span>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px var(--shadow-medium);
            border: 1px solid var(--border-color);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Supprimer la notification après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Animation du bouton de thème
    animateThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.style.transform = 'scale(0.8) rotate(180deg)';
            setTimeout(() => {
                themeToggle.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
        }
    }

    // Obtenir le thème actuel
    getCurrentTheme() {
        return this.theme;
    }

    // Vérifier si le mode sombre est actif
    isDarkMode() {
        return this.theme === 'dark';
    }

    // Détecter automatiquement la préférence système
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Synchroniser avec la préférence système
    syncWithSystemPreference() {
        const systemTheme = this.detectSystemPreference();
        if (this.theme !== systemTheme) {
            this.saveTheme(systemTheme);
            this.applyTheme();
        }
    }
}

// Styles CSS pour les animations de notification
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// Ajouter les styles d'animation
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Initialiser le gestionnaire de thème au chargement de la page
let themeManager;

document.addEventListener('DOMContentLoaded', function() {
    themeManager = new ThemeManager();
    
    // Synchroniser avec la préférence système si aucune préférence n'est sauvegardée
    if (!localStorage.getItem('mcqed_theme')) {
        themeManager.syncWithSystemPreference();
    }
});

// Exposer le gestionnaire de thème globalement
window.themeManager = themeManager;

// Fonction utilitaire pour basculer le thème depuis la console
window.toggleTheme = function() {
    if (themeManager) {
        themeManager.toggleTheme();
    }
};

// Fonction utilitaire pour obtenir le thème actuel
window.getCurrentTheme = function() {
    if (themeManager) {
        return themeManager.getCurrentTheme();
    }
    return 'light';
};

// Fonction utilitaire pour forcer un thème
window.setTheme = function(theme) {
    if (themeManager && (theme === 'light' || theme === 'dark')) {
        themeManager.saveTheme(theme);
        themeManager.applyTheme();
    }
}; 