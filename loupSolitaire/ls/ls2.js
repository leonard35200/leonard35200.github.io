// Activez le débogage
localStorage.debug = true;
console.log('Script chargé - vérification des disciplines...');

// ======================
// Données et utilitaires
// ======================
const disciplinesKai = [
  { nom: "Sixième Sens", effet: "Devine les dangers imminents, détecte intentions et objets suspects.", bonus: {} },
  { nom: "Camouflage", effet: "Se fond dans l'environnement urbain ou naturel.", bonus: {} },
  { nom: "Maîtrise psychique de la matière", effet: "Déplace de petits objets par la pensée.", bonus: {} },
  { nom: "Guérison", effet: "+1 ENDURANCE par paragraphe sans combat.", bonus: { endurance: 1 } },
  { nom: "Communication animale", effet: "Permet de comprendre ou influencer certains animaux.", bonus: {} },
  { nom: "Orientation", effet: "Permet de toujours choisir la bonne direction.", bonus: {} },
  { nom: "Chasse", effet: "Plus besoin de repas, sauf en désert.", bonus: {} },
  { nom: "Maîtrise des armes", effet: "+2 HABILETÉ avec arme tirée au sort.", bonus: { habilete: 2, arme: true } },
  { nom: "Bouclier psychique", effet: "Protège contre les attaques mentales.", bonus: {} },
  { nom: "Puissance psychique", effet: "+2 HABILETÉ si l'ennemi est sensible.", bonus: { habilete: 2 } }
];

const armes = ["Poignard", "Lance", "Masse d'armes", "Sabre", "Marteau de guerre", "Épée", "Hache", "Bâton", "Glaive"];
function armeAleatoire() { return armes[Math.floor(Math.random() * armes.length)]; }
function tirageHasard() { return Math.floor(Math.random() * 10); }

const disciplineIds = ["discipline1", "discipline2", "discipline3", "discipline4", "discipline5"];

// ======================
// Fonctions d'interface
// ======================
function showParagraph(id) {
  const paragraphs = document.querySelectorAll('.main-content p');
  paragraphs.forEach(p => p.style.display = p.id === id ? 'block' : 'none');
  localStorage.setItem('currentParagraph', id);
}

// ======================
// Gestion des disciplines
// ======================
function initDisciplineSelectors() {
  console.log("Initialisation des sélecteurs de disciplines...");
  
  disciplineIds.forEach((id, index) => {
    const select = document.getElementById(id);
    if (!select) {
      console.error(`Élément non trouvé: ${id}`);
      return;
    }

    // Vider et peupler le sélecteur
    select.innerHTML = '<option value="">-- Choisir --</option>';
    disciplinesKai.forEach(discipline => {
      const option = document.createElement('option');
      option.value = discipline.nom;
      option.textContent = discipline.nom;
      select.appendChild(option);
    });

    // Restaurer la sélection
    const savedValue = localStorage.getItem(id);
    if (savedValue) select.value = savedValue;
    
    updateDisciplineEffect(index);
  });
}

function updateDisciplineEffect(index) {
  const select = document.getElementById(disciplineIds[index]);
  const effectEl = document.getElementById(`effet${index + 1}`);
  const selectedDiscipline = disciplinesKai.find(d => d.nom === select.value);
  
  effectEl.textContent = selectedDiscipline 
    ? selectedDiscipline.effet + (selectedDiscipline.bonus.arme ? ` (+2 avec ${armeAleatoire()})` : '')
    : '';
}

function updateDisciplineMenus() {
  const selectedValues = disciplineIds.map(id => {
    const el = document.getElementById(id);
    return el ? el.value : '';
  });
  
  disciplineIds.forEach((id, index) => {
    const select = document.getElementById(id);
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Choisir --</option>';
    
    disciplinesKai.forEach(discipline => {
      if (!selectedValues.includes(discipline.nom) || discipline.nom === currentValue) {
        const option = new Option(discipline.nom, discipline.nom);
        select.add(option);
      }
    });
    
    if (currentValue) select.value = currentValue;
  });
}

function applyDisciplineBonuses() {
  const habEl = document.getElementById('hab');
  const endEl = document.getElementById('end');
  if (!habEl || !endEl) return;
  
  let habBonus = 0;
  let endBonus = 0;
  
  disciplineIds.forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    
    const disciplineName = select.value;
    const discipline = disciplinesKai.find(d => d.nom === disciplineName);
    
    if (discipline?.bonus) {
      habBonus += discipline.bonus.habilete || 0;
      endBonus += discipline.bonus.endurance || 0;
    }
  });
  
  const baseHab = parseInt(habEl.dataset.base) || 0;
  const baseEnd = parseInt(endEl.dataset.base) || 0;
  
  habEl.value = baseHab + habBonus;
  endEl.value = baseEnd + endBonus;
}

function lockDisciplines() {
  const selectedDisciplines = [];
  let isValid = true;
  
  disciplineIds.forEach(id => {
    const select = document.getElementById(id);
    if (!select || !select.value) {
      isValid = false;
      return;
    }
    selectedDisciplines.push(select.value);
    localStorage.setItem(id, select.value);
  });
  
  if (!isValid || selectedDisciplines.length !== 5) {
    alert('Vous devez sélectionner 5 disciplines avant de commencer');
    return false;
  }
  
  localStorage.setItem('disciplines_lock', '1');
  localStorage.setItem('disciplines_choisies', JSON.stringify(selectedDisciplines));
  showDisciplinesList(selectedDisciplines);
  return true;
}

function showDisciplinesList(disciplines) {
  const listEl = document.getElementById('liste-disciplines');
  const zoneEl = document.getElementById('zone-disciplines');
  
  if (!listEl || !zoneEl) return;
  
  listEl.innerHTML = `
    <h3>Vos Disciplines Kaï :</h3>
    <ul>
      ${disciplines.map(d => `<li>${d}</li>`).join('')}
    </ul>
  `;
  
  zoneEl.style.display = 'none';
  listEl.classList.remove('hidden');
}

function setupDisciplineEvents() {
  disciplineIds.forEach((id, index) => {
    const select = document.getElementById(id);
    if (!select) return;
    
    select.addEventListener('change', () => {
      localStorage.setItem(id, select.value);
      updateDisciplineMenus();
      updateDisciplineEffect(index);
      applyDisciplineBonuses();
    });
  });
  
  const startButton = document.getElementById('start-button');
  if (startButton) {
    startButton.addEventListener('click', () => {
      if (lockDisciplines()) {
        const introScreen = document.getElementById('intro-screen');
        if (introScreen) introScreen.style.display = 'none';
        const savedPara = localStorage.getItem('currentParagraph') || 'paraIntro';
        showParagraph(savedPara);
      }
    });
  }
}

// ======================
// Feuille d'aventure
// ======================
function setupTextarea() {
  const ta = document.getElementById('objetsSpeciaux');
  if (!ta) return;
  
  function resize() {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }
  
  const saved = localStorage.getItem('feuille_objetsSpeciaux');
  if (saved !== null) {
    ta.value = saved;
    resize();
  }
  
  ta.addEventListener('input', () => {
    resize();
    localStorage.setItem('feuille_objetsSpeciaux', ta.value);
  });
}

function initDefaultStats() {
  if (localStorage.getItem('init')) return;
  
  const h = 10 + tirageHasard();
  const e = 20 + tirageHasard();
  const o = tirageHasard();
  const ob = tirageHasard();
  
  const habEl = document.getElementById('hab');
  const endEl = document.getElementById('end');
  const piecesEl = document.getElementById('pieces');
  
  if (habEl) {
    habEl.value = h;
    habEl.dataset.base = h;
  }
  
  if (endEl) {
    endEl.value = e;
    endEl.dataset.base = e;
  }
  
  if (piecesEl) piecesEl.value = o;
  
  document.getElementById('armes1').value = 'Hache';
  document.getElementById('repas').value = '1 Repas';
  document.getElementById('objets1').value = 'Carte géographique';
  document.getElementById('sacados').value = 'Sac à dos';
  
  const extras = [
    "Épée", "Casque (+2 END)", "2 Repas", 
    "Cotte de mailles (+4 END)", "Masse d'armes", 
    "Potion de guérison", "Bâton", "Lance", 
    "+12 Couronnes", "Glaive"
  ];
  
  const bonus = extras[ob];
  if (bonus) {
    if ([0, 4, 6, 7, 9].includes(ob)) {
      document.getElementById('armes2').value = bonus;
    } else if (ob === 1 || ob === 3) {
      document.getElementById('objets1').value += ', ' + bonus;
      const delta = ob === 1 ? 2 : 4;
      if (endEl) {
        const newEnd = parseInt(endEl.value) + delta;
        endEl.value = newEnd;
        endEl.dataset.base = parseInt(endEl.dataset.base) + delta;
      }
    } else if (ob === 2) {
      document.getElementById('repas').value += ', 2 Repas';
    } else if (ob === 5) {
      document.getElementById('sacados').value += ', Potion';
    } else if (ob === 8) {
      if (piecesEl) piecesEl.value = parseInt(piecesEl.value) + 12;
    }
  }
  
  localStorage.setItem('init', '1');
}

function saveFields() {
  const fieldsToSave = [
    'hab', 'end', 'pieces', 
    'armes1', 'armes2', 'repas', 
    'sacados', 'objets1', 'objetsSpeciaux',
    ...disciplineIds
  ];
  
  fieldsToSave.forEach(id => {
    const el = document.getElementById(id);
    if (el) localStorage.setItem(id, el.value);
  });
}

function loadFields() {
  const fieldsToSave = [
    'hab', 'end', 'pieces', 
    'armes1', 'armes2', 'repas', 
    'sacados', 'objets1', 'objetsSpeciaux',
    ...disciplineIds
  ];
  
  fieldsToSave.forEach(id => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem(id);
    if (el && saved !== null) el.value = saved;
  });
}

function setupEndurance() {
  const endInput = document.getElementById('end');
  if (!endInput) return;
  
  // Valeur maximale
  let maxEnd = parseInt(localStorage.getItem('stat_end_max'));
  if (isNaN(maxEnd)) maxEnd = 30;
  
  // Événement de changement
  endInput.addEventListener('change', () => {
    let val = parseInt(endInput.value) || maxEnd;
    if (val > maxEnd) val = maxEnd;
    if (val < 0) val = 0;
    endInput.value = val;
    localStorage.setItem('stat_end', val.toString());
  });
  
  // Initialisation
  let currentEnd = parseInt(localStorage.getItem('stat_end'));
  if (isNaN(currentEnd)) currentEnd = maxEnd;
  endInput.value = currentEnd;
  endInput.dataset.base = maxEnd;
}

// ======================
// Initialisation générale
// ======================
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM chargé - initialisation en cours');
  
  // Éléments UI
  const paragraphs = document.querySelectorAll('.main-content p');
  const links = document.querySelectorAll('.main-content a');
  const introScreen = document.getElementById('intro-screen');
  const startButton = document.getElementById('start-button');
  const resetButton = document.getElementById('reset-button');
  const sheetToggle = document.getElementById('sheet-toggle');
  const sheet = document.getElementById('character-sheet');
  const closeBtn = document.getElementById('close-sheet');

  // Navigation
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      showParagraph(id);
    });
  });

  // Réinitialisation
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      if (confirm('Êtes-vous sûr de vouloir tout réinitialiser ?')) {
        localStorage.clear();
        location.reload();
      }
    });
  }

  // Feuille de personnage
  if (sheetToggle && sheet) {
    sheetToggle.addEventListener('click', () => sheet.classList.toggle('hidden'));
  }
  if (closeBtn && sheet) {
    closeBtn.addEventListener('click', () => sheet.classList.add('hidden'));
  }

  // État initial
  if (introScreen) introScreen.style.display = 'flex';
  paragraphs.forEach(p => p.style.display = 'none');
  
  // Initialisation des systèmes
  loadFields();
  setupTextarea();
  setupEndurance();
  
  if (!localStorage.getItem('init')) {
    initDefaultStats();
  }

  // Gestion des disciplines
  initDisciplineSelectors();
  setupDisciplineEvents();
  applyDisciplineBonuses();
  
  // Vérifier si les disciplines sont déjà verrouillées
  if (localStorage.getItem('disciplines_lock') === '1') {
    const disciplines = JSON.parse(localStorage.getItem('disciplines_choisies') || []);
    if (disciplines.length === 5) {
      showDisciplinesList(disciplines);
      if (introScreen) introScreen.style.display = 'none';
      const savedPara = localStorage.getItem('currentParagraph') || 'paraIntro';
      showParagraph(savedPara);
    } else {
      localStorage.removeItem('disciplines_lock');
      document.getElementById('zone-disciplines').style.display = 'block';
    }
  } else {
    document.getElementById('zone-disciplines').style.display = 'block';
  }
  
  // Sauvegarde automatique
  const fieldsToSave = [
    'hab', 'end', 'pieces', 
    'armes1', 'armes2', 'repas', 
    'sacados', 'objets1', 'objetsSpeciaux'
  ];
  
  fieldsToSave.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', saveFields);
  });
});