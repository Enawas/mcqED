/**
 * Script de démarrage d'un environnement MCQED propre
 * Utilisez ce script pour démarrer MCQED comme si c'était un nouveau déploiement
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Démarrage d\'un environnement MCQED propre...');

// Vérifier si le serveur est déjà en cours d'exécution
function checkServerStatus() {
    return new Promise((resolve) => {
        const http = require('http');
        const req = http.request({
            hostname: 'localhost',
            port: 8000,
            path: '/',
            method: 'GET',
            timeout: 2000
        }, (res) => {
            resolve(true); // Serveur en cours d'exécution
        });
        
        req.on('error', () => {
            resolve(false); // Serveur non démarré
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Démarrer le serveur
function startServer() {
    console.log('📡 Démarrage du serveur MCQED...');
    
    const server = spawn('node', ['server.js'], {
        stdio: 'inherit',
        shell: true
    });
    
    server.on('error', (error) => {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
    });
    
    server.on('close', (code) => {
        console.log(`🛑 Serveur arrêté avec le code: ${code}`);
    });
    
    return server;
}

// Fonction principale
async function startFreshEnvironment() {
    try {
        // Vérifier si le serveur est déjà en cours d'exécution
        const isRunning = await checkServerStatus();
        
        if (isRunning) {
            console.log('⚠️  Le serveur MCQED est déjà en cours d\'exécution sur le port 8000');
            console.log('🔄 Arrêt du serveur existant...');
            
            // Arrêter le serveur existant
            const { exec } = require('child_process');
            exec('taskkill /f /im node.exe', (error) => {
                if (error) {
                    console.log('ℹ️  Aucun processus Node.js à arrêter');
                } else {
                    console.log('✅ Serveur existant arrêté');
                }
                
                // Attendre un peu puis redémarrer
                setTimeout(() => {
                    startServer();
                }, 2000);
            });
        } else {
            // Démarrer le serveur
            startServer();
        }
        
        console.log('\n📋 Instructions pour un environnement propre :');
        console.log('1. Le serveur démarre sur http://localhost:8000');
        console.log('2. Accédez à http://localhost:8000/reset-environment pour nettoyer les données');
        console.log('3. Ou connectez-vous directement avec les identifiants par défaut :');
        console.log('   • Utilisateur : admin');
        console.log('   • Mot de passe : admin123');
        console.log('\n🎯 Pour arrêter le serveur : Ctrl+C');
        
    } catch (error) {
        console.error('❌ Erreur lors du démarrage:', error);
    }
}

// Exécuter si le script est appelé directement
if (require.main === module) {
    startFreshEnvironment();
}

module.exports = { startFreshEnvironment };
