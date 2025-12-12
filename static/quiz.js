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

// --- Språkdata & Globalt språk ---
const languageStrings = {
    sv: {
        // Generellt & Info
        pageTitle: "CCNA - By Z",
        mainTitle: "🖧 CCNA Test",
        themeButtonText: "🌓 Byt Tema",
        langButtonText: "🇬🇧 English",
        infoAlertTitle: "Info om denna Quiz:",
        infoAlertText1: "Det finns cirka <strong>691</strong> unika frågor totalt.",
        infoAlertText2: "Filerna märkta <strong>Final</strong> innehåller lite svårare och dem mer relevanta frågorna från hela frågebanken.",
        
        // Startskärmen
        card1Header: "1. Välj Frågekällor",
        checkboxLabelWrong: "🚩 Endast felsvarade frågor",
        buttonDeselectAll: "Avmarkera alla",
        card2Header: "2. Filtrera efter Kategori (Valfritt)",
        buttonLoadCategoriesDefault: "📂 Ladda frågor & Välj Kategorier",
        buttonLoadCategoriesWrong: "📂 Ladda Felaktiga frågor & Välj Kategorier",
        buttonLoadCategoriesLoading: "Laddar...",
        buttonLoadCategoriesLoaded: "✅ Kategorier laddade",
        buttonLoadCategoriesNone: "Inga frågor hittades!",
        categoriesAvailable: "Tillgängliga Kategorier:",
        card3Header: "3. Inställningar & Start",
        labelNumQuestions: "Antal frågor att ta:",
        buttonStart: "▶ STARTA QUIZ",
        buttonHighscoresShow: "🏆 Visa highscores",
        buttonHighscoresHide: "Dölj highscores",
        highscoresLoading: "<em>Laddar highscores...</em>",
        highscoresNone: "<em>Inga highscores sparade.</em>",
        highscoresError: "<em>Fel vid hämtning av highscores.</em>",
        highscoresHeader1: "Datum och Tid",
        highscoresHeader2: "Poäng (Korrekt/Totalt)",
        highscoresHeader3: "⏱️ Tid",
        highscoresHeader4: "Kategorier",
        alertSelectFile: "Välj minst en fil.",
        alertSelectFileOrWrong: "Välj minst en fil eller 'Endast felaktiga frågor'.",
        alertNoQuestions: "Hittade inga frågor att ladda!",
        alertNoQuestionsStart: "Hittade inga frågor att starta quizet med.",
        alertErrorFetching: "Fel vid hämtning av frågor. Kolla konsolen.",
        alertNoCategoryMatch: "Inga frågor matchade de valda kategorierna. Välj fler kategorier.",
        alertCriticalError: "Kritiskt fel: Inga frågor att starta quizet med.",
        
        // Quiz Skärmen
        questionOfTotal: "Fråga [CURRENT] av [TOTAL]",
        abortButton: "⏹ Avbryt quiz",
        buttonNext: "Nästa fråga",
        buttonSubmit: "✅ Skicka svar",
        buttonCorrect: "✔ Rätt svar!",
        explanationNone: "Ingen förklaring",
        categoryOther: "Övrigt/Saknar Kategori",
        
        // Resultat Skärmen
        resultTitle: "📊 Resultat",
        resultTotal: "🎯 Totalt: [CORRECT]/[TOTAL] ([PERCENT]%)",
        resultTime: "⏱️ **Total Tid:** [TOTALTIME] (Snitt per fråga: [AVGTIME]s)",
        chartLabel: "Rätt per kategori",
        buttonRestart: "🔁 Starta om",
        
        // Modal
        abortModalTitle: "Avbryt quiz?",
        abortModalBody: "Vill du rätta de frågor du redan svarat på innan du avslutar, eller återgå till startskärmen?",
        abortWithScore: "Rätta och visa resultat",
        abortWithoutScore: "Återgå till start",
        
        // Toggles
        toggleFilesSelect: "Markera alla",
        toggleFilesDeselect: "Avmarkera alla",
        toggleCategoriesSelect: "Markera alla kategorier",
        toggleCategoriesDeselect: "Avmarkera alla kategorier",

    },
    en: {
        // Generellt & Info
        pageTitle: "CCNA - By Z",
        mainTitle: "🖧 CCNA Test",
        themeButtonText: "🌓 Toggle Theme",
        langButtonText: "🇸🇪 Swedish",
        infoAlertTitle: "Info about this Quiz:",
        infoAlertText1: "There are approximately <strong>691</strong> unique questions in total.",
        infoAlertText2: "Files labeled <strong>Final</strong> contain slightly harder and more relevant questions from the entire question bank.",
        
        // Startskärmen
        card1Header: "1. Select Question Sources",
        checkboxLabelWrong: "🚩 Only Wrong Answers",
        buttonDeselectAll: "Deselect All",
        card2Header: "2. Filter by Category (Optional)",
        buttonLoadCategoriesDefault: "📂 Load Questions & Select Categories",
        buttonLoadCategoriesWrong: "📂 Load Incorrect Questions & Select Categories",
        buttonLoadCategoriesLoading: "Loading...",
        buttonLoadCategoriesLoaded: "✅ Categories Loaded",
        buttonLoadCategoriesNone: "No questions found!",
        categoriesAvailable: "Available Categories:",
        card3Header: "3. Settings & Start",
        labelNumQuestions: "Number of questions to take:",
        buttonStart: "▶ START QUIZ",
        buttonHighscoresShow: "🏆 Show Highscores",
        buttonHighscoresHide: "Hide Highscores",
        highscoresLoading: "<em>Loading highscores...</em>",
        highscoresNone: "<em>No highscores saved.</em>",
        highscoresError: "<em>Error fetching highscores.</em>",
        highscoresHeader1: "Date and Time",
        highscoresHeader2: "Score (Correct/Total)",
        highscoresHeader3: "⏱️ Time",
        highscoresHeader4: "Categories",
        alertSelectFile: "Select at least one file.",
        alertSelectFileOrWrong: "Select at least one file or 'Only incorrect questions'.",
        alertNoQuestions: "Found no questions to load!",
        alertNoQuestionsStart: "Found no questions to start the quiz with.",
        alertErrorFetching: "Error fetching questions. Check console.",
        alertNoCategoryMatch: "No questions matched the selected categories. Select more categories.",
        alertCriticalError: "Critical error: No questions to start the quiz with.",

        // Quiz Skärmen
        questionOfTotal: "Question [CURRENT] of [TOTAL]",
        abortButton: "⏹ Abort Quiz",
        buttonNext: "Next Question",
        buttonSubmit: "✅ Submit Answer",
        buttonCorrect: "✔ Correct answer!",
        explanationNone: "No explanation provided",
        categoryOther: "Other/Missing Category",

        // Resultat Skärmen
        resultTitle: "📊 Results",
        resultTotal: "🎯 Total: [CORRECT]/[TOTAL] ([PERCENT]%)",
        resultTime: "⏱️ **Total Time:** [TOTALTIME] (Avg per question: [AVGTIME]s)",
        chartLabel: "Correct per Category",
        buttonRestart: "🔁 Restart Quiz",
        
        // Modal
        abortModalTitle: "Abort Quiz?",
        abortModalBody: "Do you want to score the questions you've already answered before quitting, or return to the start screen?",
        abortWithScore: "Score and show result",
        abortWithoutScore: "Return to start",
        
        // Toggles
        toggleFilesSelect: "Select all",
        toggleFilesDeselect: "Deselect all",
        toggleCategoriesSelect: "Select all categories",
        toggleCategoriesDeselect: "Deselect all categories",
    }
};

let currentLanguage = 'sv'; 

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

const languageToggleBtn = document.getElementById('languageToggle'); // New Language Button

// ======================================================
// LANGUAGE HANDLING
// ======================================================

function updateUI(lang) {
    const strings = languageStrings[lang];
    
    // Generellt & Info
    document.getElementById('pageTitle').textContent = strings.pageTitle;
    document.getElementById('mainTitle').textContent = strings.mainTitle;
    document.getElementById('themeToggle').textContent = strings.themeButtonText;
    document.getElementById('languageToggle').textContent = strings.langButtonText;

    // Info Alert
    document.getElementById('infoAlert').innerHTML = `
        <strong>${strings.infoAlertTitle}</strong><br>
        • ${strings.infoAlertText1}<br>
        • ${strings.infoAlertText2}<br>
    `;

    // Start Screen Headers/Labels
    document.getElementById('card1Header').textContent = strings.card1Header;
    document.getElementById('checkboxLabelWrong').textContent = strings.checkboxLabelWrong;
    document.getElementById('toggleFilesBtn').textContent = (toggleFilesBtn.textContent === "Avmarkera alla" || toggleFilesBtn.textContent === "Deselect All") ? strings.toggleFilesDeselect : strings.toggleFilesSelect;
    
    document.getElementById('card2Header').textContent = strings.card2Header;
    
    // Load button status depends on logic, only update base text
    if (!onlyWrong.checked) {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesDefault;
    } else {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesWrong;
    }
    
    document.getElementById('categoriesAvailable').textContent = strings.categoriesAvailable;
    document.getElementById('toggleCategoriesBtn').textContent = (toggleCategoriesBtn.textContent.includes("Avmarkera") || toggleCategoriesBtn.textContent.includes("Deselect")) ? strings.toggleCategoriesDeselect : strings.toggleCategoriesSelect;
    
    document.getElementById('card3Header').textContent = strings.card3Header;
    document.getElementById('labelNumQuestions').textContent = strings.labelNumQuestions;
    document.getElementById('startBtn').textContent = strings.buttonStart;
    
    document.getElementById('showHighscoresBtn').textContent = (highscoresDiv.style.display === 'block') ? strings.buttonHighscoresHide : strings.buttonHighscoresShow;
    
    // Quiz Screen
    document.getElementById('abortBtn').textContent = strings.abortButton;
    nextBtn.textContent = strings.buttonNext;
    multiSubmitBtn.textContent = strings.buttonSubmit;
    
    // Result Screen
    document.getElementById('resultTitle').textContent = strings.resultTitle;
    document.getElementById('restartBtn').textContent = strings.buttonRestart;
    
    // Modal
    document.getElementById('abortModalTitle').textContent = strings.abortModalTitle;
    document.getElementById('abortModalBody').textContent = strings.abortModalBody;
    document.getElementById('abortWithScore').textContent = strings.abortWithScore;
    document.getElementById('abortWithoutScore').textContent = strings.abortWithoutScore;
    
    // Uppdatera progress bar texten (om synlig)
    updateProgress();
    
    // Uppdatera highscore-visningen (om synlig)
    if (highscoresDiv.style.display === 'block') {
        fetchAndDisplayHighscores(true);
    }
}

// Language Toggle Event Listener
languageToggleBtn.addEventListener('click', () => {
    currentLanguage = (currentLanguage === 'sv') ? 'en' : 'sv';
    updateUI(currentLanguage);
    localStorage.setItem('quizLanguage', currentLanguage);
});


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
    if (!totalSeconds || isNaN(totalSeconds)) return languageStrings[currentLanguage].highscoresHeader3.replace('⏱️ ', '0s');
    
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
        const str = languageStrings[currentLanguage].questionOfTotal;
        questionNum.textContent = str.replace('[CURRENT]', current + 1).replace('[TOTAL]', total); 
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
    const strings = languageStrings[currentLanguage];

    if (show && highscoresDiv.style.display === 'block') {
        highscoresDiv.style.display = 'none';
        showHighscoresBtn.textContent = strings.buttonHighscoresShow;
        return;
    }
    
    if (show) {
        highscoresDiv.innerHTML = strings.highscoresLoading;
        showHighscoresBtn.textContent = strings.buttonHighscoresHide;
    }


    try {
        const res = await fetch('/highscores');
        const data = await res.json();

        let html = '';

        if (!data || data.length === 0) {
            html = strings.highscoresNone;
        } else {
            html = `
                <div class="highscore-entry header">
                    <span>${strings.highscoresHeader1}</span>
                    <span>${strings.highscoresHeader2}</span>
                    <span>${strings.highscoresHeader3}</span>
                    <span>${strings.highscoresHeader4}</span>
                </div>
            `;
            // Sorting logic remains the same
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
            
            html = html || strings.highscoresNone;
        }
        
        highscoresDiv.innerHTML = html;

        if (show) {
            highscoresDiv.style.display = 'block';
            showHighscoresBtn.textContent = strings.buttonHighscoresHide;
        } else {
            highscoresDiv.style.display = 'none';
            showHighscoresBtn.textContent = strings.buttonHighscoresShow;
        }
        
    } catch (err) {
        console.error("Could not fetch highscores:", err);
        highscoresDiv.innerHTML = strings.highscoresError;
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
    const strings = languageStrings[currentLanguage];
    const selectedFiles = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0;
    
    loadCategoriesBtn.disabled = !(onlyWrong.checked || selectedFiles);

    if (onlyWrong.checked) {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesWrong;
    } else {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesDefault;
    }
}

categoryCheckboxes.addEventListener('change', updateStartButtonStatus);
onlyWrong.addEventListener('change', updateLoadButtonStatus);


document.addEventListener('DOMContentLoaded', () => {
    // 1. Ladda språk från localStorage
    const savedLang = localStorage.getItem('quizLanguage');
    if (savedLang && languageStrings.hasOwnProperty(savedLang)) {
        currentLanguage = savedLang;
    }
    updateUI(currentLanguage); // Uppdatera UI baserat på valt språk

    // 2. Ladda fil-checkboxar
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
    const strings = languageStrings[currentLanguage];
    const categories = new Set();
    allQ.forEach(q => {
        if (q.category) categories.add(q.category);
        else categories.add(strings.categoryOther);
    });
    
    const availableCategories = Array.from(categories).sort();
    categoryCheckboxes.innerHTML = ''; 

    if (availableCategories.length === 0) {
        categorySelection.classList.add('d-none');
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
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
    const strings = languageStrings[currentLanguage];
    const checkboxes = categoryCheckboxes.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const newState = !allChecked;
    checkboxes.forEach(cb => cb.checked = newState);
    toggleCategoriesBtn.textContent = newState ? strings.toggleCategoriesDeselect : strings.toggleCategoriesSelect; 
    updateStartButtonStatus();
});

// ======================================================
// LOAD CATEGORIES LOGIC (STEP 1: Load questions and show filter)
// ======================================================

loadCategoriesBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    
    questions = []; 
    allLoadedQuestions = [];
    categoryCheckboxes.innerHTML = '';
    
    loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading;
    loadCategoriesBtn.disabled = true;
    startBtn.disabled = true;

    let fetchPromise;

    if (onlyWrong.checked) {
        selectedQuizFiles = ['Fel frågor']; 
        fetchPromise = fetch("/wrong").then(r => r.json());
    } else {
        selectedQuizFiles = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
        if (selectedQuizFiles.length === 0) { 
            alert(strings.alertSelectFile);
            updateLoadButtonStatus(); 
            startBtn.disabled = false;
            return; 
        }
        fetchPromise = Promise.all(selectedQuizFiles.map(f => fetch(`/questions/${f}`).then(r => r.json()))).then(arrays => arrays.flat());
    }

    fetchPromise
        .then(allQ => {
            if (!allQ || allQ.length === 0) { 
                alert(strings.alertNoQuestions);
                loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
                return; 
            }
            
            allLoadedQuestions = allQ; 
            questions = allQ; 
            
            displayCategoryCheckboxes(allQ);
            loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoaded;
        })
        .catch(err => { 
            console.error("Error fetching questions:", err); 
            alert(strings.alertErrorFetching);
            loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading;
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
    const strings = languageStrings[currentLanguage];
    
    if (startBtn.disabled) return;
    
    // ----------------------------------------------------
    // MODE 1: DIRECT START - No questions are loaded yet.
    // ----------------------------------------------------
    if (allLoadedQuestions.length === 0) {
        
        const filesSelected = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).length > 0 || onlyWrong.checked;
        if (!filesSelected) { 
            alert(strings.alertSelectFileOrWrong);
            return; 
        }

        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading.replace('...', strings.buttonLoadCategoriesLoading); // Use loading text
        loadCategoriesBtn.disabled = true;
        startBtn.disabled = true;
        
        let fetchPromise;
        if (onlyWrong.checked) {
            selectedQuizFiles = ['Fel frågor'];
            fetchPromise = fetch("/wrong").then(r => r.json());
        } else {
            selectedQuizFiles = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
            fetchPromise = Promise.all(selectedQuizFiles.map(f => fetch(`/questions/${f}`).then(r => r.json()))).then(arrays => arrays.flat());
        }

        fetchPromise.then(allQ => {
            if (!allQ || allQ.length === 0) {
                alert(strings.alertNoQuestionsStart); 
                loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
                return;
            }
            
            allLoadedQuestions = allQ; 
            let questionsToUse = [...allLoadedQuestions]; 
            
            const num = parseInt(document.getElementById('numQuestions').value, 10);
            if (num && num < questionsToUse.length) {
                questionsToUse = shuffleArray(questionsToUse).slice(0, num);
            }
            
            questions = questionsToUse; 
            
            updateLoadButtonStatus(); 
            startQuiz();
            
        }).catch(err => {
            console.error("Error during direct start of questions:", err); 
            alert(strings.alertErrorFetching);
            loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading;
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
        selectedCategories.includes(q.category || strings.categoryOther)
    );

    if (filteredQuestions.length === 0) {
        alert(strings.alertNoCategoryMatch);
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
    updateLoadButtonStatus(); 
    
    startQuiz();
});


function startQuiz() {
    const strings = languageStrings[currentLanguage];
    if (questions.length === 0) {
        alert(strings.alertCriticalError);
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
    const strings = languageStrings[currentLanguage];
    const checkboxes = fileCheckboxesDiv.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const newState = !allChecked;
    checkboxes.forEach(cb => cb.checked = newState);
    toggleFilesBtn.textContent = newState ? strings.toggleFilesDeselect : strings.toggleFilesSelect;
    
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
    // Q.correct is a string for single-choice, array for multi-choice
    if (!currentQ || typeof currentQ.correct === 'string') return;

    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    const anyChecked = cbs.some(c => c.checked);
    
    multiSubmitBtn.disabled = !anyChecked;
}

// ======================================================
// SHOW QUESTION
// ======================================================
function showQuestion() {
    const q = questions[currentQuestion];
    const strings = languageStrings[currentLanguage];
    
    questionText.textContent = q.question;

    optionsDiv.innerHTML = '';
    explanationDiv.classList.add('d-none');
    nextBtn.classList.add('d-none'); 
    multiSubmitBtn.classList.add('d-none'); 
    nextBtn.textContent = strings.buttonNext; // Reset text

    questionStartTime = Date.now();

    // Determine if it is multi-choice by checking if q.correct is an array or string
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
            // SINGLE CHOICE
            input.addEventListener('change', () => checkAnswer(opt, optionItem, q));
        } else {
            // MULTI CHOICE
            input.addEventListener('change', updateMultiSubmitButtonStatus); 
        }
        
        fragment.appendChild(optionItem); 
    }
    
    optionsDiv.appendChild(fragment); 

    if (isMulti) {
        multiSubmitBtn.textContent = strings.buttonSubmit;
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
    const strings = languageStrings[currentLanguage];
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1); 

    Array.from(optionsDiv.querySelectorAll('input')).forEach(input => input.disabled = true);

    // Q.correct is a STRING here
    const isCorrect = (selected === q.correct);
    scoreList.push({ 
        category: q.category || strings.categoryOther, 
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

        explanationDiv.textContent = q.explanation || strings.explanationNone;
        explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// MULTI SELECT: Submit 
// ======================================================
function submitMulti(q) {
    const strings = languageStrings[currentLanguage];
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    
    if (multiSubmitBtn.disabled) return; 

    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    
    cbs.forEach(cb => cb.disabled = true);
    multiSubmitBtn.disabled = true; 

    // Q.correct is an ARRAY of strings here
    const selectedSet = new Set(cbs.filter(c => c.checked).map(c => c.value));
    const correctSet = new Set(q.correct || []);

    const isCorrect = setEquals(selectedSet, correctSet);
    scoreList.push({ 
        category: q.category || strings.categoryOther,
        correct: isCorrect,
        time: parseFloat(timeTaken)
    });

    Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => {
        const input = item.querySelector('input');
        if (!input) return;

        // Mark correct options
        if (q.correct.includes(input.value)) {
            item.classList.add('correct');
        } 
        
        // Mark selected, incorrect options
        if (input.checked && !q.correct.includes(input.value)) {
            item.classList.add('wrong');
        }
    });

    if (isCorrect) {
        multiSubmitBtn.textContent = strings.buttonCorrect;
        multiSubmitBtn.classList.remove('btn-primary');
        multiSubmitBtn.classList.add('btn-success-green');
        
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) showResult();
            else showQuestion();
        }, 600);

    } else {
        explanationDiv.textContent = q.explanation || strings.explanationNone;
        explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// RESULT + highscore save
// ======================================================
function showResult() {
    const strings = languageStrings[currentLanguage];
    
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

    const resultTotalStr = strings.resultTotal
        .replace('[CORRECT]', totalCorrect)
        .replace('[TOTAL]', totalQuestions)
        .replace('[PERCENT]', percentage);
        
    const resultTimeStr = strings.resultTime
        .replace('[TOTALTIME]', formattedTotalTime)
        .replace('[AVGTIME]', averageTime);

    document.getElementById('totalResult').innerHTML = `${resultTotalStr}<br>${resultTimeStr}`;

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
        data: { labels, datasets: [{ label: strings.chartLabel, data, backgroundColor: labels.map((_, i) => `rgba(${50 + i * 40},123,255,0.7)`), borderColor: 'rgba(0,0,0,1)', borderWidth: 1 }] },
        options: { scales: { y: { beginAtZero: true, max: Math.max(...totals) || 1 } } }
    });
}
