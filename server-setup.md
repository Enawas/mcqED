# 🔧 Configuration du Serveur MCQED

## 📋 **Vue d'Ensemble**

Ce document décrit la configuration du serveur Express pour l'application MCQED, permettant de lancer l'application en local sur le port 8000.

---

## 🏗️ **Architecture du Serveur**

### **Technologies Utilisées**
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **CORS** : Gestion des requêtes cross-origin
- **Static Files** : Servir les fichiers HTML/CSS/JS

### **Structure du Serveur**
```
server.js
├── Configuration Express
├── Middleware CORS
├── Routes statiques
├── Routes API
└── Gestion d'erreurs
```

---

## ⚙️ **Configuration**

### **Port et Environnement**
```javascript
const PORT = process.env.PORT || 8000;
```
- **Développement** : Port 8000 par défaut
- **Production** : Variable d'environnement PORT

### **CORS Configuration**
```javascript
app.use(cors({
    origin: ['http://localhost:8000', 'http://127.0.0.1:8000'],
    credentials: true
}));
```
- **Origines autorisées** : localhost et 127.0.0.1
- **Credentials** : Support des cookies/sessions

### **Fichiers Statiques**
```javascript
app.use(express.static(path.join(__dirname)));
```
- **Racine** : Répertoire courant
- **Accès direct** : Tous les fichiers HTML/CSS/JS

---

## 🛣️ **Routes Configurées**

### **Routes Principales**
| Route | Fichier | Description |
|-------|---------|-------------|
| `/` | `login.html` | Page de connexion (racine) |
| `/login` | `login.html` | Page de connexion |
| `/index` | `index.html` | Page d'accueil |
| `/vmware` | `vmware.html` | QCM VMware |

### **Routes d'Administration**
| Route | Fichier | Description |
|-------|---------|-------------|
| `/password-generator` | `password-generator.html` | Générateur de mots de passe |
| `/diagnostic-login` | `diagnostic-login.html` | Outil de diagnostic |
| `/question-editor` | `question-editor.html` | Éditeur de questions |

### **API Routes**
| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/qcm` | GET | Récupération des QCM (futur) |

---

## 🔒 **Sécurité**

### **Headers de Sécurité**
```javascript
// À ajouter pour la production
app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
```

### **Validation des Entrées**
```javascript
// Middleware de validation
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

### **Gestion des Erreurs**
```javascript
// 404 - Redirection vers login
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'login.html'));
});
```

---

## 🚀 **Démarrage du Serveur**

### **Commandes Disponibles**
```bash
# Démarrage normal
npm start

# Mode développement (redémarrage automatique)
npm run dev

# Serveur Python alternatif
npm run serve
```

### **Logs de Démarrage**
```
🚀 Serveur MCQED démarré sur http://localhost:8000
📁 Répertoire racine: /path/to/mcqed
🔒 Sécurité: CORS activé pour le développement
⏰ Heure de démarrage: 01/01/2024, 12:00:00

📋 Pages disponibles:
   • Connexion: http://localhost:8000/login
   • Accueil: http://localhost:8000/index
   • VMware QCM: http://localhost:8000/vmware
   • Générateur: http://localhost:8000/password-generator
   • Diagnostic: http://localhost:8000/diagnostic-login
   • Éditeur: http://localhost:8000/question-editor

🎯 Pour arrêter le serveur: Ctrl+C
```

---

## 🔧 **Configuration Avancée**

### **Variables d'Environnement**
```bash
# .env (à créer)
PORT=8000
NODE_ENV=development
CORS_ORIGIN=http://localhost:8000
```

### **Middleware Personnalisé**
```javascript
// Logging des requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Compression (pour la production)
const compression = require('compression');
app.use(compression());
```

### **Rate Limiting**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite par IP
});

app.use(limiter);
```

---

## 📊 **Monitoring et Logs**

### **Logs de Performance**
```javascript
// Middleware de timing
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${duration}ms`);
    });
    next();
});
```

### **Gestion des Erreurs**
```javascript
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});
```

---

## 🚀 **Déploiement**

### **Production**
```bash
# Installer les dépendances de production
npm install --production

# Démarrer en mode production
NODE_ENV=production npm start
```

### **Docker (Optionnel)**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

---

## 🔍 **Dépannage**

### **Problèmes Courants**

#### **Port déjà utilisé**
```bash
# Vérifier les processus
netstat -ano | findstr :8000
# ou
lsof -i :8000

# Tuer le processus
taskkill /PID <PID> /F
```

#### **Erreurs de CORS**
- Vérifier la configuration CORS
- Ajouter l'origine manquante
- Vérifier les credentials

#### **Fichiers non trouvés**
- Vérifier les chemins relatifs
- S'assurer que tous les fichiers existent
- Vérifier les permissions

---

## 📈 **Optimisations**

### **Performance**
- **Compression** : Gzip pour les fichiers statiques
- **Cache** : Headers de cache appropriés
- **Minification** : CSS/JS minifiés en production

### **Sécurité**
- **HTTPS** : Certificats SSL en production
- **Headers** : Headers de sécurité
- **Validation** : Validation des entrées

---

**🎯 Objectif :** Serveur Express optimisé et sécurisé pour MCQED ! 