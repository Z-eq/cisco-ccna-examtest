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
        infoAlertText3: "Koden för denna quiz finns på mitt <a href='https://github.com/Z-eq/cisco-ccna-examtest' target='_blank'>GitHub</a>.",
       
        
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
        chartLabel: "Resultat per kategori", 
        buttonRestart: "🔁 Starta om",
        
        // Modal
        abortModalTitle: "Avbryt quiz?",
        abortModalBody: "Vill du rätta de frågor du redan svarat på innan du avslutar, eller återgå till startskärmen?",
        abortWithScore: "Rätta och visa resultat", // Text för 'abortWithScore' ID
        abortWithoutScore: "Återgå till start",   // Text för 'abortWithoutScore' ID
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
// NYA DOM referenser för språkhantering
const tagModalTitle = document.getElementById('tagModalTitle'); 
const tagQuestionLabel = document.getElementById('tagQuestionLabel'); 
const tagCommentLabel = document.getElementById('tagCommentLabel'); 
const tagCancelBtn = document.getElementById('tagCancelBtn'); 

// ABORT MODAL KNAPP REFERENSER (VIKTIGT FÖR TEXTEN!)
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

const multiSubmitBtn = document.getElementById('multiSubmitBtn'); 

const categorySelection = document.getElementById('categorySelection');
const categoryCheckboxes = document.getElementById('categoryCheckboxes');
const toggleCategoriesBtn = document.getElementById('toggleCategoriesBtn');

const languageToggleBtn = document.getElementById('languageToggle'); 

// Modal instanser
let tagModal = null; 
let currentQuestionToTag = null; // Lagra frågan för tagg-modalen

// ======================================================
// LANGUAGE HANDLING
// ======================================================

function updateUI(lang) {
    const strings = languageStrings[lang];
    
    // Generellt & Info
    document.getElementById('pageTitle').textContent = strings.pageTitle;
    document.getElementById('mainTitle').textContent = strings.mainTitle;
    document.getElementById('themeToggle').textContent = strings.themeButtonText;
    document.getElementById('languageToggle').textContent = (lang === 'sv') ? languageStrings['en'].langButtonText : languageStrings['sv'].langButtonText;
    document.documentElement.lang = lang;


    // Info Alert (Centrerad lista)
    infoAlert.innerHTML = `
        <ul class="list-unstyled text-start mx-auto" style="max-width: 800px;"> 
            <li>• ${strings.infoAlertText1}</li>
            <li>• ${strings.infoAlertText2}</li>
            <li>• ${strings.infoAlertText3}</li>
        </ul>
    `;

    // Start Screen Headers/Labels
    document.getElementById('card1Header').textContent = strings.card1Header;
    document.getElementById('checkboxLabelWrong').textContent = strings.checkboxLabelWrong;
    
    // Använd dataset för tillståndshantering
    const isFilesDeselectMode = toggleFilesBtn.dataset.mode === 'deselect';
    toggleFilesBtn.textContent = isFilesDeselectMode ? strings.toggleFilesDeselect : strings.toggleFilesSelect;
    
    document.getElementById('card2Header').textContent = strings.card2Header;
    
    // Load button status depends on logic, only update base text
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
    
    // Uppdatera highscore-knappen baserat på synlighet
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
    
    // FIX FÖR ABORT KNAPPARNAS TEXT
    if (abortWithScoreBtn) abortWithScoreBtn.textContent = strings.abortWithScore; 
    if (abortWithoutScoreBtn) abortWithoutScoreBtn.textContent = strings.abortWithoutScore; 
    
    // Tagga Modal översättning
    if (tagModalTitle) tagModalTitle.textContent = strings.tagModalTitle; 
    if (tagQuestionLabel) tagQuestionLabel.textContent = strings.tagQuestionLabel; 
    if (tagCommentLabel) tagCommentLabel.textContent = strings.tagCommentLabel; 
    if (tagCancelBtn) tagCancelBtn.textContent = strings.tagButtonCancel; 
    
    // Denna knapp har dynamisk text, men vi sätter dess grundtext här
    if (confirmTagBtn) confirmTagBtn.textContent = strings.tagButtonSave; 
    
    // Uppdatera startskärmens tag-knappstext
    if (tagBtn) tagBtn.textContent = strings.tagButtonText; 
    
    // Uppdatera progress bar texten (om synlig)
    updateProgress();
    
    // Om highscores visas, ladda om för att få rätt språk
    if (highscoresDiv.style.display === 'block') {
        fetchAndDisplayHighscores(true, false); // Tvinga omladdning men behåll visning
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
    return dateObj.toLocaleString(currentLanguage === 'sv' ? 'sv-SE' : 'en-US', options).replace(',', ''); 
}

function formatTime(totalSeconds) {
    const strings = languageStrings[currentLanguage];
    // Kollar om det är highscore-rubriken vi vill ha (baserat på hur den definierats i strängarna)
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
    
    if (total > 0 && current < total) { // Visa endast om quizen pågår
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
        body: JSON.stringify({ 
            date: dateAndTime, 
            score: scorePercentage, 
            total: scoreTotalStr, 
            time: parseFloat(time),
            files: files 
        })
    }).catch(err => console.error("Could not save highscore:", err));
}

// ======================================================
// HIGHSCORES show/hide AND LOADING
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
            // Använd HTML-tabell för bättre struktur
            html = `
                <table class="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>${strings.highscoresHeader1}</th>
                            <th>${strings.highscoresHeader2}</th>
                            <th>${strings.highscoresHeader3}</th>
                            <th>${strings.highscoresHeader4}</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            // Sorterar för att visa bästa/snabbaste först
            data.sort((a, b) => {
                const timeA = parseFloat(a.time) || 9999;
                const timeB = parseFloat(b.time) || 9999;
                
                // Prioritera snabbare tid, sedan högre procent
                if (timeA !== timeB) return timeA - timeB; 
                return (parseFloat(b.score) || 0) - (parseFloat(a.score) || 0); 
            });


            data.forEach((h) => {
                const scoreDisplay = h.score !== undefined && h.total !== undefined ? `${h.score}% (${h.total})` : 'N/A';
                const timeDisplay = formatTime(h.time); 
                const filesDisplay = (h.files && Array.isArray(h.files) ? h.files.join(', ') : (h.files || 'N/A')); 
                
                html += `<tr>
                            <td>${h.date}</td>
                            <td>${scoreDisplay}</td>
                            <td>${timeDisplay}</td>
                            <td title="${filesDisplay}">${filesDisplay}</td>
                        </tr>`;
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
        console.error("Could not fetch highscores:", err);
        highscoresDiv.innerHTML = `<p class="text-danger">${strings.highscoresError}</p>`;
        if (show) highscoresDiv.style.display = 'block';
    }
}

showHighscoresBtn.addEventListener('click', () => fetchAndDisplayHighscores(true, true)); 

// ======================================================
// FETCH JSON FILES & START BUTTON LOGIC
// ======================================================

function updateStartButtonStatus() {
    const filesSelected = Array.from(fileCheckboxesDiv.querySelectorAll('input:checked')).length > 0 || onlyWrong.checked;
    
    // Om kategorier INTE visas (Direct Start mode)
    if (categorySelection.classList.contains('d-none')) {
        startBtn.disabled = !filesSelected;
    } else {
        // Om kategorier VISAS, måste minst en kategori vara vald
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
onlyWrong.addEventListener('change', () => {
    updateLoadButtonStatus();
    updateStartButtonStatus(); // Uppdatera Startknappens status om 'Endast felaktiga' ändras
});


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
                    // Återställ all kategorival/frågor om filer ändras
                    questions = []; 
                    allLoadedQuestions = [];
                    categorySelection.classList.add('d-none');
                    categoryCheckboxes.innerHTML = '';
                    loadCategoriesBtn.classList.remove('btn-success');
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
            
            // Ladda highscores tyst i bakgrunden utan att visa dem
            fetchAndDisplayHighscores(false, false); 
        });

    // INITIERA MODALER
    tagModal = new bootstrap.Modal(document.getElementById('tagModal'));
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
        // Skapa ett säkert ID för kategorin
        const catId = `cat-${cat.replace(/\s/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${cat}" id="${catId}" checked>
            <label class="form-check-label" for="${catId}">${cat}</label>`;
        
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
    
    // Uppdatera dataset och text
    toggleCategoriesBtn.dataset.mode = newState ? 'deselect' : 'select';
    toggleCategoriesBtn.textContent = newState ? strings.toggleCategoriesDeselect : strings.toggleCategoriesSelect; 

    updateStartButtonStatus();
});

// ======================================================
// LOAD CATEGORIES LOGIC (STEP 1: Load questions and show filter) - UPPDATERAD FÖR SOURCEFILE
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
    selectedQuizFiles = []; 

    if (onlyWrong.checked) {
        selectedQuizFiles = ['Fel frågor']; 
        fetchPromise = fetch("/wrong").then(r => {
            if (!r.ok) throw new Error("Could not fetch /wrong");
            return r.json();
        }).then(questions => questions.map(q => ({...q, sourceFile: 'wrong.json'}))); // Lägg till källfil
    } else {
        const filesToFetch = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
        if (filesToFetch.length === 0) { 
            alert(strings.alertSelectFile);
            updateLoadButtonStatus(); 
            startBtn.disabled = false;
            return; 
        }
        selectedQuizFiles = filesToFetch; 
        
        // Här mappar vi varje fråga med dess specifika källfil
        fetchPromise = Promise.all(filesToFetch.map(f => 
            fetch(`/questions/${f}`)
                .then(r => {
                    if (!r.ok) throw new Error(`Could not fetch ${f}`);
                    return r.json();
                })
                .then(questions => questions.map(q => ({...q, sourceFile: f}))) // <-- SPARAR SPECIFIK KÄLLFIL HÄR
        )).then(arrays => arrays.flat());
    }

    fetchPromise
        .then(allQ => {
            if (!allQ || allQ.length === 0) { 
                alert(strings.alertNoQuestions);
                loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
                loadCategoriesBtn.classList.add('btn-danger');
                return; 
            }
            
            // Hantera dubbletter, men behåll sourceFile från den först hittade
            let uniqueQuestions = {};
            allQ.forEach(q => {
                const key = q.question.toLowerCase().trim();
                if (!uniqueQuestions[key]) {
                    uniqueQuestions[key] = q;
                }
            });
            
            const uniqueQArray = Object.values(uniqueQuestions);
            allLoadedQuestions = uniqueQArray;
            questions = uniqueQArray; 
            
            displayCategoryCheckboxes(uniqueQArray);
            loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoaded + ` (${uniqueQArray.length})`;
            loadCategoriesBtn.classList.remove('btn-danger');
            loadCategoriesBtn.classList.add('btn-success');
        })
        .catch(err => { 
            console.error("Error fetching questions:", err); 
            alert(strings.alertErrorFetching);
            loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
            loadCategoriesBtn.classList.add('btn-danger');
        })
        .finally(() => {
            loadCategoriesBtn.disabled = false;
            startBtn.disabled = false;
        });
});

// ======================================================
// START QUIZ LOGIC (STEP 2: Filtering & Start OR Direct Start) - UPPDATERAD FÖR SOURCEFILE
// ======================================================
startBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    
    if (startBtn.disabled) return;
    
    // ----------------------------------------------------
    // MODE 1: DIRECT START - No questions are loaded yet. - UPPDATERAD FÖR SOURCEFILE
    // ----------------------------------------------------
    if (allLoadedQuestions.length === 0) {
        
        const filesSelected = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).length > 0 || onlyWrong.checked;
        if (!filesSelected) { 
            alert(strings.alertSelectFileOrWrong);
            return; 
        }

        loadCategoriesBtn.textContent = strings.buttonLoadCategoriesLoading;
        loadCategoriesBtn.disabled = true;
        startBtn.disabled = true;
        
        let fetchPromise;
        selectedQuizFiles = [];

        if (onlyWrong.checked) {
            selectedQuizFiles = ['Fel frågor'];
            fetchPromise = fetch("/wrong").then(r => {
                if (!r.ok) throw new Error("Could not fetch /wrong");
                return r.json();
            }).then(questions => questions.map(q => ({...q, sourceFile: 'wrong.json'}))); // <-- KÄLLFIL
        } else {
            const filesToFetch = Array.from(document.querySelectorAll('#fileCheckboxes input:checked')).map(cb => cb.value);
            selectedQuizFiles = filesToFetch;
            fetchPromise = Promise.all(filesToFetch.map(f => 
                fetch(`/questions/${f}`)
                    .then(r => {
                        if (!r.ok) throw new Error(`Could not fetch ${f}`);
                        return r.json();
                    })
                    .then(questions => questions.map(q => ({...q, sourceFile: f}))) // <-- KÄLLFIL
            )).then(arrays => arrays.flat());
        }

        fetchPromise.then(allQ => {
            if (!allQ || allQ.length === 0) {
                alert(strings.alertNoQuestionsStart); 
                loadCategoriesBtn.textContent = strings.buttonLoadCategoriesNone;
                loadCategoriesBtn.classList.remove('btn-success');
                return;
            }
            
            // Hantera dubbletter, men behåll sourceFile från den först hittade
            let uniqueQuestions = {};
            allQ.forEach(q => {
                const key = q.question.toLowerCase().trim();
                if (!uniqueQuestions[key]) {
                    uniqueQuestions[key] = q;
                }
            });
            
            allLoadedQuestions = Object.values(uniqueQuestions);
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
            updateLoadButtonStatus();
            loadCategoriesBtn.classList.remove('btn-success');
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
    loadCategoriesBtn.classList.remove('btn-success'); // Ta bort grön färg
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
    quizStartTime = Date.now(); // Starta global timer
    
    startScreen.classList.add('d-none');
    quizScreen.classList.remove('d-none');
    resultScreen.classList.add('d-none');
    
    infoAlert.classList.add('d-none'); 

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
    // Återställ allt
    questions = []; 
    allLoadedQuestions = [];
    categorySelection.classList.add('d-none');
    categoryCheckboxes.innerHTML = '';
    
    resultScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    
    infoAlert.classList.remove('d-none'); 
    
    updateLoadButtonStatus(); 
    updateStartButtonStatus();
    loadCategoriesBtn.classList.remove('btn-success'); 
});

// Abort quiz modal logic
const abortModal = new bootstrap.Modal(document.getElementById('abortModal'));
document.getElementById('abortBtn').addEventListener('click', () => abortModal.show());
document.getElementById('abortWithScore').addEventListener('click', () => {
    abortModal.hide();
    showResult();
});
document.getElementById('abortWithoutScore').addEventListener('click', () => {
    abortModal.hide();
    quizScreen.classList.add('d-none');
    startScreen.classList.remove('d-none');
    
    infoAlert.classList.remove('d-none'); 
    
    // Rensa minneskrävande data
    questions = []; 
    allLoadedQuestions = [];
    categorySelection.classList.add('d-none');
    categoryCheckboxes.innerHTML = '';
    
    updateLoadButtonStatus(); 
    updateStartButtonStatus();
    loadCategoriesBtn.classList.remove('btn-success'); 
});

// TOGGLE select/unselect all files
toggleFilesBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    const checkboxes = fileCheckboxesDiv.querySelectorAll("input[type='checkbox']");
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const newState = !allChecked;
    checkboxes.forEach(cb => cb.checked = newState);
    
    toggleFilesBtn.dataset.mode = newState ? 'deselect' : 'select';
    toggleFilesBtn.textContent = newState ? strings.toggleFilesDeselect : strings.toggleFilesSelect;
    
    // Rensa allt relaterat till laddade frågor
    questions = []; 
    allLoadedQuestions = [];
    categorySelection.classList.add('d-none');
    categoryCheckboxes.innerHTML = '';
    loadCategoriesBtn.classList.remove('btn-success'); 

    updateLoadButtonStatus();
    updateStartButtonStatus();
});


// ======================================================
// MULTI-SUBMIT LOGIC
// ======================================================
function updateMultiSubmitButtonStatus() {
    const cbs = Array.from(optionsDiv.querySelectorAll('input[type="checkbox"]'));
    const anyChecked = cbs.some(c => c.checked);
    
    multiSubmitBtn.disabled = !anyChecked;
}

// ======================================================
// TAGGA FRÅGA MED KOMMENTAR (Steg 1: Öppna Modal)
// ======================================================
function tagQuestion(q) {
    // 1. Spara den aktuella frågan globalt
    currentQuestionToTag = q; 
    
    // 2. Förbered modalen med frågetexten
    tagQuestionText.textContent = q.question;
    tagCommentTextarea.value = ''; // Rensa textfältet
    
    // 3. Återställ Spara-knappen i modalen
    const strings = languageStrings[currentLanguage];
    confirmTagBtn.textContent = strings.tagButtonSave;
    confirmTagBtn.classList.remove('btn-success', 'btn-danger', 'btn-info');
    confirmTagBtn.classList.add('btn-warning');

    // 4. Visa modalen
    tagModal.show();
}

// ======================================================
// SKICKA FRÅGAN + KOMMENTAR TILL SERVERN (Steg 2: Skicka data) - UPPDATERAD FÖR SOURCEFILE
// ======================================================
confirmTagBtn.addEventListener('click', () => {
    const strings = languageStrings[currentLanguage];
    if (!currentQuestionToTag) return;

    const comment = tagCommentTextarea.value.trim();

    confirmTagBtn.textContent = 'Sparar...';
    confirmTagBtn.disabled = true;

    tagBtn.disabled = true;
    tagBtn.textContent = 'Sparar tagg...';
    tagBtn.classList.remove('btn-outline-warning', 'btn-success', 'btn-danger');
    tagBtn.classList.add('btn-info'); 

    // Använd den nu garanterade egenskapen currentQuestionToTag.sourceFile
    const sourceFile = currentQuestionToTag.sourceFile || 'Okänd källa (JS Error)';

    fetch('/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            question: currentQuestionToTag.question, 
            category: currentQuestionToTag.category || strings.categoryOther,
            source: sourceFile, // <-- SKICKAR NU DEN SPECIFIKA KÄLLFILEN
            comment: comment 
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Serverfel vid taggning.');
        
        const successText = (comment.length > 0) 
            ? strings.tagButtonText.replace('Tagga för senare', '✅ Taggad med anteckning') 
            : strings.tagButtonText.replace('Tagga för senare', '✅ Taggad');
            
        tagBtn.textContent = successText;
        tagBtn.classList.remove('btn-info');
        tagBtn.classList.add('btn-success');

        confirmTagBtn.textContent = '✅ Sparat!';
        confirmTagBtn.classList.remove('btn-warning');
        confirmTagBtn.classList.add('btn-success');
        
        setTimeout(() => {
            tagModal.hide();
        }, 800);
    })
    .catch(error => {
        console.error("Fel vid taggning:", error);
        tagBtn.textContent = '⚠️ Fel vid taggning';
        tagBtn.classList.remove('btn-info');
        tagBtn.classList.add('btn-danger');

        confirmTagBtn.textContent = '⚠️ Fel!';
        confirmTagBtn.classList.remove('btn-warning');
        confirmTagBtn.classList.add('btn-danger');
    })
    .finally(() => {
        confirmTagBtn.disabled = false;
        
        setTimeout(() => {
            if (currentQuestionToTag === questions[currentQuestion]) { 
                tagBtn.disabled = false;
                tagBtn.textContent = strings.tagButtonText;
                tagBtn.classList.remove('btn-success', 'btn-danger');
                tagBtn.classList.add('btn-outline-warning');
            }
        }, 3000); 
    });
});


// ======================================================
// SHOW QUESTION
// ======================================================
function showQuestion() {
    const q = questions[currentQuestion];
    const strings = languageStrings[currentLanguage];
    
    // Återställ Tagga-knappen
    tagBtn.disabled = false;
    tagBtn.textContent = strings.tagButtonText; 
    tagBtn.classList.remove('btn-success', 'btn-danger', 'btn-info');
    tagBtn.classList.add('btn-outline-warning');

    // Sätt klickhändelsen till den aktuella frågan
    tagBtn.onclick = () => tagQuestion(q);

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
        
        // Ta bort från felaktiga listan
        fetch("/wrong/remove", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(q) });

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion >= questions.length) showResult();
            else showQuestion();
        }, 600); 

    } else {
        optionItem.classList.add('wrong');
        
        // Visa det korrekta svaret
        Array.from(optionsDiv.querySelectorAll('.option-item')).forEach(item => { 
            const input = item.querySelector('input');
            if (input && input.value === q.correct) {
                item.classList.add('correct');
            }
        });

        explanationDiv.textContent = q.explanation || strings.explanationNone;
        explanationDiv.classList.remove('d-none');
        // Lägg till i felaktiga listan
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

        // Mark correct options (green)
        if (correctSet.has(input.value)) {
            item.classList.add('correct');
        } 
        
        // Mark selected, incorrect options (red)
        if (input.checked && !correctSet.has(input.value)) {
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

    infoAlert.classList.add('d-none'); 

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

    // ANPASSAD HTML FÖR RESULTAT
    document.getElementById('totalResult').innerHTML = `<h4>${resultTotalStr}</h4><p class="text-muted">${resultTimeStr}</p>`; 

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
    const correctData = labels.map(l => categoryResults[l].correct);
    const incorrectData = labels.map(l => categoryResults[l].total - categoryResults[l].correct);

    // Färgtema för diagrammet baserat på aktuellt läge
    const isDarkMode = document.body.classList.contains('dark');
    const axisColor = isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)';
    const fontColor = isDarkMode ? '#f8f9fa' : '#212529';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';


    if (chart) chart.destroy(); 
    chart = new Chart(ctx, {
        type: 'bar',
        data: { 
            labels: labels, 
            datasets: [
                {
                    label: 'Rätt', 
                    data: correctData,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                    stack: 'Stack 1'
                },
                {
                    label: 'Fel',
                    data: incorrectData,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)',
                    stack: 'Stack 1'
                }
            ]
        },
        options: { 
            indexAxis: 'y', 
            responsive: true,
            scales: { 
                x: { 
                    stacked: true, 
                    beginAtZero: true,
                    ticks: { color: fontColor },
                    grid: { color: gridColor }
                },
                y: {
                    stacked: true,
                    ticks: { color: fontColor },
                    grid: { color: gridColor }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: strings.chartLabel,
                    color: fontColor
                },
                legend: {
                    labels: {
                        color: fontColor
                    }
                }
            }
        }
    });
}