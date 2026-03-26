import { loadFroamStorage, saveToStorage, deleteStorage } from "/src/storage/storageFunctions.js";

const body = document.querySelector("body");
const mainContent = document.getElementById('main-content');
const modalOverlay = document.querySelector('.modal-overlay');

const startGameBtn = document.getElementById('startGameBtn');

let scoreBoard = loadFroamStorage() || [];
const scoreBoardHtml = document.getElementById('scoreBoard');

const viewMoreBtn = document.getElementById("viewMoreScoreBoard");
const viewLessBtn = document.getElementById("viewLessScoreBoard");

const choosePfpBtn = document.getElementById('pfp-btn');
const pfpPickerDialog = document.querySelector(".pfp-picker-dialog");
const currentPfp = document.getElementById('current-pfp');
const closePfpStackBtn = document.getElementById('close-pfp-stack-btn');

const gameInfoModal = document.getElementById('gameInfoModal');
const gameInfoCloseBtn = document.querySelector('.close-btn-game-info');

let nickname = document.getElementById('nickname');
let scoreHtml = '';

nickname.value = '';

loadScoreBoard();

startGameBtn.addEventListener('click', () => {
    startGame();
})

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        startGame();
    }
});

// choosePfpBtn.addEventListener('click', () => {
//     pfpPickerDialog.showModal();
// })


// closePfpStackBtn.addEventListener('click', () => {
//     pfpPickerDialog.close();
// });


document.querySelectorAll('.js-pfp').forEach((btn) => (
    btn.addEventListener(('click'), () => {
        document.getElementById('pfpModal').close();

        const srcNewPfp = btn.src;
        currentPfp.src = srcNewPfp;
        currentPfp.name = btn.id;
    })
));

// pfpPickerDialog.addEventListener("click", (event) => {
//     if (event.target.nodeName == "DIALOG") {
//         pfpPickerDialog.close();
//     }
// })

// const deleteScore = document.querySelector(".delete-icon");

// deleteScore.addEventListener("click", () => {
//     deleteStorage();
//     scoreBoard = loadFroamStorage() || [];
//     loadScoreBoard();
// });

function loadScoreBoard() {
    scoreHtml = '';
    scoreBoardHtml.innerHTML = '';
    console.log(scoreBoard.length)
    // console.log(scoreBoard.length > 3 ? 3 : scoreBoard.length)

    if (scoreBoard.length <= 3) {
        viewMoreBtn.classList.add("hidden");
    }

    if (viewMoreBtn.classList.contains("hidden")) {
        let count = 0;
        scoreBoard.forEach((tentativo) => {
            count++;
            const gameId = tentativo.gameId;
            const nickname = tentativo.username;
            const score = tentativo.score;
            scoreHtml = `
            <div class="js-score-card flex items-center p-5 bg-[#FAFAFA] gap-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-400" data-id=${gameId}>
                <div class="text-2xl font-extrabold text-gray-600">${count}</div>
                <div class="w-full flex justify-between">
                    <div class="font-bold text-xl">${nickname}</div>
                    <div class="text-[#4F00D0] font-bold text-lg">${score.punteggio}</div>
                </div>
            </div>  
                `;
            scoreBoardHtml.innerHTML += scoreHtml;
        })
    } else {
        for (let i = 0; i < (scoreBoard.length > 3 ? 3 : scoreBoard.length); i++) {
            let tentativo = scoreBoard[i];
            const gameId = tentativo.gameId;
            const nickname = tentativo.username;
            const score = tentativo.score;

            scoreHtml = `
            <div class="js-score-card flex items-center p-5 bg-[#FAFAFA] gap-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-400" data-id=${gameId}>
                <div class="text-2xl font-extrabold text-gray-600">${i + 1}</div>
                <div class="w-full flex justify-between">
                    <div class="font-bold text-xl">${nickname}</div>
                    <div class="text-[#4F00D0] font-bold text-lg">${score.punteggio}</div>
                </div>
            </div>
        `;

            scoreBoardHtml.innerHTML += scoreHtml;
        }

    }

    // for (let i = 0; i < (scoreBoard.length > 3 ? 3 : scoreBoard.length); i++) {
    //     let tentativo = scoreBoard[i];
    //     const gameId = tentativo.gameId;
    //     const nickname = tentativo.username;
    //     const score = tentativo.score;

    //     scoreHtml = `
    //         <div class="flex items-center p-5 bg-[#FAFAFA] gap-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-400" data-id=${gameId}>
    //             <div class="text-2xl font-extrabold text-gray-600">${i + 1}</div>
    //             <div class="w-full flex justify-between">
    //                 <div class="font-bold text-xl">${nickname}</div>
    //                 <div class="text-[#4F00D0] font-bold text-lg">${score.punteggio}</div>
    //             </div>
    //         </div>
    //     `;

    //     scoreBoardHtml.innerHTML += scoreHtml;
    // }



    // scoreBoard.forEach((tentativo) => {
    //     count++;
    //     const gameId = tentativo.gameId;
    //     const nickname = tentativo.username;
    //     const score = tentativo.score;

    //     scoreHtml = `
    //         <div class="flex items-center p-5 bg-[#FAFAFA] gap-5 rounded-2xl" data-id=${gameId}>
    //             <div class="text-2xl font-extrabold">${count}</div>
    //             <div class="w-full flex justify-between">
    //                 <div class="font-bold text-xl">${nickname}</div>
    //                 <div class="text-[#4F00D0] font-bold text-lg">${score.punteggio}</div>
    //             </div>
    //         </div>
    //     `;

    //     // scoreHtml = `
    //     //     <button class="score-header nickname-header" data-id=${gameId}>
    //     //         <span class="text-wrap text-break" >${nickname}</span>
    //     //     </button>

    //     //     <button class="score-header points-header" data-id=${gameId}>
    //     //         <span class="text-wrap text-break" >${score.punteggio}</span>
    //     //     </button>

    //     //     <div class="score-header correct-header" data-id=${gameId}>
    //     //         <span class="text-break text-wrap" >${score.corrette}</span>
    //     //     </div>

    //     //     <div class="score-header wrong-header" data-id=${gameId}>
    //     //         <span class="text-break text-wrap" >${score.errate}</span>
    //     //     </div>
    // //`;

    //     scoreBoardHtml.innerHTML += scoreHtml;
    // })
}

scoreBoardHtml.addEventListener('click', (event) => {
    const targetElement = event.target.closest('.js-score-card');
    if (targetElement ) {

        gameInfoModal.showModal();

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

viewMoreBtn.addEventListener("click", () => {
    const wrapper = document.getElementById('scoreBoardWrapper');
    const rightPanelHeight = document.getElementById('right-panel').offsetHeight;
    console.log(rightPanelHeight)
    wrapper.style.height= rightPanelHeight + 'px';
    viewMoreBtn.classList.add("hidden");
    viewLessBtn.classList.remove("hidden");
    loadScoreBoard();
});

viewLessBtn.addEventListener("click", () => {
    document.getElementById('scoreBoardWrapper').style.height = 'auto';
    viewMoreBtn.classList.remove("hidden");
    viewLessBtn.classList.add("hidden");
    loadScoreBoard();
});



gameInfoCloseBtn.addEventListener('click', () => {
    gameInfoModal.close();
});

gameInfoModal.addEventListener('click', (event) => {
    if (event.target.nodeName == "DIALOG") {
        gameInfoModal.close();
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
    window.location.href = `./game.html?nickname=${nickname}&difficulty=${difficulty}&pfpId=${pfp}`
}

function findGameById(gameId) {
    return scoreBoard.find((tentativo) => tentativo.gameId === gameId);
}

