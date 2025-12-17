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

# --- Hjälpfunktioner för filhantering ---

def filepath(name):
    """Returnerar den fullständiga sökvägen till en fil."""
    # Specialhantering för TAGGED_QUESTIONS_FILE då den ligger i appens rot
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
        return default_value if default_value is not None else []

def write_json(filename, data):
    """Skriver data till en JSON-fil."""
    p = filepath(filename)
    with open(p, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Säkerställer att baslinjefilerna existerar tomma vid start
for fn in (WRONG_FILE, HIGHSCORE_FILE):
    p = filepath(fn)
    if not os.path.exists(p):
        write_json(fn, [])

# --- Routing för Quiz-applikationen ---

@app.route("/")
def index():
    """Huvudroute som renderar startsidan."""
    return render_template("index.html")

@app.route("/files")
def list_files():
    """Returnerar en sorterad lista över tillgängliga JSON-frågefiler."""
    files = [
        f for f in os.listdir(QUESTIONS_DIR) 
        if f.endswith(".json") and f not in (WRONG_FILE, HIGHSCORE_FILE)
    ]
    files.sort()
    return jsonify(files)

@app.route("/questions/<path:filename>")
def get_question_file(filename):
    """Serverar en specifik frågefil."""
    return send_from_directory(QUESTIONS_DIR, filename)

# --- Endpoints för felaktiga frågor ---

@app.route("/wrong")
def get_wrong_questions():
    return jsonify(read_json(WRONG_FILE))

@app.route("/wrong/add", methods=["POST"])
def add_wrong_question():
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"status":"error","reason":"invalid payload"}), 400
    wrong = read_json(WRONG_FILE)
    if not any(q.get("question") == data.get("question") for q in wrong):
        wrong.append(data)
        write_json(WRONG_FILE, wrong)
    return jsonify({"status":"ok"})

@app.route("/wrong/remove", methods=["POST"])
def remove_wrong_question():
    data = request.get_json()
    if not data or "question" not in data:
        return jsonify({"status":"error","reason":"invalid payload"}), 400
    wrong = read_json(WRONG_FILE)
    wrong = [q for q in wrong if q.get("question") != data.get("question")]
    write_json(WRONG_FILE, wrong)
    return jsonify({"status":"ok"})

# --- Endpoints för Highscores ---

@app.route("/highscores", methods=["GET"])
def get_highscores():
    return jsonify(read_json(HIGHSCORE_FILE))

@app.route("/highscores", methods=["POST"])
def post_highscore():
    data = request.get_json()
    if not data:
        return jsonify({"status":"error","reason":"invalid payload"}), 400
    scores = read_json(HIGHSCORE_FILE, default_value=[]) 
    scores.append(data)
    write_json(HIGHSCORE_FILE, scores)
    return jsonify({"status":"ok"})

# --- NY ENDPOINT: Hämta sparade taggar ---

@app.route('/tags', methods=['GET'])
def get_tags():
    """Läser in textfilen med taggar och skickar till frontend."""
    p = filepath(TAGGED_QUESTIONS_FILE)
    try:
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8") as f:
                content = f.read()
            return jsonify({"success": True, "content": content})
        else:
            return jsonify({"success": True, "content": ""})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# --- NY ENDPOINT: Tagga fråga med kommentar ---

@app.route('/tag', methods=['POST']) 
def tag_question():
    """Sparar den taggade frågan i en textfil."""
    try:
        data = request.get_json()
        question = data.get('question', 'N/A')
        category = data.get('category', 'Okänd kategori')
        source = data.get('source', 'Okänd källa')
        comment = data.get('comment', '').strip()
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        entry = (
            f"--- Taggad Fråga ({timestamp}) ---\n"
            f"Källa: {source} | Kategori: {category}\n"
            f"Fråga: {question}\n"
        )
        if comment:
            entry += f"Anteckning: {comment}\n"
        entry += f"---------------------------------\n\n"

        with open(filepath(TAGGED_QUESTIONS_FILE), 'a', encoding='utf-8') as f:
            f.write(entry)

        return jsonify({"success": True, "message": "Fråga taggad!"}), 200
    except Exception as e:
        print(f"Fel vid taggning av fråga: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
