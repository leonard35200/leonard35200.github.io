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
<body><h1>Loup Solitaire - Paragraphe 1</h1>
<p style="display:none;">écrire avant ici</p>
</body></html>
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
                insert_pos = content.rfind('<p style="display:none;">écrire avant ici</p>')
                para_html = (
                    f'<p id="para{current_num}" '
                    f'data-vulnerablePsy="True" '
                    f'data-attaquePsy="False" '
                    f'data-attaqueQuotient="0hab" '
                    f'data-bonus="0hab">'
                    f'<strong>{current_num} :</strong> {texte}</p>\n'
                )
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
  #preview {{ border:1px solid #aaa; padding:10px; min-height:150px; max-height:300px; overflow-y:auto; font-family:monospace; }}
  .number-highlight {{ background-color: yellow; font-weight:bold; cursor:pointer; padding:2px 4px; border-radius:3px; user-select:none; }}
  .number-link {{ background-color:#87cefa; font-weight:bold; cursor:pointer; padding:2px 4px; border-radius:3px; user-select:none; text-decoration:underline; }}
  button {{ margin-right:10px; }}
</style>
</head>
<body>
<h2>Paragraphe actuel : {current_num}</h2>

<textarea id="texte" placeholder="Collez votre paragraphe ici..." style="width:90%;height:150px;font-family:monospace;"></textarea><br>
<button onclick="applyHighlight()">Surligner les nombres</button>
<button onclick="wrapSelectedText()" style="background-color:yellow;">Mettre en gras</button>
<button onclick="submitText()" style="background-color:red;">Valider et Ajouter</button>

<div id="preview" contenteditable="true" spellcheck="false" aria-label="Prévisualisation du paragraphe"></div>

<form id="form" method="post" style="display:none;">
  <input type="hidden" name="texte_final" id="texte_final">
</form>

<script>
function escapeHtml(text) {{
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}}

function applyHighlight() {{
  const raw = document.getElementById("texte").value;
  const escaped = escapeHtml(raw);
  const highlighted = escaped.replace(/(\\d+)/g,
    '<span class="number-highlight" onclick="toggleLink(event)">$1</span>');
  // Entoure chaque ligne dans un <p>
  const paras = highlighted.split('\\n')
    .map(line => '<p>' + line + '</p>')
    .join('');
  document.getElementById("preview").innerHTML = paras;
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

function wrapSelectedText() {{
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  const preview = document.getElementById("preview");
  if (!preview.contains(range.commonAncestorContainer)) return;

  const strong = document.createElement("strong");
  strong.textContent = sel.toString();
  range.deleteContents();
  range.insertNode(strong);

  // Remonter au <p> parent
  let p = strong.parentElement;
  while (p && p.tagName !== "P") p = p.parentElement;
  if (!p) return alert("Sélection hors paragraphe");

  // Prompts pour data-*
  const v1 = prompt("data-vulnerablePsy ?", "True");
  const v2 = prompt("data-attaquePsy ?", "False");
  const v3 = prompt("data-attaqueQuotient ?", "0hab");
  const v4 = prompt("data-bonus ?", "0hab");

  p.setAttribute("data-vulnerablePsy", v1);
  p.setAttribute("data-attaquePsy", v2);
  p.setAttribute("data-attaqueQuotient", v3);
  p.setAttribute("data-bonus", v4);
}}

function submitText() {{
  const preview = document.getElementById("preview");
  const clone = preview.cloneNode(true);

  clone.querySelectorAll("span.number-link").forEach(span => {{
    const n = span.textContent;
    const a = document.createElement("a");
    a.href = "#para" + n;
    a.textContent = n;
    a.style.textDecoration = "underline";
    a.style.color = "blue";
    span.replaceWith(a);
  }});

  clone.querySelectorAll("span.number-highlight").forEach(span => {{
    span.replaceWith(document.createTextNode(span.textContent));
  }});

  document.getElementById("texte_final").value = clone.innerHTML;
  document.getElementById("form").submit();
}}
</script>

<p>Instructions :
1. Collez votre paragraphe dans la zone de texte.
2. Cliquez sur “Surligner les nombres”.
3. Sélectionnez un texte et cliquez “Mettre en gras” pour ajouter les data-attributes.
4. Cliquez “Valider et Ajouter”.</p>

</body>
</html>
"""
    return render_template_string(page)

if __name__ == "__main__":
    app.run(debug=True)
