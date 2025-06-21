import os
import zipfile
import re
import sys
from bs4 import BeautifulSoup

def extraire_epub(epub_path, output_dir="epub_extrait"):
    with zipfile.ZipFile(epub_path, 'r') as z:
        z.extractall(output_dir)
    return output_dir

def collecter_html_et_images(dossier):
    htmls = []
    images = []
    for root, _, files in os.walk(dossier):
        for file in files:
            if file.endswith(".xhtml") or file.endswith(".html"):
                htmls.append(os.path.join(root, file))
            elif file.lower().endswith((".png", ".jpg", ".jpeg", ".gif", ".svg")):
                images.append(os.path.join(root, file))
    return sorted(htmls), images

def nettoyer_html(html_paths):
    contenu = ""
    for path in html_paths:
        with open(path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f, "html.parser")
            corps = soup.body or soup
            contenu += str(corps)
    return contenu

def transformer_en_interactif(html_content):
    contenu = html_content

    # Ajoute les blocs de paragraphes numérotés
    contenu = re.sub(
        r'(?<!id="p)(?<!href="#p)(\D|^)(\d{1,4})([.,\s])',
        lambda m: f'{m.group(1)}<div id="p{m.group(2)}" class="paragraphe" style="display:none;"><h2>Paragraphe {m.group(2)}</h2>',
        contenu
    )

    # Ferme les blocs (une fermeture simple)
    contenu += "</div>" * contenu.count('<div id="p')

    # Transforme les références en liens cliquables
    contenu = re.sub(
        r'\b(?<!id="p)(?<!href="#p)(\d{1,4})\b',
        r'<a href="#p\1" onclick="afficherParagraphe(\'p\1\'); return false;">\1</a>',
        contenu
    )

    js = """
<script>
function afficherParagraphe(id) {
  document.querySelectorAll('.paragraphe').forEach(p => p.style.display = 'none');
  const cible = document.getElementById(id);
  if (cible) {
    cible.style.display = 'block';
    window.location.hash = id;
  }
}
// Affiche automatiquement le premier paragraphe au chargement
window.onload = function() {
  afficherParagraphe('p1');
};
</script>
"""

    return f"<!DOCTYPE html><html><head><meta charset='utf-8'><title>Loup Solitaire Interactif</title></head><body>{js}\n{contenu}</body></html>"

def enregistrer_html(resultat_html, nom_fichier="loup_solitiaire_epub.html"):
    with open(nom_fichier, "w", encoding="utf-8") as f:
        f.write(resultat_html)
    print(f"✅ HTML interactif créé : {nom_fichier}")

def main():
    if len(sys.argv) != 2:
        print("Usage : python script_epub.py chemin_fichier.epub")
        return

    epub_path = sys.argv[1]
    dossier = extraire_epub(epub_path)
    html_paths, _ = collecter_html_et_images(dossier)
    contenu_html = nettoyer_html(html_paths)
    html_interactif = transformer_en_interactif(contenu_html)
    enregistrer_html(html_interactif)

if __name__ == "__main__":
    main()
