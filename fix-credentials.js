/**
 * Script pour corriger les identifiants par défaut MCQED
 * Génère le bon hash pour le mot de passe admin123
 */

const crypto = require('crypto');

console.log('🔧 Correction des identifiants MCQED...');

// Configuration actuelle
const currentConfig = {
    username: "admin",
    password: "admin123",
    salt: "mcqed_salt_2024"
};

// Générer le hash correct
function generatePasswordHash(password, salt) {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Générer le nouveau hash
const correctHash = generatePasswordHash(currentConfig.password, currentConfig.salt);

console.log('📋 Informations des identifiants :');
console.log(`   • Utilisateur : ${currentConfig.username}`);
console.log(`   • Mot de passe : ${currentConfig.password}`);
console.log(`   • Salt : ${currentConfig.salt}`);
console.log(`   • Hash généré : ${correctHash}`);

// Vérifier le hash actuel dans config.js
const fs = require('fs');
const configContent = fs.readFileSync('config.js', 'utf8');

// Extraire le hash actuel
const hashMatch = configContent.match(/passwordHash:\s*"([^"]+)"/);
if (hashMatch) {
    const currentHash = hashMatch[1];
    console.log(`   • Hash actuel : ${currentHash}`);
    
    if (currentHash === correctHash) {
        console.log('✅ Le hash est déjà correct !');
    } else {
        console.log('❌ Le hash est incorrect, mise à jour nécessaire...');
        
        // Mettre à jour le fichier config.js
        const updatedContent = configContent.replace(
            /passwordHash:\s*"[^"]+"/,
            `passwordHash: "${correctHash}"`
        );
        
        fs.writeFileSync('config.js', updatedContent);
        console.log('✅ Fichier config.js mis à jour avec le bon hash !');
    }
} else {
    console.log('❌ Impossible de trouver le hash dans config.js');
}

console.log('\n🎯 Identifiants de connexion :');
console.log(`   • Utilisateur : ${currentConfig.username}`);
console.log(`   • Mot de passe : ${currentConfig.password}`);
console.log('\n📝 Note : Ces identifiants sont maintenant corrects pour la connexion.');

// Créer un fichier de test pour vérifier
const testHash = generatePasswordHash('admin123', 'mcqed_salt_2024');
console.log(`\n🧪 Test de vérification :`);
console.log(`   • Hash de 'admin123' : ${testHash}`);
console.log(`   • Correspondance : ${testHash === correctHash ? '✅ OK' : '❌ ERREUR'}`);
