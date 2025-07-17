from flask import Flask, render_template_string, request, redirect
import os

app = Flask(__name__)

HTML_FILE = "paragraphe.html"
NUM_FILE = "current_para_num.txt"

if not os.path.exists(NUM_FILE):
    with open(NUM_FILE, "w") as f:
        f.write("1")

if not os.path.exists(HTML_FILE):
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write("""<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Loup Solitaire</title></head>
<body><h1>Loup Solitaire - Paragraphe 1</h1></body></html>
""")

@app.route("/", methods=["GET", "POST"])
def index():
    with open(NUM_FILE, "r") as f:
        current_num = int(f.read().strip())

    if request.method == "POST":
        texte = request.form.get("texte_final", "").strip()
        if texte:
            with open(HTML_FILE, "r+", encoding="utf-8") as f:
                content = f.read()
                insert_pos = content.rfind('<p style="display: none;">écrire avant ici</p>')

                para_html = f'<p id="para{current_num}"><strong>{current_num} :</strong> {texte}</p>\n'
                new_content = content[:insert_pos] + para_html + content[insert_pos:]
                f.seek(0)
                f.write(new_content)
                f.truncate()

            current_num += 1
            with open(NUM_FILE, "w") as f:
                f.write(str(current_num))

            return redirect("/")

    page = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Éditeur Loup Solitaire</title>
<style>
.number-highlight {{
  background-color: yellow;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  user-select: none;
}}
.number-link {{
  background-color: #87cefa;
  font-weight: bold;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  user-select: none;
  text-decoration: underline;
}}
#texte {{
  width: 90%;
  height: 150px;
  white-space: pre-wrap;
  font-family: monospace;
  margin-bottom: 10px;
}}
#preview {{
  border: 1px solid #aaa;
  padding: 10px;
  white-space: pre-wrap;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
}}
button {{
  margin-right: 10px;
}}
</style>
</head>
<body>
<h2>Paragraphe actuel : {current_num}</h2>

<textarea id="texte" placeholder="Collez votre paragraphe ici..."></textarea><br>
<button onclick="applyHighlight()">Surligner les nombres</button>
<button onclick="wrapSelectedText()" style="background-color:yellow">Mettre en gras</button>
<button onclick="submitText()" style="background-color:red">Valider et Ajouter</button>

<div id="preview" contenteditable="true" spellcheck="false" aria-label="Prévisualisation du paragraphe avec sélection des liens"></div>

<form id="form" method="post" style="display:none;">
  <input type="hidden" name="texte_final" id="texte_final">
</form>

<script>
function applyHighlight() {{
  const rawText = document.getElementById("texte").value;
  const escaped = rawText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withHighlights = escaped.replace(/(\\d+)/g, '<span class="number-highlight" onclick="toggleLink(event)">$1</span>');
  const preview = document.getElementById("preview");
  preview.innerHTML = withHighlights;
}}

function toggleLink(event) {{
  const span = event.target;
  if (span.classList.contains("number-link")) {{
    span.classList.remove("number-link");
    span.classList.add("number-highlight");
  }} else {{
    span.classList.remove("number-highlight");
    span.classList.add("number-link");
  }}
  event.stopPropagation();
}}

function submitText() {{
  let preview = document.getElementById("preview");
  let clone = preview.cloneNode(true);

  clone.querySelectorAll("span.number-link").forEach(span => {{
    const num = span.textContent;
    const a = document.createElement("a");
    a.href = "#para" + num;
    a.textContent = num;
    a.style.textDecoration = "underline";
    a.style.color = "blue";
    span.replaceWith(a);
  }});

  clone.querySelectorAll("span.number-highlight").forEach(span => {{
    const txt = document.createTextNode(span.textContent);
    span.replaceWith(txt);
  }});

  document.getElementById("texte_final").value = clone.innerHTML;
  document.getElementById("form").submit();
}}

function wrapSelectedText() {{
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const preview = document.getElementById("preview");

  if (!preview || !preview.contains(range.commonAncestorContainer)) return;

  const strong = document.createElement("strong");
  strong.textContent = range.toString();

  const br1 = document.createElement("br");
  const br2 = document.createElement("br");
  const br3 = document.createElement("br");
  const br4 = document.createElement("br");

  range.deleteContents();

  const fragment = document.createDocumentFragment();
  fragment.appendChild(br1);
  fragment.appendChild(br2);
  fragment.appendChild(strong);
  fragment.appendChild(br3);
  fragment.appendChild(br4);

  range.insertNode(fragment);

  const val1 = prompt("Valeur pour data-vulnerablePsy (ex : True) ?", "True");
  const val2 = prompt("Valeur pour data-attaquePsy (ex : False) ?", "False");
  const val3 = prompt("Valeur pour data-attaqueQuotient (ex : 0hab) ?", "0hab");
  const val4 = prompt("Valeur pour data-bonus (ex : 0hab) ?", "0hab");

  const parentP = strong.closest("p");

  if (parentP) {{
    parentP.setAttribute("data-vulnerablePsy", val1);
    parentP.setAttribute("data-attaquePsy", val2);
    parentP.setAttribute("data-attaqueQuotient", val3);
    parentP.setAttribute("data-bonus", val4);
  }}
}}
</script>

<p>Instructions :  
1. Collez votre paragraphe dans la zone de texte.  
2. Cliquez sur “Surligner les nombres” pour repérer tous les nombres.  
3. Cliquez sur les nombres que vous souhaitez transformer en liens (ils passent en bleu).  
4. Cliquez sur “Valider et Ajouter” pour sauvegarder.</p>

</body>
</html>
"""
    return render_template_string(page)

if __name__ == "__main__":
    app.run(debug=True)
