# 🌙 Guide du Mode Sombre - MCQED

## 📋 Vue d'ensemble

Le mode sombre a été implémenté sur toutes les pages du projet MCQED pour offrir une expérience utilisateur moderne et confortable pour les yeux.

## ✨ Fonctionnalités

### 🎯 **Basculement automatique**
- **Bouton dans la navigation** : Icône lune/soleil pour basculer entre les modes
- **Raccourci clavier** : `Ctrl/Cmd + Shift + T` pour basculer rapidement
- **Sauvegarde automatique** : La préférence est sauvegardée dans localStorage
- **Détection système** : Synchronisation avec la préférence système (première visite)

### 🎨 **Design adaptatif**
- **Couleurs harmonieuses** : Palette de couleurs optimisée pour chaque mode
- **Transitions fluides** : Animations douces entre les thèmes
- **Contraste optimal** : Lisibilité garantie dans les deux modes
- **Scrollbar personnalisée** : Style cohérent avec le thème

### 📱 **Responsive**
- **Mobile-friendly** : Optimisé pour tous les écrans
- **Touch-friendly** : Boutons adaptés aux écrans tactiles
- **Accessibilité** : Support des lecteurs d'écran

## 🛠️ Fichiers implémentés

### **CSS du mode sombre**
- `dark-mode.css` - Styles et variables CSS pour les deux thèmes

### **JavaScript du gestionnaire**
- `dark-mode.js` - Logique de basculement et gestion des préférences

### **Pages mises à jour**
- ✅ `index.html` - Dashboard principal
- ✅ `login.html` - Page de connexion
- ✅ `question-editor.html` - Éditeur de questions
- ✅ `qcm-player-pages.html` - Lecteur de QCM
- ✅ `examen-blanc.html` - Examen blanc
- ✅ `admin-profile.html` - Profil administrateur

## 🎨 Palette de couleurs

### **Mode clair (par défaut)**
```css
--bg-primary: #ffffff
--bg-secondary: #f8f9fa
--text-primary: #212529
--text-secondary: #6c757d
--border-color: #dee2e6
--primary-color: #667eea
```

### **Mode sombre**
```css
--bg-primary: #1a1a1a
--bg-secondary: #2d2d2d
--text-primary: #ffffff
--text-secondary: #b0b0b0
--border-color: #404040
--primary-color: #667eea
```

## 🔧 Utilisation

### **Pour l'utilisateur**
1. **Basculement manuel** : Cliquez sur l'icône 🌙/☀️ dans la navigation
2. **Raccourci clavier** : Utilisez `Ctrl/Cmd + Shift + T`
3. **Préférence automatique** : Le thème est sauvegardé automatiquement

### **Pour le développeur**

#### **Ajouter le mode sombre à une nouvelle page**
```html
<!-- Dans le <head> -->
<link rel="stylesheet" href="dark-mode.css">

<!-- Avant </body> -->
<script src="dark-mode.js"></script>
```

#### **Utiliser les variables CSS**
```css
.my-element {
    background: var(--bg-card);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}
```

#### **API JavaScript**
```javascript
// Basculer le thème
window.toggleTheme();

// Obtenir le thème actuel
const currentTheme = window.getCurrentTheme();

// Forcer un thème
window.setTheme('dark'); // ou 'light'
```

## 🎯 Éléments stylisés

### **Composants principaux**
- ✅ Navigation et header
- ✅ Cartes et conteneurs
- ✅ Formulaires et champs
- ✅ Boutons et actions
- ✅ Modals et popups
- ✅ Tableaux et listes
- ✅ Alertes et notifications
- ✅ Dropdowns et menus

### **Composants MCQED spécifiques**
- ✅ Dashboard et statistiques
- ✅ Cartes QCM
- ✅ Lecteur de QCM
- ✅ Éditeur de questions
- ✅ Examen blanc
- ✅ Chronomètre flottant

## 🔍 Dépannage

### **Le mode sombre ne fonctionne pas**
1. Vérifiez que `dark-mode.css` et `dark-mode.js` sont présents
2. Vérifiez que les liens sont correctement ajoutés dans le HTML
3. Ouvrez la console pour vérifier les erreurs JavaScript

### **Styles incohérents**
1. Utilisez les variables CSS au lieu de couleurs fixes
2. Vérifiez que les sélecteurs CSS sont corrects
3. Assurez-vous que les styles ne sont pas écrasés

### **Performance**
1. Les transitions sont optimisées pour la fluidité
2. Les variables CSS sont utilisées pour éviter les reflows
3. Le localStorage est utilisé pour la persistance

## 🚀 Fonctionnalités avancées

### **Détection automatique du système**
- Synchronisation avec `prefers-color-scheme`
- Adaptation automatique au thème système
- Possibilité de désactiver la synchronisation

### **Animations et transitions**
- Transitions fluides entre les thèmes
- Animation du bouton de basculement
- Notifications avec animations

### **Accessibilité**
- Support des lecteurs d'écran
- Contraste optimal pour la lisibilité
- Navigation au clavier

## 📝 Notes de développement

### **Bonnes pratiques**
1. **Utilisez toujours les variables CSS** pour les couleurs
2. **Testez dans les deux modes** avant de déployer
3. **Vérifiez le contraste** pour l'accessibilité
4. **Optimisez les performances** des transitions

### **Maintenance**
1. **Mise à jour des couleurs** : Modifiez uniquement `dark-mode.css`
2. **Ajout de nouvelles pages** : Suivez le guide d'implémentation
3. **Tests** : Vérifiez sur différents navigateurs et appareils

## 🎉 Résultat

Le mode sombre offre maintenant une expérience utilisateur moderne et cohérente sur toutes les pages du projet MCQED, avec une implémentation robuste et maintenable.

---

*Dernière mise à jour : $(date)*
*Version : 1.0* 