/**
 * Script de migration des questions existantes
 * Convertit les questions du HTML vers le nouveau système JSON
 */

class QuestionMigrator {
    constructor() {
        this.migratedQuestions = [];
    }

    /**
     * Extrait les questions du HTML existant
     */
    extractQuestionsFromHTML() {
        const questions = [];
        
        // Rechercher tous les éléments de question dans le HTML
        const questionElements = document.querySelectorAll('.card-body');
        
        questionElements.forEach((element, index) => {
            const titleElement = element.querySelector('.card-title');
            if (!titleElement) return;
            
            const questionText = titleElement.textContent.trim();
            if (!questionText || questionText.length < 10) return;
            
            // Extraire le numéro de question
            const questionMatch = questionText.match(/^(\d+)\.\s*(.+)$/);
            if (!questionMatch) return;
            
            const questionNumber = parseInt(questionMatch[1]);
            const questionTextClean = questionMatch[2];
            
            // Extraire les options
            const options = [];
            const optionElements = element.querySelectorAll('input[type="checkbox"], input[type="radio"]');
            
            optionElements.forEach(optionElement => {
                const label = optionElement.closest('label');
                if (label) {
                    const optionText = label.textContent.trim();
                    const optionMatch = optionText.match(/^([A-G])\.\s*(.+)$/);
                    if (optionMatch) {
                        options.push({
                            id: optionMatch[1].toLowerCase(),
                            text: optionMatch[2].trim()
                        });
                    }
                }
            });
            
            // Déterminer le type de question (basé sur le nombre de bonnes réponses)
            const correctAnswers = this.getCorrectAnswersFromScript(questionNumber);
            const questionType = correctAnswers.length > 1 ? 'multiple' : 'single';
            
            if (options.length > 0) {
                questions.push({
                    id: questionNumber,
                    text: questionTextClean,
                    type: questionType,
                    options: options,
                    correctAnswers: correctAnswers,
                    explanation: this.getExplanationFromScript(questionNumber)
                });
            }
        });
        
        return questions;
    }

    /**
     * Obtient les bonnes réponses depuis le script existant
     */
    getCorrectAnswersFromScript(questionNumber) {
        // Utiliser les données du script.js existant
        const correctAnswers = {
            q1: ['a', 'e'],
            q2: ['a', 'c', 'd', 'e'],
            q3: ['a', 'c', 'e'],
            q4: ['a', 'd'],
            q5: ['b'],
            q6: ['a'],
            q7: ['b'],
            q8: ['d'],
            q9: ['a'],
            q10: ['c', 'e', 'f'],
            q11: ['a'],
            q12: ['a'],
            q13: ['c'],
            q14: ['a'],
            q15: ['b', 'c', 'd'],
            q16: ['d'],
            q17: ['a', 'd', 'e', 'g'],
            q18: ['a', 'c'],
            q19: ['b'],
            q20: ['b'],
            q21: ['c'],
            q22: ['d'],
            q23: ['d'],
            q24: ['b'],
            q25: ['a', 'd'],
            q26: ['a'],
            q27: ['d'],
            q28: ['c'],
            q29: ['a'],
            q30: ['d'],
            q31: ['c'],
            q32: ['b', 'd'],
            q33: ['b'],
            q34: ['c'],
            q35: ['b'],
            q36: ['b'],
            q37: ['a'],
            q38: ['d'],
            q39: ['d'],
            q40: ['a', 'c', 'e'],
            q41: ['a'],
            q42: ['b', 'd', 'e'],
            q43: ['c'],
            q44: ['d'],
            q45: ['b'],
            q46: ['a', 'd', 'e', 'g'],
            q47: ['c', 'e'],
            q48: ['a'],
            q49: ['a'],
            q50: ['c', 'e'],
            q51: ['a'],
            q52: ['a', 'c'],
            q53: ['b', 'e'],
            q54: ['c'],
            q55: ['d'],
            q56: ['b'],
            q57: ['a'],
            q58: ['a', 'd'],
            q59: ['d'],
            q60: ['c', 'e'],
            q61: ['b', 'c', 'd'],
            q62: ['c'],
            q63: ['b', 'e'],
            q64: ['b'],
            q65: ['b', 'c'],
            q66: ['b', 'd'],
            q67: ['b'],
            q68: ['a'],
            q69: ['b'],
            q70: ['c'],
            q71: ['b', 'd'],
            q72: ['c'],
            q73: ['a'],
            q74: ['a', 'd', 'f', 'g'],
            q75: ['a'],
            q76: ['a', 'e'],
            q77: ['d'],
            q78: ['b'],
            q79: ['b'],
            q80: ['b', 'd'],
            q81: ['a', 'b', 'e'],
            q82: ['c'],
            q83: ['a'],
            q84: ['c', 'd'],
            q85: ['a', 'e'],
            q86: ['a'],
            q87: ['c'],
            q88: ['a', 'b'],
            q89: ['b', 'e'],
            q90: ['c'],
            q91: ['b'],
            q92: ['b'],
            q93: ['c'],
            q94: ['c'],
            q95: ['c'],
            q96: ['d', 'e'],
            q97: ['d'],
            q98: ['b', 'd', 'e', 'g'],
            q99: ['d'],
            q100: ['c', 'e'],
            q101: ['c'],
            q102: ['c'],
            q103: ['c'],
            q104: ['a', 'b', 'c', 'g'],
            q105: ['b'],
            q106: ['b'],
            q107: ['d'],
            q108: ['d'],
            q109: ['c'],
            q110: ['a', 'd', 'e'],
            q111: ['a', 'b']
        };
        
        return correctAnswers[`q${questionNumber}`] || [];
    }

    /**
     * Obtient l'explication depuis le script existant
     */
    getExplanationFromScript(questionNumber) {
        // Pour l'instant, retourner une explication générique
        // Vous pouvez personnaliser cela selon vos besoins
        return `Explication pour la question ${questionNumber}`;
    }

    /**
     * Organise les questions en sections
     */
    organizeQuestionsIntoSections(questions) {
        const sections = [];
        const questionsPerSection = 15;
        
        for (let i = 0; i < Math.ceil(questions.length / questionsPerSection); i++) {
            const startIndex = i * questionsPerSection;
            const endIndex = Math.min(startIndex + questionsPerSection, questions.length);
            const sectionQuestions = questions.slice(startIndex, endIndex);
            
            sections.push({
                id: i + 1,
                title: `Section ${i + 1} - Questions ${startIndex + 1} à ${endIndex}`,
                questions: sectionQuestions
            });
        }
        
        return sections;
    }

    /**
     * Génère le JSON pour le nouveau système
     */
    generateJSON(questions) {
        const sections = this.organizeQuestionsIntoSections(questions);
        
        return {
            title: "VMware vSphere 8 Professional",
            description: "QCM complet sur VMware vSphere 8 avec questions réparties en sections",
            totalQuestions: questions.length,
            sections: sections
        };
    }

    /**
     * Effectue la migration complète
     */
    migrate() {
        console.log('Début de la migration des questions...');
        
        // Extraire les questions du HTML
        const questions = this.extractQuestionsFromHTML();
        console.log(`${questions.length} questions extraites`);
        
        // Générer le JSON
        const jsonData = this.generateJSON(questions);
        
        // Sauvegarder dans le système de questions
        if (typeof questionManager !== 'undefined') {
            questionManager.importFromJSON('vmware-vsphere-8', JSON.stringify(jsonData));
            console.log('Questions migrées avec succès dans le système !');
        }
        
        // Retourner les données pour export
        return jsonData;
    }

    /**
     * Exporte les questions migrées vers un fichier
     */
    exportMigratedQuestions() {
        const jsonData = this.migrate();
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vmware-vsphere-8-migrated.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Fichier de questions migrées exporté !');
    }
}

// Fonctions globales pour l'utilisation
window.migrateQuestions = function() {
    const migrator = new QuestionMigrator();
    return migrator.migrate();
};

window.exportMigratedQuestions = function() {
    const migrator = new QuestionMigrator();
    migrator.exportMigratedQuestions();
};

// Auto-migration au chargement de la page (si sur la page d'édition)
if (window.location.pathname.includes('question-editor.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Migration automatique des questions...');
        setTimeout(() => {
            try {
                window.migrateQuestions();
                console.log('Migration automatique terminée !');
            } catch (error) {
                console.error('Erreur lors de la migration automatique:', error);
            }
        }, 2000);
    });
} 