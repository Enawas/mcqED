/**
 * Script de réinitialisation de l'environnement MCQED
 * Permet de repartir sur un environnement propre comme si le site venait d'être déployé
 */

const fs = require('fs');
const path = require('path');

console.log('🔄 Début de la réinitialisation de l\'environnement MCQED...');

// Fonction pour nettoyer le localStorage côté client
function generateClientResetScript() {
    return `
// Script de nettoyage côté client
console.log('🧹 Nettoyage du localStorage...');

// Supprimer toutes les données MCQED du localStorage
const keysToRemove = [
    'mcqed_config',
    'mcqed_user',
    'mcqed_session',
    'mcqed_questions',
    'mcqed_qcm_data',
    'mcqed_favorites',
    'mcqed_progress',
    'mcqed_settings',
    'mcqed_theme',
    'mcqed_language',
    'mcqed_notifications',
    'mcqed_analytics',
    'mcqed_cache',
    'mcqed_temp_data'
];

// Supprimer les clés spécifiques
keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log('✅ Supprimé:', key);
    }
});

// Supprimer toutes les clés qui commencent par 'mcqed_'
const allKeys = Object.keys(localStorage);
allKeys.forEach(key => {
    if (key.startsWith('mcqed_')) {
        localStorage.removeItem(key);
        console.log('✅ Supprimé:', key);
    }
});

// Nettoyer sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage nettoyé');

// Nettoyer les cookies liés à MCQED
document.cookie.split(";").forEach(function(c) { 
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Cookies nettoyés');
console.log('🎉 Environnement MCQED réinitialisé avec succès !');
console.log('🔄 Veuillez recharger la page pour continuer.');
`;
}

// Fonction pour créer un fichier de réinitialisation HTML
function createResetPage() {
    const resetScript = generateClientResetScript();
    
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation MCQED</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 20px;
        }
        .status {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: left;
        }
        .btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px;
            transition: all 0.3s ease;
        }
        .btn:hover {
            background: #0056b3;
            transform: translateY(-2px);
        }
        .btn-danger {
            background: #dc3545;
        }
        .btn-danger:hover {
            background: #c82333;
        }
        .log {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
            max-height: 200px;
            overflow-y: auto;
            font-family: monospace;
            font-size: 12px;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔄 Réinitialisation MCQED</h1>
        <p>Cette page va nettoyer toutes les données de votre environnement MCQED.</p>
        
        <div class="status">
            <strong>⚠️ Attention :</strong> Cette action va supprimer :
            <ul>
                <li>Toutes les données utilisateur</li>
                <li>Les QCM et questions personnalisées</li>
                <li>Les préférences et paramètres</li>
                <li>L'historique et les favoris</li>
                <li>Les sessions actives</li>
            </ul>
        </div>
        
        <button class="btn btn-danger" onclick="resetEnvironment()">
            🧹 Réinitialiser l'environnement
        </button>
        
        <button class="btn" onclick="window.location.href='/'">
            🏠 Retour à l'accueil
        </button>
        
        <div id="log" class="log" style="display: none;"></div>
    </div>

    <script>
        function log(message) {
            const logDiv = document.getElementById('log');
            logDiv.style.display = 'block';
            logDiv.innerHTML += message + '\\n';
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        function resetEnvironment() {
            if (!confirm('Êtes-vous sûr de vouloir réinitialiser complètement l\'environnement MCQED ? Cette action est irréversible.')) {
                return;
            }
            
            log('🔄 Début de la réinitialisation...');
            
            ${resetScript}
            
            setTimeout(() => {
                log('✅ Réinitialisation terminée !');
                log('🔄 Redirection vers la page de connexion...');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }, 1000);
        }
    </script>
</body>
</html>`;

    fs.writeFileSync('reset-environment.html', htmlContent);
    console.log('✅ Fichier reset-environment.html créé');
}

// Fonction pour nettoyer les fichiers temporaires
function cleanTempFiles() {
    const tempFiles = [
        'temp_questions.json',
        'temp_qcm_data.json',
        'backup_questions.json',
        'migration_log.txt'
    ];
    
    tempFiles.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(`✅ Fichier temporaire supprimé: ${file}`);
        }
    });
}

// Fonction principale
function resetEnvironment() {
    console.log('📋 Étapes de réinitialisation :');
    console.log('1. Création de la page de réinitialisation');
    console.log('2. Nettoyage des fichiers temporaires');
    console.log('3. Génération du script de nettoyage client');
    
    try {
        // Créer la page de réinitialisation
        createResetPage();
        
        // Nettoyer les fichiers temporaires
        cleanTempFiles();
        
        console.log('\n🎉 Réinitialisation terminée !');
        console.log('\n📋 Prochaines étapes :');
        console.log('1. Démarrez le serveur : npm start');
        console.log('2. Accédez à : http://localhost:8000/reset-environment.html');
        console.log('3. Cliquez sur "Réinitialiser l\'environnement"');
        console.log('4. Vous serez redirigé vers la page de connexion');
        console.log('5. Connectez-vous avec les identifiants par défaut');
        
    } catch (error) {
        console.error('❌ Erreur lors de la réinitialisation:', error);
    }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
    resetEnvironment();
}

module.exports = { resetEnvironment, generateClientResetScript };
