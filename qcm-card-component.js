// Composant QcmCard pour application vanilla JavaScript
class QcmCard {
  constructor(config) {
    this.config = {
      title: '',
      subtitle: '',
      status: 'published', // 'published', 'draft', 'archived'
      lastScore: 0,
      lastTime: 0,
      isFavorite: false,
      onLaunch: () => {},
      onEdit: () => {},
      onMockExam: () => {},
      onDuplicate: () => {},
      onDelete: () => {},
      onShare: () => {},
      onToggleFavorite: () => {},
      loading: false,
      ...config
    };
    
    this.element = null;
    this.showMenu = false;
  }

  // Configuration des statuts
  getStatusConfig() {
    const configs = {
      published: {
        label: 'Publié',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'fas fa-check-circle',
        iconColor: 'text-green-600'
      },
      draft: {
        label: 'Brouillon',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: 'fas fa-exclamation-triangle',
        iconColor: 'text-yellow-600'
      },
      archived: {
        label: 'Archivé',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: 'fas fa-times-circle',
        iconColor: 'text-gray-600'
      }
    };
    return configs[this.config.status];
  }

  // Configuration des niveaux de difficulté
  getDifficultyConfig() {
    const configs = {
      beginner: {
        label: 'Débutant',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'fas fa-seedling',
        iconColor: 'text-blue-600'
      },
      intermediate: {
        label: 'Intermédiaire',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        icon: 'fas fa-tree',
        iconColor: 'text-orange-600'
      },
      advanced: {
        label: 'Avancé',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: 'fas fa-fire',
        iconColor: 'text-red-600'
      }
    };
    return configs[this.config.difficultyLevel] || configs.beginner;
  }

  // Générer le HTML du skeleton loading
  generateSkeletonHTML() {
    return `
      <div class="qcm-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div class="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
        <div class="space-y-3 mb-6">
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div class="flex items-center justify-between">
          <div class="h-10 bg-gray-200 rounded w-24"></div>
          <div class="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    `;
  }

  // Générer le HTML principal
  generateHTML() {
    const statusInfo = this.getStatusConfig();
    const difficultyInfo = this.getDifficultyConfig();
    
    return `
      <div class="qcm-card bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
        <!-- Header avec titre, sous-titre et badges -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex-1 min-w-0">
                         <div class="flex items-center space-x-3">
               <i class="${this.config.iconClass || 'fas fa-question'} fa-2x text-blue-600 flex-shrink-0"></i>
               <div class="min-w-0 flex-1">
                <h3 class="text-lg font-semibold text-gray-900 truncate" title="${this.config.title}">
                  ${this.config.title}
                </h3>
                <p class="text-sm text-gray-500 mt-1 truncate" title="${this.config.subtitle}">
                  ${this.config.subtitle}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2 ml-4">
            <!-- Badge de niveau de difficulté -->
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${difficultyInfo.color}" title="Niveau de difficulté">
              <i class="${difficultyInfo.icon} w-3 h-3 mr-1 ${difficultyInfo.iconColor}"></i>
              ${difficultyInfo.label}
            </div>
            <!-- Badge de statut -->
            <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}">
              <i class="${statusInfo.icon} w-3 h-3 mr-1 ${statusInfo.iconColor}"></i>
              ${statusInfo.label}
            </div>
            <button class="favorite-btn p-1.5 rounded-lg transition-colors ${
              this.config.isFavorite 
                ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
            }" aria-label="${this.config.isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
              <i class="fas fa-star ${this.config.isFavorite ? 'fill-current' : ''}"></i>
            </button>
          </div>
        </div>

        <!-- Indicateurs rapides -->
        <div class="space-y-3 mb-6">
          <!-- Dernier score avec barre de progression -->
          <div class="flex items-center space-x-3">
            <i class="fas fa-trophy w-4 h-4 text-gray-400 flex-shrink-0"></i>
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-gray-600">Dernier score</span>
                <span class="font-medium text-gray-900">
                  ${this.config.lastScore > 0 ? this.config.lastScore + '%' : 'Aucune donnée'}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style="width: ${this.config.lastScore > 0 ? this.config.lastScore : 0}%"
                  role="progressbar"
                  aria-valuenow="${this.config.lastScore}"
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div>
            </div>
          </div>

          <!-- Dernier temps -->
          <div class="flex items-center space-x-3">
            <i class="fas fa-stopwatch w-4 h-4 text-gray-400 flex-shrink-0"></i>
            <span class="text-sm text-gray-600">
              Dernier temps : <span class="font-medium text-gray-900">
                ${this.config.lastTime > 0 ? this.config.lastTime + ' min' : 'Aucune donnée'}
              </span>
            </span>
          </div>
          
          <!-- Nombre de questions -->
          <div class="flex items-center space-x-3">
            <i class="fas fa-question-circle w-4 h-4 text-gray-400 flex-shrink-0"></i>
            <span class="text-sm text-gray-600">
              Questions : <span class="font-medium text-gray-900">
                ${this.config.totalQuestions || 0}
              </span>
            </span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-between">
          <!-- Actions principales -->
          <div class="flex items-center space-x-3">
            <button class="launch-btn inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md" style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);" onmouseover="this.style.background='linear-gradient(135deg, #15803d 0%, #166534 100%)'" onmouseout="this.style.background='linear-gradient(135deg, #16a34a 0%, #15803d 100%)'" aria-label="Lancer le QCM">
              <i class="fas fa-play mr-2"></i>
              Lancer
            </button>
            
                         <button class="mock-exam-btn inline-flex items-center px-6 py-3 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md" style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);" onmouseover="this.style.background='linear-gradient(135deg, #ca8a04 0%, #a16207 100%)'" onmouseout="this.style.background='linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'" aria-label="Créer un examen blanc">
               <i class="fas fa-file-alt mr-2"></i>
               Examen blanc
             </button>
          </div>

          <!-- Menu des actions secondaires -->
          <div class="relative">
            <button class="menu-btn p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" aria-label="Ouvrir le menu des actions" aria-expanded="${this.showMenu}">
              <i class="fas fa-ellipsis-v"></i>
            </button>

            <!-- Menu déroulant -->
            <div class="menu-dropdown qcm-dropdown-menu absolute right-0 top-full mt-1 w-48 py-1 z-10 ${this.showMenu ? 'block' : 'hidden'}">
              <button class="edit-btn qcm-dropdown-item edit w-full" aria-label="Éditer le QCM">
                <i class="fas fa-edit"></i>
                Éditer
              </button>
              <button class="duplicate-btn qcm-dropdown-item duplicate w-full" aria-label="Dupliquer le QCM">
                <i class="fas fa-copy"></i>
                Dupliquer
              </button>
              <button class="share-btn qcm-dropdown-item share w-full" aria-label="Partager le QCM">
                <i class="fas fa-share"></i>
                Partager
              </button>
              <div class="border-t border-gray-200 my-1"></div>
              <button class="delete-btn qcm-dropdown-item delete w-full" aria-label="Supprimer le QCM">
                <i class="fas fa-trash"></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>



      <!-- Overlay pour fermer le menu -->
      <div class="menu-overlay fixed inset-0 z-0 ${this.showMenu ? 'block' : 'hidden'}"></div>
    `;
  }

  // Créer l'élément DOM
  create() {
    const container = document.createElement('div');
    container.className = 'qcm-card-container';
    
    if (this.config.loading) {
      container.innerHTML = this.generateSkeletonHTML();
    } else {
      container.innerHTML = this.generateHTML();
    }
    
    this.element = container.firstElementChild;
    this.attachEventListeners();
    
    return this.element;
  }

  // Attacher les événements
  attachEventListeners() {
    if (!this.element) return;

    // Bouton favori
    const favoriteBtn = this.element.querySelector('.favorite-btn');
    if (favoriteBtn) {
      favoriteBtn.addEventListener('click', () => {
        this.config.onToggleFavorite();
      });
    }

    // Bouton lancer
    const launchBtn = this.element.querySelector('.launch-btn');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        this.config.onLaunch();
      });
    }

    // Menu des actions
    const menuBtn = this.element.querySelector('.menu-btn');
    const menuDropdown = this.element.querySelector('.menu-dropdown');
    const menuOverlay = this.element.querySelector('.menu-overlay');
    
    if (menuBtn) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }

    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        this.hideMenu();
      });
    }

    // Actions du menu
    const editBtn = this.element.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        this.config.onEdit();
        this.hideMenu();
      });
    }

    const mockExamBtn = this.element.querySelector('.mock-exam-btn');
    if (mockExamBtn) {
      mockExamBtn.addEventListener('click', () => {
        this.config.onMockExam();
      });
    }

    const duplicateBtn = this.element.querySelector('.duplicate-btn');
    if (duplicateBtn) {
      duplicateBtn.addEventListener('click', () => {
        this.config.onDuplicate();
        this.hideMenu();
      });
    }

    const shareBtn = this.element.querySelector('.share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        this.config.onShare();
        this.hideMenu();
      });
    }

    const deleteBtn = this.element.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        // Utiliser la modal de suppression avec mot de passe de la page principale
        if (typeof handleDelete === 'function') {
          handleDelete(this.config.id || this.config.qcmId);
        }
        this.hideMenu();
      });
    }



    // Fermer le menu en cliquant ailleurs
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.hideMenu();
      }
    });
  }

  // Afficher/masquer le menu
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.updateMenuVisibility();
  }

  hideMenu() {
    this.showMenu = false;
    this.updateMenuVisibility();
  }

  // Mettre à jour la visibilité du menu
  updateMenuVisibility() {
    const menuDropdown = this.element.querySelector('.menu-dropdown');
    const menuOverlay = this.element.querySelector('.menu-overlay');
    const menuBtn = this.element.querySelector('.menu-btn');
    
    if (menuDropdown) {
      menuDropdown.classList.toggle('block', this.showMenu);
      menuDropdown.classList.toggle('hidden', !this.showMenu);
    }
    
    if (menuOverlay) {
      menuOverlay.classList.toggle('block', this.showMenu);
      menuOverlay.classList.toggle('hidden', !this.showMenu);
    }
    
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', this.showMenu);
    }
  }



  // Mettre à jour les données
  update(config) {
    this.config = { ...this.config, ...config };
    
    if (this.element) {
      const newElement = this.create();
      this.element.parentNode.replaceChild(newElement, this.element);
      this.element = newElement;
    }
  }

  // Supprimer l'élément
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Fonction utilitaire pour créer une carte QCM
function createQcmCard(config) {
  const card = new QcmCard(config);
  return card.create();
}

   // Fonction utilitaire pour créer plusieurs cartes
  function createQcmCards(qcms, container) {
    container.innerHTML = '';
    
    qcms.forEach(qcm => {
      const cardElement = createQcmCard({
        id: qcm.id,
        title: qcm.title,
        subtitle: qcm.subtitle,
        status: qcm.status,
        lastScore: qcm.lastScore,
        lastTime: qcm.lastTime,
        totalQuestions: qcm.totalQuestions,
        isFavorite: qcm.isFavorite,
        iconClass: qcm.iconClass,
        difficultyLevel: qcm.difficultyLevel,
        onLaunch: () => handleLaunch(qcm.id),
        onEdit: () => handleEdit(qcm.id),
        onMockExam: () => handleMockExam(qcm.id),
        onDuplicate: () => handleDuplicate(qcm.id),
        onDelete: () => handleDelete(qcm.id),
        onShare: () => handleShare(qcm.id),
        onToggleFavorite: () => handleToggleFavorite(qcm.id)
      });
      
      container.appendChild(cardElement);
    });
  }

// Export pour utilisation globale
window.QcmCard = QcmCard;
window.createQcmCard = createQcmCard;
window.createQcmCards = createQcmCards; 