import { loadFroamStorage, saveToStorage } from "./storage/storageFunctions.js";

const body = document.querySelector("body");
const mainContent = document.getElementById('main-content');
const modalOverlay = document.querySelector('.modal-overlay');

const startGameBtn = document.getElementById('startGameBtn');

const scoreBoard = loadFroamStorage() || [];
const scoreBoardHtml = document.getElementById('scoreBoard');

const choosePfpBtn = document.getElementById('pfp-btn');
const pfpPickerDialog = document.querySelector(".pfp-picker-dialog");
const currentPfp = document.getElementById('current-pfp');
const closePfpStackBtn = document.getElementById('close-pfp-stack-btn');

const gameInfoDialog = document.querySelector('.game-info-dialog');
const gameInfoCloseBtn = document.querySelector('.close-btn-game-info');

let nickname = document.getElementById('nickname');
let scoreHtml = '';

nickname.value = '';

scoreBoard.forEach((tentativo) => {
    // console.log(tentativo)
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
    pfpPickerDialog.showModal();
    // if (!pfpShown) {
    //     pfpMenuOn();
    // }
})


closePfpStackBtn.addEventListener('click', () => {
    pfpPickerDialog.close();
    // if (pfpShown) {
    //     pfpMenuOff();
    // }
});


document.querySelectorAll('.js-pfp').forEach((btn) => (
    btn.addEventListener(('click'), () => {
        pfpPickerDialog.close();
        // pfpMenuOff();

        const srcNewPfp = btn.src;
        currentPfp.src = srcNewPfp;
        currentPfp.name = btn.id;
    })
));

pfpPickerDialog.addEventListener("click", (event) => {
    if(event.target.nodeName == "DIALOG"){
        pfpPickerDialog.close();
    } 
})



scoreBoardHtml.addEventListener('click', (event) => {
    const targetElement = event.target.closest('.nickname-header, .points-header');
    if (targetElement && ((window.innerWidth <= 768) || (window.innerWidth >= 1200))) {

        gameInfoDialog.showModal();

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



gameInfoCloseBtn.addEventListener('click', () => {
    gameInfoDialog.close();
});

gameInfoDialog.addEventListener('click', (event) => {
    if(event.target.nodeName == "DIALOG"){
        gameInfoDialog.close();
    }
})

function startGame() {
    const nickname = document.getElementById('nickname').value;
    const difficulty = document.getElementById('difficulty').value.toLowerCase();
    // console.log(difficulty)
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

