import { loadFroamStorage, saveToStorage } from "/src/storage/storageFunctions.js";

function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function getQuestions(difficulty, category) {
    let url = `https://opentdb.com/api.php?amount=15`;
    if (difficulty && difficulty !== 'mixed') {
        url += `&difficulty=${encodeURIComponent(difficulty)}`;
    }
    if (category) {
        url += `&category=${encodeURIComponent(category)}`;
    }

    let domande = null;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        domande = json.results;
    } catch (error) {
        console.error(error.message);
    }

    return domande;
}

const score = {
    punteggio: 0,
    corrette: 0,
    errate: 0
};

// URL Parameters
const params = new URLSearchParams(window.location.search);
const nickname = params.get('nickname') || 'Player';
let difficultySelected = params.get('difficulty') || '';
let categorySelected = params.get('category') || '';
let pfpId = params.get('pfpId');

if (difficultySelected === 'mixed') {
    difficultySelected = '';
}

const validPfp = (pfpId && pfpId !== 'user.png' && pfpId !== 'undefined' && pfpId !== '') ? pfpId : 'user.svg';

const welcomeMsg = document.getElementById('welcomeMessage');
if (welcomeMsg) {
    welcomeMsg.innerHTML = `
        <img class="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain bg-secondary p-1 border-2 border-[#4F00D0] shrink-0" src="/images/profile_pics/${validPfp}" alt="Player avatar">
        <span class="font-black text-base sm:text-xl text-primary truncate max-w-[140px] sm:max-w-[240px] italic">${escapeHtml(nickname)}</span> 
    `;
}

async function renderPage() {
    let allQuestions = [];
    let scoreBoard = loadFroamStorage() || [];

    try {
        allQuestions = await getQuestions(difficultySelected, categorySelected);
    } catch (error) {
        console.log(error);
    }

    if (!allQuestions || allQuestions.length === 0) {
        throw new Error("No questions returned from API");
    }

    let numeroDomanda = 0;

    const currentScoreElem = document.getElementById('currentScore');
    const currentQuestionNumElem = document.getElementById('currentQuestionNum');
    const totalQuestionsNumElem = document.getElementById('totalQuestionsNum');
    const questionCategoryElem = document.getElementById('questionCategory');
    const questionDifficultyElem = document.getElementById('questionDifficulty');

    const nextQuestionBtn = document.getElementById('nextQuestion');
    const resultContainer = document.getElementById('resultContainer');
    const pageContainer = document.getElementById('pageContainer');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseMenu = document.getElementById('pauseMenu');
    const backToGame = document.getElementById('backToGame');
    const fiftyPercentBtn = document.getElementById('fiftyPercent');
    const progressBarWrapper = document.querySelector(".progress-bar-wrapper");
    const progressBar = document.querySelector(".progress-bar");

    let currentQuestion = {};
    let fiftyPercentUsed = false;
    let pauseMenuIsDisplayed = false;
    let nextQuestionIsDisplayed = false;
    let isGameFinished = false;
    let answers = [];

    if (totalQuestionsNumElem) {
        totalQuestionsNumElem.innerText = `${allQuestions.length}`;
    }

    updateScoreDisplay();
    renderQuestion();

    function updateScoreDisplay() {
        if (currentScoreElem) {
            currentScoreElem.innerText = `${score.punteggio}`;
        }
    }

    function renderQuestion() {
        if (numeroDomanda >= allQuestions.length) {
            fineDomande();
            return;
        }

        currentQuestion = allQuestions[numeroDomanda];

        if (currentQuestionNumElem) {
            currentQuestionNumElem.innerText = `${numeroDomanda + 1}`;
        }

        if (questionCategoryElem) {
            questionCategoryElem.innerText = decodeHTMLEntities(currentQuestion.category || 'General Knowledge');
        }

        if (questionDifficultyElem) {
            questionDifficultyElem.innerText = (currentQuestion.difficulty || 'Medium').toUpperCase();
        }

        if (progressBar) {
            progressBar.style.width = calcolaPercentuale(numeroDomanda) + "%";
        }

        let questionHTML = '';
        const domanda = document.getElementById('domanda');
        const optionContainer = document.getElementById('option-container');

        answers = [
            {
                answer: escapeHtml(decodeHTMLEntities(currentQuestion.correct_answer)),
                correct: "true"
            },
            {
                answer: escapeHtml(decodeHTMLEntities(currentQuestion.incorrect_answers[0])),
                correct: "false"
            },
            {
                answer: escapeHtml(decodeHTMLEntities(currentQuestion.incorrect_answers[1])),
                correct: "false"
            },
            {
                answer: escapeHtml(decodeHTMLEntities(currentQuestion.incorrect_answers[2])),
                correct: "false"
            }
        ];

        answers = shuffleArray(answers);
        const letters = ['A', 'B', 'C', 'D'];

        if (currentQuestion.type === 'multiple') {
            questionHTML = answers.map((ans, idx) => `
                <button id="opt${idx + 1}" data-answer="${ans.answer}" class="js-multiple-option group w-full min-h-[58px] sm:min-h-[64px] py-3.5 sm:py-4 px-4 bg-[#f3eef8] hover:bg-[#eedcff] text-[#2d3748] hover:text-[#37274d] rounded-2xl font-bold text-base sm:text-lg border-2 border-transparent transition-all shadow-xs active:scale-98 cursor-pointer flex items-center gap-3 text-left break-words">
                    <span class="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/80 group-hover:bg-[#4F00D0] group-hover:text-white text-[#4F00D0] font-black text-xs sm:text-sm flex items-center justify-center shrink-0 transition-colors shadow-2xs">${letters[idx]}</span>
                    <span class="flex-1">${ans.answer}</span>
                </button>
            `).join('');
        } else {
            questionHTML = `
                <button id="opt1" data-answer="True" class="js-boolean-option group w-full min-h-[58px] sm:min-h-[64px] py-3.5 sm:py-4 px-4 bg-[#f3eef8] hover:bg-[#eedcff] text-[#2d3748] hover:text-[#37274d] rounded-2xl font-bold text-base sm:text-lg border-2 border-transparent transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-3 text-center break-words">
                    <span>True</span>
                </button>
                <button id="opt2" data-answer="False" class="js-boolean-option group w-full min-h-[58px] sm:min-h-[64px] py-3.5 sm:py-4 px-4 bg-[#f3eef8] hover:bg-[#eedcff] text-[#2d3748] hover:text-[#37274d] rounded-2xl font-bold text-base sm:text-lg border-2 border-transparent transition-all shadow-xs active:scale-98 cursor-pointer flex items-center justify-center gap-3 text-center break-words">
                    <span>False</span>
                </button>
            `;
        }

        if (optionContainer) {
            optionContainer.innerHTML = questionHTML;
        }

        if (domanda) {
            domanda.innerText = decodeHTMLEntities(currentQuestion.question);
        }

        updateFiftyPercentState();
    }

    function updateFiftyPercentState() {
        if (!fiftyPercentBtn) return;

        if (isGameFinished || fiftyPercentUsed) {
            fiftyPercentBtn.disabled = true;
            fiftyPercentBtn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
            fiftyPercentBtn.setAttribute('title', fiftyPercentUsed ? 'Lifeline already used' : 'Game completed');
        } else if (pauseMenuIsDisplayed || nextQuestionIsDisplayed) {
            fiftyPercentBtn.disabled = true;
            fiftyPercentBtn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
        } else if (currentQuestion.type !== 'multiple') {
            fiftyPercentBtn.disabled = true;
            fiftyPercentBtn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
            fiftyPercentBtn.setAttribute('title', 'Not available for True/False questions');
        } else {
            fiftyPercentBtn.disabled = false;
            fiftyPercentBtn.classList.remove('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
            fiftyPercentBtn.setAttribute('title', 'Remove 2 wrong options (-1 pt)');
        }
    }

    // Answer click handler
    document.getElementById('option')?.addEventListener('click', (event) => {
        const clickedElement = event.target.closest('button');
        if (!clickedElement) return;

        if (clickedElement.classList.contains('js-multiple-option') || clickedElement.classList.contains('js-boolean-option')) {
            const correctAnswerText = escapeHtml(decodeHTMLEntities(currentQuestion.correct_answer));
            const selectedAnswer = clickedElement.dataset.answer;
            const isCorrect = (correctAnswerText === selectedAnswer);
            checkAnswer(isCorrect, clickedElement);
        }
    });

    // Direct 50/50 Lifeline Button
    fiftyPercentBtn?.addEventListener('click', () => {
        if (isGameFinished || fiftyPercentUsed || pauseMenuIsDisplayed || nextQuestionIsDisplayed) {
            return;
        }

        if (currentQuestion.type !== "multiple") {
            alert('Questo aiuto si può usare solo nelle domande a scelta multipla!');
            return;
        }

        let wrongIndices = [];
        for (let i in answers) {
            if (answers[i].correct === 'false') {
                wrongIndices.push(parseInt(i));
            }
        }

        wrongIndices = shuffleArray(wrongIndices);
        let removed = 0;
        while (removed < 2 && removed < wrongIndices.length) {
            let optId = `opt${wrongIndices[removed] + 1}`;
            const optElem = document.getElementById(optId);
            if (optElem) {
                optElem.disabled = true;
                optElem.classList.add('opacity-30', 'line-through', 'cursor-not-allowed', 'pointer-events-none');
            }
            removed++;
        }

        fiftyPercentUsed = true;
        score.punteggio = Math.max(0, score.punteggio - 1);
        updateScoreDisplay();
        updateFiftyPercentState();
    });

    // Next question handler
    nextQuestionBtn?.addEventListener('click', () => {
        numeroDomanda++;
        renderQuestion();
        resetAnswers();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Enter" && nextQuestionIsDisplayed) {
            numeroDomanda++;
            renderQuestion();
            resetAnswers();
        }
    });

    // Pause button
    pauseBtn?.addEventListener('click', () => {
        if (isGameFinished || pauseBtn.disabled) return;
        if (pauseMenuIsDisplayed) {
            hidePauseMenu();
        } else {
            showPauseMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            if (isGameFinished || pauseBtn?.disabled) {
                return;
            }
            if (pauseMenuIsDisplayed) {
                hidePauseMenu();
            } else {
                showPauseMenu();
            }
        }
    });

    // Back to homepage buttons
    document.querySelectorAll('.js-homePageBtn').forEach((btn) => {
        btn.addEventListener('click', () => {
            window.location.href = "./index.html";
        });
    });

    // Resume game button
    backToGame?.addEventListener('click', () => {
        hidePauseMenu();
    });

    function disableBtn(classe, clicked) {
        document.querySelectorAll(`.${classe}`).forEach((option) => {
            option.disabled = true;
        });
        clicked.classList.add("selezionato");
    }

    function checkAnswer(correct, clickedElement) {
        clickedElement.classList.add(correct ? "correct-option" : 'wrong-option');
        disableBtn("js-multiple-option", clickedElement);
        disableBtn("js-boolean-option", clickedElement);

        if (correct) {
            score.corrette++;
        } else {
            score.errate++;
        }
        calcScore(correct);
        updateScoreDisplay();

        if (numeroDomanda + 1 < allQuestions.length) {
            openNextQuestionMenu();
        } else {
            fineDomande();
        }
    }

    function calcScore(corretta) {
        if (corretta) {
            if (currentQuestion.difficulty === 'easy') {
                score.punteggio += 1;
            } else if (currentQuestion.difficulty === 'medium') {
                score.punteggio += 2;
            } else {
                score.punteggio += 3;
            }
        }
    }

    function resetAnswers() {
        if (pauseBtn) pauseBtn.disabled = false;
        if (resultContainer) {
            resultContainer.classList.add('hidden');
            resultContainer.classList.remove('flex');
        }
        nextQuestionIsDisplayed = false;
        updateFiftyPercentState();
    }

    function openNextQuestionMenu() {
        if (pauseBtn) pauseBtn.disabled = true;
        if (resultContainer) {
            resultContainer.classList.remove('hidden');
            resultContainer.classList.add('flex');
        }
        nextQuestionIsDisplayed = true;
        updateFiftyPercentState();
    }

    function showPauseMenu() {
        if (pauseMenu) {
            pauseMenu.classList.remove('hidden');
            pauseMenu.classList.add('flex');
        }
        pauseMenuIsDisplayed = true;
        updateFiftyPercentState();
        if (pageContainer) pageContainer.classList.add('blur-xs', 'pointer-events-none');
    }

    function hidePauseMenu() {
        if (pauseMenu) {
            pauseMenu.classList.add('hidden');
            pauseMenu.classList.remove('flex');
        }
        pauseMenuIsDisplayed = false;
        updateFiftyPercentState();
        if (pageContainer) pageContainer.classList.remove('blur-xs', 'pointer-events-none');
    }

    function calcolaPercentuale(numero) {
        return ((numero + 1) / allQuestions.length) * 100;
    }

    function fineDomande() {
        let userScore = {
            gameId: Date.now() + Math.random().toString(16).substring(2),
            username: nickname,
            score: score
        };
        scoreBoard = loadFroamStorage() || [];
        scoreBoard.unshift(userScore);
        saveToStorage(scoreBoard);

        if (progressBarWrapper) progressBarWrapper.classList.add("hidden");

        const noMoreQuestionsContainer = document.getElementById("noMoreQuestions");

        if (pageContainer) pageContainer.classList.add("hidden");

        if (noMoreQuestionsContainer) {
            noMoreQuestionsContainer.classList.remove("hidden");
            noMoreQuestionsContainer.classList.add("flex");
        }

        const finalScore = document.getElementById("finalScore");
        if (finalScore) finalScore.innerText = `${score.punteggio}`;

        const correctFinalScore = document.getElementById("correctFinalScore");
        const wrongFinalScore = document.getElementById("wrongFinalScore");
        if (correctFinalScore) correctFinalScore.innerText = `${score.corrette}`;
        if (wrongFinalScore) wrongFinalScore.innerText = `${score.errate}`;

        isGameFinished = true;
        if (pauseBtn) {
            pauseBtn.disabled = true;
            pauseBtn.classList.add('opacity-40', 'cursor-not-allowed', 'pointer-events-none');
        }
        updateFiftyPercentState();
    }
}

function escapeHtml(text) {
    if (!text) return '';
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, function (m) { return map[m]; });
}

// Countdown & API retry loop
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitWithCountdown(seconds) {
    const counterElement = document.getElementById('retryCounter');
    for (let i = seconds; i > 0; i--) {
        if (counterElement) {
            counterElement.innerText = `Troppe richieste. Nuovo tentativo tra ${i} secondi...`;
        }
        await wait(1000);
    }
    if (counterElement) {
        counterElement.innerText = "Sto riprovando...";
    }
}

let success = false;
let attempt = 1;
const delayInSeconds = 5;

while (!success) {
    try {
        const loadingElem = document.getElementById('loading');
        if (loadingElem) {
            loadingElem.classList.remove('hidden');
            loadingElem.classList.add('flex');
        }

        await renderPage();

        success = true;
        if (loadingElem) {
            loadingElem.classList.remove('flex');
            loadingElem.classList.add('hidden');
        }
    } catch (error) {
        console.log(`Errore API. Ritento tra ${delayInSeconds} secondi... (Tentativo ${attempt})`);
        await waitWithCountdown(delayInSeconds);
        attempt++;

        if (attempt > 6) {
            console.error("Server irraggiungibile dopo vari tentativi.");
            const counterElement = document.getElementById('retryCounter');
            if (counterElement) {
                counterElement.innerText = "Impossibile caricare le domande. Riprova più tardi.";
            }
            break;
        }
    }
}