// ======================
// Fonctions utilitaires communes
// ======================

// Tirage d'un dé à 10 faces (0-9)
function lancerDe() {
  return Math.floor(Math.random() * 10);
}

// Tirage d'une arme aléatoire
const armes = [
  "Poignard", "Lance", "Masse d’armes", "Sabre",
  "Marteau de guerre", "Épée", "Hache", "Bâton", "Glaive"
];
function armeAleatoire() {
  return armes[Math.floor(Math.random() * armes.length)];
}

// Tirage d'un nombre aléatoire (0-9)
function tirageHasard() {
  return Math.floor(Math.random() * 10);
}

// Autres utilitaires à ajouter ici si besoin