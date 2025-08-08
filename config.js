/**
 * Configuration centralisée pour MCQED
 */

// Configuration centralisée pour MCQED
const MCQED_CONFIG = {
    security: {
        // Configuration de connexion
        maxLoginAttempts: 3,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes en millisecondes
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
        passwordSalt: "mcqed_salt_2024",
        
        // Identifiants par défaut
        credentials: {
            username: "admin",
            passwordHash: "d6bc443508400efa5b039044984ffefbd132606fa1168eb37d9cac7ec11bea99"
        },
        
        // Mot de passe de suppression par défaut
        deletionPassword: "admin123"
    },
    
    // Configuration de l'application
    app: {
        name: "MCQED",
        version: "2.0",
        description: "Plateforme de QCM"
    }
};

// Fonction pour obtenir la configuration de sécurité
function getSecurityConfig() {
    return {
        maxAttempts: MCQED_CONFIG.security.maxLoginAttempts,
        lockoutDuration: MCQED_CONFIG.security.lockoutDuration,
        sessionTimeout: MCQED_CONFIG.security.sessionTimeout,
        salt: MCQED_CONFIG.security.passwordSalt,
        credentials: MCQED_CONFIG.security.credentials,
        deletionPassword: MCQED_CONFIG.security.deletionPassword
    };
}

// Fonction pour sauvegarder la configuration
function saveSecurityConfig(config) {
    if (config.maxAttempts) MCQED_CONFIG.security.maxLoginAttempts = config.maxAttempts;
    if (config.lockoutDuration) MCQED_CONFIG.security.lockoutDuration = config.lockoutDuration;
    if (config.sessionTimeout) MCQED_CONFIG.security.sessionTimeout = config.sessionTimeout;
    if (config.salt) MCQED_CONFIG.security.passwordSalt = config.salt;
    if (config.credentials) MCQED_CONFIG.security.credentials = config.credentials;
    if (config.deletionPassword) MCQED_CONFIG.security.deletionPassword = config.deletionPassword;
    
    // Sauvegarder dans localStorage
    localStorage.setItem('mcqed_config', JSON.stringify(MCQED_CONFIG));
}

// Fonction pour charger la configuration depuis localStorage
function loadSecurityConfig() {
    const savedConfig = localStorage.getItem('mcqed_config');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            Object.assign(MCQED_CONFIG, parsed);
        } catch (e) {
            console.error('Erreur lors du chargement de la configuration:', e);
        }
    }
}

// Charger la configuration au démarrage
loadSecurityConfig();

// Fonctions utilitaires de configuration
const ConfigUtils = {
    /**
     * Obtient une valeur de configuration
     */
    get(path) {
        return path.split('.').reduce((obj, key) => obj && obj[key], MCQED_CONFIG);
    },

    /**
     * Définit une valeur de configuration
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, MCQED_CONFIG);
        target[lastKey] = value;
    },

    /**
     * Vérifie si une fonctionnalité est activée
     */
    isEnabled(feature) {
        return this.get(feature) === true;
    },

    /**
     * Obtient la configuration de sécurité
     */
    getSecurityConfig() {
        return MCQED_CONFIG.security;
    },

    /**
     * Obtient la configuration de l'interface
     */
    getUIConfig() {
        return MCQED_CONFIG.ui;
    },

    /**
     * Obtient la configuration des QCM
     */
    getQuizConfig() {
        return MCQED_CONFIG.quiz;
    },

    /**
     * Obtient la configuration des notifications
     */
    getNotificationConfig() {
        return MCQED_CONFIG.notifications;
    },

    /**
     * Obtient la configuration des données
     */
    getDataConfig() {
        return MCQED_CONFIG.data;
    },

    /**
     * Vérifie si l'application est en mode développement
     */
    isDevelopment() {
        return MCQED_CONFIG.development.debug;
    },

    /**
     * Log une message si le debug est activé
     */
    log(message, level = 'info') {
        if (MCQED_CONFIG.development.debug && MCQED_CONFIG.development.enableConsoleLogs) {
            const levels = ['debug', 'info', 'warn', 'error'];
            const currentLevel = levels.indexOf(MCQED_CONFIG.development.logLevel);
            const messageLevel = levels.indexOf(level);
            
            if (messageLevel >= currentLevel) {
                console[level](`[MCQED Config] ${message}`);
            }
        }
    }
};

// Export pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MCQED_CONFIG, ConfigUtils };
} 