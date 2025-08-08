@echo off
echo ========================================
echo    🚀 Démarrage du Serveur MCQED
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Erreur: Node.js n'est pas installé ou n'est pas dans le PATH
    echo.
    echo 📥 Téléchargez Node.js depuis: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances
        pause
        exit /b 1
    )
    echo ✅ Dépendances installées
    echo.
)

echo 🌐 Démarrage du serveur sur http://localhost:8000
echo.
echo 📋 Commandes disponibles:
echo    • npm start     - Démarrer le serveur
echo    • npm run dev   - Mode développement (redémarrage automatique)
echo    • npm run serve - Serveur Python alternatif
echo.

REM Démarrer le serveur
echo 🚀 Lancement du serveur...
npm start

echo.
echo 🛑 Serveur arrêté
pause 