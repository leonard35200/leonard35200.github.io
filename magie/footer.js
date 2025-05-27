const anneeActuelle = new Date().getFullYear();
const texte = (anneeActuelle === 2025)
    ? "© 2025 Léonard Loquet ccc. Tous droits réservés."
    : `© 2025 - ${anneeActuelle} Léonard Loquet. Tous droits réservés.`;
const copyright = document.getElementById("copyright");
  if (copyright) copyright.textContent = texte;