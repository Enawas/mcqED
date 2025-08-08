# 🚀 Guide de Démarrage d'un Environnement MCQED Propre

Ce guide vous explique comment repartir sur un environnement MCQED comme si le site venait d'être déployé, sans aucune donnée existante.

## 📋 Prérequis

- Node.js installé (version 14 ou supérieure)
- Toutes les dépendances installées (`npm install`)

## 🔄 Méthodes de Réinitialisation

### Méthode 1 : Script Automatique (Recommandée)

```bash
# Réinitialiser et démarrer automatiquement
npm run clean
```

Cette commande va :
1. Nettoyer toutes les données existantes
2. Créer la page de réinitialisation
3. Démarrer le serveur proprement

### Méthode 2 : Étapes Manuelles

#### Étape 1 : Réinitialiser l'environnement
```bash
npm run reset
```

#### Étape 2 : Démarrer le serveur propre
```bash
npm run fresh
```

### Méthode 3 : Interface Web

1. Démarrer le serveur normalement :
```bash
npm start
```

2. Accéder à la page de réinitialisation :
```
http://localhost:8000/reset-environment
```

3. Cliquer sur "Réinitialiser l'environnement"

## 🎯 Après la Réinitialisation

### Identifiants par Défaut

Une fois l'environnement réinitialisé, vous pouvez vous connecter avec :

- **Utilisateur** : `admin`
- **Mot de passe** : `admin123`

### Pages Disponibles

- **Connexion** : `http://localhost:8000/login`
- **Accueil** : `http://localhost:8000/index`
- **Réinitialisation** : `http://localhost:8000/reset-environment`

## 🧹 Ce qui est Nettoyé

La réinitialisation supprime :

### Données Locales (localStorage)
- Configuration MCQED (`mcqed_config`)
- Données utilisateur (`mcqed_user`)
- Sessions (`mcqed_session`)
- Questions personnalisées (`mcqed_questions`)
- QCM personnalisés (`mcqed_qcm_data`)
- Favoris (`mcqed_favorites`)
- Progression (`mcqed_progress`)
- Paramètres (`mcqed_settings`)
- Thème (`mcqed_theme`)
- Langue (`mcqed_language`)
- Notifications (`mcqed_notifications`)
- Analytics (`mcqed_analytics`)
- Cache (`mcqed_cache`)
- Données temporaires (`mcqed_temp_data`)

### Session et Cookies
- Toutes les données de session
- Tous les cookies liés à MCQED

### Fichiers Temporaires
- `temp_questions.json`
- `temp_qcm_data.json`
- `backup_questions.json`
- `migration_log.txt`

## ⚠️ Important

- **Cette action est irréversible** - toutes les données seront perdues
- **Sauvegardez** vos données importantes avant la réinitialisation
- **Les QCM de test** ne seront pas migrés (comme demandé)

## 🔧 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur normalement |
| `npm run dev` | Démarre en mode développement avec nodemon |
| `npm run reset` | Réinitialise l'environnement uniquement |
| `npm run fresh` | Démarre un environnement propre |
| `npm run clean` | Réinitialise ET démarre un environnement propre |

## 🚨 Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier les processus Node.js en cours
tasklist | findstr node

# Arrêter tous les processus Node.js
taskkill /f /im node.exe

# Redémarrer
npm run fresh
```

### Erreur de port déjà utilisé
```bash
# Vérifier le port 8000
netstat -ano | findstr :8000

# Arrêter le processus qui utilise le port
taskkill /PID [PID_NUMBER] /F
```

### Problèmes de permissions
```bash
# Exécuter en tant qu'administrateur si nécessaire
# Ou vérifier les permissions du dossier
```

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez que Node.js est bien installé
2. Vérifiez que toutes les dépendances sont installées
3. Consultez les logs du serveur pour plus d'informations
4. Redémarrez votre terminal/IDE si nécessaire

---

**🎉 Votre environnement MCQED est maintenant prêt pour un nouveau départ !**
