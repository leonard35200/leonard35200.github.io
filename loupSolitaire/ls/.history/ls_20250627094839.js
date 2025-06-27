// ======================
// Configuration générale
// ======================
const CONFIG = {
  disciplineIds: ["discipline1","discipline2","discipline3","discipline4","discipline5"],
  get test() {
    const saved = JSON.parse(localStorage.getItem("disciplines_choisies") || "[]");
    // si aucune discipline n’est encore choisie → mode interactif (1)
    // sinon mode statique (0)
    return saved.length === 0 ? 1 : 0;
  }
};


// ======================
// Données des disciplines Kaï
// ======================
const disciplinesKai = [
  { nom: "", effet: "" },
  { nom: "Sixième Sens", effet: "Devine les dangers imminents, détecte intentions et objets suspects." },
  { nom: "Camouflage", effet: "Se fond dans l'environnement urbain ou naturel." },
  { nom: "Maîtrise psychique de la matière", effet: "Déplace de petits objets par la pensée." },
  { nom: "Guérison", effet: "+1 ENDURANCE par paragraphe sans combat." },
  { nom: "Communication animale", effet: "Permet de comprendre ou influencer certains animaux." },
  { nom: "Orientation", effet: "Permet de toujours choisir la bonne direction." },
  { nom: "Chasse", effet: "Plus besoin de repas, sauf en désert." },
  { nom: "Maîtrise des armes", effet: "+2 HABILETÉ avec arme tirée au sort." },
  { nom: "Bouclier psychique", effet: "Protège contre les attaques mentales." },
  { nom: "Puissance psychique", effet: "+2 HABILETÉ si l'ennemi est sensible." }
];

const armes = [
  "Poignard", "Lance", "Masse d'armes", "Sabre", "Marteau de guerre", 
  "Épée", "Hache", "Bâton", "Glaive"
];

// ======================
// Utilitaires
// ======================
function armeAleatoire() {
  return armes[Math.floor(Math.random() * armes.length)];
}

function tirageHasard() {
  return Math.floor(Math.random() * 10);
}

function lancerDe() {
  return Math.floor(Math.random() * 10);
}

// ======================
// Gestion des disciplines
// ======================
class DisciplineManager {
  constructor() {
    this.selects = [];
  }

  init() {
    this.selects = CONFIG.disciplineIds.map(id => document.getElementById(id));
    this.loadDisciplines();
    this.initListeners();
    this.updateAllMenus();
  }

  getSelectedDisciplines() {
    return this.selects.map(select => select ? select.value : "").filter(v => v);
  }

  updateAllMenus() {
    const selected = this.getSelectedDisciplines();
    
    this.selects.forEach((select, i) => {
      if (!select) return;
      
      const current = select.value;
      select.innerHTML = '<option value="">-- Choisir une discipline --</option>';

      disciplinesKai.forEach(discipline => {
        const alreadySelected = selected.includes(discipline.nom) && discipline.nom !== current;
        if (!alreadySelected) {
          const option = document.createElement('option');
          option.value = discipline.nom;
          option.textContent = discipline.nom;
          if (discipline.nom === current) option.selected = true;
          select.appendChild(option);
        }
      });

      this.updateEffect(i);
    });
  }

  updateEffect(index) {
    const select = this.selects[index];
    if (!select) return;

    const effectEl = document.getElementById(`effet${index + 1}`);
    if (!effectEl) return;

    const discipline = disciplinesKai.find(d => d.nom === select.value);
    effectEl.textContent = discipline ? discipline.effet : '';
  }

  saveDisciplines() {
    const selections = this.selects.map(select => select ? select.value : "");
    localStorage.setItem("disciplines_choisies", JSON.stringify(selections));
  }

  loadDisciplines() {
    const saved = JSON.parse(localStorage.getItem("disciplines_choisies")) || [];
    this.selects.forEach((select, i) => {
      if (select && saved[i]) {
        select.value = saved[i];
      }
    });
  }

  initListeners() {
    this.selects.forEach(select => {
      if (select) {
        select.addEventListener('change', () => {
          this.saveDisciplines();
          this.updateAllMenus();
        });
      }
    });
  }

  displayList(container, list) {
  if (!container) {
    console.error("Conteneur 'zone-disciplines' introuvable");
    return;
  }
  // Vider le conteneur
  container.innerHTML = '';

  if (CONFIG.test === 1) {
    // Mode interactif : créer 5 selects + spans à la volée
    CONFIG.disciplineIds.forEach((id, i) => {
      const wrapper = document.createElement('div');

      const select = document.createElement('select');
      select.id = id;
      // Option par défaut
      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = '-- Choisir une discipline --';
      select.appendChild(defaultOpt);

      // Options depuis votre liste de disciplines
      disciplinesKai.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.nom;
        opt.textContent = d.nom;
        select.appendChild(opt);
      });

      const span = document.createElement('span');
      span.id = `effet${i + 1}`;

      wrapper.append(select, ' ', span);
      container.append(wrapper);
    });
    // Ré-init pour lier les listeners et restaurer la sauvegarde
    this.init();

  } else {
    // Mode statique : afficher une liste <ul> de noms de disciplines
    const ul = document.createElement('ul');

    if (list && list.length) {
      list.forEach(item => {
        const li = document.createElement('li');
        // Si `item` est un objet, on prend `item.nom`, sinon on affiche la string
        li.textContent = (item && item.nom) ? item.nom : item;
        ul.appendChild(li);
      });
    } else {
      ul.textContent = "Aucune discipline sélectionnée.";
    }

    container.appendChild(ul);
  }
}


}

// ======================
// Gestion des statistiques
// ======================
class StatsManager {
  constructor() {
    this.statsConfig = {
      hab: { base: 10 },
      end: { base: 20 },
      pieces: { base: 0 }
    };
  }

  init() {
    if (!localStorage.getItem("init")) {
      this.generateInitialStats();
      localStorage.setItem("init", "1");
    }
    this.loadStats();
    this.initListeners();
  }

  generateInitialStats() {
    const hab = 10 + Math.floor(Math.random() * 10);
    const end = 20 + Math.floor(Math.random() * 10);
    const pieces = Math.floor(Math.random() * 10);

    localStorage.setItem("stat_hab", hab.toString());
    localStorage.setItem("stat_end", end.toString());
    localStorage.setItem("stat_end_max", end.toString());
    localStorage.setItem("stat_pieces", pieces.toString());
  }

  loadStats() {
    Object.keys(this.statsConfig).forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        const stored = localStorage.getItem("stat_" + id);
        if (stored) {
          input.value = stored;
        }
      }
    });
  }

  initListeners() {
    Object.keys(this.statsConfig).forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => {
          let value = parseInt(input.value, 10) || 0;
          
          if (id === 'end') {
            const max = parseInt(localStorage.getItem('stat_end_max'), 10) || 30;
            if (value > max) {
              value = max;
              input.value = max;
            }
          }
          
          localStorage.setItem("stat_" + id, value.toString());
        });
      }
    });
  }
}

// ======================
// Gestion de la sauvegarde des champs
// ======================
class FieldManager {
  init() {
    this.loadFields();
    this.initSaveListeners();
  }

  loadFields() {
    CONFIG.fields.forEach(id => {
      const element = document.getElementById(id);
      const stored = localStorage.getItem(id);
      
      if (!element || stored === null) return;

      switch (element.tagName) {
        case "INPUT":
        case "TEXTAREA":
          element.value = stored;
          break;
        case "SELECT":
          if (id.startsWith("discipline")) {
            element.value = stored;
          } else {
            element.selectedIndex = parseInt(stored, 10);
          }
          break;
        case "SPAN":
        case "DIV":
          element.textContent = stored;
          break;
      }
    });
  }

  initSaveListeners() {
    CONFIG.fields.forEach(id => {
      const element = document.getElementById(id);
      if (!element) return;

      const event = (element.tagName === "SELECT") ? "change" : "input";
      element.addEventListener(event, () => {
        const toStore = (element.tagName === "SELECT" && id.startsWith("discipline"))
          ? element.value
          : element.tagName === "SELECT"
            ? element.selectedIndex.toString()
            : element.value;
        
        localStorage.setItem(id, toStore);
      });
    });
  }
}

// ======================
// Gestion de la navigation
// ======================
class NavigationManager {
  init() {
    this.initParagraphNavigation();
    this.initSheetToggle();
    this.initResetButton();
  }

  initParagraphNavigation() {
    const paragraphs = document.querySelectorAll('.main-content p');
    const links = document.querySelectorAll('.main-content a');
    const introScreen = document.getElementById('intro-screen');
    const startButton = document.getElementById('start-button');

    const showParagraph = (id) => {
      paragraphs.forEach(p => p.style.display = p.id === id ? 'block' : 'none');
      localStorage.setItem('currentParagraph', id);
    };

    if (startButton) {
      startButton.addEventListener('click', () => {
        if (introScreen) introScreen.style.display = 'none';
        
        const saved = localStorage.getItem('currentParagraph') || 'paraIntro';
        showParagraph(saved);
      });
    }

    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const id = link.getAttribute('href').slice(1);
        showParagraph(id);
      });
    });

    // Initialisation
    if (introScreen) introScreen.style.display = 'flex';
    paragraphs.forEach(p => p.style.display = 'none');
  }

  initSheetToggle() {
    const sheetToggle = document.getElementById('sheet-toggle');
    const sheet = document.getElementById('character-sheet');
    const closeBtn = document.getElementById('close-sheet');

    if (sheetToggle && sheet) {
      sheetToggle.addEventListener('click', () => sheet.classList.toggle('hidden'));
    }
    
    if (closeBtn && sheet) {
      closeBtn.addEventListener('click', () => sheet.classList.add('hidden'));
    }
  }

  initResetButton() {
    const resetButton = document.getElementById('reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (confirm("Êtes-vous sûr de vouloir tout réinitialiser ?")) {
          this.resetGame();
        }
      });
    }
  }

  resetGame() {
    // Conserver certaines préférences utilisateur
    const preservedKeys = ['userPreferences', 'settings'];
    const tempStorage = {};
    
    preservedKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) tempStorage[key] = value;
    });

    // Nettoyer le localStorage
    localStorage.clear();

    // Restaurer les préférences
    Object.keys(tempStorage).forEach(key => {
      localStorage.setItem(key, tempStorage[key]);
    });

    // Recharger la page
    window.location.reload();
  }
}

// ======================
// Gestion de la zone de texte auto-redimensionnable
// ======================
class TextareaManager {
  init() {
    const textarea = document.getElementById('objetsSpeciaux');
    if (!textarea) return;

    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    // Charger la valeur sauvegardée
    const saved = localStorage.getItem('feuille_objetsSpeciaux');
    if (saved !== null) {
      textarea.value = saved;
      resize();
    }

    // Sauvegarder et redimensionner à chaque modification
    textarea.addEventListener('input', () => {
      resize();
      localStorage.setItem('feuille_objetsSpeciaux', textarea.value);
    });
  }
}

// ======================
// Initialisation principale
// ======================
class GameManager {
  constructor() {
    this.disciplineManager = new DisciplineManager();
    this.statsManager = new StatsManager();
    this.fieldManager = new FieldManager();
    this.navigationManager = new NavigationManager();
    this.textareaManager = new TextareaManager();
  }

  init() {
    console.log("🎮 Initialisation du jeu...");
    
    this.statsManager.init();
    this.fieldManager.init();
    this.textareaManager.init();
    this.navigationManager.init();
    
    // Initialiser les disciplines avec un léger délai pour s'assurer que le DOM est prêt
    setTimeout(() => {
      this.disciplineManager.init();
      
      // Afficher les disciplines dans la zone dédiée
      const container = document.getElementById('zone-disciplines');
      if (container) {
        const savedDisciplines = JSON.parse(localStorage.getItem("disciplines_choisies")) || [];
        this.disciplineManager.displayList(container, savedDisciplines);
      }
    }, 100);

    console.log("✅ Initialisation terminée");
  }
}

// ======================
// Lancement au chargement de la page
// ======================
document.addEventListener('DOMContentLoaded', () => {
  // Injecter la chaîne HTML directement
  document.getElementById('contenu-paragraphes').innerHTML = contenuParagraphes;

  // Ensuite lancer le jeu
  const gameManager = new GameManager();
  gameManager.init();
});



// Sauvegarde avant fermeture de la page
window.addEventListener('beforeunload', () => {
  console.log("💾 Sauvegarde avant fermeture...");
});