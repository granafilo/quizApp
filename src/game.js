/**
 * @file game.js
 * @description Core game logic, API data fetching, user interaction, and score management for Quiz App.
 */

import { loadFroamStorage, saveToStorage } from "/src/storage/storageFunctions.js";

/* ==========================================================================
   Helper Functions
   ========================================================================== */

/**
 * Decodes HTML entities from API response strings.
 * @param {string} text 
 * @returns {string}
 */
function decodeHTMLEntities(text) {
    if (!text) return "";
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

/**
 * Shuffles an array randomly using the Fisher-Yates algorithm.
 * @template T
 * @param {T[]} array 
 * @returns {T[]}
 */
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Delays execution for a specified duration.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* ==========================================================================
   Game State
   ========================================================================== */

const params = new URLSearchParams(window.location.search);
const rawDifficulty = (params.get("difficulty") || "").toLowerCase();
const rawCategory = params.get("category") || "";
let rawPfp = params.get("pfpId") || "user.svg";
if (rawPfp === "undefined" || rawPfp.trim() === "") {
    rawPfp = "user.svg";
}

const gameState = {
    nickname: params.get("nickname") || "Player",
    difficulty: rawDifficulty === "mixed" ? "" : rawDifficulty,
    category: rawCategory,
    pfpId: rawPfp,
    allQuestions: [],
    currentIndex: 0,
    score: {
        punteggio: 0,
        corrette: 0,
        errate: 0
    },
    streak: 0,
    maxStreak: 0,
    fiftyPercentUsed: false,
    isWaitingNext: false,
    currentAnswers: []
};

/* ==========================================================================
   DOM Element References
   ========================================================================== */

const playerNicknameEl = document.getElementById("playerNickname");
const playerPfpEl = document.getElementById("playerPfp");
const questionCounterEl = document.getElementById("questionCounter");
const scoreTrackerEl = document.getElementById("scoreTracker");
const streakBadgeEl = document.getElementById("streakBadge");
const streakTextEl = document.getElementById("streakText");
const progressBarEl = document.getElementById("progressBar");
const difficultyBadgeEl = document.getElementById("difficultyBadge");
const domandaEl = document.getElementById("domanda");
const optionContainerEl = document.getElementById("option-container");
const resultContainerEl = document.getElementById("resultContainer");
const nextQuestionBtn = document.getElementById("nextQuestion");
const hintBtn = document.getElementById("hintBtn");
const pauseBtn = document.getElementById("pauseBtn");
const pauseModal = document.getElementById("pauseModal");
const resumeGameBtn = document.getElementById("resumeGameBtn");
const pageContainer = document.getElementById("pageContainer");
const noMoreQuestionsContainer = document.getElementById("noMoreQuestions");
const finalScoreEl = document.getElementById("finalScore");
const correctFinalScoreEl = document.getElementById("correctFinalScore");
const wrongFinalScoreEl = document.getElementById("wrongFinalScore");
const maxStreakFinalScoreEl = document.getElementById("maxStreakFinalScore");
const playAgainBtn = document.getElementById("playAgainBtn");
const loadingOverlay = document.getElementById("loading");
const retryCounterEl = document.getElementById("retryCounter");
const homePageBtns = document.querySelectorAll(".js-homePageBtn");

/* ==========================================================================
   API & Loading Functions
   ========================================================================== */

/**
 * Fetches 15 quiz questions from Open Trivia DB.
 * @param {string} difficulty 
 * @param {string} category
 * @returns {Promise<Array<Object>>}
 */
async function fetchQuestions(difficulty, category) {
    const diffQuery = difficulty ? `&difficulty=${encodeURIComponent(difficulty)}` : "";
    const catQuery = category ? `&category=${encodeURIComponent(category)}` : "";
    const url = `https://opentdb.com/api.php?amount=15${diffQuery}${catQuery}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || data.results.length === 0) {
        throw new Error("No questions available for the selected filters.");
    }

    return data.results;
}

/**
 * Displays countdown timer when OpenTDB rate-limits requests.
 * @param {number} seconds 
 */
async function displayCountdown(seconds) {
    for (let i = seconds; i > 0; i--) {
        if (retryCounterEl) {
            retryCounterEl.innerText = `Too many requests. Retrying in ${i}s...`;
        }
        await wait(1000);
    }
    if (retryCounterEl) {
        retryCounterEl.innerText = "Loading questions...";
    }
}

/* ==========================================================================
   Render & UI Updates
   ========================================================================== */

/**
 * Initializes the top bar with player profile picture and nickname.
 */
function initPlayerHeader() {
    if (playerNicknameEl) {
        playerNicknameEl.innerText = gameState.nickname;
    }
    if (playerPfpEl) {
        playerPfpEl.src = `/images/profile_pics/${gameState.pfpId}`;
        playerPfpEl.onerror = () => {
            playerPfpEl.src = "/images/profile_pics/user.svg";
        };
    }
    updateScoreTracker();
}

/**
 * Updates the score tracker badge.
 */
function updateScoreTracker() {
    if (scoreTrackerEl) {
        scoreTrackerEl.innerText = `${gameState.score.punteggio} pts`;
    }
}

/**
 * Renders the active question and options.
 */
function renderQuestion() {
    const totalQuestions = gameState.allQuestions.length;
    if (gameState.currentIndex >= totalQuestions) {
        handleFinishGame();
        return;
    }

    const questionObj = gameState.allQuestions[gameState.currentIndex];
    const currentNum = gameState.currentIndex + 1;

    // Update progress
    const progressPercent = Math.round((currentNum / totalQuestions) * 100);
    if (progressBarEl) {
        progressBarEl.style.width = `${progressPercent}%`;
    }
    if (questionCounterEl) {
        questionCounterEl.innerText = `Question ${currentNum} of ${totalQuestions}`;
    }

    // Update difficulty / category badge
    if (difficultyBadgeEl) {
        const diffText = questionObj.difficulty ? questionObj.difficulty.toUpperCase() : "QUIZ";
        difficultyBadgeEl.innerText = `${diffText} • ${decodeHTMLEntities(questionObj.category || "General")}`;
    }

    // Update question text
    if (domandaEl) {
        domandaEl.innerText = decodeHTMLEntities(questionObj.question);
    }

    // Prepare answers list
    const decodedCorrect = decodeHTMLEntities(questionObj.correct_answer);
    const answers = [
        { text: decodedCorrect, isCorrect: true },
        ...questionObj.incorrect_answers.map((ans) => ({
            text: decodeHTMLEntities(ans),
            isCorrect: false
        }))
    ];

    gameState.currentAnswers = shuffleArray(answers);

    // Build option buttons HTML
    optionContainerEl.innerHTML = "";
    gameState.currentAnswers.forEach((ans, index) => {
        const btn = document.createElement("button");
        btn.id = `opt-${index}`;
        btn.className = "option-btn";
        btn.innerText = ans.text;
        btn.dataset.correct = ans.isCorrect ? "true" : "false";

        btn.addEventListener("click", () => handleOptionSelect(btn, ans.isCorrect));
        optionContainerEl.appendChild(btn);
    });

    // Reset next question button and states
    resultContainerEl.classList.add("hidden");
    gameState.isWaitingNext = false;

    // Trigger smooth question transition animation
    if (pageContainer) {
        pageContainer.classList.remove("question-animate");
        void pageContainer.offsetWidth; // Reflow to reset animation
        pageContainer.classList.add("question-animate");
    }

    // Update Hint button state
    if (hintBtn) {
        if (questionObj.type === "multiple" && !gameState.fiftyPercentUsed) {
            hintBtn.disabled = false;
            hintBtn.classList.remove("opacity-40", "cursor-not-allowed");
        } else {
            hintBtn.disabled = true;
            hintBtn.classList.add("opacity-40", "cursor-not-allowed");
        }
    }
}

/**
 * Handles selection of an answer option.
 * @param {HTMLButtonElement} selectedBtn 
 * @param {boolean} isCorrect 
 */
function handleOptionSelect(selectedBtn, isCorrect) {
    if (gameState.isWaitingNext) return;

    const questionObj = gameState.allQuestions[gameState.currentIndex];

    // Disable all option buttons
    const allOptions = optionContainerEl.querySelectorAll(".option-btn");
    allOptions.forEach((btn) => {
        btn.disabled = true;
        if (btn.dataset.correct === "true") {
            btn.classList.add("correct-option");
        }
    });

    if (isCorrect) {
        selectedBtn.classList.add("correct-option");
        gameState.score.corrette++;
        gameState.streak++;
        if (gameState.streak > gameState.maxStreak) {
            gameState.maxStreak = gameState.streak;
        }

        // Base points according to difficulty
        let basePoints = 1;
        if (questionObj.difficulty === "hard") {
            basePoints = 3;
        } else if (questionObj.difficulty === "medium") {
            basePoints = 2;
        }

        // Streak combo bonus
        let streakBonus = 0;
        if (gameState.streak >= 5) {
            streakBonus = 3;
        } else if (gameState.streak >= 3) {
            streakBonus = 2;
        } else if (gameState.streak === 2) {
            streakBonus = 1;
        }

        gameState.score.punteggio += (basePoints + streakBonus);

        // Update streak combo badge in UI
        if (streakBadgeEl && streakTextEl) {
            if (gameState.streak >= 2) {
                streakTextEl.innerText = `x${gameState.streak} (+${streakBonus} pts)`;
                streakBadgeEl.classList.remove("hidden");
                streakBadgeEl.classList.add("inline-flex");
            }
        }
    } else {
        selectedBtn.classList.add("wrong-option");
        gameState.score.errate++;
        gameState.streak = 0;

        // Hide streak badge on wrong answer
        if (streakBadgeEl) {
            streakBadgeEl.classList.remove("inline-flex");
            streakBadgeEl.classList.add("hidden");
        }
    }

    updateScoreTracker();

    // Disable hint during resolution
    if (hintBtn) hintBtn.disabled = true;

    // Reveal next button
    resultContainerEl.classList.remove("hidden");
    gameState.isWaitingNext = true;
}

/**
 * 50/50 Hint: eliminates two wrong answers from multiple-choice questions.
 */
function handleFiftyPercentHint() {
    if (gameState.fiftyPercentUsed || gameState.isWaitingNext) return;

    const questionObj = gameState.allQuestions[gameState.currentIndex];
    if (questionObj.type !== "multiple") {
        return;
    }

    const wrongButtons = [];
    const allOptions = optionContainerEl.querySelectorAll(".option-btn");
    allOptions.forEach((btn) => {
        if (btn.dataset.correct === "false") {
            wrongButtons.push(btn);
        }
    });

    const shuffledWrongs = shuffleArray(wrongButtons);
    // Eliminate up to 2 wrong buttons
    shuffledWrongs.slice(0, 2).forEach((btn) => {
        btn.disabled = true;
        btn.classList.add("eliminated-option");
    });

    gameState.fiftyPercentUsed = true;
    gameState.score.punteggio = Math.max(0, gameState.score.punteggio - 1);
    updateScoreTracker();

    if (hintBtn) {
        hintBtn.disabled = true;
        hintBtn.classList.add("opacity-40", "cursor-not-allowed");
    }
}

/**
 * Advances to the next question or finishes the game.
 */
function handleNextQuestion() {
    if (!gameState.isWaitingNext) return;
    gameState.currentIndex++;
    renderQuestion();
}

/**
 * Finalizes the game, stores results in localStorage, and shows final stats.
 */
function handleFinishGame() {
    // Save to localStorage
    const userScore = {
        gameId: Date.now() + Math.random().toString(16).substring(2),
        username: gameState.nickname,
        score: gameState.score,
        maxStreak: gameState.maxStreak
    };

    const scoreBoard = loadFroamStorage() || [];
    scoreBoard.unshift(userScore);
    saveToStorage(scoreBoard);

    // Hide question area, show completion screen
    if (pageContainer) pageContainer.classList.add("hidden");
    if (noMoreQuestionsContainer) {
        noMoreQuestionsContainer.classList.remove("hidden");
        noMoreQuestionsContainer.classList.add("flex");
    }

    if (finalScoreEl) finalScoreEl.innerText = `${gameState.score.punteggio}`;
    if (correctFinalScoreEl) correctFinalScoreEl.innerText = `${gameState.score.corrette}`;
    if (wrongFinalScoreEl) wrongFinalScoreEl.innerText = `${gameState.score.errate}`;
    if (maxStreakFinalScoreEl) maxStreakFinalScoreEl.innerText = `${gameState.maxStreak}`;

    if (hintBtn) hintBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = true;
}

/* ==========================================================================
   Modal & Pause Handling
   ========================================================================== */

function openPauseModal() {
    if (pauseModal && !pauseModal.open) {
        pauseModal.showModal();
        if (pageContainer) pageContainer.classList.add("game-blur");
    }
}

function closePauseModal() {
    if (pauseModal && pauseModal.open) {
        pauseModal.close();
        if (pageContainer) pageContainer.classList.remove("game-blur");
    }
}

/* ==========================================================================
   Event Listeners & Keyboard Shortcuts
   ========================================================================== */

function initEventListeners() {
    // Next Question Click & Enter Key
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener("click", handleNextQuestion);
    }

    // 50/50 Hint Click
    if (hintBtn) {
        hintBtn.addEventListener("click", handleFiftyPercentHint);
    }

    // Pause Modal Controls
    if (pauseBtn) {
        pauseBtn.addEventListener("click", openPauseModal);
    }
    if (resumeGameBtn) {
        resumeGameBtn.addEventListener("click", closePauseModal);
    }
    if (pauseModal) {
        pauseModal.addEventListener("close", () => {
            if (pageContainer) pageContainer.classList.remove("game-blur");
        });
        pauseModal.addEventListener("cancel", (event) => {
            if (pageContainer) pageContainer.classList.remove("game-blur");
        });
    }

    // Global Keyboard Shortcuts
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            if (pauseModal && pauseModal.open) {
                closePauseModal();
            } else if (!noMoreQuestionsContainer || noMoreQuestionsContainer.classList.contains("hidden")) {
                openPauseModal();
            }
        } else if (event.key === "Enter" && gameState.isWaitingNext) {
            event.preventDefault();
            handleNextQuestion();
        }
    });

    // Play Again Button
    if (playAgainBtn) {
        playAgainBtn.addEventListener("click", () => {
            window.location.reload();
        });
    }

    // Return to Homepage Buttons
    homePageBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            window.location.href = "./index.html";
        });
    });
}

/* ==========================================================================
   Game Bootstrap
   ========================================================================== */

async function startGame() {
    initPlayerHeader();
    initEventListeners();

    let attempts = 0;
    const maxAttempts = 5;
    const delaySec = 5;

    while (attempts < maxAttempts) {
        try {
            if (loadingOverlay) loadingOverlay.classList.remove("hidden");
            gameState.allQuestions = await fetchQuestions(gameState.difficulty, gameState.category);

            // Successfully fetched
            if (loadingOverlay) loadingOverlay.classList.add("hidden");
            renderQuestion();
            return;
        } catch (error) {
            attempts++;
            console.warn(`Attempt ${attempts} failed:`, error.message);

            if (attempts >= maxAttempts) {
                if (retryCounterEl) {
                    retryCounterEl.innerHTML = `
                        <span class="text-rose-600 block mb-2">Unable to load questions from the server.</span>
                        <button onclick="window.location.reload()" class="btn btn-sm btn-primary rounded-full mt-2">Try Again</button>
                    `;
                }
                const spinner = loadingOverlay?.querySelector(".loading-spinner");
                if (spinner) spinner.classList.add("hidden");
                return;
            }

            await displayCountdown(delaySec);
        }
    }
}

// Start Game on Page Load
startGame();