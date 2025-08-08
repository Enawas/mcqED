const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8000;

// Configuration CORS pour le développement
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
}));

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de vérification d'authentification
function checkAuth(req, res, next) {
    // Pour une application client-side avec sessionStorage,
    // nous devons vérifier l'authentification côté client
    // Le serveur ne peut pas accéder directement au sessionStorage du navigateur
    
    // Solution temporaire : permettre l'accès mais laisser la vérification côté client
    // En production, utilisez des sessions serveur ou JWT
    
    // Pour l'instant, nous allons permettre l'accès aux fichiers
    // mais chaque page HTML vérifiera l'authentification côté client
    next();
    
    // Note: Cette approche n'est pas sécurisée pour la production
    // En production, implémentez une vraie authentification serveur
}

// Middleware pour les pages publiques (pas d'authentification requise)
function publicPages(req, res, next) {
    next();
}

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname)));

// Routes publiques (pas d'authentification requise)
app.get('/', publicPages, (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login', publicPages, (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Routes protégées (authentification requise)
app.get('/index', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route supprimée car vmware.html n'existe plus

// Route supprimée car vmware-json.html n'existe plus

app.get('/vmware-complete', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'vmware-complete.html'));
});

// Routes d'administration (authentification requise)
app.get('/password-generator', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'password-generator.html'));
});

app.get('/diagnostic-login', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'diagnostic-login.html'));
});

app.get('/question-editor', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'question-editor.html'));
});

// Route de réinitialisation de l'environnement (publique)
app.get('/reset-environment', publicPages, (req, res) => {
    res.sendFile(path.join(__dirname, 'reset-environment.html'));
});

// API pour la gestion des QCM personnalisés
app.get('/api/qcm', (req, res) => {
    // Endpoint pour récupérer les QCM personnalisés
    res.json({ message: 'API QCM - Fonctionnalité à implémenter' });
});

// Gestion des erreurs 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'login.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur MCQED démarré sur http://localhost:${PORT}`);
    console.log(`📁 Répertoire racine: ${__dirname}`);
    console.log(`🔒 Sécurité: CORS activé pour le développement`);
    console.log(`⏰ Heure de démarrage: ${new Date().toLocaleString('fr-FR')}`);
    console.log(`\n📋 Pages disponibles:`);
    console.log(`   • Connexion: http://localhost:${PORT}/login`);
    console.log(`   • Accueil: http://localhost:${PORT}/index`);
    console.log(`   • VMware QCM: http://localhost:${PORT}/vmware-complete`);
    console.log(`   • Générateur: http://localhost:${PORT}/password-generator`);
    console.log(`   • Diagnostic: http://localhost:${PORT}/diagnostic-login`);
    console.log(`   • Éditeur: http://localhost:${PORT}/question-editor`);
    console.log(`\n🎯 Pour arrêter le serveur: Ctrl+C`);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur MCQED...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Arrêt du serveur MCQED...');
    process.exit(0);
}); 