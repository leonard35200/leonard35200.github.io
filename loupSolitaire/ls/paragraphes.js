// ======================
// Gestion de l'affichage et navigation des paragraphes
// ======================

// Ce fichier gère :
// - L'écran d'introduction
// - Le bouton "Commencer"
// - L'affichage/masquage des paragraphes
// - La navigation via les liens internes
// - L'ouverture/fermeture de la feuille d'aventure (si tu veux séparer, mets-le dans feuilleAventure.js)

window.addEventListener('DOMContentLoaded', () => {
  // Sélection des éléments principaux
  const paragraphs = document.querySelectorAll('.main-content p');
  const links = document.querySelectorAll('.main-content a');
  const introScreen = document.getElementById('intro-screen');
  const startButton = document.getElementById('start-button');

  // Fonction pour afficher un paragraphe par son id
  function showParagraph(id) {
    paragraphs.forEach(p => p.style.display = p.id === id ? 'block' : 'none');
    localStorage.setItem('currentParagraph', id);
  }

  // Quand on clique sur "Commencer"
  startButton.addEventListener('click', () => {
    introScreen.style.display = 'none';
    const saved = localStorage.getItem('currentParagraph') || 'paraIntro';
    showParagraph(saved);
  });

  // Navigation entre paragraphes via les liens
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      showParagraph(id);
    });
  });

  // Toujours démarrer sur l'intro
  introScreen.style.display = 'flex';
  paragraphs.forEach(p => p.style.display = 'none');

  // (Optionnel) Gestion de l'ouverture/fermeture de la feuille d'aventure
  // Si tu préfères, déplace ce bloc dans feuilleAventure.js
  const sheetToggle = document.getElementById('sheet-toggle');
  const sheet = document.getElementById('character-sheet');
  const closeBtn = document.getElementById('close-sheet');
  sheetToggle.addEventListener('click', () => sheet.classList.toggle('hidden'));
  closeBtn.addEventListener('click', () => sheet.classList.add('hidden'));
});