let qNo = 0;
let username = "";
let score = 0;
let highScore = 0;
let quizData = [];
let selectedAnswer = "";

// Load the questions from the JSON file
async function loadQuizData() {
    const response = await fetch("questions.json");
    quizData = await response.json();

    // randomize the questions
    quizData.sort(() => Math.random() - 0.5);
    /*
    compare function will return a random number between -0.5 and 0.5, which will be looped through all the elements
    if the number is negative, the first element will be placed before the second element
    if the number is positive, the second element will be placed before the first element
    if the number is 0, the order of the elements will remain unchanged
    */
    loadQuestion();
}

// Load the question and options
function loadQuestion() {
    console.log(quizData[qNo]);
    const questionObj = quizData[qNo];
    document.getElementById("question").innerText = questionObj.question;

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById("btn" + i);
        btn.innerText = questionObj.options[i];
        btn.className = "option-btn";
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "default";
    }

    document.getElementById("message").innerText = "";
    document.getElementById("next-btn").style.display = "none";
}

// Start the quiz logic
function startQuiz() {
    username = prompt("Please enter your name");
    if (username) {
        document.getElementById("username").innerText = username;
        document.getElementById("start-page").style.display = "none";
        document.getElementById("quiz-container").style.display = "block";
        loadQuizData();
    } else {
        alert("Please enter a valid name");
    }
}

document.getElementById("start-btn").addEventListener("click", startQuiz);

// Event listener for the option buttons
for(let i = 0; i < 4; i++) {
    document.getElementById("btn" + i).addEventListener("click", (event) => {
        selectedAnswer = event.target;
        // console.log(selectedAnswer);
        if(selectedAnswer.innerText === quizData[qNo].answer) {
            // correct answer
            console.log("Correct answer");
            score++;
            document.getElementById("score").innerText = score;
            selectedAnswer.className = "option-btn correct";
            document.getElementById("message").innerText = "Correct Answer ✅";

        } else {
            // wrong answer
            console.log("Wrong answer");
            selectedAnswer.className = "option-btn wrong";
            document.getElementById("message").innerText = "Wrong Answer ❌";
        }

        // Disable all the buttons
        for (let i = 0; i < 4; i++) {
            const btn = document.getElementById("btn" + i);
            btn.disabled = true;
            btn.style.opacity = 0.5;
            btn.style.cursor = "not-allowed";
        }

        selectedAnswer.disabled = false;
        selectedAnswer.style.opacity = 1;

        // Next button should be visible
        document.getElementById("next-btn").style.display = "block";
    });

}

// Event listener for the next button
document.getElementById("next-btn").addEventListener("click", (event) => {
    if(qNo < quizData.length){
        qNo++;
        loadQuestion();
        const progress = Math.round((qNo) / quizData.length * 100);
        document.getElementById("progress-bar-fill").style.width = progress + "%";
        document.getElementById("progress-bar-text").innerText = progress + "%";
        document.getElementById("message").innerText = "";
        document.getElementById("next-btn").style.display = "none";
    } else {
        // end quiz
        endQuiz();
    }
});

function endQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("score-container").style.display = "block";
    document.getElementById("final-score").innerText = score;

    // store the high score in the local storage
    const scores = JSON.parse(localStorage.getItem("scores")) || [];    // scores will store the array of objects

    // add the current score to the array
    scores.push({
        name: username,
        score: score,
        date: new Date().getDate() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getFullYear(),
        time: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds(),    // add timezone as well
    });

    // store the scores in the local storage
    localStorage.setItem("scores", JSON.stringify(scores));   // JSON.stringify() converts the array into a string
}

// Event listener for the restart button
document.getElementById("restart-btn").addEventListener("click", (event) => {
    // Reset the quiz
    qNo = 0;
    score = 0;
    username = "";
    selectedAnswer = "";
    document.getElementById("score").innerText = score;
    document.getElementById("username").innerText = " - ";
    document.getElementById("progress-bar-fill").style.width = "0";
    document.getElementById("progress-bar-text").innerText = "0%";
    document.getElementById("start-page").style.display = "block";
    document.getElementById("score-container").style.display = "none";
});


document.getElementById("highscore-btn").addEventListener("click", (event) => {
    // show the high scores
    document.getElementById("highscore-page").style.display = "block";
    document.getElementById("start-page").style.display = "none";
    const scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.sort((a, b) => b.score - a.score);
    let scoresHTML = "";
    for (let i = 0; i < scores.length; i++) {
        scoresHTML += `<li style="list-style: none">${scores[i].name} - ${scores[i].score} - ${scores[i].date} at ${scores[i].time}</li>`;
    }
    document.getElementById("highscores").innerHTML = scoresHTML;
});

// go back btn
document.getElementById("go-back").addEventListener("click", (event) => {
    // go back to the start page
    document.getElementById("highscore-page").style.display = "none";
    document.getElementById("start-page").style.display = "block";
});

