import { loadFroamStorage } from "/src/storage/storageFunctions.js";

const startGameBtn = document.getElementById('startGameBtn');
let scoreBoard = loadFroamStorage() || [];
const scoreBoardHtml = document.getElementById('scoreBoard');
const modalScoreBoardHtml = document.getElementById('modalScoreBoard') || document.getElementById('mobileScoreBoard');

const viewMoreBtn = document.getElementById("viewMoreScoreBoard");
const viewLessBtn = document.getElementById("viewLessScoreBoard");

const scoreboardBtn = document.getElementById('scoreboardBtn') || document.getElementById('mobileScoreboardBtn');
const scoreboardModal = document.getElementById('scoreboardModal') || document.getElementById('mobileScoreboardModal');

const currentPfp = document.getElementById('current-pfp');
const gameInfoModal = document.getElementById('gameInfoModal');
const pfpModal = document.getElementById('pfpModal');

// Category and Difficulty Modal elements
const categoryModal = document.getElementById('categoryModal');
const difficultyModal = document.getElementById('difficultyModal');
const selectedCategoryInput = document.getElementById('selectedCategory');
const selectedDifficultyInput = document.getElementById('selectedDifficulty');
const selectedCategoryText = document.getElementById('selectedCategoryText');
const selectedDifficultyText = document.getElementById('selectedDifficultyText');

let nickname = document.getElementById('nickname');
if (nickname) {
    nickname.value = '';
}

loadScoreBoard();

if (startGameBtn) {
    startGameBtn.addEventListener('click', () => {
        startGame();
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        // If any modal is open, don't trigger game start
        if (pfpModal?.open || gameInfoModal?.open || scoreboardModal?.open || categoryModal?.open || difficultyModal?.open) {
            return;
        }
        startGame();
    }
});

// Avatar selection
document.querySelectorAll('.js-pfp').forEach((btn) => {
    btn.addEventListener('click', () => {
        if (pfpModal) {
            pfpModal.close();
        }
        currentPfp.src = btn.src;
        currentPfp.name = btn.id;
    });
});

// Category selection
document.querySelectorAll('.js-category-option').forEach((btn) => {
    btn.addEventListener('click', () => {
        const catVal = btn.dataset.category || '';
        const catName = btn.dataset.name || 'Any Category';
        if (selectedCategoryInput) selectedCategoryInput.value = catVal;
        if (selectedCategoryText) selectedCategoryText.innerText = `CATEGORY: ${catName.toUpperCase()}`;
        if (categoryModal) categoryModal.close();
    });
});

// Difficulty selection
document.querySelectorAll('.js-difficulty-option').forEach((btn) => {
    btn.addEventListener('click', () => {
        const diffVal = btn.dataset.difficulty || 'Mixed';
        const diffName = btn.dataset.name || 'Mixed';
        if (selectedDifficultyInput) selectedDifficultyInput.value = diffVal;
        if (selectedDifficultyText) selectedDifficultyText.innerText = `DIFFICULTY: ${diffName.toUpperCase()}`;
        if (difficultyModal) difficultyModal.close();
    });
});

// Leaderboard button (accessible from header)
if (scoreboardBtn && scoreboardModal) {
    scoreboardBtn.addEventListener('click', () => {
        scoreboardModal.showModal();
    });
}

function renderScoreCards(items) {
    if (!items || items.length === 0) {
        return `
            <div class="text-center text-gray-500 py-6 text-base font-medium">
                No matches played yet. Start playing!
            </div>
        `;
    }

    return items.map((tentativo, index) => {
        const gameId = tentativo.gameId;
        const name = tentativo.username || 'Anonymous';
        const score = tentativo.score?.punteggio ?? 0;
        return `
            <div class="js-score-card flex items-center p-3.5 sm:p-4 bg-white hover:bg-[#eedcff]/40 border border-gray-100 rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200" data-id="${gameId}">
                <div class="text-lg sm:text-xl font-black text-gray-400 w-8 text-center">${index + 1}</div>
                <div class="w-full flex justify-between items-center pl-2 min-w-0">
                    <div class="font-bold text-base sm:text-lg truncate max-w-[140px] sm:max-w-[200px] text-gray-800">${escapeHtml(name)}</div>
                    <div class="text-[#4F00D0] font-extrabold text-base sm:text-lg shrink-0">${score} pts</div>
                </div>
            </div>
        `;
    }).join('');
}

function loadScoreBoard() {
    if (!scoreBoardHtml && !modalScoreBoardHtml) return;

    const isExpanded = viewMoreBtn?.classList.contains("hidden");

    if (scoreBoard.length <= 3) {
        viewMoreBtn?.classList.add("hidden");
        viewLessBtn?.classList.add("hidden");
    }

    if (scoreBoardHtml) {
        const itemsToShow = isExpanded ? scoreBoard : scoreBoard.slice(0, 3);
        scoreBoardHtml.innerHTML = renderScoreCards(itemsToShow);
    }

    // Modal scoreboard (shows full list)
    if (modalScoreBoardHtml) {
        modalScoreBoardHtml.innerHTML = renderScoreCards(scoreBoard);
    }
}

function handleScoreCardClick(event) {
    const targetElement = event.target.closest('.js-score-card');
    if (!targetElement || !gameInfoModal) return;

    const gameId = targetElement.dataset.id;
    const gameInfo = findGameById(gameId);
    if (!gameInfo) return;

    const gameInfoUser = document.querySelector('.game-info-user');
    const gameInfoScore = document.querySelector('.game-info-score-number');
    const gameInfoCorrect = document.querySelector('.game-info-correct-number');
    const gameInfoWrong = document.querySelector('.game-info-wrong-number');

    if (gameInfoUser) gameInfoUser.innerText = gameInfo.username || 'Anonymous';
    if (gameInfoScore) gameInfoScore.innerText = `${gameInfo.score?.punteggio ?? 0}`;
    if (gameInfoCorrect) gameInfoCorrect.innerText = `${gameInfo.score?.corrette ?? 0}`;
    if (gameInfoWrong) gameInfoWrong.innerText = `${gameInfo.score?.errate ?? 0}`;

    gameInfoModal.showModal();
}

if (scoreBoardHtml) {
    scoreBoardHtml.addEventListener('click', handleScoreCardClick);
}

if (modalScoreBoardHtml) {
    modalScoreBoardHtml.addEventListener('click', handleScoreCardClick);
}

if (viewMoreBtn) {
    viewMoreBtn.addEventListener("click", () => {
        viewMoreBtn.classList.add("hidden");
        viewLessBtn?.classList.remove("hidden");
        loadScoreBoard();
    });
}

if (viewLessBtn) {
    viewLessBtn.addEventListener("click", () => {
        viewMoreBtn.classList.remove("hidden");
        viewLessBtn.classList.add("hidden");
        loadScoreBoard();
    });
}

function startGame() {
    const nicknameInput = document.getElementById('nickname');
    const nicknameVal = nicknameInput ? nicknameInput.value.trim() : '';
    const difficultyVal = selectedDifficultyInput ? selectedDifficultyInput.value.toLowerCase() : 'mixed';
    const categoryVal = selectedCategoryInput ? selectedCategoryInput.value : '';
    const pfpVal = currentPfp ? (currentPfp.name || 'user.svg') : 'user.svg';

    if (nicknameVal === '') {
        alert('Please enter a nickname to start the game.');
        nicknameInput?.focus();
        return;
    }
    window.location.href = `./game.html?nickname=${encodeURIComponent(nicknameVal)}&difficulty=${encodeURIComponent(difficultyVal)}&category=${encodeURIComponent(categoryVal)}&pfpId=${encodeURIComponent(pfpVal)}`;
}

function findGameById(gameId) {
    return scoreBoard.find((tentativo) => String(tentativo.gameId) === String(gameId));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
