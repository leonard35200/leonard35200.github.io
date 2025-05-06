document.addEventListener('DOMContentLoaded', function() {window.scrollTo({ top: 0 })});


function devinerChiffre() {
  const res = parseInt(document.getElementById("resultat").value);
  const chiffre = 9 - (res % 9);
  document.getElementById("resultat").value = "";
  document.getElementById("cc").innerHTML = "<p>Le chiffre que tu as rayé est : " + chiffre + "</p> ";
  document.getElementById("retour").style.margin = "40px auto 0 auto";
  document.getElementById("retour").style.display = "block";
}

function recommencer() {
    const button = document.getElementById('retour');
    button.classList.add('rotate');
    setTimeout(() => {
        button.classList.remove('rotate');
        window.location.href="nombre-caché.html";
    }, 500);
}

document.getElementById('retour').addEventListener('click', function(event) {
    const button = this;
    button.classList.add('rotate');
    setTimeout(() => {
        button.classList.remove('rotate');
        window.location.href="nombre-caché.html";
    }, 500);
});

