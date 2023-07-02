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
    // console.log(quizData);
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
    if(qNo < quizData.length-14){
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
    // document.getElementById("progress-bar-fill").style.width = "0%";
    // document.getElementById("progress-bar-fill").style.width = progress + "%";
    document.getElementById("start-page").style.display = "block";
    document.getElementById("score-container").style.display = "none";
});


// let highScoreBtn = document.getElementById("highscore-btn");
//
// highScoreBtn.addEventListener("click",  (event) => {
//     // Show the score div
//     document.getElementById("highscore-page").style.display = "block";
//     document.getElementById("start-page").style.display = "none";
// });
//

