const showQues = document.querySelector(".questions")
const optionsForQues = document.querySelector(".options")
const quesScore = document.querySelector("#score")
const nextBtn = document.querySelector("#next");


let questions = [];
let currIndex = 0;
let score = 0;
let answered = false;


// Get Questions
const fetchQuestions = async () => {
    const quesUrl = "https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple";
    try {

        const res = await fetch(quesUrl);
        const data = await res.json()

        questions = data.results;
        currIndex = 0;
        score = 0;
        answered = false

        // console.log(data)

        const { results } = data;

        if (!results || results.length === 0) {
            showQues.innerText = "No questions available.";
            return;
        }

        loadQues();


    } catch (error) {
        showQues.innerText = "Failed. Try again.";
        console.error("Error:", error);
    }
}


// Show Question 
function loadQues() {
    answered = false;

    if (currIndex >= questions.length) {

        // Last feedback for the users
        let feedBack = "";
        if (score > 7) {
            feedBack = "🎉 Congratulations! You did great!"
        }
        else if (score >= 5) {
            feedBack = "👍 Good Job!";
        } 
        else if (score <= 4) {
            feedBack = "😞 Bad! Try Again!";
        }

        showQues.innerText = `${feedBack}\nTotal Score: ${score} / ${questions.length}`;
        quesScore.style.display = "none";
        optionsForQues.innerHTML = "";
        nextBtn.style.display = "none";
        return;
    }

    const q = questions[currIndex];
    showQues.innerHTML = q.question;

    let answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

    optionsForQues.innerHTML = ""; // Remove previous options
    answers.forEach(answer => {
        let btn = document.createElement("button");
        btn.innerText = answer;
        btn.onclick = () => nextQuestion(btn, answer === q.correct_answer);
        optionsForQues.appendChild(btn);
    });



    quesScore.style.display = "block";

}


//  Check answer and display score
function nextQuestion(button, isCorrect) {
    if (answered) return;
    answered = true;

    button.classList.add(isCorrect ? "correct" : "incorrect");

    // Highlighted correct or incorrect answer
    if (!isCorrect) {
        document.querySelectorAll(".options button").forEach(btn => {
            if (btn.innerText === questions[currIndex].correct_answer) {
                btn.classList.add("correct");
            }
        })
    }

    // Update the score
    if (isCorrect) {
        score++;
        quesScore.innerText = `Score : ${score}`;
    }

}

// Move to next question
nextBtn.addEventListener("click", () => {
    currIndex++;
    loadQues();
});

window.onload = fetchQuestions;