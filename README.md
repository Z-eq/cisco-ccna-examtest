# Cisco CCNA Exam Test 200-301 v2.1

A fast, category-based knowledge testing application built with Flask (Python) and JavaScript/CSS, specialized for CCNA certification training.

##  Key Features

Train for CCNA certification! This app features dynamic category selection, detailed highscores (with time/topic tracking), and a specialized study mode to practice only your failed CCNA questions.

### Quiz Functionality

* **Clear Progress:** Features a visible progress bar and clear question numbering (e.g., "Question 5 of 10").
* **Detailed Highscores:** Saves highscores including score, total time, date, time of completion, and the categories included in the test.
* **Flexible Question Types:** Supports both single-choice and multi-select (multiple correct answers) questions.
* **Practice Mode:** Automatically saves incorrectly answered questions, allowing you to run a dedicated test focusing only on your "wrong answers".

##  Getting Started

Follow these steps to get the application running on your local machine.

### 1. Clone the Repository

Start by cloning the project to your computer:

```bash
git clone [https://github.com/Z-eq/cisco-ccna-examtest.git](https://github.com/Z-eq/cisco-ccna-examtest.git)
cd cisco-ccna-examtest

#### 2. Install Python Dependencies

It is highly recommended to use a virtual environment (venv) to isolate the project's dependencies.
#### a. Create and Activate Environment
Bash

### Create the environment
python -m venv venv

### Activate the environment
### Windows (Command Prompt/PowerShell):
.\venv\Scripts\activate
#### macOS/Linux:
source venv/bin/activate

#### b. Install Packages

Use the requirements.txt file to install Flask and its dependencies:
Bash

#### pip install -r requirements.txt

#### 3. Add Question Files

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

        
    📄 Licensing

This project is licensed under the MIT License - see the optional LICENSE file for details.
