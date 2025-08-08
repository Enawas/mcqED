# QcmCard - Composant React/Tailwind

Un composant React moderne et accessible pour afficher des cartes de QCM (Questionnaires à Choix Multiples) avec une interface utilisateur riche et des fonctionnalités avancées.

## 🚀 Fonctionnalités

### ✅ Structure complète
- **Titre et sous-titre** avec informations détaillées
- **Badge de statut** (Publié, Brouillon, Archivé)
- **Indicateurs rapides** : score moyen avec barre de progression, temps moyen
- **Icône de favori** avec toggle interactif

### ✅ Actions principales
- **Bouton "Lancer"** bien visible avec dégradé vert
- **Menu overflow** (⋯) avec actions secondaires :
  - Éditer (bleu)
  - Examen blanc (orange)
  - Dupliquer (violet)
  - Partager (vert)
  - Supprimer (rouge) avec confirmation

### ✅ Accessibilité (WCAG)
- **Labels ARIA** explicites sur tous les boutons
- **Contraste conforme** aux standards WCAG
- **Navigation au clavier** supportée
- **Lecteurs d'écran** compatibles
- **Focus management** approprié

### ✅ Responsive Design
- **Mobile-first** : empilement propre sur petits écrans
- **Action principale** toujours visible
- **Actions secondaires** dans menu adaptatif
- **Grille responsive** : 1 → 2 → 3 colonnes

### ✅ Interactions avancées
- **Hover/focus** : élévation et transitions fluides
- **Modal de confirmation** pour suppression
- **Option "Annuler"** avec undo rapide
- **Animations** et micro-interactions

### ✅ Performance
- **Lazy loading** avec skeleton state
- **Placeholder** pendant le chargement
- **Optimisations** React (memo, callback)
- **Bundle splitting** supporté

## 📦 Installation

```bash
npm install lucide-react
npm install -D tailwindcss @types/react
```

## 🎯 Utilisation basique

```tsx
import QcmCard from './QcmCard';

function App() {
  const handleLaunch = () => {
    console.log('QCM lancé !');
  };

  return (
    <QcmCard
      title="Réseaux – QCM 1"
      subtitle="15 questions · Mise à jour : 2 jours"
      status="published"
      averageScore={78}
      avgTime={12}
      isFavorite={true}
      onLaunch={handleLaunch}
      onEdit={() => console.log('Éditer')}
      onMockExam={() => console.log('Examen blanc')}
      onDuplicate={() => console.log('Dupliquer')}
      onDelete={() => console.log('Supprimer')}
      onShare={() => console.log('Partager')}
      onToggleFavorite={() => console.log('Toggle favori')}
    />
  );
}
```

## 🔧 Props détaillées

### Props principales

| Prop | Type | Requis | Description |
|------|------|--------|-------------|
| `title` | `string` | ✅ | Titre du QCM |
| `subtitle` | `string` | ✅ | Sous-titre avec infos |
| `status` | `'published' \| 'draft' \| 'archived'` | ✅ | Statut du QCM |
| `averageScore` | `number` | ✅ | Score moyen (0-100) |
| `avgTime` | `number` | ✅ | Temps moyen en minutes |
| `isFavorite` | `boolean` | ✅ | État favori |
| `loading` | `boolean` | ❌ | État de chargement |

### Callbacks d'actions

| Callback | Type | Description |
|----------|------|-------------|
| `onLaunch` | `() => void` | Action principale |
| `onEdit` | `() => void` | Éditer le QCM |
| `onMockExam` | `() => void` | Créer examen blanc |
| `onDuplicate` | `() => void` | Dupliquer le QCM |
| `onDelete` | `() => Promise<void> \| void` | Supprimer (avec confirmation) |
| `onShare` | `() => void` | Partager le QCM |
| `onToggleFavorite` | `() => void` | Toggle favori |

## 🎨 Personnalisation

### Variantes de statut

```tsx
// Statuts disponibles
const statuses = {
  published: {
    label: 'Publié',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  draft: {
    label: 'Brouillon', 
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertTriangle
  },
  archived: {
    label: 'Archivé',
    color: 'bg-gray-100 text-gray-800', 
    icon: XCircle
  }
};
```

### Palette de couleurs

```css
/* Couleurs par défaut */
--color-primary: #3b82f6;    /* Bleu */
--color-success: #10b981;    /* Vert */
--color-warning: #f59e0b;    /* Jaune */
--color-danger: #ef4444;     /* Rouge */
--color-purple: #8b5cf6;     /* Violet */
```

## 📱 Responsive Design

### Breakpoints Tailwind

```tsx
// Grille responsive automatique
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <QcmCard {...props} />
</div>
```

### Comportement mobile

- **Action principale** : Bouton "Lancer" en haut
- **Actions secondaires** : Menu hamburger (⋯)
- **Indicateurs** : Empilés verticalement
- **Texte** : Tronqué avec ellipsis

## ♿ Accessibilité

### Standards WCAG 2.1 AA

```tsx
// Labels ARIA automatiques
<button aria-label="Lancer le QCM">
  <Play className="w-5 h-5" />
  Lancer
</button>

// Navigation au clavier
<div role="button" tabIndex={0} onKeyDown={handleKeyDown}>
  {/* Contenu */}
</div>

// Focus management
<button onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
  {/* Bouton */}
</button>
```

### Contraste des couleurs

- **Texte principal** : 4.5:1 minimum
- **Texte secondaire** : 3:1 minimum  
- **Badges** : 4.5:1 minimum
- **Boutons** : 4.5:1 minimum

## ⚡ Performance

### Lazy Loading

```tsx
// Skeleton state
{loading && (
  <div className="animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
)}
```

### Optimisations React

```tsx
// Memoization
const QcmCard = React.memo(({ ...props }) => {
  // Composant optimisé
});

// Callbacks optimisés
const handleLaunch = useCallback(() => {
  // Action optimisée
}, []);
```

## 🔄 États du composant

### États principaux

1. **Normal** : Affichage complet
2. **Loading** : Skeleton state
3. **Hover** : Élévation et effets
4. **Focus** : Ring de focus
5. **Menu ouvert** : Dropdown visible
6. **Modal ouvert** : Confirmation suppression

### Transitions

```css
/* Transitions fluides */
transition: all 0.2s ease-in-out;

/* Hover effects */
hover:shadow-md hover:scale-[1.02];

/* Focus ring */
focus:ring-2 focus:ring-blue-500 focus:ring-offset-2;
```

## 🧪 Tests

### Tests unitaires recommandés

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import QcmCard from './QcmCard';

describe('QcmCard', () => {
  test('affiche le titre correctement', () => {
    render(<QcmCard title="Test QCM" {...defaultProps} />);
    expect(screen.getByText('Test QCM')).toBeInTheDocument();
  });

  test('appelle onLaunch au clic du bouton principal', () => {
    const onLaunch = jest.fn();
    render(<QcmCard onLaunch={onLaunch} {...defaultProps} />);
    fireEvent.click(screen.getByLabelText('Lancer le QCM'));
    expect(onLaunch).toHaveBeenCalled();
  });
});
```

## 📋 Exemple complet

```tsx
import React, { useState } from 'react';
import QcmCard from './QcmCard';

const Dashboard = () => {
  const [qcms, setQcms] = useState(mockData);

  const handleLaunch = (id: string) => {
    console.log(`Lancer QCM ${id}`);
  };

  const handleDelete = async (id: string) => {
    // Simulation API
    await api.deleteQcm(id);
    setQcms(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qcms.map(qcm => (
        <QcmCard
          key={qcm.id}
          title={qcm.title}
          subtitle={qcm.subtitle}
          status={qcm.status}
          averageScore={qcm.averageScore}
          avgTime={qcm.avgTime}
          isFavorite={qcm.isFavorite}
          onLaunch={() => handleLaunch(qcm.id)}
          onEdit={() => handleEdit(qcm.id)}
          onMockExam={() => handleMockExam(qcm.id)}
          onDuplicate={() => handleDuplicate(qcm.id)}
          onDelete={() => handleDelete(qcm.id)}
          onShare={() => handleShare(qcm.id)}
          onToggleFavorite={() => handleToggleFavorite(qcm.id)}
        />
      ))}
    </div>
  );
};
```

## 🎯 Bonnes pratiques

### ✅ Recommandé

- Utiliser des callbacks optimisés avec `useCallback`
- Gérer les états de chargement
- Implémenter la gestion d'erreurs
- Tester l'accessibilité
- Optimiser les performances

### ❌ À éviter

- Props inline complexes
- Callbacks non optimisés
- États de chargement non gérés
- Ignorer l'accessibilité
- Pas de gestion d'erreurs

## 🔧 Configuration Tailwind

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées si nécessaire
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  },
  plugins: []
};
```

## 📄 Licence

MIT License - Libre d'utilisation pour projets personnels et commerciaux.

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche feature
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

---

**Développé avec ❤️ en React + TypeScript + Tailwind CSS** 