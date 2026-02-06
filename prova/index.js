import { loadFroamStorage, saveToStorage } from "./storage/storageFunctions.js";

const body = document.querySelector("body");
const mainContent = document.getElementById('main-content');
const modalOverlay = document.querySelector('.modal-overlay');

const startGameBtn = document.getElementById('startGameBtn');

const scoreBoard = loadFroamStorage() || [];
const scoreBoardHtml = document.getElementById('scoreBoard');

const choosePfpBtn = document.getElementById('pfp-btn');
const pfpContainer = document.getElementById('pfp-stack-container');
const currentPfp = document.getElementById('current-pfp');
const closePfpStackBtn = document.getElementById('close-pfp-stack-btn');


const difficultySelect = document.getElementById('difficulty');

const gameSelectedContainer = document.querySelector('.game-selected');

let nickname = document.getElementById('nickname');
let scoreHtml = '';
let pfpShown = false;
let gameInfoShown = false;

nickname.value = '';

scoreBoard.forEach((tentativo) => {
    console.log(tentativo)
    const gameId = tentativo.gameId;
    const nickname = tentativo.username;
    const score = tentativo.score;

    scoreHtml = `
            <button class="score-header nickname-header" data-id=${gameId}>
                <span class="text-wrap text-break" >${nickname}</span>
            </button>

            <button class="score-header points-header" data-id=${gameId}>
                <span class="text-wrap text-break" >${score.punteggio}</span>
            </button>

            <div class="score-header correct-header" data-id=${gameId}>
                <span class="text-break text-wrap" >${score.corrette}</span>
            </div>

            <div class="score-header wrong-header" data-id=${gameId}>
                <span class="text-break text-wrap" >${score.errate}</span>
            </div>
    `;

    scoreBoardHtml.innerHTML += scoreHtml;
})

startGameBtn.addEventListener('click', () => {
    startGame();
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

choosePfpBtn.addEventListener('click', () => {
    if (!pfpShown) {
        pfpMenuOn();
    }
})


closePfpStackBtn.addEventListener('click', () => {
    if (pfpShown) {
        pfpMenuOff();
    }
});


document.querySelectorAll('.js-pfp').forEach((btn) => (
    btn.addEventListener(('click'), () => {
        pfpMenuOff();

        const srcNewPfp = btn.src;
        currentPfp.src = srcNewPfp;
        currentPfp.name = btn.id;
    })
));



scoreBoardHtml.addEventListener('click', (event) => {
    const targetElement = event.target.closest('.nickname-header, .points-header');
    if (targetElement && (window.innerWidth <= 768)) {

        gameInfoMenuOn();

        const gameId = targetElement.dataset.id;
        const gameInfo = findGameById(gameId);

        const gameInfoUser = document.querySelector('.game-info-user');
        const gameInfoScore = document.querySelector('.game-info-score-number');
        const gameInfoCorrect = document.querySelector('.game-info-correct-number');
        const gameInfoWrong = document.querySelector('.game-info-wrong-number');

        gameInfoUser.innerText = `${gameInfo.username}`;
        gameInfoScore.innerText = `${gameInfo.score.punteggio}`;
        gameInfoCorrect.innerText = `${gameInfo.score.corrette}`;
        gameInfoWrong.innerText = `${gameInfo.score.errate}`;
    }
});

const gameInfoCloseBtn = document.querySelector('.close-btn-game-info');

gameInfoCloseBtn.addEventListener('click', () => {
    gameInfoMenuOff();
});

modalOverlay.addEventListener("click", () => {
    if (pfpShown) {
        pfpMenuOff();
    } else if (gameInfoShown) {
        gameInfoMenuOff();
    }
});

function startGame() {
    const nickname = document.getElementById('nickname').value;
    const difficulty = document.getElementById('difficulty').value.toLowerCase();
    console.log(difficulty)
    const pfp = currentPfp.name;
    if (nickname.trim() === '') {
        alert('Please enter a nickname to start the game.');
        return;
    }
    window.location.href = `/game.html?nickname=${nickname}&difficulty=${difficulty}&pfpId=${pfp}`
}

function findGameById(gameId) {
    return scoreBoard.find((tentativo) => tentativo.gameId === gameId);
}

function gameInfoMenuOff() {
    body.classList.remove("no-scroll");
    gameSelectedContainer.classList.add('d-none');
    gameSelectedContainer.classList.remove('d-flex');
    // mainContent.classList.remove('blur');
    modalOverlay.classList.add("d-none");
    mainContent.removeAttribute('inert');
    gameInfoShown = false;
}

function gameInfoMenuOn() {
    body.classList.add("no-scroll");

    gameSelectedContainer.classList.remove('d-none');
    gameSelectedContainer.classList.add('d-flex');
    // mainContent.classList.add('blur');
    modalOverlay.classList.remove("d-none");
    mainContent.setAttribute('inert', '');

    gameInfoShown = true;
}

function pfpMenuOn() {
    body.classList.add("no-scroll");
    pfpContainer.classList.remove('d-none');
    pfpContainer.classList.add('d-flex');
    // mainContent.classList.add('blur');
    modalOverlay.classList.remove("d-none");
    mainContent.setAttribute('inert', '');

    //riabilito gli altri pulsanti
    choosePfpBtn.disabled = true;
    difficultySelect.disabled = true;
    startGameBtn.disabled = true;
    pfpShown = true;
}

function pfpMenuOff() {
    body.classList.remove("no-scroll");

    pfpContainer.classList.add('d-none');
    pfpContainer.classList.remove('d-flex');
    // mainContent.classList.remove('blur');
    modalOverlay.classList.add("d-none");
    mainContent.removeAttribute('inert');

    //riabilito gli altri pulsanti
    choosePfpBtn.disabled = false;
    difficultySelect.disabled = false;
    startGameBtn.disabled = false;
    pfpShown = false;
}
