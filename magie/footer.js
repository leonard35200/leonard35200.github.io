const anneeActuelle = new Date().getFullYear();
const texte = (anneeActuelle === 2025)
    ? "© 2025 Léonard Loquet. Tous droits réservés."
    : `© 2025 - ${anneeActuelle} Léonard Loquet ccc. Tous droits réservés.`;
const copyright = document.getElementById("copyright");
  if (copyright) copyright.textContent = texte;