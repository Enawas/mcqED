/* ===== SCRIPT D'APPLICATION DU MODE SOMBRE ===== */

// Liste des fichiers HTML à mettre à jour
const htmlFiles = [
    'admin-profile.html',
    'diagnostic-login.html',
    'password-generator.html',
    'debug-login.html',
    'debug-qcm-structure.html',
    'test-security.html',
    'test-password.html'
];

// Fonction pour ajouter les liens CSS et JS du mode sombre
function addDarkModeToHTML(filePath) {
    const fs = require('fs');
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // Ajouter le lien CSS du mode sombre après FontAwesome
        if (content.includes('font-awesome') && !content.includes('dark-mode.css')) {
            content = content.replace(
                /<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/[^"]+">/,
                '$&\n    <link rel="stylesheet" href="dark-mode.css">'
            );
            modified = true;
        }
        
        // Ajouter le script JS du mode sombre avant la fermeture de body
        if (!content.includes('dark-mode.js')) {
            content = content.replace(
                /<\/body>/,
                '    <script src="dark-mode.js"></script>\n</body>'
            );
            modified = true;
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Mode sombre ajouté à ${filePath}`);
        } else {
            console.log(`ℹ️  ${filePath} déjà à jour`);
        }
        
    } catch (error) {
        console.error(`❌ Erreur lors de la modification de ${filePath}:`, error.message);
    }
}

// Fonction principale
function applyDarkModeToAllFiles() {
    console.log('🌙 Application du mode sombre à toutes les pages HTML...\n');
    
    htmlFiles.forEach(file => {
        addDarkModeToHTML(file);
    });
    
    console.log('\n✅ Mode sombre appliqué avec succès !');
    console.log('\n📋 Pages mises à jour :');
    htmlFiles.forEach(file => {
        console.log(`   - ${file}`);
    });
    
    console.log('\n🎯 Fonctionnalités du mode sombre :');
    console.log('   - Bouton de basculement dans la navigation');
    console.log('   - Sauvegarde automatique des préférences');
    console.log('   - Détection de la préférence système');
    console.log('   - Raccourci clavier : Ctrl/Cmd + Shift + T');
    console.log('   - Transitions fluides entre les thèmes');
}

// Exécuter si le script est appelé directement
if (typeof require !== 'undefined' && require.main === module) {
    applyDarkModeToAllFiles();
}

// Instructions d'utilisation manuelle
console.log(`
📝 INSTRUCTIONS POUR L'APPLICATION MANUELLE DU MODE SOMBRE :

1. Pour chaque fichier HTML, ajoutez ces lignes :

   Dans la section <head>, après FontAwesome :
   <link rel="stylesheet" href="dark-mode.css">

   Avant </body> :
   <script src="dark-mode.js"></script>

2. Fichiers à modifier :
   - admin-profile.html
   - diagnostic-login.html
   - password-generator.html
   - debug-login.html
   - debug-qcm-structure.html
   - test-security.html
   - test-password.html

3. Vérifiez que les fichiers dark-mode.css et dark-mode.js sont présents dans le dossier.

4. Testez le mode sombre en cliquant sur le bouton 🌙 dans la navigation.
`);

// Export pour utilisation dans d'autres scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addDarkModeToHTML,
        applyDarkModeToAllFiles,
        htmlFiles
    };
} 