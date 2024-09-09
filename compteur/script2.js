let nombreJoueur = 1;
let nomsJoueur = [];
let nomsJoueurFin = JSON.parse(sessionStorage.getItem('nomsJoueur'));
let nombreJoueurFin = sessionStorage.getItem('nombreJoueur');


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

sessionStorage.setItem('nomsJoueurs', JSON.stringify(nomsJoueur));
  nomsJoueurFin = JSON.parse(sessionStorage.getItem('nomsJoueur'));
  var divJeux = document.getElementById("jeux");
 divJeux.style.display = "block"; 
}

function updateTableSeven() {


            // Efface le contenu actuel du tableau
            var table = document.getElementById('scoreTableSeven');
            table.innerHTML = '';

            // Génère les colonnes du tableau en fonction du nombre de joueurs
            var headerRowSeven= table.insertRow(0);
            headerRowSeven.insertCell(0);

            for (var i = 1; i <= nombreJoueurFin; i++) {
                var cell = headerRowSeven.insertCell(i);
                cell.innerHTML = 'Joueur ' + i;
           cell.style.backgroundColor ="BlanchedAlmond";
            }

            // Génère les lignes du tableau pour chaque catégorie
            var categoriesSeven = [ 'Pièce', 'Merveille','Armée',' ',' ',' ',' ']; // Ajoutez d'autres catégories au besoin
            var couleursSeven = [ 'grey','grey','red', 'blue', 'yellow', 'purple', 'green']; // Ajoutez d'autres couleurs au besoin
            for (var i = 0; i < categoriesSeven.length; i++) {
                var row = table.insertRow(-1);
                var cell = row.insertCell(0);
                cell.innerHTML = categoriesSeven[i];
                cell.style.backgroundColor = couleursSeven[i];        


                for (var j = 1; j <= nombreJoueurFin; j++) {
                    var cell = row.insertCell(j);
                    cell.contentEditable = true;
                }
            }
        }

function calculateScoresSeven() {
            // Logique de calcul des: scores ici

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

            // Afficher les scores finaux

var resultString = 'Scores Finaux:\n';

// Tri du tableau dans l'ordre décroissant
var playerScores = [];

// Remplir le tableau d'objets avec le numéro du joueur et ses points
for (var i = 0; i < totalPointsSeven.length; i++) {
    playerScores.push({ player: i + 1, points: totalPointsSeven[i] });
}

// Tri du tableau d'objets dans l'ordre décroissant en fonction des points
playerScores.sort(function(a, b) {
    return b.points - a.points;
});

// Générer la chaîne de résultats
var resultString = 'Scores Finaux:\n';

for (var i = 0; i < playerScores.length; i++) {
    resultString += 'Joueur ' + playerScores[i].player + ' : ' + playerScores[i].points + ' points\n';
}

alert(resultString);

}

window.addEventListener('load', function() {
    // Vérifier si la page actuelle est "seven-wonders.html"
    if (window.location.pathname.endsWith("seven-wonders.html")) {
        // Appeler la fonction uniquement pour la page "seven-wonders.html"
        updateTableSeven();
    }
});



    // Ajoutez ici le code spécifique à votre fonction pour cette page


