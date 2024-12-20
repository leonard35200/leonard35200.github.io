// Sélection des éléments HTML
const div1 = document.getElementById('div1');
const div2 = document.getElementById('div2');
const entree = document.getElementById('entree');
const decalageEntree = document.getElementById('decalageEntree');
const btnValidation = document.getElementById('validation');
const h4 = document.getElementById('h4');
const p1 = document.getElementById('p1');

let methode = ''; // Méthode de cryptage
let chiffrage = ''; // Cryptage ou Décryptage

// Fonction pour changer d'étape
function remplacerDivs() {
  h4.innerText = 'Voulez-vous crypter ou décrypter ?';
  div1.style.display = 'none';
  div2.style.display = 'block';
}

// Fonction pour afficher les champs de texte
function afficherTextarea() {
  div2.style.display = 'none';
  h4.innerText = '';
  entree.style.display = 'block';
  btnValidation.style.display = 'block';

  if (methode === 'Cesar') {
    decalageEntree.style.display = 'block';
  }
}

// Fonction de validation
function validation() {
  const texte = entree.value;
  const decalage = parseInt(decalageEntree.value) || 0;

  if (methode === 'ROT13') {
    afficherTexte(cesar(texte, 13));
  } else if (methode === 'Cesar') {
    afficherTexte(cesar(texte, decalage));
  } else {
    p1.innerText = `Méthode ${methode} non encore implémentée.`;
  }
}

// Afficher le texte final
function afficherTexte(resultat) {
  entree.style.display = 'none';
  decalageEntree.style.display = 'none';
  btnValidation.style.display = 'none';
  h4.innerText = `Voici votre texte ${chiffrage} :`;
  p1.innerText = resultat;
}

// Fonction de cryptage César
function cesar(phrase, decalage) {
  let cryptee = '';
  for (let i = 0; i < phrase.length; i++) {
    const char = phrase[i];
    const code = phrase.charCodeAt(i);

    if (code >= 65 && code <= 90) {
      cryptee += String.fromCharCode(((code - 65 + decalage) % 26) + 65);
    } else if (code >= 97 && code <= 122) {
      cryptee += String.fromCharCode(((code - 97 + decalage) % 26) + 97);
    } else {
      cryptee += char;
    }
  }
  return cryptee;
}

// Écouteurs d'événements
document.getElementById('ROT13').addEventListener('click', () => {
  methode = 'ROT13';
  remplacerDivs();
});

document.getElementById('Cesar').addEventListener('click', () => {
  methode = 'Cesar';
  remplacerDivs();
});

document.getElementById('cryptage').addEventListener('click', () => {
  chiffrage = 'crypté';
  afficherTextarea();
});

document.getElementById('decryptage').addEventListener('click', () => {
  chiffrage = 'décrypté';
  afficherTextarea();
});

btnValidation.addEventListener('click', validation);
