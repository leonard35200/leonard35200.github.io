// Déclarations globales
let nombreJoueur = 1;
let nomsJoueur = [];
let nomsJoueurFin = JSON.parse(sessionStorage.getItem('nomsJoueur')) || [];
let nombreJoueurFin = parseInt(sessionStorage.getItem('nombreJoueur')) || 1;

// Définition des catégories et couleurs
let categoriesSevenWonders = [ 'Pièce', 'Merveille','Armée',' ',' ',' ',' '];
let couleursSevenWonders = [ 'grey','grey','red', 'blue', 'yellow', 'purple', 'green'];

let categoriesSevenWondersArchitechte = [ '🏛️', '🐱','','⚔️ ',' 🧪'];
let couleursSevenWondersArchitechte = [ 'grey','grey','blue', 'red', 'green'];


let categoriesSevenWondersDuel = [" "," ", " "," ", "merveille","scientifique","pièces",""];
let couleursSevenWondersDuel = [ 'royalblue','green','gold',"#7B1FA2", '#FFECB3',"#2E7D32", "#FDD835","#C62828"];

let categoriesPetitesBourgardes = ["Usine","Maison","Eglise","Taverne","Jaune","Puit","Tour","Case Vide"];
let couleursPetitesBourgardes = ["#CCCCCC","#FFFFFF","#FF0000","#00FF00","#FFFF00","#0000FF","#800080","#FFFFFF"];
let imagesPetitesBourgardes = ["image/Usine.png","image/Maison.png","image/Eglise.png","image/Taverne.png","image/Jaune.png","image/Puit.png","image/Tour.png","image/Casevide.png"];

// Fonctions pour changer le nombre de joueurs
function changerNombreJoueur(value) {
  nombreJoueur = value;
  sessionStorage.setItem('nombreJoueur', value);
  nombreJoueurFin = value;
}

function unJoueur() { changerNombreJoueur(1); updateInputFields(); }
function deuxJoueurs() { changerNombreJoueur(2); updateInputFields(); }
function troisJoueurs() { changerNombreJoueur(3); updateInputFields(); }
function quatreJoueurs() { changerNombreJoueur(4); updateInputFields(); }
function cinqJoueurs() { changerNombreJoueur(5); updateInputFields(); }
function sixJoueurs() { changerNombreJoueur(6); updateInputFields(); }
function septJoueurs() { changerNombreJoueur(7); updateInputFields(); }

// Fonction pour mettre à jour les champs de saisie
function updateInputFields() {
  var inputsContainer = document.getElementById('inputsContainer');
  if (!inputsContainer) {
    console.error('Conteneur d\'entrées non trouvé.');
    return;
  }
  inputsContainer.innerHTML = '';
  for (var i = 1; i <= nombreJoueur; i++) {
    var input = document.createElement('input');
    input.className = 'input_nom_joueur';
    input.type = 'text';
    input.placeholder = 'Nom du joueur ' + i;
    input.id = 'nombreJoueur' + i;
    inputsContainer.appendChild(input);
  }
}

// Fonction pour sauvegarder les noms des joueurs
function saveInputValues() {
  nomsJoueur = [];
  for (var i = 1; i <= nombreJoueur; i++) {
    var inputId = 'nombreJoueur' + i;
    var input = document.getElementById(inputId);
    if (input) {
      var inputValue = input.value.trim();
      nomsJoueur.push(inputValue || 'Joueur ' + i);
    } else {
      nomsJoueur.push('Joueur ' + i);
    }
  }
  sessionStorage.setItem('nomsJoueur', JSON.stringify(nomsJoueur));
  nomsJoueurFin = nomsJoueur;
  var divJeux = document.getElementById("jeux");
  if (divJeux) {
    divJeux.style.display = "block";
  }
}

// Fonction pour mettre à jour le tableau des scores
function updateTableSeven(categorie, couleurs, images = []) {
  var nomsJoueurs = JSON.parse(sessionStorage.getItem('nomsJoueur')) || [];
  var nombreJoueurFin = parseInt(sessionStorage.getItem('nombreJoueur')) || 1;

  if (!nomsJoueurs.length || isNaN(nombreJoueurFin)) {
    console.error('Les données des joueurs ne sont pas disponibles ou invalides.');
    return;
  }

  var table = document.getElementById('scoreTableSeven');
  if (!table) {
    console.error('Tableau des scores non trouvé.');
    return;
  }

  table.innerHTML = '';

  var headerRowSeven = table.insertRow(0);
  headerRowSeven.insertCell(0).innerHTML = '';

  for (var i = 1; i <= nombreJoueurFin; i++) {
    var cell = headerRowSeven.insertCell(i);
    cell.innerHTML = nomsJoueurs[i - 1] || 'Joueur ' + i;
    cell.style.backgroundColor = "BlanchedAlmond";
  }

  for (var i = 0; i < categorie.length; i++) {
    var row = table.insertRow(-1);
    var cell = row.insertCell(0);

    if (images.length && images[i]) {
      cell.innerHTML = '<img src="' + images[i] + '" alt="' + categorie[i] + '" style="width:50px;height:50px;">';
    } else {
      cell.textContent = categorie[i] || 'Catégorie';
    }

    cell.style.backgroundColor = couleurs[i] || 'white';

    for (var j = 1; j <= nombreJoueurFin; j++) {
      var cell = row.insertCell(j);
      cell.contentEditable = true;
    }
  }
}

// Fonction pour calculer les scores
function calculateScoresSeven() {
  var table = document.getElementById('scoreTableSeven');
  if (!table) {
    console.error('Tableau des scores non trouvé.');
    return;
  }

  var totalPointsSeven = [];
  var nombreJoueurFin = table.rows[0].cells.length - 1;
  var nomsJoueurs = JSON.parse(sessionStorage.getItem('nomsJoueur')) || [];

  for (var i = 1; i <= nombreJoueurFin; i++) {
    var total = 0;
    for (var j = 1; j < table.rows.length; j++) {
      var cellValue = parseInt(table.rows[j].cells[i].innerText);
      total += isNaN(cellValue) ? 0 : cellValue;
    }
    totalPointsSeven.push(total);
  }

  var playerScores = [];
  for (var i = 0; i < totalPointsSeven.length; i++) {
    playerScores.push({ player: nomsJoueurs[i] || 'Joueur ' + (i + 1), points: totalPointsSeven[i] });
  }

  playerScores.sort(function(a, b) {
    return b.points - a.points;
  });

  var resultString = 'Scores Finaux:\n';
  for (var i = 0; i < playerScores.length; i++) {
    resultString += playerScores[i].player + ' : ' + playerScores[i].points + ' points\n';
  }

  alert(resultString);
}

// Fonction pour choisir le premier joueur aléatoirement
function choisirPremierJoueur() {
  var nomsJoueurs = JSON.parse(sessionStorage.getItem('nomsJoueur')) || [];
  if (!nomsJoueurs.length) {
    alert('Aucun joueur défini.');
    return;
  }
  var premierJoueurIndex = Math.floor(Math.random() * nomsJoueurs.length);
  var ordreJoueurs = nomsJoueurs.slice(premierJoueurIndex).concat(nomsJoueurs.slice(0, premierJoueurIndex));
  sessionStorage.setItem('nomsJoueur', JSON.stringify(ordreJoueurs));
  alert(ordreJoueurs[0] + " est le premier Joueur");
}

// Écouteur d'événements pour charger les données appropriées selon la page
window.addEventListener('load', function() {
  var pathname = window.location.pathname;

  if (pathname.endsWith("seven-wonders.html")) {
    updateTableSeven(categoriesSevenWonders, couleursSevenWonders);
  } else if (pathname.endsWith("seven-wonders-duel.html") && nombreJoueurFin === 2) {
    updateTableSeven(categoriesSevenWondersDuel, couleursSevenWondersDuel);
  } else if (pathname.endsWith("seven-wonders-architects.html")) {
    updateTableSeven(categoriesSevenWondersArchitechte, couleursSevenWondersArchitechte);
  } else if (pathname.endsWith("petite-bourgade.html")) {
    updateTableSeven(categoriesPetitesBourgardes, couleursPetitesBourgardes, imagesPetitesBourgardes);
  }
});