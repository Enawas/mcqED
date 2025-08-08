let sectionScores = [];

function nextPage(section) {
    document.getElementById(`page-${section}`).classList.add('d-none');
    document.getElementById(`page-${section + 1}`).classList.remove('d-none');
}

function prevPage(section) {
    document.getElementById(`page-${section}`).classList.add('d-none');
    document.getElementById(`page-${section - 1}`).classList.remove('d-none');
}

function validateSection(section) {
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
		q111: ['a', 'b'],
    };

    const answerLabels = {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 'D',
        e: 'E',
        f: 'F',
        g: 'G'
    };
	
	

    let score = 0;
    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Réinitialiser les résultats affichés précédemment

    // Réinitialiser les styles et les résultats de toutes les questions
    document.querySelectorAll('.card-body').forEach(questionDiv => {
        questionDiv.classList.remove('bg-success', 'bg-danger', 'text-white');
        const existingResults = questionDiv.querySelectorAll('.result');
        existingResults.forEach(result => result.remove());
    });

    // Créer un objet pour stocker les réponses sélectionnées par question
    const userAnswers = {};
    for (let [key, value] of formData.entries()) {
        if (!userAnswers[key]) {
            userAnswers[key] = [];
        }
        userAnswers[key].push(value);
    }

    const startQuestion = (section - 1) * 15 + 1;
    const endQuestion = section * 15;

    for (let i = startQuestion; i <= endQuestion; i++) {
        const key = 'q' + i;
        if (userAnswers[key]) {
            const questionDiv = document.querySelector(`input[name="${key}"]`).closest('.card-body');
            const resultP = document.createElement('p');
            resultP.className = 'result';

            const isCorrect = correctAnswers[key].every(ans => userAnswers[key].includes(ans)) && correctAnswers[key].length === userAnswers[key].length;

            if (isCorrect) {
                score++;
                questionDiv.classList.add('bg-success', 'text-white');
                resultP.textContent = `Correct (${userAnswers[key].map(ans => answerLabels[ans]).join(', ')})`;
                resultP.classList.add('correct');
            } else {
                questionDiv.classList.add('bg-danger', 'text-white');
                resultP.textContent = `Incorrect (${userAnswers[key].map(ans => answerLabels[ans]).join(', ')}) , Correct (${correctAnswers[key].map(ans => answerLabels[ans]).join(', ')})`;
                resultP.classList.add('incorrect');
            }
            questionDiv.appendChild(resultP);
        }
    }

    resultDiv.innerHTML = `<p>Votre score pour la page ${section} est de ${score} sur 15.</p>`;
    sectionScores[section - 1] = score;
}

function validateTotal() {
    for (let i = 1; i <= 5; i++) {
        validateSection(i); // Valider chaque section
    }

    let totalScore = sectionScores.reduce((a, b) => a + b, 0);

    const totalQuestions = 110;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML += `<p>Votre score total est de ${totalScore} sur ${totalQuestions}.</p>`;
}

function saveResult() {
    validateTotal(); // Valider toutes les sections avant d'enregistrer le résultat

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
		q111: ['a', 'b'],
    };

    const answerLabels = {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 'D',
        e: 'E',
        f: 'F',
        g: 'G'
    };

    let resultData = [];
    const form = document.getElementById('quiz-form');
    const formData = new FormData(form);

    // Créer un objet pour stocker les réponses sélectionnées par question
    const userAnswers = {};
    for (let [key, value] of formData.entries()) {
        if (!userAnswers[key]) {
            userAnswers[key] = [];
        }
        userAnswers[key].push(value);
    }

    for (let key in userAnswers) {
        const isCorrect = correctAnswers[key].every(ans => userAnswers[key].includes(ans)) && correctAnswers[key].length === userAnswers[key].length;
        const userAnswerText = userAnswers[key].map(ans => answerLabels[ans]).join(', ');
        const correctAnswerText = correctAnswers[key].map(ans => answerLabels[ans]).join(', ');
        resultData.push({
            question: key.substr(1),
            userAnswer: userAnswerText,
            correctAnswer: correctAnswerText,
            isCorrect: isCorrect
        });
    }

    const now = new Date();
    const year = String(now.getFullYear()).substr(2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}${month}${year}-${hours}${minutes}`;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text('Résultats du QCM : VMware vSphere 8', 10, 10);

    const tableData = resultData.map(item => [
        item.question,
        item.userAnswer,
        item.correctAnswer,
        item.isCorrect ? { content: 'Correct', styles: { textColor: [0, 128, 0] } } : { content: 'Incorrect', styles: { textColor: [255, 0, 0] } }
    ]);

    doc.autoTable({
        head: [['Question', 'Réponse', 'Bonne Réponse', 'Statut']],
        body: tableData
    });

    doc.save(`resultat_qcm_${formattedDate}.pdf`);
}



function showAnswer(questionId) {
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
		q111: ['a', 'b'],
    };
    const answerDiv = document.getElementById(`answer-${questionId}`);
    const answers = correctAnswers[questionId];
    const answerLabels = {
        a: 'A',
        b: 'B',
        c: 'C',
        d: 'D',
        e: 'E',
        f: 'F',
        g: 'G'
    };
    let displayAnswers = answers.map(answer => answerLabels[answer]).join(', ');
    answerDiv.textContent = `Bonne réponse : ${displayAnswers}`;
    answerDiv.classList.toggle('d-none'); // Cette ligne montre ou cache la réponse à chaque clic
}

function navigatePage(pageNumber) {
    // Cacher toutes les pages
    for (let i = 1; i <= 8; i++) {
        const page = document.getElementById(`page-${i}`);
        if (page) {
            page.classList.add('d-none');
        }
    }
    // Afficher la page demandée
    const selectedPage = document.getElementById(`page-${pageNumber}`);
    if (selectedPage) {
        selectedPage.classList.remove('d-none');
    }
}

function resetAnswers(section) {
    // Sélectionnez tous les inputs de type checkbox dans la section actuelle
    const inputs = document.querySelectorAll(`#page-${section} input[type='checkbox']`);

    // Désélectionnez chaque checkbox
    inputs.forEach(input => {
        input.checked = false;
    });

    // Retirez les couleurs de fond et les textes de réponse
    const questionDivs = document.querySelectorAll(`#page-${section} .card-body`);
    questionDivs.forEach(div => {
        div.classList.remove('bg-success', 'bg-danger', 'text-white'); // Retirez les classes ajoutées lors de la validation
        const resultText = div.querySelector('.result');
        if (resultText) {
            resultText.remove(); // Supprimez le paragraphe de résultat si présent
        }
    });

    // Effacez les divs de réponse, si vous avez ajouté un texte de réponse correcte
    const answerDivs = document.querySelectorAll(`#page-${section} .answer-text`);
    answerDivs.forEach(div => {
        div.textContent = ''; // Efface le texte
        div.classList.add('d-none'); // Cache le div, s'il utilisait une classe pour être caché/masqué
    });
}

function shuffleQuestions(pageNumber) {
    const container = document.getElementById(`questions-container-${pageNumber}`); // Cible le conteneur spécifique aux questions
    let questions = container.querySelectorAll('.card'); // Sélectionnez toutes les questions de cette page
    questions = Array.from(questions); // Convertit NodeList en Array pour le mélange

    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]]; // Échange les éléments
    }

    // Vide le conteneur de questions et ajoute les éléments mélangés
    container.innerHTML = '';
    questions.forEach(question => container.appendChild(question));
}










function showAllQuestions() {
    // Masquer toutes les pages individuelles
    const pages = document.querySelectorAll('.question-page');
    pages.forEach(page => page.classList.add('d-none'));

    // Créer ou afficher la page "Examen blanc"
    let examPage = document.getElementById('exam-page');
    if (!examPage) {
        examPage = document.createElement('div');
        examPage.id = 'exam-page';
        examPage.classList.add('exam-page');

        // Ajouter les boutons "Retour", "Valider" et "Mélanger" en haut
        const topButtons = createControlButtons('top');
        examPage.appendChild(topButtons);

        // Rassembler toutes les questions des différentes pages
        pages.forEach(page => {
            const questions = page.querySelectorAll('.card');
            questions.forEach(question => {
                const clonedQuestion = question.cloneNode(true);
                const answerButton = clonedQuestion.querySelector('button');
                if (answerButton) {
                    answerButton.remove(); // Supprime le bouton "Réponse"
                }
                examPage.appendChild(clonedQuestion);
            });
        });

        // Ajouter les boutons "Retour", "Valider" et "Mélanger" en bas
        const bottomButtons = createControlButtons('bottom');
        examPage.appendChild(bottomButtons);

        // Ajouter la page "Examen blanc" au corps du document
        document.body.appendChild(examPage);
    } else {
        examPage.classList.remove('d-none');
    }
}

function returnToFirstPage() {
    // Masquer la page "Examen blanc"
    const examPage = document.getElementById('exam-page');
    if (examPage) {
        examPage.classList.add('d-none');
    }

    // Afficher la première page
    const firstPage = document.getElementById('page-8');
    if (firstPage) {
        firstPage.classList.remove('d-none');
    }
}

function validateAll() {
    // Fonction pour valider toutes les questions et calculer le score total
    // Cette fonction devrait être similaire à votre fonction de validation existante
    let totalScore = 0;
    let totalQuestions = 111;

    // Ajouter la logique de validation ici
    // ...
    alert(`Votre score total est de ${totalScore} sur ${totalQuestions}.`);
}

function shuffleAllQuestions() {
    const examPage = document.getElementById('exam-page');
    if (examPage) {
        let questions = examPage.querySelectorAll('.card');
        questions = Array.from(questions); // Convertit NodeList en Array pour le mélange

        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]]; // Échange les éléments
        }

        // Vide le conteneur de questions et ajoute les éléments mélangés
        const topButtons = examPage.querySelector('.top-buttons');
        const bottomButtons = examPage.querySelector('.bottom-buttons');
        
        examPage.innerHTML = ''; // Supprime tout le contenu actuel
        examPage.appendChild(topButtons);

        questions.forEach(question => examPage.appendChild(question));

        examPage.appendChild(bottomButtons);
    }
}

function createControlButtons(position) {
    const controlButtons = document.createElement('div');
    controlButtons.className = `d-flex justify-content-between mb-3 ${position}-buttons`;

    const returnButton = document.createElement('button');
    returnButton.type = 'button';
    returnButton.className = 'btn btn-secondary';
    returnButton.textContent = 'Retour';
    returnButton.onclick = returnToFirstPage;
    controlButtons.appendChild(returnButton);

    const validateButton = document.createElement('button');
    validateButton.type = 'button';
    validateButton.className = 'btn btn-success';
    validateButton.textContent = 'Valider';
    validateButton.onclick = validateAll;
    controlButtons.appendChild(validateButton);

    const shuffleButton = document.createElement('button');
    shuffleButton.type = 'button';
    shuffleButton.className = 'btn btn-info';
    shuffleButton.textContent = 'Mélanger';
    shuffleButton.onclick = shuffleAllQuestions;
    controlButtons.appendChild(shuffleButton);

    return controlButtons;
}












function toggleTheme() {
    const body = document.body;
    body.classList.toggle('dark-theme');

    const themeToggleButton = document.getElementById('theme-toggle');
    const icon = themeToggleButton.querySelector('i');

    if (body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-lightbulb');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-lightbulb');
    }
}

// Fonctionnalité pour montrer toutes les questions (examen blanc)
function showAllQuestions() {
    const pages = document.querySelectorAll('.question-page');
    pages.forEach(page => page.classList.add('d-none'));

    let examPage = document.getElementById('exam-page');
    if (!examPage) {
        examPage = document.createElement('div');
        examPage.id = 'exam-page';
        examPage.classList.add('exam-page');

        const topButtons = createControlButtons('top');
        examPage.appendChild(topButtons);

        pages.forEach(page => {
            const questions = page.querySelectorAll('.card');
            questions.forEach(question => {
                const clonedQuestion = question.cloneNode(true);
                const answerButton = clonedQuestion.querySelector('button');
                if (answerButton) {
                    answerButton.remove();
                }
                examPage.appendChild(clonedQuestion);
            });
        });

        const bottomButtons = createControlButtons('bottom');
        examPage.appendChild(bottomButtons);

        document.body.appendChild(examPage);
    } else {
        examPage.classList.remove('d-none');
    }
}

function returnToFirstPage() {
    const examPage = document.getElementById('exam-page');
    if (examPage) {
        examPage.classList.add('d-none');
    }

    const firstPage = document.getElementById('page-1');
    if (firstPage) {
        firstPage.classList.remove('d-none');
    }
}

function validateAll() {
    let totalScore = 0;
    let totalQuestions = 111;
    alert(`Votre score total est de ${totalScore} sur ${totalQuestions}.`);
}

function shuffleAllQuestions() {
    const examPage = document.getElementById('exam-page');
    if (examPage) {
        let questions = examPage.querySelectorAll('.card');
        questions = Array.from(questions);

        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }

        const topButtons = examPage.querySelector('.top-buttons');
        const bottomButtons = examPage.querySelector('.bottom-buttons');
        
        examPage.innerHTML = '';
        examPage.appendChild(topButtons);

        questions.forEach(question => examPage.appendChild(question));

        examPage.appendChild(bottomButtons);
    }
}

function createControlButtons(position) {
    const controlButtons = document.createElement('div');
    controlButtons.className = `d-flex justify-content-between mb-3 ${position}-buttons`;

    const returnButton = document.createElement('button');
    returnButton.type = 'button';
    returnButton.className = 'btn btn-secondary';
    returnButton.textContent = 'Retour';
    returnButton.onclick = returnToFirstPage;
    controlButtons.appendChild(returnButton);

    const validateButton = document.createElement('button');
    validateButton.type = 'button';
    validateButton.className = 'btn btn-success';
    validateButton.textContent = 'Valider';
    validateButton.onclick = validateAll;
    controlButtons.appendChild(validateButton);

    const shuffleButton = document.createElement('button');
    shuffleButton.type = 'button';
    shuffleButton.className = 'btn btn-info';
    shuffleButton.textContent = 'Mélanger';
    shuffleButton.onclick = shuffleAllQuestions;
    controlButtons.appendChild(shuffleButton);

    return controlButtons;
}
