let nombreJoueur = 1;
let nomsJoueur = [];
let nomsJoueurFin = JSON.parse(sessionStorage.getItem('nomsJoueur'));
let nombreJoueurFin = sessionStorage.getItem('nombreJoueur');

let categoriesSevenWonders = [ 'Pièce', 'Merveille','Armée',' ',' ',' ',' '];
let couleursSevenWonders = [ 'grey','grey','red', 'blue', 'yellow', 'purple', 'green'];

let categoriesSevenWondersDuel = [" "," ", " "," ", "merveille","scientifique","pièces",""];
let couleursSevenWondersDuel = [ 'royalblue','green','gold',"#7B1FA2", '#FFECB3',"#2E7D32", "#FDD835","#C62828"];

let categoriesPetitesBourgardes = ["","","","","","","",""]
let couleursPetitesBourgardes = ["","","","","","","",""]
let imagesPetitesBourgardes = ["Usine.png","Maison.png","Eglise.png","Taverne.png","jaune.png","puit.png","tour.png","casevide.png"]


function test(){
  console.log('test')
}


function changerNombreJoueur(value) {
  nombreJoueur = value;
sessionStorage.setItem('nombreJoueur', value);
  nombreJoueurFin = sessionStorage.getItem('nombreJoueur');
  
}


function unJoueur() {
 changerNombreJoueur(1);
  updateInputFields();


}
function deuxJoueurs() {
  changerNombreJoueur(2);
  updateInputFields();
}
function troisJoueurs() {
  changerNombreJoueur(3);
  updateInputFields();
  
}
function quatreJoueurs() {
  changerNombreJoueur(4);
  updateInputFields();


}
function cinqJoueurs() {
  changerNombreJoueur(5);
  updateInputFields();
}
function sixJoueurs() {
  changerNombreJoueur(6);
  updateInputFields();
}
function septJoueurs() {
  changerNombreJoueur(7);
  updateInputFields();
}








function updateInputFields() {
// Remove any existing input fields
var inputsContainer = document.getElementById('inputsContainer');
inputsContainer.innerHTML = '';
// Create new input fields based on the value of nombreJoueur
for (var i = 1; i <= nombreJoueur; i++) {
  var input = document.createElement('input');
  input.className = 'input_nom_joueur';
  input.type = 'text';
  input.placeholder = 'Nom du joueur ' + i;
  input.id = 'nombreJoueur' + i;
  inputsContainer.appendChild(input);
}}



function saveInputValues() {
  // Ne redéclarez pas la variable ici, cela créerait une nouvelle portée locale
  nomsJoueur = []; // Utilisez simplement la variable existante sans le mot-clé 'let' ou 'var'

  for (var i = 1; i <= nombreJoueur; i++) {
    var inputId = 'nombreJoueur' + i;
    var inputValue = document.getElementById(inputId).value;
    nomsJoueur.push(inputValue);
  }

sessionStorage.setItem('nomsJoueur', JSON.stringify(nomsJoueur));
  nomsJoueurFin = JSON.parse(sessionStorage.getItem('nomsJoueur'));
  var divJeux = document.getElementById("jeux");
 divJeux.style.display = "block";
}

function updateTableSeven(categorie, couleurs, images) {
    var nomsJoueurs = JSON.parse(sessionStorage.getItem('nomsJoueur'));
    console.log(nomsJoueurs);

    var table = document.getElementById('scoreTableSeven');
    table.innerHTML = '';

    var headerRowSeven = table.insertRow(0);
    headerRowSeven.insertCell(0);

    for (var i = 1; i <= nombreJoueurFin; i++) {
        var cell = headerRowSeven.insertCell(i);
        cell.innerHTML = nomsJoueurFin[i - 1];
        cell.style.backgroundColor = "BlanchedAlmond";
    }

    for (var i = 0; i < categorie.length; i++) {
        var row = table.insertRow(-1);
        var cell = row.insertCell(0);

        // Condition pour éviter les images ou catégories vides
        if (images && images[i]) {
            cell.innerHTML = '<img src="' + images[i] + '" alt="' + (categorie[i] || 'Catégorie') + '" style="width:50px;height:50px;">';
        } else {
            cell.innerHTML = categorie[i] || 'Catégorie';  // Utiliser 'Catégorie' si la catégorie est vide
        }

        cell.style.backgroundColor = couleurs[i] || 'white';  // Couleur par défaut si vide

        for (var j = 1; j <= nombreJoueurFin; j++) {
            var cell = row.insertCell(j);
            cell.contentEditable = true;
        }
    }
}
function calculateScoresSeven() {
    // Logique de calcul des scores ici (omise pour la clartÃ©)

    // Exemple simple : addition des points par colonne
    var totalPointsSeven = [];
    var table = document.getElementById('scoreTableSeven');

    for (var i = 1; i < table.rows[0].cells.length; i++) {
        var total = 0;
        for (var j = 1; j < table.rows.length; j++) {
            total += parseInt(table.rows[j].cells[i].innerText) || 0;
        }
        totalPointsSeven.push(total);
    }

    // Tri du tableau dans l'ordre dÃ©croissant
    var playerScores = [];

    // Remplir le tableau d'objets avec le numÃ©ro du joueur et ses points
    for (var i = 0; i < totalPointsSeven.length; i++) {
        playerScores.push({ player: nomsJoueurFin[i], points: totalPointsSeven[i] });
    }

    // Tri du tableau d'objets dans l'ordre dÃ©croissant en fonction des points
    playerScores.sort(function(a, b) {
        return b.points - a.points;
    });

    // GÃ©nÃ©rer la chaÃ®ne de rÃ©sultats sans les prÃ©noms des joueurs
    var resultString = 'Scores Finaux:\n';

    for (var i = 0; i < playerScores.length; i++) {
        resultString += playerScores[i].player + ' : ' + playerScores[i].points + ' points\n';
    }

    // Afficher l'alerte avec les rÃ©sultats
    alert(resultString);
}


window.addEventListener('load', function() {
    // Vérifier si la page actuelle est "seven-wonders.html"
    if (window.location.pathname.endsWith("seven-wonders.html") ) {
        // Appeler la fonction uniquement pour la page "seven-wonders.html"
        updateTableSeven(categoriesSevenWonders, couleursSevenWonders);
    }
});

window.addEventListener('load', function() {
    // Vérifier si la page actuelle est "seven-wonders.html"
    if (window.location.pathname.endsWith("seven-wonders-duel.html") && nombreJoueurFin === '2') {
        updateTableSeven(categoriesSevenWondersDuel, couleursSevenWondersDuel);
     
    }
});

window.addEventListener('load', function() {
    // Vérifier si la page actuelle est "seven-wonders.html"
    if (window.location.pathname.endsWith("seven-wonders-architects.html") ) {
        updateTableSeven(categoriesSevenWonders, couleursSevenWonders);
    }
});



window.addEventListener('load', function() {
     if (window.location.pathname.endsWith("petite-bourgade.html") ) {
        updateTableSeven(categoriesPetitesBourgades, couleursPetitesBourgades, imagesPetitesBourgades);
    }
});


// Ajoutez cette fonction pour mettre à jour le bouton après le choix du premier joueur


// Modifiez la fonction choisirPremierJoueur pour appeler updateBoutonChoixPremierJoueur
function choisirPremierJoueur() {
  var nomsJoueurs = JSON.parse(sessionStorage.getItem('nomsJoueur'));
  var premierJoueurIndex = Math.floor(Math.random() * nomsJoueurs.length);
  var ordreJoueurs = nomsJoueurs.slice(premierJoueurIndex).concat(nomsJoueurs.slice(0, premierJoueurIndex));
  sessionStorage.setItem('nomsJoueur', JSON.stringify(ordreJoueurs));
  console.log("Ordre des joueurs après choix aléatoire du premier joueur :", ordreJoueurs)
    alert(ordreJoueurs[0] + " est le premier Joueur");
}


