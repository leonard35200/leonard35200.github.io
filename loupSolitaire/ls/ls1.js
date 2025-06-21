// Activez le débogage
localStorage.debug = true;
console.log('Script chargé - vérification des disciplines...');

// ======================
// Initialisation et navigation
// ======================
window.addEventListener('DOMContentLoaded', () => {
  // Éléments UI
  const paragraphs = document.querySelectorAll('.main-content p');
  const links = document.querySelectorAll('.main-content a');
  const introScreen = document.getElementById('intro-screen');
  const startButton = document.getElementById('start-button');
  const resetButton = document.getElementById('reset-button');
  const sheetToggle = document.getElementById('sheet-toggle');
  const sheet = document.getElementById('character-sheet');
  const closeBtn = document.getElementById('close-sheet');

  // Fonction pour afficher un paragraphe spécifique
  function showParagraph(id) {
    paragraphs.forEach(p => p.style.display = p.id === id ? 'block' : 'none');
    localStorage.setItem('currentParagraph', id);
  }

  // Gestion du bouton "Commencer"
  startButton.addEventListener('click', () => {
    if (verrouillerDisciplines()) {
      introScreen.style.display = 'none';
      const saved = localStorage.getItem('currentParagraph') || 'paraIntro';
      showParagraph(saved);
    } else {
      alert('Veuillez sélectionner 5 disciplines avant de commencer');
    }
  });

  // Navigation via les liens
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').slice(1);
      showParagraph(id);
    });
  });

  // Réinitialisation
  resetButton.addEventListener('click', () => {
    if (confirm('Êtes-vous sûr de vouloir tout réinitialiser ?')) {
      localStorage.clear();
      location.reload();
    }
  });

  // Gestion de la feuille de personnage
  sheetToggle.addEventListener('click', () => sheet.classList.toggle('hidden'));
  closeBtn.addEventListener('click', () => sheet.classList.add('hidden'));

  // État initial
  introScreen.style.display = 'flex';
  paragraphs.forEach(p => p.style.display = 'none');
  if (localStorage.getItem('disciplines_lock') === '1') {
    introScreen.style.display = 'none';
    const saved = localStorage.getItem('currentParagraph') || 'paraIntro';
    showParagraph(saved);
  }
});

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











// ======================
// Feuille d'aventure
// ======================
function setupTextarea() {
  const ta = document.getElementById('objetsSpeciaux');
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
  
  // Génération des stats de base
  const h = 10 + tirageHasard();
  const e = 20 + tirageHasard();
  const o = tirageHasard();
  const ob = tirageHasard();
  
  document.getElementById('hab').value = h;
  document.getElementById('hab').dataset.base = h;
  document.getElementById('end').value = e;
  document.getElementById('end').dataset.base = e;
  localStorage.setItem('stat_end_max', e);
  
  document.getElementById('pieces').value = o;
  document.getElementById('armes1').value = 'Hache';
  document.getElementById('repas').value = '1 Repas';
  document.getElementById('objets1').value = 'Carte géographique';
  document.getElementById('sacados').value = 'Sac à dos';
  
  // Équipement bonus
  const extras = [
    "Épée", "Casque (+2 END)", "2 Repas", 
    "Cotte de mailles (+4 END)", "Masse d'armes", 
    "Potion de guérison", "Bâton", "Lance", 
    "+12 Couronnes", "Glaive"
  ];
  
  const bonus = extras[ob];
  if ([0, 4, 6, 7, 9].includes(ob)) {
    document.getElementById('armes2').value = bonus;
  } else if (ob === 1 || ob === 3) {
    document.getElementById('objets1').value += ', ' + bonus;
    const delta = ob === 1 ? 2 : 4;
    const endEl = document.getElementById('end');
    const newEnd = parseInt(endEl.value) + delta;
    endEl.value = newEnd;
    endEl.dataset.base = parseInt(endEl.dataset.base) + delta;
    localStorage.setItem('stat_end_max', newEnd);
  } else if (ob === 2) {
    document.getElementById('repas').value += ', 2 Repas';
  } else if (ob === 5) {
    document.getElementById('sacados').value += ', Potion';
  } else if (ob === 8) {
    const p = document.getElementById('pieces');
    p.value = parseInt(p.value) + 12;
  }
  
  localStorage.setItem('init', '1');
}

// Liste des champs à sauvegarder
const fieldsToSave = [
  'hab', 'end', 'pieces', 
  'armes1', 'armes2', 'repas', 'sacados', 
  'objets1', 'objetsSpeciaux',
  ...disciplineIds
];

function saveFields() {
  fieldsToSave.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      localStorage.setItem(id, el.value);
    } else if (el.tagName === 'SELECT') {
      localStorage.setItem(id, el.value);
    }
  });
}

function loadFields() {
  fieldsToSave.forEach(id => {
    const el = document.getElementById(id);
    const saved = localStorage.getItem(id);
    if (!el || saved === null) return;
    
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = saved;
    } else if (el.tagName === 'SELECT') {
      el.value = saved;
    }
  });
}

// Gestion de l'endurance
// ======================
// Gestion de l'endurance
// ======================
function setupEndurance() {
  const endInput = document.getElementById('end');
  
  // Vérifier d'abord si l'élément existe
  if (!endInput) {
    console.error("Erreur: L'élément #end n'existe pas dans le DOM");
    return;
  }

  // Valeur maximale
  const maxEnd = parseInt(localStorage.getItem('stat_end_max')) || 30; // 30 comme valeur par défaut

  // Configuration de l'événement
  endInput.addEventListener('change', () => {
    let val = parseInt(endInput.value);
    
    // Validation
    if (isNaN(val)) val = maxEnd;
    if (val > maxEnd) val = maxEnd;
    if (val < 0) val = 0;
    
    // Mise à jour
    endInput.value = val;
    localStorage.setItem('stat_end', val.toString());
    
    console.log('Endurance mise à jour:', val); // Debug
  });

  // Initialisation
  const currentEnd = parseInt(localStorage.getItem('stat_end')) || maxEnd;
  endInput.value = currentEnd;
  endInput.dataset.base = maxEnd - (currentEnd - maxEnd); // Calcul du bonus de base
}

// Initialisation finale
window.addEventListener('DOMContentLoaded', () => {
  console.log('Début du chargement...'); // Debug 1
  
  // Chargement des données
  loadFields();
  setupTextarea();
  setupEndurance();
  
  // Initialisation par défaut si nécessaire
  if (!localStorage.getItem('init')) {
    console.log('Initialisation des stats par défaut'); // Debug 2
    initDefaultStats();
    console.log('Valeur disciplines_lock:', localStorage.getItem('disciplines_lock')); // Debug 6
    console.log('Valeur disciplines_choisies:', localStorage.getItem('disciplines_choisies'));
  }

  // Initialisation des disciplines
  console.log('Initialisation des disciplines...'); // Debug 3
  initDisciplineSelectors();
  setupDisciplineEvents();
  applyDisciplineBonuses();

  // Vérification des disciplines verrouillées
  if (localStorage.getItem('disciplines_lock') === '1') {
    console.log('Disciplines déjà verrouillées - mode affichage'); // Debug 4
    try {
      const disciplines = JSON.parse(localStorage.getItem('disciplines_choisies') || '[]');
      console.log('Disciplines chargées:', disciplines); // Debug 5
      
      if (disciplines.length === 5) {
        showDisciplinesList(disciplines);
        document.getElementById('intro-screen').style.display = 'none';
        const savedPara = localStorage.getItem('currentParagraph') || 'paraIntro';
        showParagraph(savedPara);
      } else {
        console.error('Erreur: Nombre de disciplines invalide', disciplines.length); // Debug 6
        localStorage.removeItem('disciplines_lock');
        document.getElementById('zone-disciplines').style.display = 'block';
      }
    } catch (e) {
      console.error('Erreur parsing disciplines:', e); // Debug 7
      localStorage.removeItem('disciplines_lock');
    }
  } else {
    console.log('Pas de disciplines verrouillées - mode sélection'); // Debug 8
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
    if (el) {
      el.addEventListener('input', saveFields);
    } else {
      console.warn('Element introuvable:', id); // Debug 9
    }
  });

  console.log('Chargement terminé'); // Debug 10
});

// Fonction verrouillage améliorée avec logs
function lockDisciplines() {
  const disciplines = [];
  let isValid = true;
  
  // Vérifier que toutes les disciplines sont sélectionnées
  disciplineIds.forEach(id => {
    const value = document.getElementById(id).value;
    if (!value) {
      isValid = false;
      console.error(`Discipline manquante: ${id}`);
    }
    disciplines.push(value);
  });

  if (!isValid) {
    alert('Veuillez sélectionner 5 disciplines avant de commencer');
    return false;
  }

  // Sauvegarder et verrouiller
  localStorage.setItem('disciplines_lock', '1');
  localStorage.setItem('disciplines_choisies', JSON.stringify(disciplines));
  
  // Afficher la liste (sans désactiver les sélecteurs)
  showDisciplinesList(disciplines);
  return true;
}

// Alias pour la fonction verrouillerDisciplines
function verrouillerDisciplines() {
  return lockDisciplines();
}// Fonction verrouillage améliorée avec logs
function lockDisciplines() {
  const disciplines = [];
  let isValid = true;
  
  // Vérifier que toutes les disciplines sont sélectionnées
  disciplineIds.forEach(id => {
    const value = document.getElementById(id).value;
    if (!value) {
      isValid = false;
      console.error(`Discipline manquante: ${id}`);
    }
    disciplines.push(value);
  });

  if (!isValid) {
    alert('Veuillez sélectionner 5 disciplines avant de commencer');
    return false;
  }

  // Sauvegarder et verrouiller
  localStorage.setItem('disciplines_lock', '1');
  localStorage.setItem('disciplines_choisies', JSON.stringify(disciplines));
  
  // Afficher la liste (sans désactiver les sélecteurs)
  showDisciplinesList(disciplines);
  return true;
}
// ======================
// Gestion simplifiée des disciplines Kaï
// ======================

const disciplineIds = ["discipline1", "discipline2", "discipline3", "discipline4", "discipline5"];

// Initialisation du système de disciplines
function initDisciplineSelectors() {
  console.log("Initialisation des sélecteurs de disciplines...");
  
  // Vérifier que la liste des disciplines existe
  if (!disciplinesKai || disciplinesKai.length === 0) {
    console.error("Erreur: La liste des disciplines Kai est vide ou non définie");
    return;
  }

  disciplineIds.forEach((id, index) => {
    const select = document.getElementById(id);
    if (!select) {
      console.error(`Élément non trouvé: ${id}`);
      return;
    }

    // Vider le sélecteur
    select.innerHTML = '<option value="">-- Choisir --</option>';
    
    // Ajouter toutes les disciplines disponibles
    disciplinesKai.forEach(discipline => {
      const option = document.createElement('option');
      option.value = discipline.nom;
      option.textContent = discipline.nom;
      select.appendChild(option);
    });

    // Restaurer la sélection sauvegardée
    const savedValue = localStorage.getItem(id);
    if (savedValue) {
      select.value = savedValue;
      console.log(`Valeur restaurée pour ${id}: ${savedValue}`);
    }
    
    // Mettre à jour l'affichage de l'effet
    updateDisciplineEffect(index);
  });
}

// Met à jour l'affichage de l'effet d'une discipline
function updateDisciplineEffect(index) {
  const select = document.getElementById(disciplineIds[index]);
  const effectEl = document.getElementById(`effet${index + 1}`);
  const selectedDiscipline = disciplinesKai.find(d => d.nom === select.value);
  
  effectEl.textContent = selectedDiscipline 
    ? selectedDiscipline.effet + (selectedDiscipline.bonus.arme ? ` (+2 avec ${armeAleatoire()})` : '')
    : '';
}

// Met à jour les menus pour éviter les doublons
function updateDisciplineMenus() {
  const selectedValues = disciplineIds.map(id => document.getElementById(id).value);
  
  disciplineIds.forEach((id, index) => {
    const select = document.getElementById(id);
    const currentValue = select.value;
    
    // Sauvegarder la sélection actuelle
    select.innerHTML = '<option value="">-- Choisir --</option>';
    
    // Repeupler le menu sans les options déjà sélectionnées
    disciplinesKai.forEach(discipline => {
      if (!selectedValues.includes(discipline.nom) || discipline.nom === currentValue) {
        const option = new Option(discipline.nom, discipline.nom);
        option.selected = discipline.nom === currentValue;
        select.add(option);
      }
    });
  });
}

// Applique les bonus des disciplines sélectionnées
function applyDisciplineBonuses() {
  const habEl = document.getElementById('hab');
  const endEl = document.getElementById('end');
  let habBonus = 0;
  let endBonus = 0;
  
  disciplineIds.forEach(id => {
    const disciplineName = document.getElementById(id).value;
    const discipline = disciplinesKai.find(d => d.nom === disciplineName);
    
    if (discipline?.bonus) {
      habBonus += discipline.bonus.habilete || 0;
      endBonus += discipline.bonus.endurance || 0;
    }
  });
  
  habEl.value = (parseInt(habEl.dataset.base) || 0) + habBonus;
  endEl.value = (parseInt(endEl.dataset.base) || 0) + endBonus;
  
  // Sauvegarder les valeurs
  localStorage.setItem('stat_hab', habEl.value);
  localStorage.setItem('stat_end', endEl.value);
}

// Verrouille les disciplines sélectionnées
function lockDisciplines() {
  const selectedDisciplines = disciplineIds.map(id => {
    const value = document.getElementById(id).value;
    if (!value) {
      alert('Vous devez sélectionner 5 disciplines avant de commencer');
      return null;
    }
    return value;
  });
  
  if (selectedDisciplines.includes(null)) return false;
  
  // Sauvegarder les choix
  disciplineIds.forEach((id, index) => {
    localStorage.setItem(id, selectedDisciplines[index]);
  });
  
  localStorage.setItem('disciplines_lock', '1');
  localStorage.setItem('disciplines_choisies', JSON.stringify(selectedDisciplines));
  
  // Afficher la liste et masquer les sélecteurs
  showDisciplinesList(selectedDisciplines);
  return true;
}

// Affiche la liste des disciplines sélectionnées
function showDisciplinesList(disciplines) {
  const listEl = document.getElementById('liste-disciplines');
  const zoneEl = document.getElementById('zone-disciplines');
  
  listEl.innerHTML = `
    <h3>Vos Disciplines Kaï :</h3>
    <ul>
      ${disciplines.map(d => `<li>${d}</li>`).join('')}
    </ul>
  `;
  
  zoneEl.style.display = 'none';
  listEl.classList.remove('hidden');
}

// Configure les événements
function setupDisciplineEvents() {
  disciplineIds.forEach((id, index) => {
    const select = document.getElementById(id);
    
    select.addEventListener('change', () => {
      localStorage.setItem(id, select.value);
      updateDisciplineMenus();
      updateDisciplineEffect(index);
      applyDisciplineBonuses();
    });
  });
  
  document.getElementById('start-button').addEventListener('click', () => {
    if (lockDisciplines()) {
      document.getElementById('intro-screen').style.display = 'none';
      const savedPara = localStorage.getItem('currentParagraph') || 'paraIntro';
      showParagraph(savedPara);
    }
  });
}

// Initialisation au chargement
window.addEventListener('DOMContentLoaded', () => {
 initDisciplineSelectors(); // Utiliser la fonction existante
  setupDisciplineEvents();
  updateDisciplineMenus();
  applyDisciplineBonuses();
});

function verrouillerDisciplines() {
  return lockDisciplines(); // Utiliser la fonction existante
}