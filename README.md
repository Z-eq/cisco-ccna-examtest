# cisco-ccna-examtest 200-301 2.1
Train for ccna certification! This fast Flask/JS app features dynamic category selection, detailed highscores (with time/topic tracking), and a specialized study mode to practice only your failed CCNA questions

Quiz-appen: Kunskapstestare

En enkel och dynamisk webbapplikation för att köra kategoribaserade kunskapstest, byggd med Flask (Python) på serversidan och JavaScript/HTML/CSS på klientsidan.
🎯 Funktioner

    Dynamiskt urval: Välj vilka JSON-filer (kategorier) du vill testa dig på.

    Progressiv visning: Tydlig progressbar och frågenumrering.

    Highscore-lista: Sparar highscores med poäng, tid, datum, klockslag och vilka filer/kategorier som ingick i testet.

    Flervalsstöd: Hanterar både enkelval och flerval (multiple select) frågor.

    Övningsläge: Sparar felaktigt besvarade frågor, som sedan kan användas för att köra ett dedikerat test på "fel frågor".

🚀 Kom igång

Följ dessa steg för att få igång applikationen på din lokala maskin.
1. Klona Repot

Börja med att klona projektet till din dator:
Bash

git clone https://github.com/DittAnvändarnamn/DittProjektNamn.git
cd DittProjektNamn

2. Installera Python-beroenden

Vi rekommenderar starkt att använda en virtuell miljö (venv) för att isolera projektets beroenden.
a. Skapa och Aktivera Miljö
Bash

# Skapa miljön
python -m venv venv

# Aktivera miljön
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

b. Installera Paket

Använd requirements.txt för att installera Flask och dess beroenden:
Bash

pip install -r requirements.txt

3. Lägg till Frågefiler

Appen läser frågor från mappen questions/.

    Skapa egna JSON-filer (t.ex. questions/svenska.json eller questions/teknik.json).

    Formatet måste matcha strukturen som appen förväntar sig (se exempel nedan).

    Exempel på JSON-struktur:
    JSON

    [
      {
        "question": "Vad är huvudstaden i Sverige?",
        "options": ["Malmö", "Göteborg", "Stockholm", "Uppsala"],
        "correct": "Stockholm",
        "explanation": "Stockholm har varit Sveriges huvudstad sedan medeltiden.",
        "category": "Geografi"
      }
    ]

4. Kör Applikationen

Se till att din virtuella miljö är aktiverad (Steg 2) och kör sedan:
Bash

python app.py

Applikationen kommer att starta på: http://127.0.0.1:5000/.
📁 Projektstruktur

.
├── app.py              # Flask backend, routing och logik
├── requirements.txt    # Python-beroenden (Flask)
├── templates/
│   └── index.html      # Huvudsida (HTML)
└── static/
    ├── quiz.js         # Huvudsaklig frontend-logik (JavaScript)
    ├── style.css       # Styling (CSS)
    └── questions/      # Mapp för JSON-frågefiler och datalagring
        ├── json_fil_1.json
        ├── json_fil_2.json
        ├── wrong.json      # Sparade felaktiga frågor (hanteras av app.py, ej i repo)
        └── highscores.json # Sparade highscores (hanteras av app.py, ej i repo)

📜 Licens

Detta projekt är licensierat under MIT-licensen - se filen LICENSE (om du väljer att lägga till den) för mer detaljer.

Gör den på engelska

That's a great idea! Presenting your project with a well-formatted English README.md will make it accessible to a wider audience on GitHub.

Here is the complete README.md in English, using the Markdown format, tailored to your Flask Quiz application:
🎓 Quiz App: Knowledge Tester

A simple, dynamic, web-based application for running category-based knowledge tests. It is built with Flask (Python) on the server-side and JavaScript/HTML/CSS on the client-side.
✨ Features

    Dynamic Selection: Choose exactly which JSON files (categories) you want to be tested on.

    Clear Progress: Features a visible progress bar and clear question numbering (e.g., "Question 5 of 10").

    Detailed Highscores: Saves highscores including score, total time, date, time of completion, and the categories included in the test.

    Flexible Question Types: Supports both single-choice and multi-select (multiple correct answers) questions.

    Practice Mode: Automatically saves incorrectly answered questions, allowing you to run a dedicated test focusing only on your "wrong answers".

🚀 Getting Started

Follow these steps to get the application running on your local machine.
1. Clone the Repository

Start by cloning the project to your computer:
Bash

git clone https://github.com/YourUsername/YourProjectName.git
cd YourProjectName

2. Install Python Dependencies

It is highly recommended to use a virtual environment (venv) to isolate the project's dependencies.
a. Create and Activate Environment
Bash

# Create the environment
python -m venv venv

# Activate the environment
# Windows (Command Prompt/PowerShell):
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

b. Install Packages

Use the requirements.txt file to install Flask and its dependencies:
Bash

pip install -r requirements.txt

3. Add Question Files

The application reads questions from the questions/ directory.

    Create your own JSON files (e.g., questions/science.json or questions/history.json).

    The format must match the structure the app expects (see example below).

    Example JSON Structure (for a file inside questions/):
    JSON

    [
      {
        "question": "What is the capital of Sweden?",
        "options": ["Malmö", "Gothenburg", "Stockholm", "Uppsala"],
        "correct": "Stockholm",
        "explanation": "Stockholm has been the capital of Sweden since the Middle Ages.",
        "category": "Geography"
      }
    ]

4. Run the Application

Ensure your virtual environment is active (Step 2), then run the application:
Bash

python app.py

The application will be available at: http://127.0.0.1:5000/.
📁 Project Structure

.
├── app.py              # Flask backend, routing, and logic
├── requirements.txt    # Python dependencies (Flask)
├── templates/
│   └── index.html      # Main page template (HTML)
└── static/
    ├── quiz.js         # Core frontend logic (JavaScript)
    ├── style.css       # Styling (CSS)
    └── questions/      # Directory for JSON question files and data storage
        ├── science.json
        ├── history.json
        ├── wrong.json      # Saved incorrect questions (Managed by app.py, excluded from repo)
        └── highscores.json # Saved highscores (Managed by app.py, excluded from repo)

📄 Licensing

This project is licensed under the MIT License - see the optional LICENSE file for details.
