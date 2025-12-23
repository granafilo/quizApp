import { loadFroamStorage, saveToStorage } from "./storage/storageFunctions.js";

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
    const url = `https://opentdb.com/api.php?amount=10&difficulty=${difficultySelected}`;
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
    const answerResult = document.getElementById('answerResult');
    const resultContainer = document.getElementById('resultContainer');
    const pageContainer = document.getElementById('pageContainer');
    const pauseBtn = document.getElementById('pauseBtn');
    const pauseMenu = document.getElementById('pauseMenu');
    const continuePauseBtn = document.getElementById('continuePauseBtn');
    const hintBtn = document.getElementById('hintBtn');
    const fiftyPercentBtn = document.getElementById('fiftyPercent');
    const dropdownMenu = document.getElementById('dropdownMenu');

    let currentQuestion = {};
    let fiftyPercentUsed = false;
    let pauseMenuIsDisplayed = false;
    let nextQuestionIsDisplayed = false;
    let answers = [];

    renderQuestion();

    function renderQuestion() {

        if (numeroDomanda >= allQuestions.length) {
            fineDomande();
        }
        //ottengo la domanda
        currentQuestion = allQuestions[numeroDomanda];
        console.log(currentQuestion);

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
        if (currentQuestion.type === 'multiple') {
            if (!fiftyPercentUsed) {
                fiftyPercentBtn.classList.remove('disabled');
            }
            questionHTML = `              
                <div class="d-flex flex-column w-100">
                    <div class="d-flex w-100 m-2">
                        <div style="flex: 1;" class="d-flex justify-content-center">
                            <button id="opt1"
                                class="w-75 js-multiple-option btn border-0 boxShadow text-break text-wrap"
                                style="font-style: italic; font-size: 25px; color: black; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                                correct="${answers[0].correct}">${answers[0].answer}</button>
                        </div>
                        <div style="flex: 1;" class="d-flex justify-content-center">
                            <div style="flex: 1;" class="d-flex justify-content-center">
                                <button id="opt2"
                                    class="w-75 js-multiple-option btn border-0 boxShadow text-break text-wrap"
                                    style="font-style: italic; font-size: 25px; color: black; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                                    correct="${answers[0].correct}">${answers[1].answer}</button>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex w-100 m-2">
                        <div style="flex: 1;" class="d-flex justify-content-center">
                            <div style="flex: 1;" class="d-flex justify-content-center">
                                <button id="opt3" class="js-multiple-option btn border-0 boxShadow w-75"
                                style="font-style: italic; font-size: 25px; color: black; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                                correct="${answers[2].correct}">${answers[2].answer}</button>
                        </div>
                        <div style="flex: 1;" class="d-flex justify-content-center">
                            <div style="flex: 1;" class="d-flex justify-content-center">
                                <button id="opt4" class="js-multiple-option btn border-0 boxShadow w-75"
                                style="font-style: italic; font-size: 25px; color: black; font-weight: 500; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                                correct="${answers[3].correct}">${answers[3].answer}</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            fiftyPercentBtn.classList.add('disabled');
            questionHTML = `
                <div style="flex: 1;" class="d-flex justify-content-center">
                    <button class="js-boolean-option btn border-0 w-75 boxShadow"
                        style=" font-style: italic; font-size: 25px; color: black; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                        correct="${currentQuestion.correct_answer === 'True' ? 'true' : 'false'}">True</button>
                </div>
                <div style="flex: 1;" class="d-flex justify-content-center">
                    <button class="js-boolean-option btn border-0 w-75 boxShadow"
                        style=" font-style: italic; font-size: 25px; color: black; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
                        correct="${currentQuestion.correct_answer === 'False' ? 'true' : 'false'}">False</button>
                </div>
            `
        }

        optionContainer.innerHTML = questionHTML;

        domanda.innerText = decodeHTMLEntities(currentQuestion.question);

    }

    //aggiungo event listener per i pulsanti delle opzioni
    document.getElementById('option').addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement.classList.contains('js-multiple-option')) {
            if (clickedElement.getAttribute('correct') === "false") {
                clickedElement.classList.add('btn-rosso');
                answerResult.innerText = "Risposta Errata";
                score.errate++;
                calcScore(false);
            } else {
                clickedElement.classList.add('btn-verde');
                answerResult.innerText = "Risposta Corretta";
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
                answerResult.innerText = "Risposta Errata";
                clickedElement.classList.add('btn-rosso');
                score.errate++;
                calcScore(false);
            } else {
                clickedElement.classList.add('btn-verde');
                answerResult.innerText = "Risposta Corretta";
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

    //event listener per l'aiuto del 50%
    fiftyPercentBtn.addEventListener(('click'), () => {
        if (!fiftyPercentUsed) {
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
                rispostaErrata.classList.add('disabled');
                j++;
            }
            fiftyPercentUsed = true;
            score.punteggio -= 1;
            fiftyPercentBtn.classList.add('disabled');
        } else {
            alert('Hai già usato questo aiuto')
        }
    })

    //event listener per passare alla prossima domanda
    nextQuestionBtn.addEventListener('click', () => {
        numeroDomanda++;
        renderQuestion();
        resetAnswers();
    })

    //event listener per passare alla prossima domanda tramite pulsante invio
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

    //event listener per riprendere il gioco dalla pausa tramite pulsante continua
    continuePauseBtn.addEventListener('click', () => {
        hidePauseMenu();
    })

    //event listener per mettere in pausa il gioco o per farlo ripartire tramite tasto escape
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
    document.querySelectorAll('.js-homePageBtn').forEach((btn) => {
        btn.addEventListener(('click'), () => {
            window.location.href = "homepage.html";
        })
    })

    //funzione per calcolare il punteggio di ogni singola domanda
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
        console.log(score, corretta);
    }

    //funzione per resettare il css e le classi delle risposte
    function resetAnswers() {
        document.querySelectorAll('.js-option').forEach((btn) => {
            btn.classList.remove('btnDisabilitato', 'halfOpacity');
            btn.classList.remove('btn-verde');
            btn.classList.remove('btn-rosso');
        })
        pageContainer.classList.remove('blur');
        resultContainer.classList.add('d-none');
        resultContainer.classList.remove('show');
        pauseBtn.classList.remove('btnDisabilitato');
        hintBtn.classList.remove('disabled');
        nextQuestionIsDisplayed = false;
        answerResult.innerText = "";
    }

    //funzione per aprire il menu per passare alla prossima domanda
    function openNextQuestionMenu() {
        pauseBtn.classList.add('btnDisabilitato');
        pageContainer.classList.add('blur');
        resultContainer.classList.remove('d-none');
        nextQuestionBtn.classList.remove('d-none');
        nextQuestionIsDisplayed = true;
        hintBtn.classList.add('disabled');
        setTimeout(() => {
            // 3. Aggiungi la classe 'show' che attiva l'animazione
            resultContainer.classList.add('show');
            nextQuestionBtn.classList.add('show');
        }, 10);
    }

    //funzione per mostrare il menu di pausa
    function showPauseMenu() {
        pauseMenuIsDisplayed = true;
        hintBtn.classList.add('disabled')
        pauseMenu.classList.remove('d-none');
        pageContainer.classList.add('blur');
        dropdownMenu.classList.remove('show');
    }

    function chiudiDropdown() {
        const dropdownToggle = document.getElementById('hintBtn');
        const dropdown = bootstrap.Dropdown.getOrCreateInstance(dropdownToggle);
        dropdown.hide();
    }

    //funzione per nascondere il menu di pausa
    function hidePauseMenu() {
        hintBtn.classList.remove('disabled')
        pauseMenu.classList.add('d-none');
        pageContainer.classList.remove('blur');
        pauseMenuIsDisplayed = false;
        chiudiDropdown();
    }

    //funzione per gestire la fine delle domande
    function fineDomande() {

        let userScore = {
            username: nickname,
            score: score
        }
        scoreBoard = loadFroamStorage() || [];
        scoreBoard.unshift(userScore);
        saveToStorage(scoreBoard);

        const noMoreQuestions = document.getElementById('noMoreQuestions');
        noMoreQuestions.classList.remove('d-none');
        pageContainer.classList.add('blur');
        const scoreDiv = document.getElementById('scoreDiv');
        scoreDiv.innerText = `Score: ${score.corrette} Corrette, ${score.errate} Errate!`
    }

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
    <img src="/images/profile_pics/${pfpId}" alt="">
    <span>Benvenuto ${nickname}</span> 
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
