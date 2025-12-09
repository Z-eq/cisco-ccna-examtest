// static/quiz.js
// ======================================================
// GLOBAL VARIABLES AND DOM ELEMENTS
// ======================================================
let allLoadedQuestions = []; // Holds ALL questions after loading to allow re-filtering.
let questions = []; // Holds the FINAL list of questions the quiz runs on.
let scoreList = [];
let currentQuestion = 0; // Index for questions in 'questions'
let questionStartTime = 0; 
let selectedQuizFiles = []; 
let chart = null; // For Chart.js

// DOM References
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn'); 
const loadCategoriesBtn = document.getElementById('loadCategoriesBtn'); 
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const questionNum = document.getElementById('questionNum'); 
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

const categorySelection = document.getElementById('categorySelection');
const categoryCheckboxes = document.getElementById('categoryCheckboxes');
const toggleCategoriesBtn = document.getElementById('toggleCategoriesBtn');


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
    if (!totalSeconds || isNaN(totalSeconds)) return '0s';
    
    const roundedSeconds = Math.round(totalSeconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const seconds = roundedSeconds % 60;
    
    if (minutes > 0) {
        const secondsString = seconds < 10 ? '0' + seconds : seconds;
        return `${minutes}m ${secondsString}s`;
    }
    return `${roundedSeconds}s`;
}

function updateProgress() {
    const total = questions.length;
    const current = currentQuestion; 
    const percent = total ? (current / total) * 100 : 0;
    
    progressBar.style.width = percent + '%';
    progressBar.textContent = Math.floor(percent) + '%';
    
    if (total > 0) {
        questionNum.textContent = `Fråga ${current + 1} av ${total}`; // Question ${current + 1} of ${total}
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
    }).catch(err => console.error("Could not save highscore:", err));
}

// ======================================================
// HIGHSCORES show/hide AND LOADING
// ======================================================

async function fetchAndDisplayHighscores(show = true) {
    if (show && highscoresDiv.style.display === 'block') {
        highscoresDiv.style.display = 'none';
        showHighscoresBtn.textContent = "Visa highscores"; // Show highscores
        return;
    }
    
    // Show loading indicator only if we are displaying the list
    if (show) {
        highscoresDiv.innerHTML = "<em>Laddar highscores...</em>"; // Loading highscores...
        showHighscoresBtn.textContent = "Dölj highscores"; // Hide highscores
    }


    try {
        const res = await fetch('/highscores');
        const data = await res.json();

        let html = '';

        if (!data || data.length === 0) {
            html = "<em>Inga highscores sparade.</em>"; // No highscores saved.
        } else {
            html = `
                <div class="highscore-entry header">
                    <span>Datum och Tid</span>
                    <span>Poäng (Korrekt/Totalt)</span>
                    <span>⏱️ Tid</span>
                    <span>Kategorier</span>
                </div>
            `;
            // Sorting based on your original logic
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
            
            html = html || "<em>Inga highscores sparade.</em>"; // No highscores saved.
        }
        
        // Update DOM regardless of whether we display or not
        highscoresDiv.innerHTML = html;

        // CHECK DISPLAY STATUS
        if (show) {
            highscoresDiv.style.display = 'block';
            showHighscoresBtn.textContent = "Dölj highscores"; // Hide highscores
        } else {
             // If we are just loading silently, make sure it's hidden
            highscoresDiv.style.display = 'none';
            showHighscoresBtn.textContent = "Visa highscores"; // Show highscores
        }
        
    } catch (err) {
        console.error("Could not fetch highscores:", err);
        highscoresDiv.innerHTML = "<em>Fel vid hämtning av highscores.</em>"; // Error fetching highscores.
        if (show) highscoresDiv.style.display = 'block';
    }
}

// Connect the new function to the button
showHighscoresBtn.addEventListener('click', () => fetchAndDisplayHighscores(true)); 

// ======================================================
// FETCH JSON FILES & START BUTTON LOGIC
// ======================================================

function updateStartButtonStatus() {
    const filesSelected = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0 || onlyWrong.checked;
    
    // If categories are NOT displayed (Direct Start mode), you can start if files are selected.
    if (categorySelection.classList.contains('d-none')) {
        startBtn.disabled = !filesSelected;
    } else {
        // If categories ARE displayed, at least one category must be selected.
        const selectedCategories = Array.from(categoryCheckboxes.querySelectorAll('input:checked')).length > 0;
        startBtn.disabled = !selectedCategories;
    }
}


function updateLoadButtonStatus() {
    const selectedFiles = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0;
    
    loadCategoriesBtn.disabled = !(onlyWrong.checked || selectedFiles);

    if (onlyWrong.checked) {
        loadCategoriesBtn.textContent = "📂 Ladda Felaktiga frågor & Välj Kategorier"; // Load Incorrect Questions & Select Categories
    } else {
        loadCategoriesBtn.textContent = "📂 Ladda frågor & Välj Kategorier"; // Load Questions & Select Categories
    }
}

categoryCheckboxes.addEventListener('change', updateStartButtonStatus);
onlyWrong.addEventListener('change', updateLoadButtonStatus);


document.addEventListener('DOMContentLoaded', () => {
    fetch("/files")
        .then(res => res.json())
        .then(files => {
            files.forEach(f => {
                const div = document.createElement('div');
                div.className = "form-check";
                div.innerHTML = `
                    <input class="form-check-input" type="checkbox" value="${f}" id="${f}" checked>
                    <label class="form-check-label" for="${f}">${f}</label>`;
                
                div.querySelector('input').addEventListener('change', () => {
                    // Reset all category selection/questions if files change
                    questions = []; 
                    allLoadedQuestions = [];
                    categorySelection.classList.add('d-none');
                    categoryCheckboxes.innerHTML = '';
                    updateStartButtonStatus();
                    updateLoadButtonStatus();
                });
                fileCheckboxesDiv.appendChild(div);
            });
        })
        .catch(err => {
            console.error("Could not load /files:", err);
        })
        .finally(() => {
            updateLoadButtonStatus(); 
            updateStartButtonStatus();
            
            // Load highscores silently in the background without displaying them
            fetchAndDisplayHighscores(false); 
        });
});


function displayCategoryCheckboxes(allQ) {
    const categories = new Set();
    allQ.forEach(q => {
        if (q.category) categories.add(q.category);
        else categories.add("Övrigt/Saknar Kategori"); // Other/Missing Category
    });
    
    const availableCategories = Array.from(categories).sort();
    categoryCheckboxes.innerHTML = ''; 

    if (availableCategories.length === 0) {
        categorySelection.classList.add('d-none');
        loadCategoriesBtn.textContent = "Inga frågor hittades!"; // No questions found!
        loadCategoriesBtn.disabled = true;
        return;
    }

    availableCategories.forEach(cat => {
        const div = document.createElement('div');
        div.className = "form-check";
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${cat}" id="cat-${cat}" checked>
            <label class="form-check-label" for="cat-${cat}">${cat}</label>`;
        
        div.querySelector('input').addEventListener('change', updateStartButtonStatus);
        categoryCheckboxes.appendChild(div);
    });

    categorySelection.classList.remove('d-none');
    updateStartButtonStatus(); 
}


toggleCategoriesBtn.addEventListener('click', () => {
    const checkboxes = categoryCheckboxes.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const newState = !allChecked;
    checkboxes.forEach(cb => cb.checked = newState);
    toggleCategoriesBtn.textContent = newState ? "Avmarkera alla kategorier" : "Markera alla kategorier"; // Unselect all categories : Select all categories
    updateStartButtonStatus();
});

// ======================================================
// LOAD CATEGORIES LOGIC (STEP 1: Load questions and show filter)
// ======================================================

loadCategoriesBtn.addEventListener('click', () => {
    questions = []; 
    allLoadedQuestions = [];
    categoryCheckboxes.innerHTML = '';
    
    loadCategoriesBtn.textContent = "Laddar..."; // Loading...
    loadCategoriesBtn.disabled = true;
    startBtn.disabled = true;

    let fetchPromise;

    if (onlyWrong.checked) {
        selectedQuizFiles = ['Fel frågor']; // Incorrect Questions
        fetchPromise = fetch("/wrong").then(r => r.json());
    } else {
        selectedQuizFiles = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
        if (selectedQuizFiles.length === 0) { 
            alert("Välj minst en fil."); // Select at least one file.
            loadCategoriesBtn.textContent = "Ladda frågor & Välj Kategorier"; // Load Questions & Select Categories
            loadCategoriesBtn.disabled = false;
            startBtn.disabled = false;
            return; 
        }
        fetchPromise = Promise.all(selectedQuizFiles.map(f => fetch(`/questions/${f}`).then(r => r.json()))).then(arrays => arrays.flat());
    }

    fetchPromise
        .then(allQ => {
            if (!allQ || allQ.length === 0) { 
                alert("Hittade inga frågor att ladda!"); // Found no questions to load!
                loadCategoriesBtn.textContent = "Inga frågor hittades"; // No questions found
                return; 
            }
            
            allLoadedQuestions = allQ; // Save all fetched questions
            questions = allQ; // So the Start button knows loading occurred
            
            displayCategoryCheckboxes(allQ);
            loadCategoriesBtn.textContent = "✅ Kategorier laddade"; // Categories loaded
        })
        .catch(err => { 
            console.error("Error fetching questions:", err); 
            alert("Fel vid hämtning av frågor. Kolla konsolen."); // Error fetching questions. Check console.
            loadCategoriesBtn.textContent = "Fel vid laddning"; // Error loading
        })
        .finally(() => {
            loadCategoriesBtn.disabled = false;
            startBtn.disabled = false;
        });
});

// ======================================================
// START QUIZ LOGIC (STEP 2: Filtering & Start OR Direct Start)
// ======================================================
startBtn.addEventListener('click', () => {
    if (startBtn.disabled) return;
    
    // ----------------------------------------------------
    // MODE 1: DIRECT START - No questions are loaded yet.
    // ----------------------------------------------------
    if (allLoadedQuestions.length === 0) {
        
        const filesSelected = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).length > 0 || onlyWrong.checked;
        if (!filesSelected) { 
            alert("Välj minst en fil eller 'Endast felaktiga frågor'."); // Select at least one file or 'Only incorrect questions'.
            return; 
        }

        loadCategoriesBtn.textContent = "Laddar och Startar..."; // Loading and Starting...
        loadCategoriesBtn.disabled = true;
        startBtn.disabled = true;
        
        let fetchPromise;
        if (onlyWrong.checked) {
            selectedQuizFiles = ['Fel frågor']; // Incorrect Questions
            fetchPromise = fetch("/wrong").then(r => r.json());
        } else {
            selectedQuizFiles = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
            fetchPromise = Promise.all(selectedQuizFiles.map(f => fetch(`/questions/${f}`).then(r => r.json()))).then(arrays => arrays.flat());
        }

        fetchPromise.then(allQ => {
            if (!allQ || allQ.length === 0) {
                alert("Hittade inga frågor att starta quizet med."); // Found no questions to start the quiz with.
                loadCategoriesBtn.textContent = "Inga frågor hittades"; // No questions found
                return;
            }
            
            allLoadedQuestions = allQ; 
            let questionsToUse = [...allLoadedQuestions]; 
            
            const num = parseInt(document.getElementById('numQuestions').value, 10);
            if (num && num < questionsToUse.length) {
                questionsToUse = shuffleArray(questionsToUse).slice(0, num);
            }
            
            questions = questionsToUse; 
            
            loadCategoriesBtn.textContent = "Ladda frågor & Välj Kategorier"; // Load Questions & Select Categories
            updateLoadButtonStatus(); 
            startQuiz();
            
        }).catch(err => {
            console.error("Error during direct start of questions:", err); 
            alert("Fel vid laddning av frågor. Kolla konsolen."); // Error loading questions. Check console.
            loadCategoriesBtn.textContent = "Fel vid laddning"; // Error loading
        }).finally(() => {
            loadCategoriesBtn.disabled = false;
            startBtn.disabled = false;
        });
        
        return; 
    }
    
    // ----------------------------------------------------
    // MODE 2: FILTERED START - Questions are already loaded (after "Load").
    // ----------------------------------------------------
    
    const selectedCategories = Array.from(categoryCheckboxes.querySelectorAll('input:checked'))
        .map(cb => cb.value);
    
    let filteredQuestions = allLoadedQuestions.filter(q => 
        selectedCategories.includes(q.category || "Övrigt/Saknar Kategori") // Other/Missing Category
    );

    if (filteredQuestions.length === 0) {
        alert("Inga frågor matchade de valda kategorierna. Välj fler kategorier."); // No questions matched the selected categories. Select more categories.
        return;
    }

    let questionsToUse = [...filteredQuestions]; 
    const num = parseInt(document.getElementById('numQuestions').value, 10);
    
    if (num && num < questionsToUse.length) {
        questionsToUse = shuffleArray(questionsToUse).slice(0, num);
    }
    
    questions = questionsToUse;
    
    // Hide/clear UI elements
    categorySelection.classList.add('d-none');
    loadCategoriesBtn.textContent = "Ladda frågor & Välj Kategorier"; // Load Questions & Select Categories
    updateLoadButtonStatus(); 
    
    startQuiz();
});


function startQuiz() {
    if (questions.length === 0) {
        alert("Kritiskt fel: Inga frågor att starta quizet med."); // Critical error: No questions to start the quiz with.
        startScreen.classList.remove('d-none');
        return;
    }
    
    currentQuestion = 0;
    scoreList = [];
    startScreen.classList.add('d-none');
    quizScreen.classList.remove('d-none');
    resultScreen.classList.add('d-none');
    
    questions = shuffleArray(questions); 
    showQuestion();
}

// ======================================================
// QUIZ CONTROLS
// ======================================================
nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion >= questions.length) showResult();
    else showQuestion();
});

restartBtn.addEventListener('click', () => {
    questions = []; 
    allLoadedQuestions = [];
    categorySelection.classList.add('d-none');
    categoryCheckboxes.innerHTML = '';
    
    resultScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    updateLoadButtonStatus(); 
    updateStartButtonStatus();
});

// Abort quiz modal logic
const abortModal = new bootstrap.Modal(document.getElementById('abortModal'));
document.getElementById('abortBtn').addEventListener('click', () => abortModal.show());
document.getElementById('abortWithScore').addEventListener('click', () => showResult());
document.getElementById('abortWithoutScore').addEventListener('click', () => {
    quizScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    
    questions = []; 
    allLoadedQuestions = [];
    categorySelection.classList.add('d-none');
    categoryCheckboxes.innerHTML = '';
    
    updateLoadButtonStatus(); 
    updateStartButtonStatus();
});

// TOGGLE select/unselect all files
toggleFilesBtn.addEventListener('click', () => {
    const checkboxes = fileCheckboxesDiv.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const newState = !allChecked;
    checkboxes.forEach(cb => cb.checked = newState);
    toggleFilesBtn.textContent = newState ? "Avmarkera alla" : "Markera alla"; // Unselect all : Select all
    
    questions = []; 
    allLoadedQuestions = [];
    categorySelection.classList.add('d-none');
    categoryCheckboxes.innerHTML = '';

    updateLoadButtonStatus();
    updateStartButtonStatus();
});


// ======================================================
// MULTI-SUBMIT LOGIC
// ======================================================

function updateMultiSubmitButtonStatus() {
    const currentQ = questions[currentQuestion];
    if (!currentQ || !Array.isArray(currentQ.correct)) return;

    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    const anyChecked = cbs.some(c => c.checked);
    
    multiSubmitBtn.disabled = !anyChecked;
}

// ======================================================
// SHOW QUESTION
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
        multiSubmitBtn.textContent = "✅ Skicka svar"; // Submit answer
        multiSubmitBtn.classList.remove('d-none', 'btn-success-green'); 
        multiSubmitBtn.classList.add('btn-primary'); 
        multiSubmitBtn.disabled = true; 
        multiSubmitBtn.onclick = () => submitMulti(q); 
    }

    updateProgress();
}

// ======================================================
// SINGLE-CHOICE: Check answer (Automatic)
// ======================================================
function checkAnswer(selected, optionItem, q) {
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1); 

    Array.from(optionsDiv.querySelectorAll('input')).forEach(input => input.disabled = true);

    const isCorrect = (selected === q.correct);
    scoreList.push({ 
        category: q.category || "Övrigt/Saknar Kategori", // Other/Missing Category
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

        explanationDiv.textContent = q.explanation || "Ingen förklaring"; // No explanation
        explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// MULTI SELECT: Submit 
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
        category: q.category || "Övrigt/Saknar Kategori", // Other/Missing Category
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
        multiSubmitBtn.textContent = '✔ Rätt svar!'; // Correct answer!
        multiSubmitBtn.classList.remove('btn-primary');
        multiSubmitBtn.classList.add('btn-success-green');
        
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) showResult();
            else showQuestion();
        }, 600);

    } else {
        explanationDiv.textContent = q.explanation || "Ingen förklaring"; // No explanation
        explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// RESULT + highscore save
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
         ⏱️ **Total Tid:** ${formattedTotalTime} (Snitt per fråga: ${averageTime}s)`; // Total: ... Total Time: ... (Avg per question: ...)

    if (totalQuestions > 0 && totalQuestions === questions.length) {
        saveHighscore(
            Math.round(totalCorrect / totalQuestions * 100), 
            `${totalCorrect}/${totalQuestions}`, 
            totalTime.toFixed(1),
            dateAndTime, 
            selectedQuizFiles 
        );
    }

    // Chart.js - View result per category
    const ctx = document.getElementById('categoryChart').getContext('2d');
    const labels = Object.keys(categoryResults);
    const data = labels.map(l => categoryResults[l].correct);
    const totals = labels.map(l => categoryResults[l].total);

    if (chart) chart.destroy(); 
    chart = new Chart(ctx, {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Rätt per kategori', data, backgroundColor: labels.map((_, i) => `rgba(${50 + i * 40},123,255,0.7)`), borderColor: 'rgba(0,0,0,1)', borderWidth: 1 }] }, // Correct per category
        options: { scales: { y: { beginAtZero: true, max: Math.max(...totals) || 1 } } }
    });
}