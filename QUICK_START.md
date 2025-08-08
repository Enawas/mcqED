# 🚀 Guide de Démarrage Rapide - MCQED

## 📋 **Prérequis**

### **Node.js (Recommandé)**
- **Télécharger** : [https://nodejs.org/](https://nodejs.org/)
- **Version** : 14.0.0 ou supérieure
- **Vérifier** : `node --version`

### **Python (Alternative)**
- **Télécharger** : [https://python.org/](https://python.org/)
- **Version** : 3.7 ou supérieure
- **Vérifier** : `python --version`

---

## 🎯 **Démarrage Rapide**

### **Option 1 : Serveur Node.js (Recommandé)**

#### **Installation automatique**
```bash
# Double-cliquer sur start-server.bat
# Ou exécuter manuellement :
npm install
npm start
```

#### **Installation manuelle**
```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer le serveur
npm start

# 3. Mode développement (redémarrage automatique)
npm run dev
```

### **Option 2 : Serveur Python**
```bash
# Serveur Python simple
python -m http.server 8000
# ou
npm run serve
```

---

## 🌐 **Accès à l'Application**

### **URLs Principales**
- **Connexion** : http://localhost:8000/login
- **Accueil** : http://localhost:8000/index
- **VMware QCM** : http://localhost:8000/vmware

### **Outils d'Administration**
- **Générateur de mot de passe** : http://localhost:8000/password-generator
- **Diagnostic système** : http://localhost:8000/diagnostic-login
- **Éditeur de questions** : http://localhost:8000/question-editor

---

## 🔐 **Connexion**

### **Identifiants par Défaut**
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin`

### **Changer le Mot de Passe**
1. Connectez-vous avec les identifiants par défaut
2. Menu utilisateur → "Générateur de mot de passe"
3. Générez un nouveau mot de passe
4. Modifiez `config.js` avec le nouveau hash

---

## 🛠️ **Fonctionnalités Disponibles**

### **Gestion des QCM**
- ✅ **VMware vSphere 8** : QCM complet (111 questions)
- ✅ **Création de nouveaux QCM** : Interface dynamique
- ✅ **Éditeur de questions** : Ajout/modification de questions

### **Sécurité**
- ✅ **Authentification sécurisée** : Hachage SHA-256 avec salt
- ✅ **Protection contre la force brute** : Limitation des tentatives
- ✅ **Sessions temporaires** : Expiration automatique
- ✅ **Verrouillage de compte** : Protection temporaire

### **Outils d'Administration**
- ✅ **Générateur de mot de passe** : Mots de passe sécurisés
- ✅ **Diagnostic système** : Vérification de configuration
- ✅ **Gestion des sessions** : Prolongation et monitoring

---

## 📁 **Structure des Fichiers**

```
MCQED/
├── 📄 index.html              # Page d'accueil principale
├── 📄 login.html              # Page de connexion
├── 📄 vmware.html             # QCM VMware vSphere 8
├── 📄 password-generator.html # Générateur de mots de passe
├── 📄 diagnostic-login.html   # Outil de diagnostic
├── 📄 question-editor.html    # Éditeur de questions
├── 📄 config.js               # Configuration centralisée
├── 📄 styles.css              # Styles CSS
├── 📄 script.js               # Logique JavaScript
├── 📄 package.json            # Configuration Node.js
├── 📄 server.js               # Serveur Express
├── 📄 start-server.bat        # Script de démarrage Windows
├── 📄 QUICK_START.md          # Ce guide
└── 📄 GUIDE_QCM_MANAGEMENT.md # Guide de gestion des QCM
```

---

## 🔧 **Dépannage**

### **Problèmes Courants**

#### **Port 8000 déjà utilisé**
```bash
# Changer le port dans server.js
const PORT = process.env.PORT || 8001;
```

#### **Erreur de dépendances**
```bash
# Supprimer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### **Problème de CORS**
- Le serveur est configuré pour le développement local
- CORS est activé pour localhost:8000

#### **Fichiers manquants**
- Vérifiez que tous les fichiers HTML sont présents
- Assurez-vous que `config.js` existe

---

## 🎯 **Commandes Utiles**

### **Développement**
```bash
# Mode développement (redémarrage automatique)
npm run dev

# Vérifier les dépendances
npm audit

# Mettre à jour les dépendances
npm update
```

### **Production**
```bash
# Démarrer en mode production
NODE_ENV=production npm start

# Vérifier la configuration
node -e "console.log(require('./config.js'))"
```

---

## 📞 **Support**

### **Logs du Serveur**
- Les logs s'affichent dans la console
- Informations de démarrage et erreurs

### **Diagnostic**
- Utilisez l'outil de diagnostic intégré
- Vérifiez la configuration de sécurité

---

**🎉 Prêt à utiliser MCQED !**

Lancez `start-server.bat` ou `npm start` et accédez à http://localhost:8000 