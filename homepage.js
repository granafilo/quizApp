import { loadFroamStorage, saveToStorage } from "./storage/storageFunctions.js";

let nickname = document.getElementById('nickname'); //ok
nickname.value = '';

//aggiungo event listener per iniziare il gioco
const startGameBtn = document.getElementById('startGameBtn'); //ok

startGameBtn.addEventListener('click', () => {
    startGame();
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

const scoreBoard = loadFroamStorage() || []; //ok
const scoreBoardHtml = document.getElementById('scoreBoard'); //ok
let scoreHtml = '';

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

const choosePfpBtn = document.getElementById('pfp-btn'); //ok
const pfpContainer = document.getElementById('pfp-stack-container'); //ok
const currentPfp = document.getElementById('current-pfp'); //ok
const difficultySelect = document.getElementById('difficulty'); //ok
const mainContent = document.getElementById('main-content'); //ok
const closePfpStackBtn = document.getElementById('close-pfp-stack-btn'); //ok
let pfpShown = false;

//ok
choosePfpBtn.addEventListener('click', () => {
    if (!pfpShown) {
        pfpContainer.classList.remove('d-none');
        pfpContainer.classList.add('d-flex');
        mainContent.classList.add('blur');
        //disabilito gli altri pulsanti
        choosePfpBtn.disabled = true;
        difficultySelect.disabled = true;
        startGameBtn.disabled = true;
        pfpShown = true;
    }
})

//ok
closePfpStackBtn.addEventListener('click', () => {
    if (pfpShown) {
        pfpContainer.classList.add('d-none');
        pfpContainer.classList.remove('d-flex');
        mainContent.classList.remove('blur');
        //disabilito gli altri pulsanti
        choosePfpBtn.disabled = false;
        difficultySelect.disabled = false;
        startGameBtn.disabled = false;
        pfpShown = false;
    }
});

//ok
document.querySelectorAll('.js-pfp').forEach((btn) => (
    btn.addEventListener(('click'), () => {
        pfpContainer.classList.add('d-none');
        pfpContainer.classList.remove('d-flex');
        mainContent.classList.remove('blur');
        //disabilito gli altri pulsanti
        choosePfpBtn.disabled = false;
        difficultySelect.disabled = false;
        startGameBtn.disabled = false;
        pfpShown = false;
        const srcNewPfp = btn.src;
        currentPfp.src = srcNewPfp;
        currentPfp.name = btn.id;
    })
));

const gameSelectedContainer = document.querySelector('.game-selected');

scoreBoardHtml.addEventListener('click', (event) => {
    const targetElement = event.target.closest('.nickname-header, .points-header');
    if (targetElement && (window.innerWidth <= 768)) {

        gameSelectedContainer.classList.remove('d-none');
        gameSelectedContainer.classList.add('d-flex');
        mainContent.classList.add('blur');
        
        const gameId = targetElement.dataset.id;
        const gameInfo = findGameById(gameId);

        const gameInfoUser = document.querySelector('.game-info-user');
        const gameInfoScore = document.querySelector('.game-info-score');
        const gameInfoCorrect = document.querySelector('.game-info-correct');
        const gameInfoWrong = document.querySelector('.game-info-wrong');

        gameInfoUser.innerText = `Username: ${gameInfo.username}`;
        gameInfoScore.innerText = `Score: ${gameInfo.score.punteggio}`;
        gameInfoCorrect.innerText = `Correct: ${gameInfo.score.corrette}`;
        gameInfoWrong.innerText = `Wrong: ${gameInfo.score.errate}`;
    }
});

const gameInfoCloseBtn = document.querySelector('.close-btn-game-info');

gameInfoCloseBtn.addEventListener('click', () => {
    gameSelectedContainer.classList.add('d-none');
    gameSelectedContainer.classList.remove('d-flex');
    mainContent.classList.remove('blur');
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

function findGameById(gameId){
    return scoreBoard.find((tentativo) => tentativo.gameId === gameId);
}
