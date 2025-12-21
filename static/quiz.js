// static/quiz.js
let allLoadedQuestions = []; 
let questions = []; 
let scoreList = [];
let currentQuestion = 0; 
let questionStartTime = 0; 
let selectedQuizFiles = []; 
let chart = null; 
let quizStartTime = 0; 
let tagModal = null; 
let abortModalInstance = null;
let currentQuestionToTag = null; 

const languageStrings = {
    sv: {
        pageTitle: "CCNA - By Z",
        mainTitle: "CCNA Test - 200-301 v2.1",
        themeButtonText: "🌓 Byt Tema",
        langButtonText: "🇸🇪 Svenska",
        infoAlertText1: "",
        infoAlertText2: "Filerna märkta <strong>Final</strong> innehåller lite svårare och mer relevanta frågor.",
        infoAlertText3: "Koden finns på min <a href='https://github.com/Z-eq/cisco-ccna-examtest' target='_blank'>GitHub</a>.",
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
        buttonHighscoresShow: "🌟 Visa highscores",
        buttonHighscoresHide: "Dölj highscores",
        buttonTagsShow: "📌 Visa taggade frågor",
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
        alertErrorFetching: "Fel vid hämtning av frågor.",
        alertNoCategoryMatch: "Inga frågor matchade de valda kategorierna.",
        alertCriticalError: "Kritiskt fel: Inga frågor att starta quizet med.",
        questionOfTotal: "Fråga [CURRENT] av [TOTAL]",
        abortButton: "⏹ Avbryt quiz",
        buttonNext: "Nästa fråga",
        buttonSubmit: "✅ Skicka svar",
        explanation: "Förklaring",
        explanationNone: "Ingen förklaring",
        categoryOther: "Övrigt/Saknar Kategori",
        resultTitle: "📊 Resultat",
        resultTotal: "🎯 Totalt: [CORRECT]/[TOTAL] ([PERCENT]%)",
        resultTime: "⏱️ **Total Tid:** [TOTALTIME] (Snitt per fråga: [AVGTIME]s)",
        chartLabel: "Resultat per kategori", 
        buttonRestart: "🔁 Starta om",
        abortModalTitle: "Avbryt quiz?",
        abortModalBody: "Vill du rätta de frågor du redan svarat på innan du avslutar, eller återgå till startskärmen?",
        abortWithScore: "Rätta och visa resultat", 
        abortWithoutScore: "Återgå till start",   
        tagModalTitle: "Tagga Fråga och Lägg till Kommentar", 
        tagQuestionLabel: "Fråga:", 
        tagCommentLabel: "Dina anteckningar/kommentar:", 
        tagButtonCancel: "Avbryt", 
        tagButtonSave: "Spara Tagg och Kommentar", 
        tagButtonText: "📌 Tagga för senare",
        toggleFilesSelect: "Markera alla",
        toggleFilesDeselect: "Avmarkera alla",
        toggleCategoriesSelect: "Markera alla kategorier",
        toggleCategoriesDeselect: "Avmarkera alla kategorier",
        tipsHeader: "💡 Tips - Fokusera på följande områden:",
        deepDive: "Summering",
        yourAnswer: "Ditt:",
        correctAnswer: "Rätt:",
        missesText: "missar",
        fileCountText: "frågor"
    },
    en: {
        pageTitle: "CCNA - By Z",
        mainTitle: "CCNA Test - 200-301 v2.1",
        themeButtonText: "🌓 Toggle Theme",
        langButtonText: "🇬🇧 English",
        infoAlertText1: "",
        infoAlertText2: "Files labeled <strong>Final</strong> contain slightly harder questions.",
        infoAlertText3: "The code can be found on my <a href='https://github.com/Z-eq/cisco-ccna-examtest' target='_blank'>GitHub</a>.",
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
        buttonHighscoresShow: "🌟 Show Highscores",
        buttonHighscoresHide: "Hide Highscores",
        buttonTagsShow: "📌 Show Tagged Questions",
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
        alertErrorFetching: "Error fetching questions.",
        alertNoCategoryMatch: "No questions matched the selected categories.",
        alertCriticalError: "Critical error: No questions to start the quiz with.",
        questionOfTotal: "Question [CURRENT] of [TOTAL]",
        abortButton: "⏹ Abort Quiz",
        buttonNext: "Next Question",
        buttonSubmit: "✅ Submit Answer",
        explanation: "Explanation",
        explanationNone: "No explanation provided",
        categoryOther: "Other/Missing Category",
        resultTitle: "📊 Results",
        resultTotal: "🎯 Total: [CORRECT]/[TOTAL] ([PERCENT]%)",
        resultTime: "⏱️ **Total Time:** [TOTALTIME] (Avg per question: [AVGTIME]s)",
        chartLabel: "Results per Category",
        buttonRestart: "🔁 Restart Quiz",
        abortModalTitle: "Abort Quiz?",
        abortModalBody: "Do you want to score the questions already answered, or return to start?",
        abortWithScore: "Score and show results", 
        abortWithoutScore: "Return to start",  
        tagModalTitle: "Tag Question and Add Comment", 
        tagQuestionLabel: "Question:", 
        tagCommentLabel: "Your notes/comment:", 
        tagButtonCancel: "Cancel", 
        tagButtonSave: "Save Tag and Comment", 
        tagButtonText: "📌 Tag for Later",
        toggleFilesSelect: "Select all",
        toggleFilesDeselect: "Deselect all",
        toggleCategoriesSelect: "Select all categories",
        toggleCategoriesDeselect: "Deselect all categories",
        tipsHeader: "🍏 Tips - Focus on the following areas:",
        deepDive: "Summary",
        yourAnswer: "Your:",
        correctAnswer: "Correct:",
        missesText: "misses",
        fileCountText: "questions"
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
const abortBtn = document.getElementById('abortBtn');
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
const tagsDiv = document.getElementById('tagsDiv');
const tagsContent = document.getElementById('tagsContent');
const showTagsBtn = document.getElementById('showTagsBtn');
const multiSubmitBtn = document.getElementById('multiSubmitBtn'); 
const categorySelection = document.getElementById('categorySelection');
const categoryCheckboxes = document.getElementById('categoryCheckboxes');
const toggleCategoriesBtn = document.getElementById('toggleCategoriesBtn');
const languageToggleBtn = document.getElementById('languageToggle'); 
const themeToggleBtn = document.getElementById('themeToggle');

// Global state for counts
let fileQuestionCounts = {};

// ======================================================
// UTILS & HELPERS
// ======================================================

function updateUI(lang) {
    const strings = languageStrings[lang];
    document.getElementById('pageTitle').textContent = strings.pageTitle;
    document.getElementById('mainTitle').textContent = strings.mainTitle;
    if (themeToggleBtn) themeToggleBtn.textContent = strings.themeButtonText;
    languageToggleBtn.textContent = (lang === 'sv') ? languageStrings['en'].langButtonText : languageStrings['sv'].langButtonText;
    document.documentElement.lang = lang;
document.getElementById('infoAlert').innerHTML = `
    <span class="footer-item">• ${strings.infoAlertText2}</span> 
    <span class="footer-divider">|</span> 
    <span class="footer-item">• ${strings.infoAlertText3}</span>
`;
    document.getElementById('card1Header').textContent = strings.card1Header;
    document.getElementById('checkboxLabelWrong').textContent = strings.checkboxLabelWrong;
    
    const fileInputs = Array.from(fileCheckboxesDiv.querySelectorAll('input'));
    const allFilesChecked = fileInputs.length > 0 && fileInputs.every(i => i.checked);
    toggleFilesBtn.textContent = allFilesChecked ? strings.toggleFilesDeselect : strings.toggleFilesSelect;

    for (const [fileName, count] of Object.entries(fileQuestionCounts)) {
        const countSpan = document.getElementById(`count-${fileName.replace(/\./g, '_')}`);
        if (countSpan) {
            countSpan.textContent = `(${count} ${strings.fileCountText})`;
        }
    }

    document.getElementById('card2Header').textContent = strings.card2Header;
    if (allLoadedQuestions.length > 0) {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoaded + ` (${allLoadedQuestions.length})`;
    } else {
        loadCategoriesBtn.textContent = onlyWrong.checked ? strings.buttonLoadCategoriesWrong : strings.buttonLoadCategoriesDefault;
    }
    
    document.getElementById('categoriesAvailable').textContent = strings.categoriesAvailable;
    const catInputs = Array.from(categoryCheckboxes.querySelectorAll('input'));
    const allCatsChecked = catInputs.length > 0 && catInputs.every(i => i.checked);
    toggleCategoriesBtn.textContent = allCatsChecked ? strings.toggleCategoriesDeselect : strings.toggleCategoriesSelect;

    document.getElementById('card3Header').textContent = strings.card3Header;
    document.getElementById('labelNumQuestions').textContent = strings.labelNumQuestions;
    startBtn.textContent = strings.buttonStart;
    showHighscoresBtn.textContent = (highscoresDiv.style.display === 'block') ? strings.buttonHighscoresHide : strings.buttonHighscoresShow;
    if (showTagsBtn) showTagsBtn.textContent = (tagsDiv.style.display === 'block') ? strings.buttonTagsHide : strings.buttonTagsShow;
    
    abortBtn.textContent = strings.abortButton;
    nextBtn.textContent = strings.buttonNext;
    multiSubmitBtn.textContent = strings.buttonSubmit;
    document.getElementById('resultTitle').textContent = strings.resultTitle;
    restartBtn.textContent = strings.buttonRestart;
    
    document.getElementById('abortModalTitle').textContent = strings.abortModalTitle;
    document.getElementById('abortModalBody').textContent = strings.abortModalBody;
    abortWithScoreBtn.textContent = strings.abortWithScore;
    abortWithoutScoreBtn.textContent = strings.abortWithoutScore;
    
    if (tagModalTitle) tagModalTitle.textContent = strings.tagModalTitle;
    if (confirmTagBtn) confirmTagBtn.textContent = strings.tagButtonSave;
    if (tagBtn) tagBtn.textContent = strings.tagButtonText;
    updateProgress();
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
    } else questionNum.textContent = '';
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function formatTime(totalSeconds) {
    if (!totalSeconds || isNaN(totalSeconds)) return '0s'; 
    const roundedSeconds = Math.round(totalSeconds);
    const minutes = Math.floor(roundedSeconds / 60);
    const seconds = roundedSeconds % 60;
    if (minutes > 0) return `${minutes}m ${seconds < 10 ? '0' + seconds : seconds}s`;
    return `${roundedSeconds}s`;
}

function getDisplayDateTime(dateObj) {
    return dateObj.toLocaleString(currentLanguage === 'sv' ? 'sv-SE' : 'en-US').replace(',', ''); 
}

function setEquals(a, b) {
    if (a.size !== b.size) return false;
    for (const x of a) if (!b.has(x)) return false;
    return true;
}

// ======================================================
// HIGHSCORES & TAGS
// ======================================================

function saveHighscore(scorePercentage, scoreTotalStr, time, dateAndTime, files) {
    fetch('/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: dateAndTime, score: scorePercentage, total: scoreTotalStr, time: parseFloat(time), files: files })
    }).catch(err => console.error("Could not save highscore:", err));
}

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
        if (!data || data.length === 0) html = `<p>${strings.highscoresNone}</p>`;
        else {
            html = `<table class="table table-striped table-sm"><thead><tr><th>${strings.highscoresHeader1}</th><th>${strings.highscoresHeader2}</th><th>${strings.highscoresHeader3}</th><th>${strings.highscoresHeader4}</th></tr></thead><tbody>`;
            data.forEach((h) => {
                const scoreDisplay = h.score !== undefined ? `${h.score}% (${h.total})` : 'N/A';
                html += `<tr><td>${h.date}</td><td>${scoreDisplay}</td><td>${formatTime(h.time)}</td><td>${(h.files || []).join(', ')}</td></tr>`;
            });
            html += `</tbody></table>`;
        }
        highscoresDiv.innerHTML = html;
        if (show) highscoresDiv.style.display = 'block';
    } catch (err) { highscoresDiv.innerHTML = `<p class="text-danger">${strings.highscoresError}</p>`; }
}

showHighscoresBtn.addEventListener('click', () => fetchAndDisplayHighscores(true, true));

showTagsBtn.addEventListener('click', async () => {
    const strings = languageStrings[currentLanguage];
    if (tagsDiv.style.display === 'block') {
        tagsDiv.style.display = 'none';
        showTagsBtn.textContent = strings.buttonTagsShow;
        return;
    }
    tagsContent.innerHTML = `<p>${strings.tagsLoading}</p>`;
    tagsDiv.style.display = 'block';
    showTagsBtn.textContent = strings.buttonTagsHide;
    try {
        const res = await fetch('/tags');
        const data = await res.json();
        tagsContent.innerHTML = data.success ? `<pre class="bg-light p-3 rounded text-dark" style="white-space: pre-wrap;">${data.content}</pre>` : `<p>${strings.tagsNone}</p>`;
    } catch (err) { tagsContent.innerHTML = `<p class="text-danger">Fel vid laddning.</p>`; }
});

// ======================================================
// START LOGIC
// ======================================================

function updateStartButtonStatus() {
    const questionsReady = allLoadedQuestions.length > 0;
    const selectedCategories = Array.from(categoryCheckboxes.querySelectorAll('input:checked')).length > 0;
    
    if (categorySelection.classList.contains('d-none')) {
        startBtn.disabled = true;
    } else {
        startBtn.disabled = !(questionsReady && selectedCategories);
    }
}

function updateLoadButtonStatus() {
    const strings = languageStrings[currentLanguage];
    const selectedFilesCount = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length;
    loadCategoriesBtn.disabled = !(onlyWrong.checked || selectedFilesCount > 0);
    
    if (allLoadedQuestions.length > 0) {
        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoaded + ` (${allLoadedQuestions.length})`;
        loadCategoriesBtn.classList.add('btn-success');
    } else {
        loadCategoriesBtn.textContent = onlyWrong.checked ? strings.buttonLoadCategoriesWrong : strings.buttonLoadCategoriesDefault;
        loadCategoriesBtn.classList.remove('btn-success');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    const savedLang = localStorage.getItem('quizLanguage');
    if (savedLang && languageStrings[savedLang]) currentLanguage = savedLang;
    
    tagModal = new bootstrap.Modal(document.getElementById('tagModal'));
    abortModalInstance = new bootstrap.Modal(document.getElementById('abortModal'));

    fetch("/files").then(res => res.json()).then(files => {
        files.forEach(f => {
            const div = document.createElement('div');
            div.className = "form-check";
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${f}" id="${f}" checked>
                <label class="form-check-label" for="${f}">${f} <span class="text-muted small" id="count-${f.replace(/\./g, '_')}">(...)</span></label>
            `;
            
            div.querySelector('input').addEventListener('change', () => {
                const anyChecked = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0;
                if (anyChecked || onlyWrong.checked) {
                    performLoad();
                } else {
                    allLoadedQuestions = [];
                    categoryCheckboxes.innerHTML = '';
                    categorySelection.classList.add('d-none');
                    updateUI(currentLanguage);
                    updateLoadButtonStatus();
                    updateStartButtonStatus();
                }
            });
            fileCheckboxesDiv.appendChild(div);

            fetch(`/questions/${f}`).then(r => r.json()).then(qs => {
                fileQuestionCounts[f] = qs.length; 
                const countSpan = document.getElementById(`count-${f.replace(/\./g, '_')}`);
                const strings = languageStrings[currentLanguage];
                if (countSpan) countSpan.textContent = `(${qs.length} ${strings.fileCountText})`;
            }).catch(() => {});
        });
        
        updateUI(currentLanguage);
        if (files.length > 0) performLoad();
    }).finally(() => { 
        fetchAndDisplayHighscores(false, false); 
    });
});

function performLoad() {
    const strings = languageStrings[currentLanguage];
    allLoadedQuestions = []; 
    categoryCheckboxes.innerHTML = '';
    loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading;
    loadCategoriesBtn.disabled = true;

    let fetchPromise;
    if (onlyWrong.checked) {
        selectedQuizFiles = ['Fel frågor'];
        fetchPromise = fetch("/wrong").then(r => r.json()).then(qs => qs.map(q => ({...q, sourceFile: 'wrong.json'})));
    } else {
        const filesToFetch = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).map(cb => cb.value);
        if (filesToFetch.length === 0) {
            loadCategoriesBtn.textContent = strings.buttonLoadCategoriesDefault;
            loadCategoriesBtn.disabled = false;
            return; 
        }
        selectedQuizFiles = filesToFetch;
        fetchPromise = Promise.all(filesToFetch.map(f => fetch(`/questions/${f}`).then(r => r.json()).then(qs => qs.map(q => ({...q, sourceFile: f}))))).then(arrays => arrays.flat());
    }

    fetchPromise.then(allQ => {
        const unique = {};
        allQ.forEach(q => { const k = q.question.toLowerCase().trim(); if(!unique[k]) unique[k] = q; });
        allLoadedQuestions = Object.values(unique);
        
        const cats = new Set();
        allLoadedQuestions.forEach(q => cats.add(q.category || strings.categoryOther));
        Array.from(cats).sort().forEach(cat => {
            const div = document.createElement('div');
            div.className = "form-check";
            const id = `cat-${cat.replace(/\W/g, '_')}`;
            div.innerHTML = `<input class="form-check-input" type="checkbox" value="${cat}" id="${id}" checked><label class="form-check-label" for="${id}">${cat}</label>`;
            div.querySelector('input').addEventListener('change', () => {
                updateUI(currentLanguage);
                updateStartButtonStatus();
            });
            categoryCheckboxes.appendChild(div);
        });
        
        categorySelection.classList.remove('d-none');
    }).finally(() => { 
        updateUI(currentLanguage);
        updateLoadButtonStatus(); 
        updateStartButtonStatus(); 
    });
}

loadCategoriesBtn.addEventListener('click', performLoad);

startBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    const selectedCats = Array.from(categoryCheckboxes.querySelectorAll('input:checked')).map(cb => cb.value);
    let filtered = allLoadedQuestions.filter(q => selectedCats.includes(q.category || strings.categoryOther));
    if (filtered.length === 0) { alert(strings.alertNoCategoryMatch); return; }

    const numInput = document.getElementById('numQuestions');
    const num = numInput ? parseInt(numInput.value, 10) : 0;
    questions = (num && num < filtered.length) ? shuffleArray([...filtered]).slice(0, num) : shuffleArray([...filtered]);

    currentQuestion = 0; scoreList = []; quizStartTime = Date.now();
    startScreen.classList.add('d-none'); quizScreen.classList.remove('d-none'); infoAlert.classList.add('d-none');
    showQuestion();
});

// ======================================================
// QUIZ CORE & ANSWERS
// ======================================================

function showQuestion() {
    const q = questions[currentQuestion];
    const strings = languageStrings[currentLanguage];
    
    tagBtn.textContent = strings.tagButtonText;
    tagBtn.onclick = () => {
        currentQuestionToTag = q;
        tagQuestionText.textContent = q.question;
        tagCommentTextarea.value = '';
        tagModal.show();
    };
    
    questionText.textContent = q.question;
    optionsDiv.innerHTML = ''; 
    explanationDiv.classList.add('d-none'); 
    nextBtn.classList.add('d-none');
    questionStartTime = Date.now();
    
    const isMulti = Array.isArray(q.correct);
    shuffleArray([...q.options]).forEach((opt, i) => {
        const label = document.createElement('label'); 
        label.className = 'option-item';
        const input = document.createElement('input'); 
        input.type = isMulti ? 'checkbox' : 'radio'; 
        input.name = 'opts'; 
        input.value = opt;
        label.appendChild(input); 
        label.appendChild(document.createTextNode(` ${String.fromCharCode(65+i)}. ${opt}`));
        
        if (!isMulti) input.addEventListener('change', () => checkAnswer(opt, label, q));
        else input.addEventListener('change', () => multiSubmitBtn.disabled = !optionsDiv.querySelectorAll('input:checked').length);
        optionsDiv.appendChild(label);
    });

    if (isMulti) {
        multiSubmitBtn.classList.remove('d-none');
        multiSubmitBtn.disabled = true;
        multiSubmitBtn.onclick = () => {
            const selected = Array.from(optionsDiv.querySelectorAll('input:checked')).map(i => i.value);
            checkMulti(selected, q);
        };
    } else {
        multiSubmitBtn.classList.add('d-none');
    }
    updateProgress();
}

function checkAnswer(selected, label, q) {
    const strings = languageStrings[currentLanguage];
    const time = (Date.now() - questionStartTime) / 1000;
    const isCorrect = (selected === q.correct);
    scoreList.push({ category: q.category || strings.categoryOther, correct: isCorrect, time: time, userSelected: selected });

    Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => {
        const val = item.querySelector('input').value;
        if (val === q.correct) item.classList.add('correct');
        else if (val === selected && !isCorrect) item.classList.add('wrong');
        item.style.pointerEvents = 'none';
    });

    if (isCorrect) {
        fetch('/wrong/remove', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(q) });
        setTimeout(() => { currentQuestion++; if (currentQuestion >= questions.length) showResult(); else showQuestion(); }, 800);
    } else {
        fetch('/wrong/add', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(q) });
        explanationDiv.innerHTML = `<strong>${strings.explanation}:</strong> ${q.explanation || strings.explanationNone}`;
        explanationDiv.classList.remove('d-none'); nextBtn.classList.remove('d-none');
    }
}

function checkMulti(selected, q) {
    const strings = languageStrings[currentLanguage];
    const time = (Date.now() - questionStartTime) / 1000;
    const correctSet = new Set(q.correct);
    const selectedSet = new Set(selected);
    const isCorrect = setEquals(correctSet, selectedSet);

    scoreList.push({ category: q.category || strings.categoryOther, correct: isCorrect, time: time, userSelected: selected.join(", ") });

    Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => {
        const val = item.querySelector('input').value;
        if (correctSet.has(val)) item.classList.add('correct');
        else if (selectedSet.has(val)) item.classList.add('wrong');
        item.style.pointerEvents = 'none';
    });

    multiSubmitBtn.classList.add('d-none');
    if (isCorrect) {
        fetch('/wrong/remove', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(q) });
        setTimeout(() => { currentQuestion++; if (currentQuestion >= questions.length) showResult(); else showQuestion(); }, 1000);
    } else {
        fetch('/wrong/add', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(q) });
        explanationDiv.innerHTML = `<strong>${strings.explanation}:</strong> ${q.explanation || strings.explanationNone}`;
        explanationDiv.classList.remove('d-none'); nextBtn.classList.remove('d-none');
    }
}

// ======================================================
// RESULTS & BUTTONS
// ======================================================

function showResult() {
    const strings = languageStrings[currentLanguage];
    quizScreen.classList.add('d-none'); 
    resultScreen.classList.remove('d-none');
    
    let totalCorrect = 0, totalTime = 0;
    const catData = {}, misses = [];

    scoreList.forEach((s, idx) => {
        totalTime += s.time;
        if (s.correct) totalCorrect++;
        else misses.push({ question: questions[idx], userAnswer: s.userSelected });
        if (!catData[s.category]) catData[s.category] = { correct: 0, total: 0 };
        catData[s.category].total++;
        if (s.correct) catData[s.category].correct++;
    });

    const perc = scoreList.length ? (totalCorrect / scoreList.length * 100).toFixed(1) : 0;
    if (parseFloat(perc) >= 85) confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    let tipsHtml = "";
    for (let c in catData) {
        let m = catData[c].total - catData[c].correct;
        if (m >= 3) tipsHtml += `<li><strong>${c}</strong> (${m} ${strings.missesText})</li>`;
    }

    document.getElementById('totalResult').innerHTML = `
        <h4>${strings.resultTotal.replace('[CORRECT]', totalCorrect).replace('[TOTAL]', scoreList.length).replace('[PERCENT]', perc)}</h4>
        <p>${strings.resultTime.replace('[TOTALTIME]', formatTime(totalTime)).replace('[AVGTIME]', (totalTime/scoreList.length || 0).toFixed(1))}</p>
        ${tipsHtml ? `<div class="alert alert-info mt-3 mx-auto text-start" style="max-width:600px">${strings.tipsHeader}<ul class="mb-0 mt-2">${tipsHtml}</ul></div>` : ''}
    `;

    const ctx = document.getElementById('categoryChart').getContext('2d');
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(catData),
            datasets: [
                { label: currentLanguage === 'sv' ? 'Rätt' : 'Correct', data: Object.keys(catData).map(c => catData[c].correct), backgroundColor: '#28a745' },
                { label: currentLanguage === 'sv' ? 'Fel' : 'Wrong', data: Object.keys(catData).map(c => catData[c].total - catData[c].correct), backgroundColor: '#dc3545' }
            ]
        },
        options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false }
    });

    const dd = document.getElementById('deepDiveContainer');
    dd.innerHTML = misses.length ? `<hr class="my-5"><h3 class="text-center mb-4">🔍 ${strings.deepDive}</h3>` : '';
    
    misses.forEach(m => {
        dd.innerHTML += `
        <div class="card mb-3 shadow-sm" style="border-left: 5px solid #dc3545 !important;">
            <div class="card-body">
                <p class="fw-bold">${m.question.question}</p>
                <div class="small">
                    <span class="text-danger">✘ ${strings.yourAnswer}</span> ${m.userAnswer}
                </div>
                <div class="small mb-2">
                    <span class="text-success">✔ ${strings.correctAnswer}</span> ${m.question.correct}
                </div>
                <div class="alert alert-secondary py-1 px-2 mb-0 small">
                    <strong>${strings.explanation}:</strong> ${m.question.explanation || strings.explanationNone}
                </div>
            </div>
        </div>`;
    });

    saveHighscore(Math.round(perc), `${totalCorrect}/${scoreList.length}`, totalTime, getDisplayDateTime(new Date()), selectedQuizFiles);
}

// Global Event Listeners
nextBtn.addEventListener('click', () => { currentQuestion++; if (currentQuestion >= questions.length) showResult(); else showQuestion(); });
restartBtn.addEventListener('click', () => location.reload());
abortBtn.addEventListener('click', () => abortModalInstance.show());
abortWithScoreBtn.addEventListener('click', () => { abortModalInstance.hide(); showResult(); });
abortWithoutScoreBtn.addEventListener('click', () => location.reload());
languageToggleBtn.addEventListener('click', () => { currentLanguage = (currentLanguage === 'sv') ? 'en' : 'sv'; localStorage.setItem('quizLanguage', currentLanguage); updateUI(currentLanguage); });
themeToggleBtn.addEventListener('click', () => { const t = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark'; document.documentElement.setAttribute('data-bs-theme', t); localStorage.setItem('theme', t); });

toggleFilesBtn.addEventListener('click', () => { 
    const cbs = Array.from(fileCheckboxesDiv.querySelectorAll('input')); 
    const anyUnchecked = cbs.some(c => !c.checked);
    cbs.forEach(c => c.checked = anyUnchecked); 
    
    if (anyUnchecked || onlyWrong.checked) {
        performLoad();
    } else {
        allLoadedQuestions = [];
        categoryCheckboxes.innerHTML = '';
        categorySelection.classList.add('d-none');
        updateUI(currentLanguage);
        updateLoadButtonStatus(); 
        updateStartButtonStatus();
    }
});

toggleCategoriesBtn.addEventListener('click', () => { 
    const cbs = Array.from(categoryCheckboxes.querySelectorAll('input')); 
    const anyUnchecked = cbs.some(c => !c.checked);
    cbs.forEach(c => c.checked = anyUnchecked); 
    
    updateUI(currentLanguage); 
    updateStartButtonStatus(); 
});

confirmTagBtn.addEventListener('click', () => { 
    if (!currentQuestionToTag) return;
    fetch('/tag', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ question: currentQuestionToTag.question, category: currentQuestionToTag.category, source: currentQuestionToTag.sourceFile, comment: tagCommentTextarea.value.trim() }) })
    .then(() => { tagModal.hide(); tagBtn.textContent = "✅ Taggad"; });
});

onlyWrong.addEventListener('change', () => {
    performLoad();
});