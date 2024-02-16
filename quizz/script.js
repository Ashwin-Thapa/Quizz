// https://opendb.com/api.php?amount=10

const question = document.getElementById('question');
const options = document.querySelector('.quiz-options');
const correctscore = document.getElementById('correct-score');
const totalquestion = document.getElementById('total-question');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const result = document.getElementById('result');

let correctAnswer = "", correctScore = askedCount = 0, totalQuestion = 10;

async function loadQuestion() {
    try {
        const apiUrl = "https://opentdb.com/api.php?amount=1";
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            showQuestion(data.results[0]);
        } else {
            throw new Error("No questions found in API response");
        }
    } catch (error) {
        console.error("Error fetching or parsing API response:", error);
        // Handle the error gracefully, such as displaying a message to the user.
    }
}

function eventListeners(){
    checkBtn.addEventListener('click', checkAnswer);
    playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', ()=> {
    loadQuestion();
    eventListeners();
    totalquestion.textContent = totalQuestion;
    correctscore.textContent = correctScore;
});

function showQuestion(data){
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let optionsList = incorrectAnswer;
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    
    question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    options.innerHTML = `
    ${optionsList.map((option, index) => 
        `<li> ${index + 1}. <span> ${option} </span> </li>`
        ).join('')}
        `;

    selectOption();
}

function selectOption(){
    options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if(options.querySelector('.selected')){
                const activeOption = options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    }); 

    console.log(correctAnswer);
}

function checkAnswer(){
    checkBtn.disabled = true;
    if(options.querySelector('.selected')){
        let selectedAnswer = options.querySelector('.selected span').textContent;
        if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
            correctScore++;
            result.innerHTML = `<p> <i class = 'fas fa-check'></i>Correct Answer! </p>`;
        }
        else{
            result.innerHTML = `<p> <i class = "fas fa-times"> </i> Incorrect Answer ! </p> <p><small><b> Correct Answer: </b> ${correctAnswer}</p>`;
        }
        checkCount();
    } else{
        result.innerHTML = `<p> <i class = ""></i>Please select an option! </p>`
    }
}

function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == totalQuestion){
        result.innerHTML = `<p> Your Score is ${correctScore}. </p>`;
        playAgainBtn.style.display = "block";
        checkBtn.style.display = "none";
    }else {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    totalQuestion.textContent = totalquestion;
    correctscore.textContent = correctScore;
}

function restartQuiz(){
    correctScore = askedCount = 0;
    playAgainBtn.style.display = 'none';
    checkBtn.style.display = "block";
    checkBtn.disabled = false;
    setCount();
    loadQuestion();
}