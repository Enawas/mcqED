import React, { useState } from 'react';
import QcmCard from './QcmCard';

// Types pour les données factices
interface QcmData {
  id: string;
  title: string;
  subtitle: string;
  status: 'published' | 'draft' | 'archived';
  averageScore: number;
  avgTime: number;
  isFavorite: boolean;
}

// Données factices
const mockQcms: QcmData[] = [
  {
    id: '1',
    title: 'Réseaux – QCM 1',
    subtitle: '15 questions · Mise à jour : 2 jours',
    status: 'published',
    averageScore: 78,
    avgTime: 12,
    isFavorite: true
  },
  {
    id: '2',
    title: 'Docker – Conteneurs',
    subtitle: '20 questions · Mise à jour : 1 semaine',
    status: 'published',
    averageScore: 85,
    avgTime: 18,
    isFavorite: false
  },
  {
    id: '3',
    title: 'Kubernetes – Orchestration',
    subtitle: '25 questions · Mise à jour : 3 jours',
    status: 'draft',
    averageScore: 0,
    avgTime: 0,
    isFavorite: true
  },
  {
    id: '4',
    title: 'VMware vSphere',
    subtitle: '30 questions · Mise à jour : 1 mois',
    status: 'archived',
    averageScore: 92,
    avgTime: 25,
    isFavorite: false
  },
  {
    id: '5',
    title: 'Sécurité informatique',
    subtitle: '18 questions · Mise à jour : 5 jours',
    status: 'published',
    averageScore: 67,
    avgTime: 15,
    isFavorite: false
  },
  {
    id: '6',
    title: 'Base de données SQL',
    subtitle: '22 questions · Mise à jour : 1 jour',
    status: 'draft',
    averageScore: 0,
    avgTime: 0,
    isFavorite: true
  }
];

const QcmCardExample: React.FC = () => {
  const [qcms, setQcms] = useState<QcmData[]>(mockQcms);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Fonctions de gestion des actions
  const handleLaunch = (id: string) => {
    console.log('Lancer QCM:', id);
    showNotificationMessage(`QCM "${qcms.find(q => q.id === id)?.title}" lancé !`);
  };

  const handleEdit = (id: string) => {
    console.log('Éditer QCM:', id);
    showNotificationMessage(`Édition du QCM "${qcms.find(q => q.id === id)?.title}"`);
  };

  const handleMockExam = (id: string) => {
    console.log('Examen blanc QCM:', id);
    showNotificationMessage(`Examen blanc créé pour "${qcms.find(q => q.id === id)?.title}"`);
  };

  const handleDuplicate = (id: string) => {
    console.log('Dupliquer QCM:', id);
    const originalQcm = qcms.find(q => q.id === id);
    if (originalQcm) {
      const newQcm: QcmData = {
        ...originalQcm,
        id: Date.now().toString(),
        title: `${originalQcm.title} (Copie)`,
        subtitle: 'Copie récente',
        status: 'draft',
        isFavorite: false
      };
      setQcms(prev => [...prev, newQcm]);
      showNotificationMessage(`QCM "${originalQcm.title}" dupliqué !`);
    }
  };

  const handleDelete = async (id: string) => {
    console.log('Supprimer QCM:', id);
    const qcmToDelete = qcms.find(q => q.id === id);
    
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setQcms(prev => prev.filter(q => q.id !== id));
    showNotificationMessage(`QCM "${qcmToDelete?.title}" supprimé !`);
  };

  const handleShare = (id: string) => {
    console.log('Partager QCM:', id);
    const qcm = qcms.find(q => q.id === id);
    if (navigator.share) {
      navigator.share({
        title: qcm?.title,
        text: `Partagez ce QCM : ${qcm?.title}`,
        url: `${window.location.origin}/qcm/${id}`
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API Share
      navigator.clipboard.writeText(`${window.location.origin}/qcm/${id}`);
      showNotificationMessage('Lien copié dans le presse-papiers !');
    }
  };

  const handleToggleFavorite = (id: string) => {
    setQcms(prev => prev.map(q => 
      q.id === id ? { ...q, isFavorite: !q.isFavorite } : q
    ));
    const qcm = qcms.find(q => q.id === id);
    showNotificationMessage(
      qcm?.isFavorite 
        ? `"${qcm.title}" retiré des favoris` 
        : `"${qcm?.title}" ajouté aux favoris`
    );
  };

  const showNotificationMessage = (message: string) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(null), 3000);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setQcms(mockQcms);
      setLoading(false);
      showNotificationMessage('QCMs rechargés !');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard QCM
              </h1>
              <p className="mt-2 text-gray-600">
                Gérez vos questionnaires à choix multiples
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Rechargement...' : 'Actualiser'}
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Nouveau QCM
              </button>
            </div>
          </div>
        </div>

        {/* Filtres et statistiques */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Total QCM</div>
            <div className="text-2xl font-bold text-gray-900">{qcms.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Publiés</div>
            <div className="text-2xl font-bold text-green-600">
              {qcms.filter(q => q.status === 'published').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Brouillons</div>
            <div className="text-2xl font-bold text-yellow-600">
              {qcms.filter(q => q.status === 'draft').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm font-medium text-gray-500">Favoris</div>
            <div className="text-2xl font-bold text-yellow-500">
              {qcms.filter(q => q.isFavorite).length}
            </div>
          </div>
        </div>

        {/* Grille des QCM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qcms.map((qcm) => (
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
              loading={loading}
            />
          ))}
        </div>

        {/* État vide */}
        {qcms.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun QCM trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par créer votre premier QCM
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Créer un QCM
            </button>
          </div>
        )}
      </div>

      {/* Notification toast */}
      {showNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-bottom-2">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {showNotification}
          </div>
        </div>
      )}
    </div>
  );
};

export default QcmCardExample; 