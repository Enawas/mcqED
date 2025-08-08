# 🔑 Guide de Connexion - MCQED

## 🚀 **Connexion Rapide**

### **Identifiants par Défaut**
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `admin`

### **Étapes de Connexion**
1. Ouvrez votre navigateur
2. Allez sur `login.html`
3. Entrez les identifiants ci-dessus
4. Cliquez sur "Se connecter"

---

## 🔧 **Si vous voulez changer le mot de passe**

### **Option 1 : Utiliser le Générateur (Recommandé)**
1. Cliquez sur "Générateur de mot de passe" sur la page de connexion
2. Générez un nouveau mot de passe sécurisé
3. Copiez le hash généré
4. Modifiez le fichier `config.js` avec le nouveau hash

### **Option 2 : Modification Manuelle**
1. Ouvrez le fichier `config.js`
2. Trouvez la section `credentials`
3. Remplacez le `passwordHash` par votre nouveau hash

---

## 🛠️ **Génération d'un Hash de Mot de Passe**

### **Dans la Console du Navigateur**
```javascript
// Ouvrez la console (F12) et tapez :
const password = "votre_nouveau_mot_de_passe";
const salt = "MCQED_SECURE_SALT_2024";
const hash = CryptoJS.SHA256(password + salt).toString();
console.log(hash);
```

### **Utilisation du Générateur Web**
1. Allez sur `password-generator.html`
2. Configurez vos préférences
3. Générez un mot de passe
4. Copiez le hash affiché

---

## 🔒 **Sécurité**

### **Fonctionnalités de Sécurité Actives**
- ✅ **Limitation des tentatives** : 5 tentatives max
- ✅ **Verrouillage temporaire** : 15 minutes après échec
- ✅ **Hachage sécurisé** : SHA-256 avec salt
- ✅ **Sessions temporaires** : Expiration automatique
- ✅ **Protection contre la force brute**

### **Recommandations**
- 🔐 Utilisez un mot de passe fort (12+ caractères)
- 🔄 Changez le mot de passe par défaut
- 💾 Sauvegardez vos identifiants en lieu sûr
- 🚫 Ne partagez jamais vos identifiants

---

## 🆘 **Problèmes de Connexion**

### **Compte Verrouillé**
- **Cause :** Trop de tentatives échouées
- **Solution :** Attendez 15 minutes ou videz le localStorage

### **Session Expirée**
- **Cause :** Inactivité prolongée
- **Solution :** Reconnectez-vous

### **Identifiants Incorrects**
- **Vérifiez :** Orthographe du nom d'utilisateur et mot de passe
- **Assurez-vous :** Que le fichier `config.js` n'a pas été modifié

---

## 📁 **Fichiers Importants**

- **`login.html`** - Page de connexion
- **`config.js`** - Configuration des identifiants
- **`password-generator.html`** - Générateur de mots de passe
- **`security.js`** - Gestionnaire de sécurité

---

## 💡 **Astuces**

1. **Sauvegarde** : Gardez une copie de vos identifiants
2. **Test** : Testez la connexion après modification
3. **Sécurité** : Utilisez des mots de passe uniques
4. **Navigation** : Utilisez les liens dans l'interface

---

**🎯 Objectif :** Accéder rapidement et en toute sécurité à votre plateforme MCQED ! 