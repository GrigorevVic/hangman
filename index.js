const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
//const letters = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я'];
let questions = [
    "Object in the solar system",
    "The highest mountain on Earth",
    "Lake in Russia",
    "Animal of the cat family",
    "American theoretical physicist",
    "Surname of Peter the Great",
    "City in Russia",
    "Particle with no rest mass",
    "Hardest metal",
    "The most common element in the Universe"
];

const bodyParts = [
    '<div class="head"></div>',
    '<div class="body"></div>',
    '<div class="left-arm"></div>',
    '<div class="right-arm"></div>',
    '<div class="left-foot"></div>',
    '<div class="right-foot"></div>',
];

let words = ["CERES", "EVEREST", "BAIKAL", "JAGUAR", "OPPENHEIMER", "ROMANOV", "VOLGOGRAD", "PHOTON", "OSMIUM", "HYDROGEN"];
let pressKeys;
let answerCounter;
let secretWordToArray;
let keywordDisplay;
let question;
let winOrLost;

const getRandomQuestion = (min = 1, max = 100) => Math.floor(Math.random() * (max - min + 1)) + min;
const wordsCopy = Array.from(words);
const questionsCopy = Array.from(questions);



// функция генерации модального окна

const generateModalWindow = () => {
    let template = '';
    template += '<div class="modalActive">';
    template += '<div class="modalWindow">';
    template += `<h2 class="game-over">${winOrLost}</h2>`;
    template += `<h3 class="word">Secret Word: ${secretWordToArray.join('')}</h3>`;
    template += '<div class="button">';
    template += '<p class="play-again">Play again</p>';
    template += '<p class="press">press Enter</p>'
    template += '</div>';
    template += '</div>';
    template += '</div>';
    return template;
}


// Генерация стартовой страницы
const generateHangman = () => {
    pressKeys = [];
    answerCounter = 0;
    if (words.length === 0) { 
        words = Array.from(wordsCopy);
        questions = Array.from(questionsCopy);
    }
    const secretWord = words[getRandomQuestion(0, words.length - 1)];
    let index = words.indexOf(secretWord);
  
    console.log(secretWord);
    question = questions[words.indexOf(secretWord)];
    words.splice(index, 1);
    questions.splice(index, 1);
    secretWordToArray = [];
    for (let i = 0; i < secretWord.length; i++) {
        secretWordToArray.push(secretWord[i]);
    }
    keywordDisplay = secretWordToArray.map(() => '_');

    let template = '';
    let div = document.createElement('div');
    div.className = 'wrapper';
    template += '<div class="modalBackground">';
    template += '</div>';
    template += '<h1 class="title">Start of the game</h1>';
    template += '<div class="container container-750">';
    template += '<div class="wrapper-hangman">';
    template += '<div class="hangman">';
    template += '<div class="vertical-long"></div>';
    template += '<div class="horizontal-top"></div>';
    template += '<div class="vertical-short"></div>';
    template += '<div class="horizontal-bottom"></div>';
    template += '<div class="slanted-line"></div>';
    /*******************************************************/
    template += '<div class="wrapper-man">';
    template += '</div>';
    /*******************************************************/
    template += '<h2 class="title-game">HANGMAN GAME</h2>';
    template += '</div>';
    template += '</div>';
    /*******************************************************/
    template += '<div class="playfield playfield-750">';
    template += '<div class="wrapper-field">';
    template += `<div class="secret-word">${keywordDisplay.join(' ')}</div>`;
    template += `<div class="hint">Hint: ${question}.</div>`;
    template += `<div class="guesses">Incorrect guesses: ${answerCounter} / 6</div>`;
    template += '</div>';
    template += '<div class="keyboard"></div>';
    template += '</div>';
    template += '</div>';
    template += '</div>';
    div.innerHTML = template;
    return div;
}

const body = document.querySelector('body');
body.append(generateHangman());

// Генерация виртуальной клавиатуры
function generateKeyboard() {
    let out = '';
    for (let i = 0; i < letters.length; i++) {
        out += `<div class="letters" id="${letters[i]}">${letters[i].toLocaleUpperCase()}</div>`;
    }
    document.querySelector('.keyboard').innerHTML = out;
}
generateKeyboard();


// Генерация поля секретного слова

const generateSecretWordField = (id) => {

    const field = document.querySelector('.wrapper-field');
    const man = document.querySelector('.wrapper-man');

    if (!secretWordToArray.includes(id.toUpperCase())) {
        let templateMan = '';
        for (let i = 0; i <= answerCounter; i++) {
            templateMan += bodyParts[i];
        }
        man.innerHTML = templateMan;
        answerCounter++;
    }
    for (let i = 0; i < keywordDisplay.length; i++) {
        if (id === secretWordToArray[i].toLowerCase()) {
            keywordDisplay[i] = id.toUpperCase();
        }
    }
    field.innerHTML = '';
    let template = '';

    template += `<div class="secret-word">${keywordDisplay.join(' ')}</div>`;
    template += `<div class="hint">Hint: ${question}.</div>`;
    template += `<div class="guesses">Incorrect guesses: ${answerCounter} / 6</div>`;
    template += '</div>';
    field.innerHTML = template;

    if (answerCounter === 6) {
        winOrLost = 'You Lost :(';
        gameOver();
    } else if (secretWordToArray.join('') === keywordDisplay.join('')) {
        winOrLost = 'You Win !!!';
        gameOver();
    }
}

// функция окончания игры
function gameOver() {
    const modal = document.querySelector('.modalBackground');
    modal.innerHTML = generateModalWindow();
    modal.classList.add('modal-active');
    body.classList.add('scroll-menu-disabled');
    const button = document.querySelector('.button');
    button.addEventListener('click', function (event) {
        modal.classList.remove('modal-active');
        body.classList.remove('scroll-menu-disabled');
        body.innerHTML = '';
        body.append(generateHangman());
        generateKeyboard();
        addListeners();
    });
}

// функция добавления обработчиков событий

function addListeners() {
    const element = document.querySelector('.keyboard');
    element.addEventListener('click', function (event) {
        const id = event.target.id;

        if (letters.includes(id)) {
            document.querySelector(`#${id}`).classList.add('disable');

            if (!pressKeys.includes(id)) {
                pressKeys.push(id);
                generateSecretWordField(id);
            }
        }
    });

    // Обработчик клавиатуры
    const modal = document.querySelector('.modalBackground');
    document.onkeydown = function (event) {
        const id = event.key.toLowerCase();
        if (modal.classList.contains('modal-active') && event.key === 'Enter') {
            modal.classList.remove('modal-active');
            body.classList.remove('scroll-menu-disabled');
            body.innerHTML = '';
            body.append(generateHangman());
            generateKeyboard();
            addListeners();
        }
        if (!modal.classList.contains('modal-active')) {
            if (letters.includes(id)) {
                document.querySelector(`#${id}`).classList.add('disable');

                if (!pressKeys.includes(id)) {
                    pressKeys.push(id);
                    generateSecretWordField(id);
                }
            }
        }
    }
}

addListeners();
