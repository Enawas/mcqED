// ===== INITIALISATION RAPIDE DU THÈME - MCQED =====
// Ce script doit être inclus dans le <head> de toutes les pages
// pour éviter le flash du mode clair

(function() {
    'use strict';
    
    // Récupérer le thème sauvegardé
    const savedTheme = localStorage.getItem('mcqed_theme') || 'light';
    
    // Appliquer le thème immédiatement
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Ajouter une classe pour masquer le contenu jusqu'à ce que le thème soit appliqué
    document.documentElement.classList.add('theme-loading');
    
    // Supprimer la classe de chargement une fois que le DOM est prêt
    document.addEventListener('DOMContentLoaded', function() {
        // Petit délai pour s'assurer que tous les styles sont chargés
        setTimeout(function() {
            document.documentElement.classList.remove('theme-loading');
        }, 50);
    });
    
    // Fallback : supprimer la classe si DOMContentLoaded ne se déclenche pas
    setTimeout(function() {
        document.documentElement.classList.remove('theme-loading');
    }, 1000);
})(); 