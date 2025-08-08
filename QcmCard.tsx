import React, { useState } from 'react';
import { 
  Play, 
  Edit, 
  FileText, 
  Copy, 
  Trash2, 
  Share2, 
  MoreVertical, 
  Star, 
  Clock, 
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Types TypeScript
interface QcmCardProps {
  title: string;
  subtitle: string;
  status: 'published' | 'draft' | 'archived';
  averageScore: number;
  avgTime: number; // en minutes
  isFavorite: boolean;
  onLaunch: () => void;
  onEdit: () => void;
  onMockExam: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onShare: () => void;
  onToggleFavorite: () => void;
  loading?: boolean;
}

// Types pour les statuts
const statusConfig = {
  published: {
    label: 'Publié',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  draft: {
    label: 'Brouillon',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertTriangle,
    iconColor: 'text-yellow-600'
  },
  archived: {
    label: 'Archivé',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: XCircle,
    iconColor: 'text-gray-600'
  }
};

const QcmCard: React.FC<QcmCardProps> = ({
  title,
  subtitle,
  status,
  averageScore,
  avgTime,
  isFavorite,
  onLaunch,
  onEdit,
  onMockExam,
  onDuplicate,
  onDelete,
  onShare,
  onToggleFavorite,
  loading = false
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Skeleton loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="space-y-3 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-10 bg-gray-200 rounded w-24"></div>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2">
        {/* Header avec titre, sous-titre et badge de statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate" title={title}>
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate" title={subtitle}>
              {subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.color}`}>
              <StatusIcon className={`w-3 h-3 mr-1 ${statusInfo.iconColor}`} />
              {statusInfo.label}
            </div>
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorite 
                  ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                  : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Indicateurs rapides */}
        <div className="space-y-3 mb-6">
          {/* Score moyen avec barre de progression */}
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Score moyen</span>
                <span className="font-medium text-gray-900">{averageScore}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${averageScore}%` }}
                  role="progressbar"
                  aria-valuenow={averageScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>

          {/* Temps moyen */}
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-sm text-gray-600">
              Temps moyen : <span className="font-medium text-gray-900">{avgTime} min</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          {/* Action principale */}
          <button
            onClick={onLaunch}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Lancer le QCM"
          >
            <Play className="w-5 h-5 mr-2" />
            Lancer
          </button>

          {/* Menu des actions secondaires */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Ouvrir le menu des actions"
              aria-expanded={showMenu}
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Menu déroulant */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={() => {
                    onEdit();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  aria-label="Éditer le QCM"
                >
                  <Edit className="w-4 h-4 mr-3 text-blue-600" />
                  Éditer
                </button>
                <button
                  onClick={() => {
                    onMockExam();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  aria-label="Créer un examen blanc"
                >
                  <FileText className="w-4 h-4 mr-3 text-orange-600" />
                  Examen blanc
                </button>
                <button
                  onClick={() => {
                    onDuplicate();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  aria-label="Dupliquer le QCM"
                >
                  <Copy className="w-4 h-4 mr-3 text-purple-600" />
                  Dupliquer
                </button>
                <button
                  onClick={() => {
                    onShare();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  aria-label="Partager le QCM"
                >
                  <Share2 className="w-4 h-4 mr-3 text-green-600" />
                  Partager
                </button>
                <div className="border-t border-gray-200 my-1"></div>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:bg-red-50"
                  aria-label="Supprimer le QCM"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Supprimer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Supprimer le QCM
                </h3>
                <p className="text-sm text-gray-500">
                  Cette action est irréversible.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer <strong>"{title}"</strong> ? 
              Toutes les données associées seront définitivement perdues.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isDeleting}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDeleting}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
};

export default QcmCard; 