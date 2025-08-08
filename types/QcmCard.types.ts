// Types pour le composant QcmCard

export interface QcmCardProps {
  /** Titre du QCM */
  title: string;
  
  /** Sous-titre avec informations supplémentaires */
  subtitle: string;
  
  /** Statut du QCM */
  status: QcmStatus;
  
  /** Score moyen en pourcentage (0-100) */
  averageScore: number;
  
  /** Temps moyen en minutes */
  avgTime: number;
  
  /** Indique si le QCM est en favori */
  isFavorite: boolean;
  
  /** Callback appelé lors du clic sur "Lancer" */
  onLaunch: () => void;
  
  /** Callback appelé lors du clic sur "Éditer" */
  onEdit: () => void;
  
  /** Callback appelé lors du clic sur "Examen blanc" */
  onMockExam: () => void;
  
  /** Callback appelé lors du clic sur "Dupliquer" */
  onDuplicate: () => void;
  
  /** Callback appelé lors de la confirmation de suppression */
  onDelete: () => Promise<void> | void;
  
  /** Callback appelé lors du clic sur "Partager" */
  onShare: () => void;
  
  /** Callback appelé lors du toggle favori */
  onToggleFavorite: () => void;
  
  /** Indique si le composant est en état de chargement */
  loading?: boolean;
}

export type QcmStatus = 'published' | 'draft' | 'archived';

export interface QcmStatusConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
}

export interface QcmData {
  id: string;
  title: string;
  subtitle: string;
  status: QcmStatus;
  averageScore: number;
  avgTime: number;
  isFavorite: boolean;
  createdAt?: string;
  updatedAt?: string;
  questionCount?: number;
  author?: string;
  tags?: string[];
}

// Types pour les actions du menu
export interface QcmAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onClick: () => void;
  destructive?: boolean;
}

// Types pour les notifications
export interface NotificationConfig {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Types pour les props de performance
export interface QcmCardPerformanceProps {
  /** Délai avant affichage du skeleton (ms) */
  skeletonDelay?: number;
  
  /** Indique si le lazy loading est activé */
  lazyLoad?: boolean;
  
  /** Callback appelé quand le composant devient visible */
  onVisible?: () => void;
}

// Types pour les props d'accessibilité
export interface QcmCardAccessibilityProps {
  /** ID unique pour l'accessibilité */
  ariaId?: string;
  
  /** Description détaillée pour les lecteurs d'écran */
  ariaDescription?: string;
  
  /** Indique si le composant est en focus */
  isFocused?: boolean;
  
  /** Callback appelé lors de la navigation au clavier */
  onKeyboardNavigation?: (direction: 'up' | 'down' | 'left' | 'right') => void;
}

// Types pour les props de thème
export interface QcmCardThemeProps {
  /** Variante de couleur du thème */
  variant?: 'default' | 'compact' | 'detailed';
  
  /** Couleur d'accent personnalisée */
  accentColor?: string;
  
  /** Indique si le mode sombre est activé */
  darkMode?: boolean;
}

// Type combiné pour toutes les props
export type QcmCardFullProps = QcmCardProps & 
  QcmCardPerformanceProps & 
  QcmCardAccessibilityProps & 
  QcmCardThemeProps;

// Types pour les événements
export interface QcmCardEvents {
  onCardClick?: (event: React.MouseEvent) => void;
  onCardHover?: (isHovered: boolean) => void;
  onCardFocus?: (isFocused: boolean) => void;
  onActionTrigger?: (action: string, data?: any) => void;
}

// Types pour les callbacks de validation
export interface QcmCardValidation {
  canEdit?: () => boolean;
  canDelete?: () => boolean;
  canShare?: () => boolean;
  canDuplicate?: () => boolean;
}

// Types pour les métadonnées
export interface QcmCardMetadata {
  /** Tags associés au QCM */
  tags?: string[];
  
  /** Catégorie du QCM */
  category?: string;
  
  /** Niveau de difficulté */
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  
  /** Langue du QCM */
  language?: string;
  
  /** Date de création */
  createdAt?: Date;
  
  /** Date de dernière modification */
  updatedAt?: Date;
  
  /** Nombre de tentatives */
  attemptCount?: number;
  
  /** Nombre de questions */
  questionCount?: number;
}

// Types pour les statistiques
export interface QcmCardStats {
  /** Score moyen */
  averageScore: number;
  
  /** Temps moyen */
  avgTime: number;
  
  /** Nombre de tentatives */
  attemptCount: number;
  
  /** Nombre de favoris */
  favoriteCount: number;
  
  /** Taux de réussite */
  successRate: number;
  
  /** Temps total passé */
  totalTime: number;
}

// Types pour les props de personnalisation
export interface QcmCardCustomization {
  /** Classes CSS personnalisées */
  className?: string;
  
  /** Styles inline personnalisés */
  style?: React.CSSProperties;
  
  /** Indique si les animations sont activées */
  animations?: boolean;
  
  /** Durée des transitions */
  transitionDuration?: number;
  
  /** Indique si les effets hover sont activés */
  hoverEffects?: boolean;
}

// Export de tous les types
export type {
  QcmCardProps as default,
  QcmStatus,
  QcmStatusConfig,
  QcmData,
  QcmAction,
  NotificationConfig,
  QcmCardPerformanceProps,
  QcmCardAccessibilityProps,
  QcmCardThemeProps,
  QcmCardFullProps,
  QcmCardEvents,
  QcmCardValidation,
  QcmCardMetadata,
  QcmCardStats,
  QcmCardCustomization
}; 