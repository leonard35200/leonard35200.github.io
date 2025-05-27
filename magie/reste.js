function initialiserPage() {
      ['r49', 'r82', 'r89'].forEach(id => document.getElementById(id).value = '');
      document.getElementById('resultat').textContent = '';
      document.getElementById('popupErreur').style.display = 'none';    }

    function afficherErreur() {
      document.getElementById('formulaire').style.display = 'none';
      document.getElementById('valider').style.display = 'none'; 
      document.getElementById('popupErreur').style.display = 'flex';
    }

    function fermerErreur() {
      document.getElementById('popupErreur').style.display = 'none';
      document.getElementById('formulaire').style.display = 'block';
      document.getElementById('valider').style.display = 'inline-block';
    }

    function modInverse(a, m) {
      let m0 = m, x0 = 0, x1 = 1;
      if (m === 1) return 0;
      while (a > 1) {
        let q = Math.floor(a / m);
        [a, m] = [m, a % m];
        [x0, x1] = [x1 - q * x0, x0];
      }
      return (x1 + m0) % m0;
    }

    function retrouverNombre() {
      const r49 = parseInt(document.getElementById('r49').value);
      const r82 = parseInt(document.getElementById('r82').value);
      const r89 = parseInt(document.getElementById('r89').value);

      console.log(`r49: ${r49}, r82: ${r82}, r89: ${r89}`);

      if (
        isNaN(r49) || r49 < 0 || r49 >= 49 ||
        isNaN(r82) || r82 < 0 || r82 >= 82 ||
        isNaN(r89) || r89 < 0 || r89 >= 89
      ) {
        console.log("Erreur de saisie");
        afficherErreur();
        return;
      }

      const n1 = 49, n2 = 82, n3 = 89;
      const N = n1 * n2 * n3;
      const N1 = N / n1, N2 = N / n2, N3 = N / n3;
      const m1 = modInverse(N1, n1), m2 = modInverse(N2, n2), m3 = modInverse(N3, n3);

      let x = (r49 * N1 * m1 + r82 * N2 * m2 + r89 * N3 * m3) % N;
      while (x >= 129014) x -= N;

      document.getElementById('debut').style.display = 'none';
      document.getElementById("retour").style.margin = "40px auto 0 auto";
      document.getElementById("retour").style.display = "block";
      document.getElementById('resultat').textContent = `Ton nombre était : ${x}`;
      
    }


    document.getElementById('retour').addEventListener('click', function(event) {
      const img = document.getElementById('tourner');
  img.classList.add('rotate');
  setTimeout(() => {
    img.classList.remove('rotate');
    window.location.href = "reste.html";
  }, 500);
    });
console.log(`La largeur de l'écran est de ${window.innerWidth}px et la hauteur est de ${window.innerHeight}px.`);


