# Cisco CCNA Exam Test 200-301 v2.1

## Over 680 Unique Questions

A fast, category-based knowledge testing application built with Flask (Python) and JavaScript/CSS, specialized for CCNA certification training.

---

### Key Features

This app is built to maximize study efficiency for the CCNA certification. It features dynamic category selection, detailed highscores, and advanced study tools.

#### Advanced Study Tools (NEW)
* **Question Tagging & Note-taking (NEW):** Tag any question during the quiz with a specific comment or note for later review. The application saves the exact question, category, and its original **source file** to a dedicated file (`tagged_questions.txt`).
* **Practice Mode ("Wrong Answers Only"):** Automatically saves incorrectly answered questions, allowing the user to run a dedicated test focusing solely on these "wrong answers."

#### Quiz Functionality
* **Flexible Source Management:** The user can select which JSON files to include in the test.
* **Deduplication (NEW):** The system automatically ensures that only **unique questions** are loaded and included in the quiz, even if the same question exists across multiple selected source files.
* **Category Filtering:** After sources are loaded, the user can select specific categories (e.g., "OSI Model", "Routing", "VLAN") to include or exclude from the quiz.
* **Flexible Question Types:** Supports both single-choice and multi-select (multiple correct answers) questions.

#### Tracking & Interface
* **Clear Progress Tracking:** Features a visible progress bar and clear question numbering (e.g., "Question 5 of 10").
* **Detailed Highscores:** Saves highscores including score, total time, date, time of completion, and a list of the categories included in the test.
* **User Interface:** Supports both Light and Dark themes (Light/Dark Mode) and **Swedish/English** languages.

---

### Getting Started

Follow these steps to get the application running on your local machine.

You can test this app here: https://ccna.onrender.com

### 1. Clone the Repository

Start by cloning the project to your computer:

git clone https://github.com/Z-eq/cisco-ccna-examtest.git

cd cisco-ccna-examtest

#### 2. Install Python Dependencies

It is highly recommended to use a virtual environment (venv) to isolate the project's dependencies.
#### a. Create and Activate Environment

### Create the environment

python -m venv venv

### Activate the environment

### In Windows (Command Prompt/PowerShell):

.\venv\Scripts\activate

#### On Linux/macOS:

source venv/bin/activate

#### b. Install Packages

Use the requirements.txt file to install Flask and its dependencies:

#### pip install -r requirements.txt

#### 3. Run the Application

Ensure your virtual environment is active (Step 2), then run the application:

python app.py

The application will be available at: http://127.0.0.1:5000/.

#### 4. You can also add your own question files



### Option B: Global Installation (Without venv)

If you choose not to use a virtual environment, you must ensure all necessary packages are installed directly into your system's Python environment. This uses the same installation command.
You can follow step 1. and then also just install Flask by command: 

pip install flask

and run the program by python app.py 

On Windows you can also double click at app.py to run the app.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

The application reads questions from the folder questions/ directory.

    Create your own JSON files (e.g., questions/science.json or questions/history.json).

    The format must match the structure the app expects (see example below).
    

    Example JSON Structure (for a file inside questions/):
    JSON

    [
      {
        "question": "What type of cable is typically crossed over to connect two Cisco switches directly?",
        "options": [
        "Fiber",
        "Coaxial",
        "Crossover Ethernet cable",
        "Straight-through Ethernet cable"
        ],
        "correct": "Crossover Ethernet cable",
        "category": "Ethernet",
        "explanation": "A **Crossover Ethernet cable** is traditionally used for a direct connection between two similar devices (like two switches or two hosts) because it crosses the transmit and receive pairs. Modern devices often use Auto-MDIX to handle this automatically, but the crossover cable is the correct type."
 
      }
    ]


#### Project Structure

     Features

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


If you need help or have any questions mail me at : zeq.alidemaj @ gmail com
        
    📄 Licensing

This project is licensed under the MIT License - Its free to use change or whatever you wish!
.
