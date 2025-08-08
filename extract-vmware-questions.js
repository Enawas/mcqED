// Script d'extraction des questions VMware vSphere 8
// Extrait toutes les questions du fichier vmware.html et les convertit au format JSON

const fs = require('fs');
const path = require('path');

// Fonction pour extraire les questions du HTML
function extractQuestionsFromHTML(htmlContent) {
    const questions = [];
    const questionRegex = /<h5 class="card-title">(\d+)\.\s*(.*?)<\/h5>/gs;
    const optionsRegex = /<li><label><input[^>]*name="q(\d+)"[^>]*value="([^"]*)"[^>]*>\s*([^<]+)<\/label><\/li>/g;
    const answerRegex = /showAnswer\('q(\d+)'\)/g;
    
    let match;
    let currentQuestion = null;
    
    // Extraire les questions
    while ((match = questionRegex.exec(htmlContent)) !== null) {
        const questionNumber = parseInt(match[1]);
        const questionText = match[2].trim();
        
        currentQuestion = {
            id: questionNumber,
            question: questionText,
            type: "multiple", // Par défaut, on peut ajuster plus tard
            options: [],
            correctAnswers: [],
            explanation: ""
        };
        
        questions.push(currentQuestion);
    }
    
    // Extraire les options pour chaque question
    const optionsMatches = htmlContent.matchAll(optionsRegex);
    for (const optionMatch of optionsMatches) {
        const questionId = parseInt(optionMatch[1]);
        const optionValue = optionMatch[2];
        const optionText = optionMatch[3].trim();
        
        const question = questions.find(q => q.id === questionId);
        if (question) {
            question.options.push(`${optionValue.toUpperCase()}. ${optionText}`);
        }
    }
    
    // Identifier les questions à choix unique (celles avec des radio buttons)
    const radioRegex = /<input[^>]*type="radio"[^>]*name="q(\d+)"[^>]*>/g;
    const radioQuestions = new Set();
    
    while ((match = radioRegex.exec(htmlContent)) !== null) {
        radioQuestions.add(parseInt(match[1]));
    }
    
    // Ajuster le type des questions
    questions.forEach(question => {
        if (radioQuestions.has(question.id)) {
            question.type = "single";
            // Pour les questions à choix unique, on suppose qu'il y a une seule bonne réponse
            question.correctAnswer = "A"; // À ajuster manuellement
        } else {
            question.type = "multiple";
            // Pour les questions à choix multiples, on suppose plusieurs bonnes réponses
            question.correctAnswers = ["A", "B"]; // À ajuster manuellement
        }
    });
    
    return questions;
}

// Fonction pour créer le fichier JSON complet
function createVMwareJSON(questions) {
    const vmwareQCM = {
        qcmId: "vmware-vsphere-8",
        title: "VMware vSphere 8 Professional",
        description: "QCM complet pour la certification VMware vSphere 8 Professional",
        version: "1.0",
        totalQuestions: questions.length,
        timeLimit: 120,
        passingScore: 70,
        questions: questions,
        metadata: {
            created: new Date().toISOString().split('T')[0],
            lastModified: new Date().toISOString().split('T')[0],
            author: "MCQED Team",
            category: "VMware",
            difficulty: "Professional",
            tags: ["vSphere", "VMware", "Virtualization", "Professional"],
            source: "Extracted from vmware.html"
        }
    };
    
    return vmwareQCM;
}

// Fonction principale
function main() {
    try {
        console.log("🔍 Extraction des questions VMware vSphere 8...");
        
        // Lire le fichier HTML
        const htmlPath = path.join(__dirname, 'vmware.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Extraire les questions
        const questions = extractQuestionsFromHTML(htmlContent);
        
        console.log(`✅ ${questions.length} questions extraites`);
        
        // Créer le JSON
        const vmwareJSON = createVMwareJSON(questions);
        
        // Sauvegarder le fichier JSON
        const jsonPath = path.join(__dirname, 'vmware-complete.json');
        fs.writeFileSync(jsonPath, JSON.stringify(vmwareJSON, null, 2), 'utf8');
        
        console.log(`💾 Fichier JSON sauvegardé : ${jsonPath}`);
        
        // Afficher un résumé
        console.log("\n📊 Résumé de l'extraction :");
        console.log(`   • Questions totales : ${questions.length}`);
        console.log(`   • Questions à choix unique : ${questions.filter(q => q.type === 'single').length}`);
        console.log(`   • Questions à choix multiples : ${questions.filter(q => q.type === 'multiple').length}`);
        
        // Afficher les premières questions pour vérification
        console.log("\n🔍 Aperçu des premières questions :");
        questions.slice(0, 3).forEach(q => {
            console.log(`   Question ${q.id}: ${q.question.substring(0, 80)}...`);
            console.log(`   Type: ${q.type}, Options: ${q.options.length}`);
        });
        
        console.log("\n⚠️  IMPORTANT :");
        console.log("   • Les réponses correctes doivent être ajustées manuellement");
        console.log("   • Vérifiez les types de questions (single/multiple)");
        console.log("   • Ajoutez les explications manquantes");
        console.log("   • Utilisez l'éditeur de questions pour finaliser");
        
    } catch (error) {
        console.error("❌ Erreur lors de l'extraction :", error.message);
    }
}

// Exécuter le script
if (require.main === module) {
    main();
}

module.exports = { extractQuestionsFromHTML, createVMwareJSON }; 