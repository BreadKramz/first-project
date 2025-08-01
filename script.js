const quizData = [
  { question: "What is my name?", options: ["Gwapo", "Pogi", "Kramz", "Mark"], answer: 3 },
  { question: "How old am I?", options: ["19", "20", "22", "21"], answer: 1 },
  { question: "Is my website good?", options: ["No", "No", "Yes", "No"], answer: 2 },
  { question: "Favorite programming language?", options: ["Python", "HTML", "CSS", "JavaScript"], answer: 3 }
];

let shuffledQuiz = [];
let currentQuestion = 0;
let score = 0;
let currentCorrectIndex = 0;
let timer;
let timeLeft = 10;
let numberOfChoices = 4;
let musicEnabled = true;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startQuiz() {
  musicEnabled = document.getElementById("music-toggle").checked;
  numberOfChoices = parseInt(document.getElementById("num-choices").value);

  const stored = localStorage.getItem("customQuestions");
  const customQuestions = stored ? JSON.parse(stored) : [];
  const allQuestions = quizData.concat(customQuestions);

  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("quiz").classList.add("show");

  shuffledQuiz = shuffle([...allQuestions]);
  currentQuestion = 0;
  score = 0;
  loadQuestion();
}

function toggleSettings() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("settings-screen").classList.add("show");
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 10;
  document.getElementById("timer").innerText = "Time: 10";
  timer = setInterval(updateTimer, 1000);

  const q = shuffledQuiz[currentQuestion];
  const correctText = q.options[q.answer];
  const filteredOptions = shuffle([...q.options]).slice(0, numberOfChoices);
  if (!filteredOptions.includes(correctText)) {
    filteredOptions[Math.floor(Math.random() * filteredOptions.length)] = correctText;
  }

  currentCorrectIndex = filteredOptions.indexOf(correctText);

  document.getElementById("question").innerText = q.question;
  document.getElementById("feedback").innerText = "";
  document.getElementById("question-counter").innerText = `Question ${currentQuestion + 1} of ${shuffledQuiz.length}`;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";
  filteredOptions.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = text;
    btn.onclick = () => selectAnswer(i);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("next-btn").style.display = "none";
}

function selectAnswer(index) {
  clearInterval(timer);
  const optionBtns = document.getElementsByClassName("option");
  for (let i = 0; i < optionBtns.length; i++) {
    optionBtns[i].disabled = true;
    optionBtns[i].style.background = (i === currentCorrectIndex) ? "#c8e6c9" : "#ffcdd2";
  }

  if (index === currentCorrectIndex) {
    score++;
    document.getElementById("feedback").innerText = "✅ Correct!";
    document.getElementById("feedback").style.color = "#4caf50";
  } else if (index !== -1) {
    document.getElementById("feedback").innerText = "❌ Wrong!";
    document.getElementById("feedback").style.color = "#e53935";
  }

  document.getElementById("next-btn").style.display = "block";
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < shuffledQuiz.length) {
    loadQuestion();
  } else {
    showScore();
  }
}

function showScore() {
  clearInterval(timer);
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("score-screen").classList.add("show");

  const scoreText = document.getElementById("score-text");
  const scoreMessage = document.getElementById("score-message");

  scoreText.innerText = `Your Score: ${score} / ${shuffledQuiz.length}`;
  scoreMessage.innerText = score === shuffledQuiz.length
    ? "🎉 Perfect Score!"
    : score >= shuffledQuiz.length / 2
    ? "👍 Good Job!"
    : "📚 Keep Practicing!";
}

function returnToStart() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("start-screen").classList.add("show");
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").innerText = `Time: ${timeLeft}`;
  if (timeLeft === 0) {
    clearInterval(timer);
    selectAnswer(-1);
    document.getElementById("feedback").innerText = "⏰ Time's up!";
    document.getElementById("feedback").style.color = "#ff5722";
    document.getElementById("next-btn").style.display = "block";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const toggle = document.getElementById("music-toggle");

  if (toggle.checked) {
    music.play().catch(err => console.log("Music autoplay blocked:", err));
  }

  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      music.play();
    } else {
      music.pause();
    }
  });
});

function toggleAddQuestion() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("add-question-screen").classList.add("show");
}

function toggleViewPanel() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("view-panel").classList.add("show");
  viewCustomQuestions();
}

function toggleClearPanel() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("clear-panel").classList.add("show");
}

function backToStart() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("start-screen").classList.add("show");
}

function addCustomQuestion() {
  const questionInput = document.getElementById("new-question");
  const choiceInputs = document.querySelectorAll(".choice-input");
  const correctAnswerInput = document.getElementById("correct-answer");
  const feedback = document.getElementById("add-feedback");

  const question = questionInput.value.trim();
  const choices = Array.from(choiceInputs).map(input => input.value.trim());
  const correctAnswer = parseInt(correctAnswerInput.value) - 1;

  if (!question || choices.some(choice => !choice) || isNaN(correctAnswer) || correctAnswer < 0 || correctAnswer >= choices.length) {
    feedback.innerText = "⚠️ Please fill in all fields correctly.";
    feedback.style.color = "#e53935";
    return;
  }

  const newQuestion = { question, options: choices, answer: correctAnswer };
  const existing = localStorage.getItem("customQuestions");
  const customQuestions = existing ? JSON.parse(existing) : [];
  customQuestions.push(newQuestion);
  localStorage.setItem("customQuestions", JSON.stringify(customQuestions));

  feedback.innerText = "✅ Question added!";
  feedback.style.color = "#4caf50";
  questionInput.value = "";
  choiceInputs.forEach(input => input.value = "");
  correctAnswerInput.value = "";
}

function openAdminPanel() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("admin-screen").classList.add("show");
}

function adminLogin() {
  const username = document.getElementById("admin-username").value.trim();
  const password = document.getElementById("admin-password").value.trim();
  const feedback = document.getElementById("admin-feedback");

  if (username === "admin" && password === "1234") {
    feedback.innerText = "";
    document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
    document.getElementById("admin-panel").classList.add("show");
  } else {
    feedback.innerText = "❌ Incorrect username or password.";
    feedback.style.color = "#e53935";
  }
}

function goToViewPanel() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("view-panel").classList.add("show");
  viewCustomQuestions();
}

function goToClearPanel() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("clear-panel").classList.add("show");
}

function backToAdminPanel() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  document.getElementById("admin-panel").classList.add("show");
}

function viewCustomQuestions() {
  const container = document.getElementById("questions-list-container");
  container.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("customQuestions")) || [];

  if (saved.length === 0) {
    container.innerHTML = "<p>No saved questions.</p>";
  } else {
    saved.forEach((q, i) => {
      const qDiv = document.createElement("div");
      qDiv.style.marginBottom = "10px";
      qDiv.style.borderBottom = "1px solid #ccc";
      qDiv.style.paddingBottom = "8px";
      
      qDiv.innerHTML = `
        <strong>Q${i + 1}:</strong> ${q.question}<br>
        Choices: ${q.options.join(", ")}<br>
        Answer: ${q.options[q.answer]}
        <br>
        <button class="debug-btn" style="margin-top:5px; background:#e53935;" onclick="deleteQuestion(${i})">🗑 Delete</button>
      `;
      container.appendChild(qDiv);
    });
  }
}

function deleteQuestion(index) {
  if (!confirm("Are you sure you want to delete this question?")) return;

  let saved = JSON.parse(localStorage.getItem("customQuestions")) || [];
  saved.splice(index, 1); // Remove selected question
  localStorage.setItem("customQuestions", JSON.stringify(saved));

  viewCustomQuestions(); // Refresh the list
}

function clearCustomQuestions() {
  if (!confirm("⚠️ Are you sure you want to permanently delete all saved questions?")) {
    return; // Cancel delete
  }
  
  localStorage.removeItem('customQuestions');
  document.getElementById('questions-list-container').innerHTML = '<p>All questions cleared.</p>';
}

function showAdminLogin() {
  document.querySelectorAll(".show").forEach(el => el.classList.remove("show"));
  const loginBox = document.getElementById("admin-login");
  loginBox.classList.add("show");

  // Autofocus on username field
  setTimeout(() => document.getElementById("admin-username").focus(), 100);
}

function openFeedbackPanel() {
  document.getElementById("start-screen").classList.remove("show");
  document.getElementById("feedback-panel").classList.add("show");
}

function submitFeedback() {
  const text = document.getElementById("feedback-text").value.trim();
  const msg = document.getElementById("feedback-message");

  if (!text) {
    msg.innerText = "⚠️ Please enter your feedback.";
    msg.style.color = "#e53935";
    return;
  }

  // Save to localStorage
  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
  feedbacks.push({ message: text, date: new Date().toLocaleString() });
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  msg.innerText = "✅ Thank you for your feedback!";
  msg.style.color = "#4caf50";
  document.getElementById("feedback-text").value = "";
}

function viewFeedbacks() {
  document.getElementById("admin-panel").classList.remove("show");
  document.getElementById("feedback-view-panel").classList.add("show");

  const list = document.getElementById("feedback-list");
  list.innerHTML = "";
  const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  if (feedbacks.length === 0) {
    list.innerHTML = "<p>No feedback yet.</p>";
  } else {
    feedbacks.forEach((fb, i) => {
      const fbDiv = document.createElement("div");
      fbDiv.style.marginBottom = "10px";
      fbDiv.innerHTML = `<strong>Feedback ${i + 1}</strong> (${fb.date}):<br>${fb.message}`;
      list.appendChild(fbDiv);
    });
  }
}

