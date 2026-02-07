import { loadFroamStorage, saveToStorage } from "/src/storage/storageFunctions.js";

function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // indice casuale tra 0 e i
        [array[i], array[j]] = [array[j], array[i]];   // scambia gli elementi
    }
    return array;
}

async function getQuestions(difficultySelected) {
    const url = `https://opentdb.com/api.php?amount=15&difficulty=${difficultySelected}`;
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

async function renderPage() {
    let allQuestions = [];
    let scoreBoard = loadFroamStorage() || [];

    try {
        allQuestions = await getQuestions(difficultySelected);
    } catch (error) {
        console.log(error);
    }

    let numeroDomanda = 0;

    const nextQuestionBtn = document.getElementById('nextQuestion');
    const resultContainer = document.getElementById('resultContainer');
    const pageContainer = document.getElementById('pageContainer');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseMenu = document.getElementById('pauseMenu');
    const backToGame = document.getElementById('backToGame');
    const hintBtn = document.getElementById('hintBtn');
    const fiftyPercentBtn = document.getElementById('fiftyPercent');
    const progressBarWrapper = document.querySelector(".progress-bar-wrapper");
    const progressBar = document.querySelector(".progress-bar");

    let currentQuestion = {};
    let fiftyPercentUsed = false;
    let fiftyPercentDisplayed = false;
    let pauseMenuIsDisplayed = false;
    let nextQuestionIsDisplayed = false;
    let answers = [];

    renderQuestion();

    //ok
    function renderQuestion() {

        if (numeroDomanda >= allQuestions.length) {
            fineDomande();
        }
        //ottengo la domanda
        currentQuestion = allQuestions[numeroDomanda];
        
        progressBar.style.width = calcolaPercentuale(numeroDomanda) + "%";

        let questionHTML = '';
        const domanda = document.getElementById('domanda');
        const optionContainer = document.getElementById('option-container');

        //formo l'array delle risposte in modo da poterlo mescolare
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
        ]

        //mescolo l'array delle risposte
        answers = shuffleArray(answers);

        //genero l'html
        //ok
        if (currentQuestion.type === 'multiple') {
            if (!fiftyPercentUsed) {
                fiftyPercentBtn.classList.remove('disabled');
            }
            questionHTML = `              
                <button id="opt1" class="js-multiple-option"
                    correct="${answers[0].correct}">${answers[0].answer}</button>
                <button id="opt2" class="js-multiple-option"
                    correct="${answers[1].correct}">${answers[1].answer}</button>
                <button id="opt3" class="js-multiple-option"
                    correct="${answers[2].correct}">${answers[2].answer}</button>
                <button id="opt4" class="js-multiple-option"
                    correct="${answers[3].correct}">${answers[3].answer}</button>
            `;
        } else {
            fiftyPercentBtn.classList.add('disabled');
            questionHTML = `
                <button class="js-boolean-option"
                    correct="${currentQuestion.correct_answer === 'True' ? 'true' : 'false'}">True</button>
                <button class="js-boolean-option"
                    correct="${currentQuestion.correct_answer === 'False' ? 'true' : 'false'}">False</button>
            `
        }

        optionContainer.innerHTML = questionHTML;

        domanda.innerText = decodeHTMLEntities(currentQuestion.question);

    }

    //aggiungo event listener per i pulsanti delle opzioni
    //ok
    document.getElementById('option').addEventListener('click', (event) => {
        const clickedElement = event.target;
        if (clickedElement.classList.contains('js-multiple-option')) {
            if (clickedElement.getAttribute('correct') === "false") {
                clickedElement.classList.add('wrong-option');
                disableBtn("js-multiple-option", clickedElement);
                score.errate++;
                calcScore(false);
            } else {
                clickedElement.classList.add('correct-option');
                disableBtn("js-multiple-option", clickedElement);
                score.corrette++;
                calcScore(true);
            }
            if (numeroDomanda + 1 < allQuestions.length) {
                openNextQuestionMenu();
            } else {
                fineDomande();
            }

        } else if (clickedElement.classList.contains('js-boolean-option')) {
            if (clickedElement.getAttribute('correct') === 'false') {
                clickedElement.classList.add('wrong-option');
                disableBtn("js-boolean-option", clickedElement);
                score.errate++;
                calcScore(false);
            } else {
                clickedElement.classList.add('correct-option');
                disableBtn("js-boolean-option", clickedElement);
                score.corrette++;
                calcScore(true);
            }
            if (numeroDomanda + 1 < allQuestions.length) {
                openNextQuestionMenu();
            } else {
                fineDomande();
            }
        }
    });

    //event listener per il pulsante aiuti
    //ok
    hintBtn.addEventListener(('click'), () => {
        if (fiftyPercentDisplayed) {
            fiftyPercentBtn.classList.add("d-none");
            fiftyPercentDisplayed = false;
        } else {
            fiftyPercentBtn.classList.remove("d-none");
            fiftyPercentDisplayed = true;
        }
    })

    //event listener per l'aiuto del 50%
    //ok
    fiftyPercentBtn.addEventListener(('click'), () => {
        if (!fiftyPercentUsed) {
            if (currentQuestion.type == "multiple") {
                let index = [];
                for (let i in answers) {
                    if (answers[i].correct == 'false') {
                        i = parseInt(i);
                        index.push(i);
                    }
                }
                index = shuffleArray(index);
                let j = 0;
                while (j < 2) {
                    let m = index[j] + 1;
                    const rispostaErrata = document.getElementById(`opt${m}`);
                    rispostaErrata.disabled = true;
                    j++;
                }
                fiftyPercentBtn.classList.add("d-none");
                fiftyPercentDisplayed = false;
                fiftyPercentUsed = true;
                score.punteggio -= 1;
            } else {
                alert("Questo aiuto si può usare solo nelle domande con 4 opzioni");
                fiftyPercentBtn.classList.add("d-none");
                fiftyPercentDisplayed = false;
            }
        } else {
            alert('Hai già usato questo aiuto')
        }
    })

    //event listener per passare alla prossima domanda
    //ok
    nextQuestionBtn.addEventListener('click', () => {
        numeroDomanda++;
        //calcolo percentuale aggiornata
        renderQuestion();
        resetAnswers();
    })

    //event listener per passare alla prossima domanda tramite pulsante invio
    //ok
    document.addEventListener('keydown', (event) => {
        if (event.key === "Enter" && nextQuestionIsDisplayed) {
            numeroDomanda++;
            renderQuestion();
            resetAnswers();
        }
    })

    //event listener per mettere in pausa il gioco o per farlo ripartire tramite pulsante pausa
    pauseBtn.addEventListener('click', () => {
        if (pauseMenuIsDisplayed) {
            hidePauseMenu();
        } else {
            showPauseMenu();
        }
    });

    //event listener per mettere in pausa il gioco o per farlo ripartire tramite tasto escape
    //ok
    document.addEventListener('keydown', (event) => {
        if (event.key === "Escape") {
            if (pauseMenuIsDisplayed) {
                hidePauseMenu();
            } else {
                showPauseMenu();
            }
        }
    })

    //event listener per i pulsanti che fanno tornare alla homepage
    //ok
    document.querySelectorAll('.js-homePageBtn').forEach((btn) => {
        btn.addEventListener(('click'), () => {
            window.location.href = "/index.html";
        })
    })

    //event listener per il pulsante per tornare al gioco
    //ok
    backToGame.addEventListener(('click'), () => {
        hidePauseMenu();
    });

    //funzione per disabilitare le opzioni dopo che viene data la risposta
    //ok
    function disableBtn(classe, clicked) {
        document.querySelectorAll(`.${classe}`).forEach((option) => {
            option.disabled = true;
        })
        clicked.classList.add("selezionato");
    }

    //funzione per calcolare il punteggio di ogni singola domanda
    //ok
    function calcScore(corretta) {

        if (corretta) {
            if (currentQuestion.difficulty == 'easy') {
                score.punteggio++;
            } else if (currentQuestion.difficulty == 'medium') {
                score.punteggio += 2;
            } else {
                score.punteggio += 3;
            }
        }
        //console.log(score, corretta);
    }

    //funzione per resettare il css e le classi delle risposte
    //ok
    function resetAnswers() {
        //attivo pulsante aiuti
        hintBtn.disabled = false;
        //attivo pulsante pausa
        pauseBtn.disabled = false;
        //nascondo next question button
        resultContainer.classList.add('d-none');
        resultContainer.classList.remove('d-flex');
        nextQuestionIsDisplayed = false;
    }

    //funzione per aprire il menu per passare alla prossima domanda
    //ok
    function openNextQuestionMenu() {
        //disabilito pulsante pausa
        pauseBtn.disabled = true;
        //disabilito pulsante aiuti
        hintBtn.disabled = true;
        //mostro next question button - result container
        resultContainer.classList.remove('d-none');
        resultContainer.classList.add('d-flex');
        nextQuestionIsDisplayed = true;
    }

    //funzione per mostrare il menu di pausa
    //ok
    function showPauseMenu() {
        //rendo visibile il menu pausa
        pauseMenu.classList.add('show');
        pauseMenuIsDisplayed = true;

        //disabilito il pulsante aiuti
        if(fiftyPercentDisplayed){
            fiftyPercentBtn.classList.add("d-none");
            fiftyPercentDisplayed = false;
        }
        hintBtn.disabled = true;

        //effetto blur sulla pagina
        pageContainer.classList.add('blur');
    }

    //funzione per nascondere il menu di pausa
    //ok
    function hidePauseMenu() {
        //nasconod il menu pausa
        pauseMenu.classList.remove('show');
        pauseMenuIsDisplayed = false;

        //abilito il pulsante aiuti
        hintBtn.disabled = false;

        //rimuovo effetto blur dalla pagina
        pageContainer.classList.remove('blur');
    }

    function calcolaPercentuale(numeroDomanda) {
        return ((numeroDomanda + 1) / allQuestions.length) * 100;
    }

    //funzione per gestire la fine delle domande
    function fineDomande() {

        let userScore = {
            gameId: Date.now() + Math.random().toString(16).substring(2),
            username: nickname,
            score: score
        }
        scoreBoard = loadFroamStorage() || [];
        scoreBoard.unshift(userScore);
        saveToStorage(scoreBoard);

        progressBarWrapper.classList.add("d-none");

        const backHomeContainer = document.getElementById("backHome");
        const noMoreQuestionsContainer = document.getElementById("noMoreQuestions");

        backHomeContainer.classList.remove("d-none");
        backHomeContainer.classList.add("d-flex");

        pageContainer.classList.add("d-none");

        noMoreQuestionsContainer.classList.remove("d-none");
        noMoreQuestionsContainer.classList.add("d-flex");

        const finalScore = document.getElementById("finalScore");
        finalScore.innerText = `${score.punteggio}`;

        const correctFinalScore = document.getElementById("correctFinalScore");
        const wrongFinalScore = document.getElementById("wrongFinalScore");
        correctFinalScore.innerText = `${score.corrette}`;
        wrongFinalScore.innerText = `${score.errate}`;

        pauseBtn.disabled = true;
        hintBtn.disabled = true;
    }

    //ok
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function (m) { return map[m]; });
    }
}

//----------------------------------------------------------------

//ottengo l'url dal quale potrò ricavare i parametri
const params = new URLSearchParams(window.location.search);

//ottengo il nickname dai parametri
const nickname = params.get('nickname') || '';

//ottengo la difficoltà dai parametri
let difficultySelected = params.get('difficulty') || '';

//ottengo l'id della pfp dai parametri
let pfpId = params.get('pfpId');

//svuoto la difficoltà se non è stata selezionata
if (difficultySelected == 'mixed') {
    difficultySelected = '';
}
//svuoto l'id se la pfp non è stata selezionata
if (pfpId == 'user.png') {
    pfpId = '';
}

const welcomeMsg = document.getElementById('welcomeMessage');
welcomeMsg.innerHTML = `
    <img class="pfp-icon" src="/src/images/profile_pics/${pfpId}" alt="">
    <span class="welcome-msg">${nickname}</span> 
    `

let success = false;

while (!success) {
    try {
        await renderPage();
        success = true;
        document.getElementById('loading').classList.add('d-none');
    } catch (error) {
        console.log('');
    }
}
