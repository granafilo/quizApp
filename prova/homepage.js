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
    const nickname = tentativo.username;
    const score = tentativo.score;

    scoreHtml = `
            <div class="score-header nickname-header">
                <span class="text-wrap text-break">${nickname}</span>
            </div>

            <div class="score-header points-header">
                <span class="text-wrap text-break">${score.punteggio}</span>
            </div>

            <div class="score-header correct-header">
                <span class="text-break text-wrap">${score.corrette}</span>
            </div>

            <div class="score-header wrong-header">
                <span class="text-break text-wrap">${score.errate}</span>
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