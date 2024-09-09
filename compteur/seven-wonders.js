 function updateTable(){
                        var  numPlayers = parseInt(document.getElementById('numPlayers').value);
            // Efface le contenu actuel du tableau
            var table = document.getElementById('scoreTable');
            table.innerHTML = '';

            // Génère les colonnes du tableau en fonction du nombre de joueurs
            var headerRow = table.insertRow(0);
            headerRow.insertCell(0);

            for (var i = 1; i <= numPlayers; i++) {
                var cell = headerRow.insertCell(i);
                cell.innerHTML = 'Joueur ' + i;
              cell.style.backgroundColor = 'BlanchedAlmond';
            }

            // Génère les lignes du tableau pour chaque catégorie
            var categories = [ 'Pièce', 'Merveille','Armée',' ',' ',' ',' ']; // Ajoutez d'autres catégories au besoin
            var couleurs = [ '#C0C0C0','#C0C0C0','Red', 'DodgerBlue', 'Orange', 'SlateBlue', 'ForestGreen']; // Ajoutez d'autres couleurs au besoin
            for (var i = 0; i < categories.length; i++) {
                var row = table.insertRow(-1);
                var cell = row.insertCell(0);
                cell.innerHTML = categories[i];
                cell.style.backgroundColor = couleurs[i];        
                

                for (var j = 1; j <= numPlayers; j++) {
                    var cell = row.insertCell(j);
                    cell.contentEditable = true;
                }
            }
        }

        function calculateScores() {
            // Logique de calcul des scores ici

            // Exemple simple : addition des points par colonne
            var totalPoints = [];
            var table = document.getElementById('scoreTable');
            
            for (var i = 1; i < table.rows[0].cells.length; i++) {
                var total = 0;
                for (var j = 1; j < table.rows.length; j++) {
                    total += parseInt(table.rows[j].cells[i].innerText) || 0;
                }
                totalPoints.push(total);
            }

            // Afficher les scores finaux
            var alertMessage = 'Scores Finaux:\n';

for (var i = 0; i < totalPoints.length; i++) {
    alertMessage += 'Joueur ' + (i + 1) + ' : ' + totalPoints[i] + ' points\n';
}

alert(alertMessage);
        }