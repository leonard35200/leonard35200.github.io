from flask import Flask, request, redirect, render_template_string

app = Flask(__name__)

HTML_FILE = "texte.html"  # fichier HTML où insérer les paragraphes
NUM_FILE = "num.txt"      # fichier texte contenant le numéro courant

# Charger ou initialiser le numéro de paragraphe
try:
    with open(NUM_FILE, "r") as f:
        current_num = int(f.read().strip())
except:
    current_num = 1

@app.route("/", methods=["GET", "POST"])
def index():
    global current_num

    if request.method == "POST":
        texte = request.form.get("texte_final", "").strip()
        vulnerablePsy = request.form.get("vulnerablePsy", "")
        attaquePsy = request.form.get("attaquePsy", "")
        attaqueQuotient = request.form.get("attaqueQuotient", "")
        bonus = request.form.get("bonus", "")

        if texte:
            with open(HTML_FILE, "r+", encoding="utf-8") as f:
                content = f.read()

                # Position avant le marqueur invisible pour insérer
                insert_pos = content.rfind('<p style="display: none;">écrire avant ici</p>')
                if insert_pos == -1:
                    insert_pos = len(content)

                data_attrs = (
                    f' data-vulnerablePsy="{vulnerablePsy}"'
                    f' data-attaquePsy="{attaquePsy}"'
                    f' data-attaqueQuotient="{attaqueQuotient}"'
                    f' data-bonus="{bonus}"'
                )

                para_html = f'<p id="para{current_num}"{data_attrs}><strong>{current_num} :</strong> {texte}</p>\n'

                new_content = content[:insert_pos] + para_html + content[insert_pos:]

                f.seek(0)
                f.write(new_content)
                f.truncate()

            current_num += 1

            with open(NUM_FILE, "w") as f:
                f.write(str(current_num))

        return redirect("/")

    # GET: afficher un formulaire simple pour test (à adapter selon ton interface)
    return render_template_string("""
    <form method="post" id="form">
      <textarea name="texte_final" id="preview" rows="6" cols="60" placeholder="Écris ton texte ici..."></textarea><br>

      <label>data-vulnerablePsy: <input type="text" name="vulnerablePsy" id="vulnerablePsy"></label><br>
      <label>data-attaquePsy: <input type="text" name="attaquePsy" id="attaquePsy"></label><br>
      <label>data-attaqueQuotient: <input type="text" name="attaqueQuotient" id="attaqueQuotient"></label><br>
      <label>data-bonus: <input type="text" name="bonus" id="bonus"></label><br>

      <button type="submit">Valider le paragraphe</button>
    </form>
    """)
    

if __name__ == "__main__":
    app.run(debug=True)
