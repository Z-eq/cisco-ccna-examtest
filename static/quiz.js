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
let quizStartTime = 0; // Global tid för hela quizet

// --- Språkdata & Globalt språk ---
const languageStrings = {
    sv: {
        // Generellt & Info
        pageTitle: "CCNA - By Z",
        mainTitle: "CCNA Test - 200-301 v2.1",
        themeButtonText: "🌓 Byt Tema",
        langButtonText: "🇸🇪 Svenska",
        infoAlertTitle: "", 
        infoAlertText1: "Det finns cirka <strong>680</strong> unika frågor totalt.",
        infoAlertText2: "Filerna märkta <strong>Final</strong> innehåller lite svårare och dem mer relevanta frågorna från hela frågebanken.",
        infoAlertText3: "Koden för denna quiz finns på min <a href='https://github.com/Z-eq/cisco-ccna-examtest' target='_blank'>GitHub</a>.",
        
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
        
        // NYA STRÄNGAR FÖR TAGGAR
        buttonTagsShow: "🔖 Visa taggade frågor",
        buttonTagsHide: "Dölj taggade frågor",
        tagsLoading: "<em>Laddar sparade taggar...</em>",
        tagsNone: "<em>Inga taggade frågor hittades.</em>",

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
        chartLabel: "Resultat per kategori", 
        buttonRestart: "🔁 Starta om",
        
        // Modal
        abortModalTitle: "Avbryt quiz?",
        abortModalBody: "Vill du rätta de frågor du redan svarat på innan du avslutar, eller återgå till startskärmen?",
        abortWithScore: "Rätta och visa resultat", 
        abortWithoutScore: "Återgå till start",   
        tagModalTitle: "Tagga Fråga och Lägg till Kommentar", 
        tagQuestionLabel: "Fråga:", 
        tagCommentLabel: "Dina anteckningar/kommentar:", 
        tagButtonCancel: "Avbryt", 
        tagButtonSave: "Spara Tagg och Kommentar", 
        tagButtonText: "🔖 Tagga för senare",
        
        // Toggles
        toggleFilesSelect: "Markera alla",
        toggleFilesDeselect: "Avmarkera alla",
        toggleCategoriesSelect: "Markera alla kategorier",
        toggleCategoriesDeselect: "Avmarkera alla kategorier",
    },
    en: {
        // Generellt & Info
        pageTitle: "CCNA - By Z",
        mainTitle: "CCNA Test - 200-301 v2.1",
        themeButtonText: "🌓 Toggle Theme",
        langButtonText: "🇬🇧 English",
        infoAlertTitle: "", 
        infoAlertText1: "There are approximately <strong>680</strong> unique questions in total.",
        infoAlertText2: "Files labeled <strong>Final</strong> contain slightly harder and more relevant questions from the entire question bank.",
        infoAlertText3: "The code for this quiz can be found on my <a href='https://github.com/Z-eq/cisco-ccna-examtest' target='_blank'>GitHub</a>.",
        
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

        // NEW STRINGS FOR TAGS
        buttonTagsShow: "🔖 Show Tagged Questions",
        buttonTagsHide: "Hide Tagged Questions",
        tagsLoading: "<em>Loading saved tags...</em>",
        tagsNone: "<em>No tagged questions found.</em>",

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
        chartLabel: "Results per Category",
        buttonRestart: "🔁 Restart Quiz",
        
        // Modal
        abortModalTitle: "Abort Quiz?",
        abortModalBody: "Do you want to score the questions you've already answered before quitting, or return to the start screen?",
        abortWithScore: "Score and show results", 
        abortWithoutScore: "Return to start",  
        tagModalTitle: "Tag Question and Add Comment", 
        tagQuestionLabel: "Question:", 
        tagCommentLabel: "Your notes/comment:", 
        tagButtonCancel: "Cancel", 
        tagButtonSave: "Save Tag and Comment", 
        tagButtonText: "🔖 Tag for Later",
        
        // Toggles
        toggleFilesSelect: "Select all",
        toggleFilesDeselect: "Deselect all",
        toggleCategoriesSelect: "Select all categories",
        toggleCategoriesDeselect: "Deselect all categories",
    }
};

let currentLanguage = 'sv'; 
const infoAlert = document.getElementById('infoAlert'); 

// DOM References
const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');

const startBtn = document.getElementById('startBtn'); 
const loadCategoriesBtn = document.getElementById('loadCategoriesBtn'); 
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const tagBtn = document.getElementById('tagBtn'); 
const confirmTagBtn = document.getElementById('confirmTagBtn'); 
const tagQuestionText = document.getElementById('tagQuestionText'); 
const tagCommentTextarea = document.getElementById('tagCommentTextarea'); 
const tagModalTitle = document.getElementById('tagModalTitle'); 
const tagQuestionLabel = document.getElementById('tagQuestionLabel'); 
const tagCommentLabel = document.getElementById('tagCommentLabel'); 
const tagCancelBtn = document.getElementById('tagCancelBtn'); 

const abortWithScoreBtn = document.getElementById('abortWithScore');
const abortWithoutScoreBtn = document.getElementById('abortWithoutScore');

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

// NYA REFERENSER FÖR TAG-VISNING
const tagsDiv = document.getElementById('tagsDiv');
const tagsContent = document.getElementById('tagsContent');
const showTagsBtn = document.getElementById('showTagsBtn');

const multiSubmitBtn = document.getElementById('multiSubmitBtn'); 

const categorySelection = document.getElementById('categorySelection');
const categoryCheckboxes = document.getElementById('categoryCheckboxes');
const toggleCategoriesBtn = document.getElementById('toggleCategoriesBtn');

const languageToggleBtn = document.getElementById('languageToggle'); 

// Modal instanser
let tagModal = null; 
let currentQuestionToTag = null; 

// ======================================================
// LANGUAGE HANDLING
// ======================================================

function updateUI(lang) {
    const strings = languageStrings[lang];
    
    document.getElementById('pageTitle').textContent = strings.pageTitle;
    document.getElementById('mainTitle').textContent = strings.mainTitle;
    document.getElementById('themeToggle').textContent = strings.themeButtonText;
    document.getElementById('languageToggle').textContent = (lang === 'sv') ? languageStrings['en'].langButtonText : languageStrings['sv'].langButtonText;
    document.documentElement.lang = lang;

    infoAlert.innerHTML = `
        <ul class="list-unstyled text-start mx-auto" style="max-width: 800px;"> 
            <li>• ${strings.infoAlertText1}</li>
            <li>• ${strings.infoAlertText2}</li>
            <li>• ${strings.infoAlertText3}</li>
        </ul>
    `;

    document.getElementById('card1Header').textContent = strings.card1Header;
    document.getElementById('checkboxLabelWrong').textContent = strings.checkboxLabelWrong;
    
    const isFilesDeselectMode = toggleFilesBtn.dataset.mode === 'deselect';
    toggleFilesBtn.textContent = isFilesDeselectMode ? strings.toggleFilesDeselect : strings.toggleFilesSelect;
    
    document.getElementById('card2Header').textContent = strings.card2Header;
    
    if (!onlyWrong.checked) {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesDefault;
    } else {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesWrong;
    }
    
    document.getElementById('categoriesAvailable').textContent = strings.categoriesAvailable;
    
    const isCatDeselectMode = toggleCategoriesBtn.dataset.mode === 'deselect';
    toggleCategoriesBtn.textContent = isCatDeselectMode ? strings.toggleCategoriesDeselect : strings.toggleCategoriesSelect;
    
    document.getElementById('card3Header').textContent = strings.card3Header;
    document.getElementById('labelNumQuestions').textContent = strings.labelNumQuestions;
    document.getElementById('startBtn').textContent = strings.buttonStart;
    
    document.getElementById('showHighscoresBtn').textContent = (highscoresDiv.style.display === 'block') ? strings.buttonHighscoresHide : strings.buttonHighscoresShow;
    
    // UPPPDATERA TAGG-KNAPP TEXT
    if (showTagsBtn) {
        showTagsBtn.textContent = (tagsDiv.style.display === 'block') ? strings.buttonTagsHide : strings.buttonTagsShow;
    }

    document.getElementById('abortBtn').textContent = strings.abortButton;
    nextBtn.textContent = strings.buttonNext;
    multiSubmitBtn.textContent = strings.buttonSubmit;
    
    document.getElementById('resultTitle').textContent = strings.resultTitle;
    document.getElementById('restartBtn').textContent = strings.buttonRestart;
    
    document.getElementById('abortModalTitle').textContent = strings.abortModalTitle;
    document.getElementById('abortModalBody').textContent = strings.abortModalBody;
    
    if (abortWithScoreBtn) abortWithScoreBtn.textContent = strings.abortWithScore; 
    if (abortWithoutScoreBtn) abortWithoutScoreBtn.textContent = strings.abortWithoutScore; 
    
    if (tagModalTitle) tagModalTitle.textContent = strings.tagModalTitle; 
    if (tagQuestionLabel) tagQuestionLabel.textContent = strings.tagQuestionLabel; 
    if (tagCommentLabel) tagCommentLabel.textContent = strings.tagCommentLabel; 
    if (tagCancelBtn) tagCancelBtn.textContent = strings.tagButtonCancel; 
    
    if (confirmTagBtn) confirmTagBtn.textContent = strings.tagButtonSave; 
    if (tagBtn) tagBtn.textContent = strings.tagButtonText; 
    
    updateProgress();
    
    if (highscoresDiv.style.display === 'block') {
        fetchAndDisplayHighscores(true, false); 
    }
}

languageToggleBtn.addEventListener('click', () => {
    currentLanguage = (currentLanguage === 'sv') ? 'en' : 'sv';
    updateUI(currentLanguage);
    localStorage.setItem('quizLanguage', currentLanguage);
});

// ======================================================
// UTILS
// ======================================================

function getDisplayDateTime(dateObj) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return dateObj.toLocaleString(currentLanguage === 'sv' ? 'sv-SE' : 'en-US', options).replace(',', ''); 
}

function formatTime(totalSeconds) {
    const strings = languageStrings[currentLanguage];
    const timeHeader = strings.highscoresHeader3;
    if (!totalSeconds || isNaN(totalSeconds)) return timeHeader.includes('⏱️') ? timeHeader.replace('⏱️ ', '0s') : '0s'; 
    
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
    
    if (total > 0 && current < total) {
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

function saveHighscore(scorePercentage, scoreTotalStr, time, dateAndTime, files) {
    fetch('/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateAndTime, score: scorePercentage, total: scoreTotalStr, time: parseFloat(time), files: files })
    }).catch(err => console.error("Could not save highscore:", err));
}

// ======================================================
// HIGHSCORES LOADING
// ======================================================

async function fetchAndDisplayHighscores(show = true, toggleVisibility = true) {
    const strings = languageStrings[currentLanguage];
    if (toggleVisibility && show && highscoresDiv.style.display === 'block') {
        highscoresDiv.style.display = 'none';
        showHighscoresBtn.textContent = strings.buttonHighscoresShow;
        return;
    }
    
    if (show) {
        highscoresDiv.innerHTML = `<p>${strings.highscoresLoading}</p>`;
        if (toggleVisibility) showHighscoresBtn.textContent = strings.buttonHighscoresHide;
    }

    try {
        const res = await fetch('/highscores');
        const data = await res.json();
        let html = '';
        if (!data || data.length === 0) {
            html = `<p>${strings.highscoresNone}</p>`;
        } else {
            html = `<table class="table table-striped table-sm"><thead><tr><th>${strings.highscoresHeader1}</th><th>${strings.highscoresHeader2}</th><th>${strings.highscoresHeader3}</th><th>${strings.highscoresHeader4}</th></tr></thead><tbody>`;
            data.sort((a, b) => {
                const timeA = parseFloat(a.time) || 9999;
                const timeB = parseFloat(b.time) || 9999;
                if (timeA !== timeB) return timeA - timeB; 
                return (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0); 
            });
            data.forEach((h) => {
                const scoreDisplay = h.score !== undefined && h.total !== undefined ? `${h.score}% (${h.total})` : 'N/A';
                const timeDisplay = formatTime(h.time); 
                const filesDisplay = (h.files && Array.isArray(h.files) ? h.files.join(', ') : (h.files || 'N/A')); 
                html += `<tr><td>${h.date}</td><td>${scoreDisplay}</td><td>${timeDisplay}</td><td title="${filesDisplay}">${filesDisplay}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        highscoresDiv.innerHTML = html;
        if (show) {
            highscoresDiv.style.display = 'block';
            if (toggleVisibility) showHighscoresBtn.textContent = strings.buttonHighscoresHide;
        } else {
            highscoresDiv.style.display = 'none';
            if (toggleVisibility) showHighscoresBtn.textContent = strings.buttonHighscoresShow;
        }
    } catch (err) {
        highscoresDiv.innerHTML = `<p class="text-danger">${strings.highscoresError}</p>`;
        if (show) highscoresDiv.style.display = 'block';
    }
}

showHighscoresBtn.addEventListener('click', () => fetchAndDisplayHighscores(true, true)); 

// ======================================================
// FETCH FILES & START LOGIC
// ======================================================

function updateStartButtonStatus() {
    const filesSelected = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0 || onlyWrong.checked;
    if (categorySelection.classList.contains('d-none')) {
        startBtn.disabled = !filesSelected;
    } else {
        const selectedCategories = Array.from(categoryCheckboxes.querySelectorAll('input:checked')).length > 0;
        startBtn.disabled = !selectedCategories;
    }
}

function updateLoadButtonStatus() {
    const strings = languageStrings[currentLanguage];
    const selectedFiles = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0;
    loadCategoriesBtn.disabled = !(onlyWrong.checked || selectedFiles);
    loadCategoriesBtn.textContent = onlyWrong.checked ? strings.buttonLoadCategoriesWrong : strings.buttonLoadCategoriesDefault;
}

categoryCheckboxes.addEventListener('change', updateStartButtonStatus);
onlyWrong.addEventListener('change', () => { updateLoadButtonStatus(); updateStartButtonStatus(); });

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('quizLanguage');
    if (savedLang && languageStrings.hasOwnProperty(savedLang)) currentLanguage = savedLang;
    updateUI(currentLanguage);

    fetch("/files")
        .then(res => res.json())
        .then(files => {
            files.forEach(f => {
                const div = document.createElement('div');
                div.className = "form-check";
                div.innerHTML = `<input class="form-check-input" type="checkbox" value="${f}" id="${f}" checked><label class="form-check-label" for="${f}">${f}</label>`;
                div.querySelector('input').addEventListener('change', () => {
                    questions = []; allLoadedQuestions = [];
                    categorySelection.classList.add('d-none');
                    categoryCheckboxes.innerHTML = '';
                    loadCategoriesBtn.classList.remove('btn-success');
                    updateStartButtonStatus(); updateLoadButtonStatus();
                });
                fileCheckboxesDiv.appendChild(div);
            });
        })
        .finally(() => {
            updateLoadButtonStatus(); updateStartButtonStatus();
            fetchAndDisplayHighscores(false, false); 
        });
    tagModal = new bootstrap.Modal(document.getElementById('tagModal'));
});

function displayCategoryCheckboxes(allQ) {
    const strings = languageStrings[currentLanguage];
    const categories = new Set();
    allQ.forEach(q => categories.add(q.category || strings.categoryOther));
    const availableCategories = Array.from(categories).sort();
    categoryCheckboxes.innerHTML = ''; 
    if (availableCategories.length === 0) {
        categorySelection.classList.add('d-none');
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
        return;
    }
    availableCategories.forEach(cat => {
        const div = document.createElement('div');
        div.className = "form-check";
        const catId = `cat-${cat.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
        div.innerHTML = `<input class="form-check-input" type="checkbox" value="${cat}" id="${catId}" checked><label class="form-check-label" for="${catId}">${cat}</label>`;
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
    toggleCategoriesBtn.dataset.mode = newState ? 'deselect' : 'select';
    toggleCategoriesBtn.textContent = newState ? strings.toggleCategoriesDeselect : strings.toggleCategoriesSelect; 
    updateStartButtonStatus();
});

loadCategoriesBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    questions = []; allLoadedQuestions = []; categoryCheckboxes.innerHTML = '';
    loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading;
    loadCategoriesBtn.disabled = true; startBtn.disabled = true;
    let fetchPromise;
    if (onlyWrong.checked) {
        selectedQuizFiles = ['Fel frågor'];
        fetchPromise = fetch("/wrong").then(r => r.json()).then(qs => qs.map(q => ({...q, sourceFile: 'wrong.json'})));
    } else {
        const filesToFetch = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
        if (filesToFetch.length === 0) { alert(strings.alertSelectFile); updateLoadButtonStatus(); startBtn.disabled = false; return; }
        selectedQuizFiles = filesToFetch;
        fetchPromise = Promise.all(filesToFetch.map(f => fetch(`/questions/${f}`).then(r => r.json()).then(qs => qs.map(q => ({...q, sourceFile: f}))))).then(arrays => arrays.flat());
    }
    fetchPromise.then(allQ => {
        if (!allQ || allQ.length === 0) { alert(strings.alertNoQuestions); return; }
        let uniqueQuestions = {};
        allQ.forEach(q => { const key = q.question.toLowerCase().trim(); if (!uniqueQuestions[key]) uniqueQuestions[key] = q; });
        allLoadedQuestions = Object.values(uniqueQuestions);
        questions = allLoadedQuestions;
        displayCategoryCheckboxes(allLoadedQuestions);
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoaded + ` (${allLoadedQuestions.length})`;
        loadCategoriesBtn.classList.add('btn-success');
    }).finally(() => { loadCategoriesBtn.disabled = false; startBtn.disabled = false; });
});

startBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    if (startBtn.disabled) return;
    if (allLoadedQuestions.length === 0) {
        const filesSelected = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).length > 0 || onlyWrong.checked;
        if (!filesSelected) { alert(strings.alertSelectFileOrWrong); return; }
        loadCategoriesBtn.click(); // Trigger load
        setTimeout(() => { if (allLoadedQuestions.length > 0) startQuiz(); }, 1000);
        return; 
    }
    const selectedCategories = Array.from(categoryCheckboxes.querySelectorAll('input:checked')).map(cb => cb.value);
    let filteredQuestions = allLoadedQuestions.filter(q => selectedCategories.includes(q.category || strings.categoryOther));
    if (filteredQuestions.length === 0) { alert(strings.alertNoCategoryMatch); return; }
    let questionsToUse = [...filteredQuestions];
    const num = parseInt(document.getElementById('numQuestions').value, 10);
    if (num && num < questionsToUse.length) questionsToUse = shuffleArray(questionsToUse).slice(0, num);
    questions = questionsToUse;
    startQuiz();
});

function startQuiz() {
    if (questions.length === 0) return;
    currentQuestion = 0; scoreList = []; quizStartTime = Date.now();
    startScreen.classList.add('d-none'); quizScreen.classList.remove('d-none'); resultScreen.classList.add('d-none'); infoAlert.classList.add('d-none'); 
    questions = shuffleArray(questions); showQuestion();
}

nextBtn.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion >= questions.length) showResult(); else showQuestion();
});

restartBtn.addEventListener('click', () => {
    questions = []; allLoadedQuestions = []; categorySelection.classList.add('d-none'); categoryCheckboxes.innerHTML = '';
    resultScreen.classList.add('d-none'); startScreen.classList.remove('d-none'); infoAlert.classList.remove('d-none'); 
    updateLoadButtonStatus(); updateStartButtonStatus(); loadCategoriesBtn.classList.remove('btn-success'); 
});

const abortModal = new bootstrap.Modal(document.getElementById('abortModal'));
document.getElementById('abortBtn').addEventListener('click', () => abortModal.show());
document.getElementById('abortWithScore').addEventListener('click', () => { abortModal.hide(); showResult(); });
document.getElementById('abortWithoutScore').addEventListener('click', () => { abortModal.hide(); quizScreen.classList.add('d-none'); startScreen.classList.remove('d-none'); infoAlert.classList.remove('d-none'); });

toggleFilesBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    const checkboxes = fileCheckboxesDiv.querySelectorAll("input[type='checkbox']");
    const newState = !Array.from(checkboxes).every(cb => cb.checked);
    checkboxes.forEach(cb => cb.checked = newState);
    toggleFilesBtn.dataset.mode = newState ? 'deselect' : 'select';
    toggleFilesBtn.textContent = newState ? strings.toggleFilesDeselect : strings.toggleFilesSelect;
    updateLoadButtonStatus(); updateStartButtonStatus();
});

function updateMultiSubmitButtonStatus() {
    multiSubmitBtn.disabled = !Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]')).some(c => c.checked);
}

function tagQuestion(q) {
    currentQuestionToTag = q;
    tagQuestionText.textContent = q.question;
    tagCommentTextarea.value = '';
    confirmTagBtn.textContent = languageStrings[currentLanguage].tagButtonSave;
    tagModal.show();
}

confirmTagBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    if (!currentQuestionToTag) return;
    const comment = tagCommentTextarea.value.trim();
    confirmTagBtn.disabled = true;
    fetch('/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: currentQuestionToTag.question, category: currentQuestionToTag.category || strings.categoryOther, source: currentQuestionToTag.sourceFile || 'Unknown', comment: comment })
    }).then(() => {
        tagModal.hide();
        tagBtn.textContent = "✅ Taggad";
    }).finally(() => { confirmTagBtn.disabled = false; });
});

function showQuestion() {
    const q = questions[currentQuestion];
    const strings = languageStrings[currentLanguage];
    tagBtn.textContent = strings.tagButtonText;
    tagBtn.onclick = () => tagQuestion(q);
    questionText.textContent = q.question;
    optionsDiv.innerHTML = ''; explanationDiv.classList.add('d-none'); nextBtn.classList.add('d-none'); multiSubmitBtn.classList.add('d-none');
    questionStartTime = Date.now();
    const isMulti = Array.isArray(q.correct);
    let shuffledOptions = shuffleArray([...q.options]);
    shuffledOptions.forEach((opt, idx) => {
        const label = document.createElement('label'); label.className = 'option-item';
        const input = document.createElement('input'); input.type = isMulti ? 'checkbox' : 'radio'; input.name = 'questionOptions'; input.value = opt;
        label.appendChild(input); label.appendChild(document.createTextNode(`${String.fromCharCode(65 + idx)}. ${opt}`));
        if (!isMulti) input.addEventListener('change', () => checkAnswer(opt, label, q));
        else input.addEventListener('change', updateMultiSubmitButtonStatus);
        optionsDiv.appendChild(label);
    });
    if (isMulti) {
        multiSubmitBtn.classList.remove('d-none'); multiSubmitBtn.disabled = true;
        multiSubmitBtn.onclick = () => submitMulti(q);
    }
    updateProgress();
}

function checkAnswer(selected, label, q) {
    const strings = languageStrings[currentLanguage];
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    Array.from(optionsDiv.querySelectorAll('input')).forEach(i => i.disabled = true);
    const isCorrect = (selected === q.correct);
    scoreList.push({ category: q.category || strings.categoryOther, correct: isCorrect, time: parseFloat(timeTaken) });
    if (isCorrect) {
        label.classList.add('correct');
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        setTimeout(() => { currentQuestion++; if (currentQuestion >= questions.length) showResult(); else showQuestion(); }, 600);
    } else {
        label.classList.add('wrong');
        Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => { if (item.querySelector('input').value === q.correct) item.classList.add('correct'); });
        explanationDiv.textContent = q.explanation || strings.explanationNone; explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        nextBtn.classList.remove('d-none');
    }
}

function submitMulti(q) {
    const strings = languageStrings[currentLanguage];
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    const correctSet = new Set(q.correct);
    const isCorrect = setEquals(new Set(cbs.filter(c => c.checked).map(c => c.value)), correctSet);
    scoreList.push({ category: q.category || strings.categoryOther, correct: isCorrect, time: parseFloat(timeTaken) });
    cbs.forEach(cb => {
        const parent = cb.parentElement;
        if (correctSet.has(cb.value)) parent.classList.add('correct');
        if (cb.checked && !correctSet.has(cb.value)) parent.classList.add('wrong');
        cb.disabled = true;
    });
    if (isCorrect) {
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        setTimeout(() => { currentQuestion++; if (currentQuestion >= questions.length) showResult(); else showQuestion(); }, 600);
    } else {
        explanationDiv.textContent = q.explanation || strings.explanationNone; explanationDiv.classList.remove('d-none');
        fetch("/wrong/add", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });
        nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// RESULT SCREEN & CHART LOGIC (FIXAD VERSION)
// ======================================================
function showResult() {
    const strings = languageStrings[currentLanguage];
    quizScreen.classList.add('d-none'); 
    resultScreen.classList.remove('d-none');
    
    let totalCorrect = 0;
    let totalTime = 0;
    const catData = {};

    scoreList.forEach(s => {
        totalTime += s.time;
        if (s.correct) totalCorrect++;

        if (!catData[s.category]) {
            catData[s.category] = { correct: 0, total: 0 };
        }
        catData[s.category].total++;
        if (s.correct) catData[s.category].correct++;
    });

    const perc = scoreList.length ? (totalCorrect / scoreList.length * 100).toFixed(1) : 0;
    const avgTime = scoreList.length ? (totalTime / scoreList.length).toFixed(1) : 0;

    const resultTotalStr = strings.resultTotal
        .replace('[CORRECT]', totalCorrect)
        .replace('[TOTAL]', scoreList.length)
        .replace('[PERCENT]', perc);
    
    const resultTimeStr = strings.resultTime
        .replace('[TOTALTIME]', formatTime(totalTime))
        .replace('[AVGTIME]', avgTime);

    document.getElementById('totalResult').innerHTML = `
        <h4 class="mb-3">${resultTotalStr}</h4>
        <p class="mb-4">${resultTimeStr}</p>
    `;

    const chartCanvas = document.getElementById('categoryChart');
    const chartContainer = chartCanvas.parentElement;
    chartContainer.style.height = "450px"; 
    chartContainer.style.position = "relative";

    const ctx = chartCanvas.getContext('2d');
    const labels = Object.keys(catData);
    const correctData = labels.map(l => catData[l].correct);
    const wrongData = labels.map(l => catData[l].total - catData[l].correct);

    if (chart) {
        chart.destroy();
    }

    const isDarkMode = document.body.classList.contains('dark-theme') || document.body.classList.contains('dark');
    const textColor = isDarkMode ? '#f8f9fa' : '#212529';

    // FIX FÖR SPRÅK I GRAFEN:
    const labelCorrect = currentLanguage === 'sv' ? 'Rätt' : 'Correct';
    const labelWrong = currentLanguage === 'sv' ? 'Fel' : 'Wrong';

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: labelCorrect, // Använder variabeln istället för hårdkodad text
                    data: correctData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: labelWrong, // Använder variabeln istället för hårdkodad text
                    data: wrongData,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: textColor } },
                title: { display: true, text: strings.chartLabel, color: textColor }
            },
            scales: {
                x: { 
                    stacked: true, 
                    beginAtZero: true,
                    ticks: { color: textColor, stepSize: 1 } 
                },
                y: { 
                    stacked: true, 
                    ticks: { color: textColor } 
                }
            }
        }
    });

    saveHighscore(Math.round(perc), `${totalCorrect}/${scoreList.length}`, totalTime, getDisplayDateTime(new Date()), selectedQuizFiles);
}
// NY FUNKTION FÖR ATT VISA/DÖLJA SPARADE TAGGAR
async function toggleTagsVisibility() {
    const strings = languageStrings[currentLanguage];
    if (tagsDiv.style.display === 'block') {
        tagsDiv.style.display = 'none';
        showTagsBtn.textContent = strings.buttonTagsShow;
        return;
    }
    tagsDiv.style.display = 'block';
    showTagsBtn.textContent = strings.buttonTagsHide;
    tagsContent.innerHTML = `<p>${strings.tagsLoading}</p>`;
    try {
        const res = await fetch('/tags');
        const data = await res.json();
        if (data.success && data.content) {
            tagsContent.innerHTML = `<pre class="p-3 bg-dark text-warning border border-warning rounded" style="white-space: pre-wrap; font-family: monospace; font-size: 0.85rem; text-align: left; max-height: 400px; overflow-y: auto;">${data.content}</pre>`;
        } else {
            tagsContent.innerHTML = `<p>${strings.tagsNone}</p>`;
        }
    } catch (err) {
        tagsContent.innerHTML = `<p class="text-danger">Error fetching tags.</p>`;
    }
}

if (showTagsBtn) {
    showTagsBtn.addEventListener('click', toggleTagsVisibility);
}
