import { loadFroamStorage, saveToStorage } from "./storage/storageFunctions.js";

let nickname = document.getElementById('nickname');
nickname.value = '';

//aggiungo event listener per iniziare il gioco
const startGameBtn = document.getElementById('startGameBtn');

startGameBtn.addEventListener('click', () => {
    startGame();
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

const scoreBoard = loadFroamStorage() || [];
const scoreBoardHtml = document.getElementById('scoreBoard');
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

const choosePfpBtn = document.getElementById('choosePfpBtn');
const pfpContainer = document.getElementById('pfpContainer');
const currentPfp = document.getElementById('currentPfp');
const difficultySelected = document.getElementById('difficultySelected');
let pfpShown = false;

choosePfpBtn.addEventListener('click', () => {
    if (!pfpShown) {
        pfpContainer.classList.remove('d-none');
        difficultySelected.disabled = true;
        pfpShown = true;
    } else {
        pfpContainer.classList.add('d-none');
        difficultySelected.disabled = false;
        pfpShown = false;
    }
})

document.querySelectorAll('.js-pfp').forEach((btn) => (
    btn.addEventListener(('click'), () => {
        pfpShown = false;
        difficultySelected.disabled = false;
        const srcNewPfp = btn.src;
        currentPfp.src = srcNewPfp;
        currentPfp.name = btn.id;
        pfpContainer.classList.add('d-none');
    })
));

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelector('.dropdown-toggle').textContent = this.textContent;
    });
});

nickname.addEventListener('click', () => {
    if (pfpShown) {
        pfpContainer.classList.add('d-none');
        difficultySelected.disabled = false;
        pfpShown = false;
    }
});

function startGame() {
    const nickname = document.getElementById('nickname').value;
    const difficulty = document.getElementById('difficultySelected').textContent.toLowerCase();
    const pfp = currentPfp.name;
    if (nickname.trim() === '') {
        alert('Please enter a nickname to start the game.');
        return;
    }
    window.location.href = `/game.html?nickname=${nickname}&difficulty=${difficulty}&pfpId=${pfp}`
}