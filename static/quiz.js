// static/quiz.js
// ======================================================
// GLOBALA VARIABLER OCH DOM-ELEMENT
// ======================================================
let questions = [];
let currentQuestion = 0;
let scoreList = [];
let chart = null; 
let questionStartTime = 0; 
let selectedQuizFiles = []; 

// DOM-referenser
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const questionNum = document.getElementById('questionNum'); // Används nu för "Fråga X av Y"
const questionText = document.getElementById('questionText');
const optionsDiv = document.getElementById('options');
const explanationDiv = document.getElementById('explanation');
const progressBar = document.getElementById('progressBar');
const onlyWrong = document.getElementById('onlyWrong');
const fileCheckboxesDiv = document.getElementById('fileCheckboxes'); 

const toggleFilesBtn = document.getElementById('toggleFilesBtn');
const highscoresDiv = document.getElementById('highscoresDiv');
const showHighscoresBtn = document.getElementById('showHighscoresBtn');

const multiSubmitBtn = document.getElementById('multiSubmitBtn'); 

// ======================================================
// HÄMTA JSON-FILER & STARTKNAPP-LOGIK
// ======================================================
startBtn.disabled = true; 

function updateStartButtonStatus() {
    const selected = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0;
    
    startBtn.disabled = !(onlyWrong.checked || selected);
}

onlyWrong.addEventListener('change', updateStartButtonStatus);

fetch("/files")
    .then(res => res.json())
    .then(files => {
        files.forEach(f => {
            const div = document.createElement('div');
            div.className = "form-check";
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${f}" id="${f}" checked>
                <label class="form-check-label" for="${f}">${f}</label>`;
            
            div.querySelector('input').addEventListener('change', updateStartButtonStatus);
            fileCheckboxesDiv.appendChild(div);
        });
        updateStartButtonStatus(); 
    })
    .catch(err => {
        console.error("Kunde inte ladda /files:", err);
        updateStartButtonStatus(); 
    });

// ======================================================
// STARTA QUIZ
// ======================================================
startBtn.addEventListener('click', () => {
    highscoresDiv.style.display = 'none';
    showHighscoresBtn.textContent = "Visa highscores";

    if (onlyWrong.checked) {
        selectedQuizFiles = ['Fel frågor']; 
        fetch("/wrong").then(r => r.json()).then(data => {
            if (!data || data.length === 0) { alert("Inga fel frågor sparade!"); return; }
            questions = shuffleArray(data);
            startQuiz();
        });
        return;
    }

    selectedQuizFiles = Array.from(document.querySelectorAll('#fileCheckboxes input:checked'))
        .map(cb => cb.value);

    if (selectedQuizFiles.length === 0) { 
        alert("Välj minst en fil."); 
        return; 
    }

    Promise.all(selectedQuizFiles.map(f => fetch(`/questions/${f}`).then(r => r.json())))
        .then(arrays => {
            questions = shuffleArray(arrays.flat());
            const num = parseInt(document.getElementById('numQuestions').value, 10);
            
            if (num) questions = questions.slice(0, num);
            
            if (questions.length === 0) { alert("Hittade inga frågor i de valda filerna!"); return; }

            startQuiz();
        })
        .catch(err => { console.error("Fel vid hämtning av frågor:", err); alert("Fel vid hämtning av frågor. Kolla konsolen."); });
});

function startQuiz() {
    currentQuestion = 0;
    scoreList = [];
    startScreen.classList.add('d-none');
    quizScreen.classList.remove('d-none');
    resultScreen.classList.add('d-none');
    showQuestion();
}

// ======================================================
// QUIZ KONTROLLER
// ======================================================
nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion >= questions.length) showResult();
    else showQuestion();
});

restartBtn.addEventListener('click', () => {
    resultScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    updateStartButtonStatus(); 
});

// Avbryt quiz modal-logik
const abortModal = new bootstrap.Modal(document.getElementById('abortModal'));
document.getElementById('abortBtn').addEventListener('click', () => abortModal.show());
document.getElementById('abortWithScore').addEventListener('click', () => showResult());
document.getElementById('abortWithoutScore').addEventListener('click', () => {
    quizScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    updateStartButtonStatus(); 
});

// TOGGLE markera/avmarkera alla files
toggleFilesBtn.addEventListener('click', () => {
    const checkboxes = fileCheckboxesDiv.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const newState = !allChecked;
    checkboxes.forEach(cb => cb.checked = newState);
    toggleFilesBtn.textContent = newState ? "Markera alla" : "Avmarkera alla";
    updateStartButtonStatus();
});

// ======================================================
// HIGHSCORES show/hide
// ======================================================
showHighscoresBtn.addEventListener('click', async () => {
    if (highscoresDiv.style.display === 'block') {
        highscoresDiv.style.display = 'none';
        showHighscoresBtn.textContent = "Visa highscores";
        return;
    }

    try {
        const res = await fetch('/highscores');
        const data = await res.json();

        if (!data || data.length === 0) {
            highscoresDiv.innerHTML = "<em>Inga highscores sparade.</em>";
        } else {
            let html = `
                <div class="highscore-entry header">
                    <span>Datum och Tid</span>
                    <span>Poäng (Korrekt/Totalt)</span>
                    <span>⏱️ Tid</span>
                    <span>Kategorier</span>
                </div>
            `;
            data.sort((a, b) => {
                const timeA = parseFloat(a.time) || 9999;
                const timeB = parseFloat(b.time) || 9999;
                
                if (timeA !== timeB) return timeA - timeB; 
                
                return (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0); 
            });


            data.forEach((h, idx) => {
                if (!h || !h.total || typeof h.score !== 'number' || typeof h.time === 'undefined') return;
                
                const timeDisplay = formatTime(h.time); 
                const filesDisplay = (h.files || ['N/A']).join(', '); 
                
                html += `<div class="highscore-entry ${idx%2===0?'even':'odd'}">
                            <span>${h.date}</span>
                            <span>${h.score}% (${h.total})</span>
                            <span>${timeDisplay}</span>
                            <span>${filesDisplay}</span>
                        </div>`;
            });
            
            highscoresDiv.innerHTML = html || "<em>Inga highscores sparade.</em>";
        }

        highscoresDiv.style.display = 'block';
        showHighscoresBtn.textContent = "Dölj highscores";
    } catch (err) {
        console.error("Kunde inte hämta highscores:", err);
        highscoresDiv.innerHTML = "<em>Fel vid hämtning av highscores.</em>";
        highscoresDiv.style.display = 'block';
    }
});


// ======================================================
// MULTI-SUBMIT LOGIK
// ======================================================

function updateMultiSubmitButtonStatus() {
    const isMulti = Array.isArray(questions[currentQuestion].correct);
    if (!isMulti) return;

    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    const anyChecked = cbs.some(c => c.checked);
    
    multiSubmitBtn.disabled = !anyChecked;
}

// ======================================================
// VISA FRÅGA
// ======================================================
function showQuestion() {
    const q = questions[currentQuestion];
    
    questionText.textContent = q.question;

    optionsDiv.innerHTML = '';
    explanationDiv.classList.add('d-none');
    nextBtn.classList.add('d-none'); 
    multiSubmitBtn.classList.add('d-none'); 

    questionStartTime = Date.now();

    const isMulti = Array.isArray(q.correct);
    let shuffledOptions = shuffleArray([...q.options]);
    
    const fragment = document.createDocumentFragment();

    for (const [idx, opt] of shuffledOptions.entries()) {
        const optionItem = document.createElement('label'); 
        optionItem.className = 'option-item';
        
        const input = document.createElement('input');
        input.type = isMulti ? 'checkbox' : 'radio';
        input.name = 'questionOptions'; 
        input.value = opt;
        input.id = `option-${idx}`; 

        const optionText = document.createTextNode(`${String.fromCharCode(65 + idx)}. ${opt}`);
        
        optionItem.appendChild(input);
        optionItem.appendChild(optionText);
        
        if (!isMulti) {
            input.addEventListener('change', () => checkAnswer(opt, optionItem, q));
        } else {
            input.addEventListener('change', updateMultiSubmitButtonStatus); 
        }
        
        fragment.appendChild(optionItem); 
    }
    
    optionsDiv.appendChild(fragment); 

    if (isMulti) {
        multiSubmitBtn.textContent = "✅ Skicka svar";
        multiSubmitBtn.classList.remove('d-none', 'btn-success-green'); 
        multiSubmitBtn.classList.add('btn-primary'); 
        multiSubmitBtn.disabled = true; 
        multiSubmitBtn.onclick = () => submitMulti(q); 
    }

    updateProgress();
}

// ======================================================
// SINGLE-CHOICE: Checka svar (Automatisk vidarekoppling vid rätt)
// ======================================================
function checkAnswer(selected, optionItem, q) {
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1); 

    Array.from(optionsDiv.querySelectorAll('input')).forEach(input => input.disabled = true);

    const isCorrect = (selected === q.correct);
    scoreList.push({ 
        category: q.category || "Övrigt", 
        correct: isCorrect, 
        time: parseFloat(timeTaken)
    });

    if (isCorrect) {
        optionItem.classList.add('correct');
        const iconSpan = document.createElement('span');
        iconSpan.className = 'temp-icon';
        iconSpan.textContent = '✔';
        optionItem.appendChild(iconSpan);
        
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) showResult();
            else showQuestion();
        }, 600); 

    } else {
        optionItem.classList.add('wrong');
        
        Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => { 
            const input = item.querySelector('input');
            if (input && input.value === q.correct) {
                item.classList.add('correct');
            }
        });

        explanationDiv.textContent = q.explanation || "Ingen förklaring";
        explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// MULTI SELECT: Submit (Automatisk vidarekoppling vid rätt)
// ======================================================
function submitMulti(q) {
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    
    if (multiSubmitBtn.disabled) return; 

    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    
    cbs.forEach(cb => cb.disabled = true);
    multiSubmitBtn.disabled = true; 

    const selectedSet = new Set(cbs.filter(c => c.checked).map(c => c.value));
    const correctSet = new Set(q.correct || []);

    const isCorrect = setEquals(selectedSet, correctSet);
    scoreList.push({ 
        category: q.category || "Övrigt", 
        correct: isCorrect,
        time: parseFloat(timeTaken)
    });

    Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => {
        const input = item.querySelector('input');
        if (!input) return;

        if (q.correct.includes(input.value)) {
            item.classList.add('correct');
        } else if (input.checked) {
            item.classList.add('wrong');
        }
    });

    if (isCorrect) {
        multiSubmitBtn.textContent = '✔ Rätt svar!';
        multiSubmitBtn.classList.remove('btn-primary');
        multiSubmitBtn.classList.add('btn-success-green');
        
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) showResult();
            else showQuestion();
        }, 600);

    } else {
        explanationDiv.textContent = q.explanation || "Ingen förklaring";
        explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// RESULTAT + highscore save
// ======================================================
function showResult() {
    quizScreen.classList.add('d-none');
    resultScreen.classList.remove('d-none');

    const categoryResults = {};
    let totalCorrect = 0;
    let totalTime = 0;

    scoreList.forEach(s => {
        categoryResults[s.category] = categoryResults[s.category] || { correct: 0, total: 0 };
        categoryResults[s.category].total++;
        
        totalTime += s.time;
        
        if (s.correct) { categoryResults[s.category].correct++; totalCorrect++; }
    });

    const totalQuestions = scoreList.length;
    const percentage = totalQuestions ? (totalCorrect / totalQuestions * 100).toFixed(1) : 0;
    const averageTime = totalQuestions ? (totalTime / totalQuestions).toFixed(1) : 0; 
    
    const formattedTotalTime = formatTime(totalTime);
    
    const dateAndTime = getDisplayDateTime(new Date());

    document.getElementById('totalResult').innerHTML =
        `🎯 Totalt: ${totalCorrect}/${totalQuestions} (${percentage}%)<br>
         ⏱️ **Total Tid:** ${formattedTotalTime} (Snitt per fråga: ${averageTime}s)`; 

    if (totalQuestions > 0 && totalQuestions === questions.length) {
        saveHighscore(
            Math.round(totalCorrect / totalQuestions * 100), 
            `${totalCorrect}/${totalQuestions}`, 
            totalTime.toFixed(1),
            dateAndTime, 
            selectedQuizFiles 
        );
    }

    // Chart.js - visa resultat per kategori
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const labels = Object.keys(categoryResults);
    const data = labels.map(l => categoryResults[l].correct);
    const totals = labels.map(l => categoryResults[l].total);

    if (chart) chart.destroy(); 
    chart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Rätt per kategori', data, backgroundColor: labels.map((_, i) => `rgba(${50 + i * 40},123,255,0.7)`), borderColor: 'rgba(0,0,0,1)', borderWidth: 1 }] },
        options: { scales: { y: { beginAtZero: true, max: Math.max(...totals) || 1 } } }
    });
}

// ======================================================
// UTILS
// ======================================================

function getDisplayDateTime(dateObj) {
    const options = { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return dateObj.toLocaleString('sv-SE', options).replace(',', ''); 
}

function formatTime(totalSeconds) {
    if (!totalSeconds || isNaN(totalSeconds)) return '-';
    
    const roundedSeconds = Math.round(totalSeconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const seconds = roundedSeconds % 60;
    
    if (minutes > 0) {
        const secondsString = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}m ${secondsString}s`;
    }
    return `${seconds}s`;
}

// ÅTERSTÄLLD FUNKTION: Visar endast % i progressfältet. Uppdaterar questionNum.
function updateProgress() {
    const total = questions.length;
    const current = currentQuestion; 
    const percent = total ? (current / total) * 100 : 0;
    
    progressBar.style.width = percent + '%';
    progressBar.textContent = Math.floor(percent) + '%';
    
    // Visar Fråga X av Y i #questionNum
    if (total > 0) {
        questionNum.textContent = `Fråga ${current + 1} av ${total}`;
    } else {
        questionNum.textContent = '';
    }
}

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

function saveHighscore(score, total, time, dateAndTime, files) {
    fetch('/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            date: dateAndTime, 
            score, 
            total,
            time,
            files: files 
        })
    }).catch(err => console.error("Kunde inte spara highscore:", err));
}