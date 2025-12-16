# app.py

# Importerar moduler från Flask och standardbiblioteket
from flask import Flask, jsonify, send_from_directory, render_template, request, abort
import os, json
# NY, Behövs för att generera tidsstämplar i /tag rutten
from datetime import datetime 

# Initialiserar Flask-applikationen
app = Flask(__name__, static_folder="static", template_folder="templates")

# Ange sökvägar till datalagring
QUESTIONS_DIR = os.path.join(os.path.dirname(__file__), "questions")
WRONG_FILE = "wrong.json"
HIGHSCORE_FILE = "highscores.json"
# NY SÖKVÄG: Fil för sparade taggade frågor
TAGGED_QUESTIONS_FILE = 'tagged_questions.txt' 

# Säkerställer att mappen för frågor/data finns
os.makedirs(QUESTIONS_DIR, exist_ok=True)

# --- Hjälpfunktioner för filhantering (Optimering) ---

def filepath(name):
    """Returnerar den fullständiga sökvägen till en fil i QUESTIONS_DIR."""
    # Specialhantering för TAGGED_QUESTIONS_FILE då den ligger i appens rot, inte i QUESTIONS_DIR
    if name == TAGGED_QUESTIONS_FILE:
        return os.path.join(os.path.dirname(__file__), name)
    return os.path.join(QUESTIONS_DIR, name)

def read_json(filename, default_value=None):
    """Läser och returnerar innehållet i en JSON-fil, hanterar fel."""
    p = filepath(filename)
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Returnerar default_value om filen inte hittas eller är korrupt
        return default_value if default_value is not None else []

def write_json(filename, data):
    """Skriver data till en JSON-fil."""
    p = filepath(filename)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Säkerställer att baslinjefilerna (wrong.json, highscores.json) existerar tomma vid start
for fn in (WRONG_FILE, HIGHSCORE_FILE):
    p = filepath(fn)
    if not os.path.exists(p):
        write_json(fn, []) # Använder den nya funktionen

# --- Routing för Quiz-applikationen ---

@app.route("/")
def index():
    """Huvudroute som renderar startsidan."""
    return render_template("index.html")

@app.route("/files")
def list_files():
    """Returnerar en sorterad lista över tillgängliga JSON-frågefiler."""
    # Använder List Comprehension för kompaktare kod (Optimering)
    files = [
        f for f in os.listdir(QUESTIONS_DIR) 
        if f.endswith(".json") and f not in (WRONG_FILE, HIGHSCORE_FILE)
    ]
    files.sort()
    return jsonify(files)

@app.route("/questions/<path:filename>")
def get_question_file(filename):
    """Serverar en specifik frågefil. Flask hanterar 404:an automatiskt."""
    return send_from_directory(QUESTIONS_DIR, filename)

# --- Endpoints för felaktiga frågor ---

@app.route("/wrong")
def get_wrong_questions():
    """Hämtar listan över felaktigt besvarade frågor."""
    return jsonify(read_json(WRONG_FILE))

@app.route("/wrong/add", methods=["POST"])
def add_wrong_question():
    """Lägger till en fråga i listan över felaktigt besvarade frågor."""
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"status":"error","reason":"invalid payload"}), 400
    
    wrong = read_json(WRONG_FILE) # Använder optimerad funktion
    
    # Undviker dubbletter baserat på frågetext
    if not any(q.get("question") == data.get("question") for q in wrong):
        wrong.append(data)
        write_json(WRONG_FILE, wrong) # Använder optimerad funktion
        
    return jsonify({"status":"ok"})

@app.route("/wrong/remove", methods=["POST"])
def remove_wrong_question():
    """Tar bort en fråga från listan över felaktigt besvarade frågor."""
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"status":"error","reason":"invalid payload"}), 400
    
    wrong = read_json(WRONG_FILE) # Använder optimerad funktion
    
    # Filtrerar bort matchande fråga
    wrong = [q for q in wrong if q.get("question") != data.get("question")]
    
    write_json(WRONG_FILE, wrong) # Använder optimerad funktion
    return jsonify({"status":"ok"})

# --- Endpoints för Highscores ---

@app.route("/highscores", methods=["GET"])
def get_highscores():
    """Hämtar listan över sparade highscores."""
    return jsonify(read_json(HIGHSCORE_FILE))

@app.route("/highscores", methods=["POST"])
def post_highscore():
    """Lägger till ett nytt highscore."""
    data = request.get_json()
    if not data:
        return jsonify({"status":"error","reason":"invalid payload"}), 400
    
    scores = read_json(HIGHSCORE_FILE, default_value=[]) 
    
    # Lägg till och spara
    scores.append(data)
    write_json(HIGHSCORE_FILE, scores)
    return jsonify({"status":"ok"})

# --- NY ENDPOINT: Tagga fråga med kommentar ---

@app.route('/tag', methods=['POST']) 
def tag_question():
    """
    Sparar den taggade frågan, inklusive en valfri kommentar, i en textfil.
    Filen sparas i applikationens rot.
    """
    try:
        data = request.get_json()
        question = data.get('question', 'N/A')
        category = data.get('category', 'Okänd kategori')
        source = data.get('source', 'Okänd källa')
        comment = data.get('comment', '').strip()
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Formatera datan för att spara den i filen
        entry = (
            f"--- Taggad Fråga ({timestamp}) ---\n"
            f"Källa: {source} | Kategori: {category}\n"
            f"Fråga: {question}\n"
        )
        
        # Lägg till kommentaren om den finns
        if comment:
            entry += f"Anteckning: {comment}\n"
            
        entry += f"---------------------------------\n\n"

        # Använd filepath för att säkerställa att filen skapas i appens rot
        tag_file_path = filepath(TAGGED_QUESTIONS_FILE)
        
        # Skriv till filen i append-läge
        with open(tag_file_path, 'a', encoding='utf-8') as f:
            f.write(entry)

        return jsonify({"success": True, "message": "Fråga taggad!"}), 200

    except Exception as e:
        print(f"Fel vid taggning av fråga: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    # Kör utvecklingsservern
    app.run(debug=True, host="0.0.0.0", port=5000)
