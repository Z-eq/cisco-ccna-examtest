// ======================================================
//               GLOBALA VARIABLER
// ======================================================
let questions = [];
let currentQuestion = 0;
let scoreList = [];

const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const questionNum = document.getElementById('questionNum');
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const explanationDiv = document.getElementById('explanation');
const progressBar = document.getElementById('progressBar');
const onlyWrong = document.getElementById('onlyWrong');

const shuffleSelect = document.getElementById('shuffleMode');
const showHighscoresBtn = document.getElementById('showHighscoresBtn');
const highscoresDiv = document.getElementById('highscoresDiv');

let chart = null;

// ======================================================
//       HÄMTA TILLGÄNGLIGA JSON-FILER FRÅN SERVERN
// ======================================================
fetch("/files")
  .then(res => res.json())
  .then(files => {
    const container = document.getElementById('fileCheckboxes');
    files.forEach(f => {
      const div = document.createElement('div');
      div.className = "form-check";
      div.innerHTML = `
        <input class="form-check-input" type="checkbox" value="${f}" id="${f}" checked>
        <label class="form-check-label" for="${f}">${f}</label>`;
      container.appendChild(div);
    });
  });

// ======================================================
//                     STARTA QUIZ
// ======================================================
startBtn.addEventListener('click', () => {

  // --- Endast fel frågor ---
  if (onlyWrong.checked) {
    fetch("/wrong").then(r => r.json()).then(data => {
      if (data.length === 0) {
        alert("Inga fel frågor sparade!");
        return;
      }
      questions = shuffleArray(data);
      startQuiz();
    });
    return;
  }

  // --- Valda filer ---
  const selectedFiles = Array
    .from(document.querySelectorAll('#fileCheckboxes input:checked'))
    .map(cb => cb.value);

  Promise.all(
    selectedFiles.map(f => fetch(`/questions/${f}`).then(r => r.json()))
  ).then(arrays => {

    questions = arrays.flat();
    if (shuffleSelect.value === "full") {
      questions = shuffleArray(questions);
    }

    const num = parseInt(document.getElementById('numQuestions').value);
    if (num) questions = questions.slice(0, num);

    startQuiz();
  });
});

// ======================================================
//                     START QUIZ
// ======================================================
function startQuiz() {
  currentQuestion = 0;
  scoreList = [];

  startScreen.classList.add('d-none');
  quizScreen.classList.remove('d-none');

  showQuestion();
}

// ======================================================
//             MARKERA/AVMARKERA ALLA FILER
// ======================================================
const toggleBtn = document.getElementById('toggleFilesBtn');
toggleBtn.addEventListener('click', () => {
  const checkboxes = document.querySelectorAll("#fileCheckboxes input[type='checkbox']");
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);

  if(allChecked){
    checkboxes.forEach(cb => cb.checked = false);
    toggleBtn.textContent = "Markera alla";
  } else {
    checkboxes.forEach(cb => cb.checked = true);
    toggleBtn.textContent = "Avmarkera alla";
  }
});
document.getElementById('fileCheckboxes').after(toggleBtn);

// ======================================================
//                 NÄSTA FRÅGA (endast vid fel)
// ======================================================
nextBtn.addEventListener('click', () => {
  currentQuestion++;
  if (currentQuestion >= questions.length) showResult();
  else showQuestion();
});

restartBtn.addEventListener('click', () => {
  resultScreen.classList.add('d-none');
  startScreen.classList.remove('d-none');
});

// ======================================================
//                      AVBRYT QUIZ
// ======================================================
const abortBtn = document.getElementById('abortBtn');
const abortModal = new bootstrap.Modal(document.getElementById('abortModal'));
const abortWithScore = document.getElementById('abortWithScore');
const abortWithoutScore = document.getElementById('abortWithoutScore');

abortBtn.addEventListener('click', () => abortModal.show());
abortWithScore.addEventListener('click', () => showResult());
abortWithoutScore.addEventListener('click', () => {
  quizScreen.classList.add('d-none');
  startScreen.classList.remove('d-none');
});

// ======================================================
//                      VISA FRÅGA
// ======================================================
function showQuestion() {
  const q = questions[currentQuestion];

  questionNum.textContent = `Fråga ${currentQuestion + 1}/${questions.length}`;
  questionText.textContent = q.question;

  optionsDiv.innerHTML = '';
  explanationDiv.classList.add('d-none');
  nextBtn.classList.add('d-none'); // göm tills vi vet att det är fel

  const isMulti = Array.isArray(q.correct);

  // SHUFFLA ALTERNATIVEN VARJE GÅNG
  let shuffledOptions = shuffleArray([...q.options]);

  shuffledOptions.forEach((opt, idx) => {

    const btn = document.createElement(isMulti ? 'div' : 'button');
    btn.className = 'option-btn';
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${opt}`;

    if (isMulti) {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = opt;
      cb.style.marginRight = '10px';
      btn.prepend(cb);
    } else {
      btn.addEventListener('click', () => checkAnswer(opt, btn, q));
    }

    optionsDiv.appendChild(btn);
  });

  // Multi-answer: lägg till "Skicka"
  if (isMulti) {
    const submitBtn = document.createElement('button');
    submitBtn.textContent = "✅ Skicka svar";
    submitBtn.className = "btn btn-success mt-3";
    submitBtn.addEventListener('click', () => submitMulti(q));
    optionsDiv.appendChild(submitBtn);
  }

  updateProgress();
}

// ======================================================
//       SINGLE-CHOICE — KONTROLLERA SVAR + AUTO-NEXT
// ======================================================
function checkAnswer(selected, btn, q) {
  const buttons = Array.from(optionsDiv.querySelectorAll('button'));
  buttons.forEach(b => b.disabled = true);

  const isCorrect = (selected === q.correct);

  if (isCorrect) {
    btn.classList.add('correct');
    scoreList.push({ category: q.category || "Övrigt", correct: true });

    fetch("/wrong/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q)
    });

    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion >= questions.length) showResult();
      else showQuestion();
    }, 600);

  } else {
    btn.classList.add('wrong');
    scoreList.push({ category: q.category || "Övrigt", correct: false });

    buttons.forEach(b => {
      if (b.textContent.includes(q.correct)) b.classList.add('correct');
    });

    explanationDiv.textContent = q.explanation || "Ingen förklaring";
    explanationDiv.classList.remove('d-none');

    fetch("/wrong/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q)
    });

    nextBtn.classList.remove('d-none');
  }
}

// ======================================================
//            MULTI SELECT — AUTO-NEXT VID RÄTT
// ======================================================
function submitMulti(q) {
  const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
  const selectedSet = new Set(cbs.filter(c => c.checked).map(c => c.value));
  const correctSet = new Set(q.correct);

  cbs.forEach(cb => cb.disabled = true);

  const isCorrect = setEquals(selectedSet, correctSet);

  if (isCorrect) {
    scoreList.push({ category: q.category || "Övrigt", correct: true });

    fetch("/wrong/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q)
    });

    cbs.forEach(cb => {
      if (q.correct.includes(cb.value)) cb.parentElement.classList.add('correct');
    });

    setTimeout(() => {
      currentQuestion++;
      if (currentQuestion >= questions.length) showResult();
      else showQuestion();
    }, 600);

  } else {
    scoreList.push({ category: q.category || "Övrigt", correct: false });

    explanationDiv.textContent = q.explanation || "Ingen förklaring";
    explanationDiv.classList.remove('d-none');

    fetch("/wrong/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(q)
    });

    cbs.forEach(cb => {
      if (q.correct.includes(cb.value)) cb.parentElement.classList.add('correct');
      else if (cb.checked) cb.parentElement.classList.add('wrong');
    });

    nextBtn.classList.remove('d-none');
  }
}

// ======================================================
//                       RESULTAT
// ======================================================
function showResult() {
  quizScreen.classList.add('d-none');
  resultScreen.classList.remove('d-none');

  const categoryResults = {};
  let totalCorrect = 0;

  scoreList.forEach(s => {
    categoryResults[s.category] = categoryResults[s.category] || { correct: 0, total: 0 };
    categoryResults[s.category].total++;
    if (s.correct) {
      categoryResults[s.category].correct++;
      totalCorrect++;
    }
  });

  document.getElementById('totalResult').textContent =
    `🎯 Totalt: ${totalCorrect}/${scoreList.length} (${(totalCorrect / scoreList.length * 100).toFixed(1)}%)`;

  // Spara highscore lokalt
  const quizDate = new Date().toISOString().split('T')[0];
  const scorePercent = Math.round(totalCorrect / scoreList.length * 100);
  let highscores = JSON.parse(localStorage.getItem('highscores') || '[]');
  highscores.push({ date: quizDate, score: scorePercent, total: `${totalCorrect}/${scoreList.length}` });
  localStorage.setItem('highscores', JSON.stringify(highscores));

  const ctx = document.getElementById('categoryChart').getContext('2d');
  const labels = Object.keys(categoryResults);
  const data = labels.map(l => categoryResults[l].correct);
  const totals = labels.map(l => categoryResults[l].total);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Rätt per kategori',
        data: data,
        backgroundColor: labels.map((_, i) => `rgba(${50 + i * 40}, 123, 255, 0.7)`),
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: Math.max(...totals) }
      }
    }
  });
}

// ======================================================
//                 VISA HIGHSCORES
// ======================================================
showHighscoresBtn.addEventListener('click', () => {
  const highscores = JSON.parse(localStorage.getItem('highscores') || '[]');
  if(highscores.length === 0) {
    highscoresDiv.innerHTML = "<em>Inga highscores sparade.</em>";
  } else {
    highscoresDiv.innerHTML = highscores
      .map(h => `${h.date} – ${h.score}% – ${h.total}`)
      .join('<br>');
  }
  highscoresDiv.style.display = 'block';
});

// ======================================================
//                     PROGRESSBAR
// ======================================================
function updateProgress() {
  const percent = (currentQuestion / questions.length) * 100;
  progressBar.style.width = percent + '%';
  progressBar.textContent = Math.floor(percent) + '%';
}

// ======================================================
//                     HJÄLPFUNKTIONER
// ======================================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function setEquals(a, b) {
  if (a.size !== b.size) return false;
  for (const x of a) if (!b.has(x)) return false;
  return true;
}
