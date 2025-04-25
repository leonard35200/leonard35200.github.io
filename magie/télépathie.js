

const symbolesDebut = [ "😀", "😁", "😂", "😇", "😉", "😊", "😋", "😌", "😍", "😎", "😏", "😑", "😒", "😓", "😕", "😖", "😘", "😜", "😞", "😟",  "😢", "😣", "😤", "😥", "😧", "😨", "😩", "😪", "😬", "😭", "😮", "😱", "😲", "😳", "😴", "😵", "😶", "🙁", "🙂", "🙃", "🙄"];
const symbolesDebut2 = ["🙂","🙃","😐","😑","😶","😮","😦","😕","😠","☹️"];
let symbolesFin = []
let secretSymbol = ""
const grid = document.getElementById("symbolGrid");

let largeurEcran = window.innerWidth;

let nombreColonnesDébut =  Math.floor(largeurEcran / 117);
let nombreColonnesFin = 0;
let listeColonnesPossibles = [4,5,7,11,12,13];

document.addEventListener('DOMContentLoaded', function() {smiley()});
document.addEventListener('DOMContentLoaded', function() {colonne(nombreColonnesDébut, listeColonnesPossibles)});
document.addEventListener('DOMContentLoaded', function() {test()});



function colonne(nombre, liste) {
    let plusProche = liste[0];
    let differenceMin = Math.abs(nombre - liste[0]);

    for (let i = 1; i < liste.length; i++) {
        let differenceActuelle = Math.abs(nombre - liste[i]);

        if (differenceActuelle < differenceMin || (differenceActuelle === differenceMin && liste[i] < plusProche)) {
            plusProche = liste[i];
            differenceMin = differenceActuelle;
        }
    }

    nombreColonnesFin = plusProche;
    grid.style.gridTemplateColumns = `repeat(${nombreColonnesFin}, 1fr)`;
}

function smiley(){
    while (symbolesFin.length < 10) {
       symboleProvisoire = symbolesDebut2[Math.floor(Math.random() * symbolesDebut2.length)];
       symbolesFin.push(symboleProvisoire)
       index = symbolesDebut2.indexOf(symboleProvisoire);
       symbolesDebut2.splice(index, 1);
    }
    secretSymbol = symbolesFin[Math.floor(Math.random() * symbolesFin.length)];
   
}
function test (){
    if (nombreColonnesFin === 4)
        { ajout = 0}
    else if (nombreColonnesFin === 5)
        {  ajout= 0}
    else if (nombreColonnesFin === 7)
        { ajout = 5}
    else if (nombreColonnesFin === 11)
        { ajout = 10}
    else if (nombreColonnesFin === 12)
        { ajout = 8}
    else if (nombreColonnesFin === 13)
        { ajout = 4}
    for (let i = 0; i < 100+ajout; i++) {
        console.log(symbolesDebut2)
        const sym = (i % 9 === 0) ? secretSymbol : symbolesFin[Math.floor(Math.random() * symbolesFin.length)];
        const div = document.createElement("div");
        div.className = "cell";
        div.innerHTML = `<span class="nombre">${i}:</span><span class="smiley">${sym}</span>`;
        grid.appendChild(div);
    }
}
function reveal() {
    document.getElementById("titre").style.display = "none";
    document.getElementById("texte").style.display = "none";
    document.getElementById("symbolGrid").style.display = "none";
    document.querySelector(".big-button").style.display = "none";
    document.getElementById("result").textContent = `Le symbole auquel tu penses est : ${secretSymbol}`;
    document.getElementById("retour").style.display = "block";
    document.getElementById("retour").style.margin = "40px auto 0 auto";

    // Ajout de l'animation sur le bouton "retour"
    document.getElementById('retour').addEventListener('click', function(event) {
        const button = this;

        // Ajoute la classe pour déclencher l'animation
        button.classList.add('rotate');

        // Attendre la fin de l'animation avant de rediriger
        setTimeout(() => {
            button.classList.remove('rotate');
            window.location.reload();
        }, 500); // Durée de l'animation (1 seconde)
    });

    
    document.getElementById("result").style.marginTop = "15%";

    var audio = document.getElementById("musiqueBalle");
    audio.play();

    window.scrollTo({ top: 0 });
}