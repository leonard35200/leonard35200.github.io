// ======================
// Configuration générale
// ======================

// Colonnes : quotient d'attaque de -11 ou moins à +11 ou plus (index 0 à 12)
// Lignes : chiffre de la table de hasard (0 à 9)

const degatsEnnemi = [
  // -11  -10/-9  -8/-7  -6/-5  -4/-3  -2/-1  0/0  +1/+2  +3/+4  +5/+6  +7/+8  +9/+10  +11 ou sup
  [ 0,   0,       0,    0,     -1,    -2,    -3,   -4,    -5,    -6,    -7,    -8,   -9 ], // 1
  [ 0,   0,       0,    -1,    -2,    -3,    -4,   -5,    -6,    -7,    -8,    -9,  -10 ], // 2
  [ 0,   0,      -1,    -2,    -3,    -4,    -5,   -6,    -7,    -8,    -9,   -10,  -11 ], // 3
  [ 0,   -1,     -2,    -3,    -4,    -5,    -6,   -7,    -8,    -9,   -10,   -11,   -12], // 4
  [ -1,  -2,     -3,    -4,    -5,    -6,    -7,   -8,    -9,   -10,   -11,   -12,   -14], // 5
  [ -2,  -3,     -4,    -5,    -6,    -7,    -8,   -9,   -10,   -11,   -12,   -14,   -16], // 6
  [ -3,  -4,     -5,    -6,    -7,    -8,    -9,  -10,   -11,   -12,   -14,   -16,   -18], // 7
  [-4,    -5,    -6,    -7,    -8,    -9,   -10,  -11,   -12,   -14,   -16,   -18,   "T"]  // 8
  [-5,    -6,    -7,    -8,    -9,   -10,  -11,   -12,   -14,   -16,   -18,   "T",   "T"], // 9
  [-6,    -7,    -8,    -9,   -10,  -11,   -12,   -14,   -16,   -18,   "T",   "T",   "T"]  // 0 attention 0 ici !!
];

const degatsLS = [
  // -11  -10/-9  -8/-7  -6/-5  -4/-3  -2/-1  0/0  +1/+2  +3/+4  +5/+6  +7/+8  +9/+10  +11 ou sup
  ["T", "T",     -8,    -6,    -6,    -5,    -5,   -5,    -4,    -4,    -4,    -3,    -3 ], // 1
  ["T",  -8,     -7,    -6,    -5,    -5,    -4,   -4,    -3,    -3,    -3,    -3,    -2 ], // 2
  [ -8,  -7,     -6,    -5,    -4,    -4,    -3,   -3,    -3,    -3,    -2,    -2,    -2 ], // 3
  [ -8,  -7,     -6,    -5,    -4,    -4,    -3,   -3,    -2,    -2,    -2,    -2,    -2 ], // 4
  //[ -7,  -6,     -5,    -4,    -4,    -9,   -10,  -11,   -12,   -14,   -16,   -18,   -20 ], // 5
  //[ -6,  -6,     -5,    -4,    -3,   -10,   -11,  -12,   -14,   -16,   -18,   -20,   -22 ], // 6
  //[ -5,  -5,     -4,    -3,   -2,   -11,   -12,  -14,   -16,   -18,   -20,   -22,   -24 ], // 7
  //[ -4,  -4,     -3,   -2,   -1,   -12,   -14,  -16,   -18,   -20,   -22,   -24,    "T"], // 8
  //[ -3,  -3,    -2,   -0,   0,   -14,   -16,  -18,   -20,   -22,   -24,   "T",    "T"], // 9
  //[ 0,    0,    0,   -0,   0,   -16,   -18,  -20,   -22,   "T",   "T",   "T",    "T"]  // 0
];
// Remplace intégralement votre ancienne déclaration de CONFIG par celle-ci :
const CONFIG = {
  // Identifiants des 5 selects
  disciplineIds: ["discipline1","discipline2","discipline3","discipline4","discipline5"],

  // Tous les champs attendus par FieldManager.loadFields()
  fields: [
    "discipline1","discipline2","discipline3","discipline4","discipline5",
    "objet1","objet2","objet3","objet4","objet5","objet6","objet7","objet8",
    "arme1","arme2","hab","pieces","objetsSpeciaux"
  ],

  // Getter dynamique : mode interactif (1) si aucune sauvegarde, sinon mode statique (0)
  get test() {
  const forceInteractif = localStorage.getItem("tuto_vue") !== "1";
  if (forceInteractif) return 1;

  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem("disciplines_choisies") || "[]");
  } catch {
    saved = [];
  }
  return saved.length === 0 ? 1 : 0;
}

};


// ======================
// Données des disciplines Kaï
// ======================

const armes = [
  "Poignard", "Lance", "Masse d'armes", "Sabre", "Marteau de guerre", 
  "Épée", "Hache", "Bâton", "Glaive"
];

function armeAleatoire() {
  return armes[Math.floor(Math.random() * armes.length)];
}

// Initialisation de l'arme maîtrisée
let armeMaitrisee = localStorage.getItem('arme_maitrisee');
if (!armeMaitrisee) {
  armeMaitrisee = armeAleatoire();
  localStorage.setItem('arme_maitrisee', armeMaitrisee);
}

const disciplinesKai = [
  { nom: "", effet: "" },
  { nom: "Sixième Sens", effet: "Devine les dangers imminents, détecte intentions et objets suspects." },
  { nom: "Camouflage", effet: "Se fond dans l'environnement urbain ou naturel." },
  { nom: "Maîtrise psychique de la matière", effet: "Déplace de petits objets par la pensée." },
  { nom: "Guérison", effet: "+1 ENDURANCE par paragraphe sans combat." },
  { nom: "Communication animale", effet: "Permet de comprendre ou influencer certains animaux." },
  { nom: "Orientation", effet: "Permet de toujours choisir la bonne direction." },
  { nom: "Chasse", effet: "Plus besoin de repas, sauf en désert." },
  { nom: `Maîtrise des armes (+2 hab. si possède ${armeMaitrisee})`, effet: `+2 HABILETÉ avec ${armeMaitrisee}.` },
  { nom: "Bouclier psychique", effet: "Protège contre les attaques mentales." },
  { nom: "Puissance psychique (+2 hab. si ennemi sensible)", effet: "+2 HABILETÉ si l'ennemi est sensible." }
];



// ======================
// Utilitaires
// ======================

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
  container.innerHTML = '';

  if (CONFIG.test === 1) {
    // Mode interactif : crée uniquement 5 <select>, sans aucun texte d'effet
    CONFIG.disciplineIds.forEach(id => {
      const select = document.createElement('select');
      select.id = id;

      // ✅ Ajoute un listener au moment de créer le <select>
      select.addEventListener('change', () => {
        this.saveDisciplines();
        this.updateAllMenus();
        if (typeof updateTuto === 'function') updateTuto(); // 🔁 débloque le bouton si 5 disciplines
      });

      // Crée les options
      const placeholder = document.createElement('option');
      placeholder.value = "";
      placeholder.textContent = "-- Choisir une discipline --";
      select.appendChild(placeholder);

      disciplinesKai.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.nom;
        opt.textContent = d.nom;
        select.appendChild(opt);
      });

      container.appendChild(select);
    });

    // Appelle init() après création des <select>
    this.init();

  } else {
    // Mode statique : affiche juste la liste des noms, sans texte d'effet
    const ul = document.createElement('ul');
    if (list && list.length) {
      list.forEach(item => {
        const li = document.createElement('li');
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
        let value = parseInt(input.value, 10);
        if (isNaN(value)) value = 0;

        // Ne jamais descendre sous zéro
        if (value < 0) value = 0;

        // Pour Endurance, ne pas dépasser le max
        if (id === 'end') {
          const max = parseInt(localStorage.getItem('stat_end_max'), 10) || 30;
          if (value > max) value = max;
        }

        input.value = value;
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

 detecterCombatDansParagraphe(id) {
  const vieHeroMax = localStorage.getItem('stat_end');
  const p = document.getElementById(id);
  if (!p) return;

  // Détecte tous les combats dans le paragraphe (multi-monstres)
  const regex = /<strong>([^<]*?)HABILET[ÉE]\s*[:|：]?\s*(\d+)\s*ENDURANCE\s*[:|：]?\s*(\d+)[^<]*<\/strong>/gi;
  const combats = [];
  let match;
  while ((match = regex.exec(p.innerHTML)) !== null) {
    combats.push({
      nom: match[1].replace(/<br>/g, '').replace(/[:\-–—]/g, '').trim() || "Monstre",
      hab: parseInt(match[2], 10),
      end: parseInt(match[3], 10)
    });
  }
  if (combats.length === 0) return;

  // Fonction pour lancer chaque combat à la suite
  const lancerCombat = (index) => {
    // Nettoie l'ancien popup
    const old = p.querySelector('.combat-popup');
    if (old) old.remove();

    if (index >= combats.length) {
      // Tous les combats sont faits
      const msg = document.createElement('div');
      msg.textContent = "Tous les ennemis sont vaincus !";
      msg.style = "background:#0a0; color:white; padding:8px 16px; border-radius:8px; margin:1em 0; font-weight:bold;";
      p.appendChild(msg);
      return;
    }

    // Variables du combat courant
    const ennemi = combats[index];
    let vieMonstre = ennemi.end;
    let habMonstre = ennemi.hab;
    const vieMonstreMax = vieMonstre;
    localStorage.setItem('stat_monstre', vieMonstre);

    // Récupère ton habileté
    let habHero = parseInt(localStorage.getItem('stat_hab'), 10);
    if (isNaN(habHero)) {
      const inputHab = document.getElementById('hab');
      habHero = inputHab ? parseInt(inputHab.value, 10) : 15;
    }
    let habHeroMax = habHero;
    const arme1 = localStorage.getItem('arme1');
    const arme2 = localStorage.getItem('arme2');
    const possedeAucuneArme = (!arme1 || arme1.trim() === "") && (!arme2 || arme2.trim() === "");

    let messageMainNue = "";
    if (possedeAucuneArme) {
      habHeroMax -= 2;
      messageMainNue = "⚠️ Combat à mains nues : -2 HABILETÉ";
    }

    // Gestion bonus psychiques
    let bonusPsy = 0;
    let messagePsy = '';
    const armesPsy = Object.values(localStorage).some(val => val && val.includes("Puissance psychique"));
    const bouclierPsy = Object.values(localStorage).some(val => val && val.includes("Bouclier psychique"));

    // Gestion bonus Maîtrise des armes
    let bonusArme = 0;
    let armeMaitrisee = localStorage.getItem('arme_maitrisee');
    const disciplineArme = localStorage.getItem('discipline1') === ("Maîtrise des armes (+2 hab. si possède " + armeMaitrisee + ")");
    const armePossedee = [localStorage.getItem('arme1'), localStorage.getItem('arme2')].includes(armeMaitrisee);

    if (disciplineArme && armePossedee) {
      bonusArme = 2;
    }

    // Création de la boîte de combat AVANT les barres de vie
    const div = document.createElement('div');
    div.className = 'combat-popup';

    let confirmationHTML = `
      <div style="background:#222; color:#fff; border:2px solid #c00; padding:1em; margin-top:1em; text-align:center; border-radius:12px; box-shadow:0 4px 16px #000a;">
        <div style="font-size:2em; margin-bottom:1em;">COMBAT contre <b>${ennemi.nom}</b></div>
    `;

    if (armesPsy) {
      confirmationHTML += `<div id="confirmationPsy" style="margin-bottom:1em;">
        <b>Discipline psychique détectée :</b><br>
        <button id="btnPsy2" style="margin:0.5em;">Activer bonus +2</button>
        <button id="btnPsy0" style="margin:0.5em;">Aucun bonus</button>
      </div>`;
    }

    confirmationHTML += `<div id="zoneBarresCombat" style="display:none"></div></div>`;
    div.innerHTML = confirmationHTML;
    p.appendChild(div);

    // Fonction pour afficher les barres de vie et le quotient d'attaque
    const afficherBarres = (bonusPsy, messagePsy, habHeroMax, vieHeroMax) => {
      const quotient = habHeroMax + bonusPsy - habMonstre;
      const vieHero = parseInt(localStorage.getItem('stat_end'), 10) || vieHeroMax;

      let html = `
        <div class="barre-container" style="margin-bottom:10px;">
          <div class="vie-remplissage" id="vieHeroBarre"></div>
          <div class="contenu-barre">
            <div class="coeur" id="iconeHeroVie">❤️</div>
            <div class="nom">Héros</div>
            <div class="rond-vie" id="vieHeroRestante">${vieHero}</div>
          </div>
        </div>
        <button id="btnHeroMoins2" style="margin-bottom:10px;">-2 Héros</button>
        <div class="barre-container" style="margin-bottom:10px;">
          <div class="vie-remplissage" id="vieMonstreBarre"></div>
          <div class="contenu-barre">
            <div class="coeur" id="iconeMonstreVie">👹</div>
            <div class="nom">${ennemi.nom}</div>
            <div class="rond-vie" id="vieMonstreRestante">${vieMonstre}</div>
          </div>
        </div>
        <button id="btnMonstreMoins2">-2 ${ennemi.nom}</button>
<div style="margin-top:1em;font-size:1.2em;">
  Quotient d'attaque : ${quotient} ${messagePsy}<br>
  ${messageMainNue}
</div>
      `;
      div.querySelector('#zoneBarresCombat').innerHTML = html;
      div.querySelector('#zoneBarresCombat').style.display = '';

      // Styles (comme avant)
      const style = document.createElement('style');
      style.textContent = `
        .barre-container {
          position: relative;
          width: 320px;
          height: 38px;
          border-radius: 999px;
          background: #ddd;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          box-shadow: 0 0 8px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .vie-remplissage {
          position: absolute;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(to right, #4e9cff, #b3e6ff);
          transition: width 0.3s;
          z-index: 1;
        }
        .contenu-barre {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          width: 100%;
          justify-content: space-between;
          color: #222;
          padding: 0 15px;
        }
        .coeur {
          font-size: 22px;
        }
        .nom {
          font-weight: bold;
          font-size: 16px;
        }
        .rond-vie {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 2px solid #999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 13px;
        }
        #btnHeroMoins2, #btnMonstreMoins2 {
          padding: 6px 14px;
          font-size: 14px;
          cursor: pointer;
          border: none;
          background: #333;
          color: white;
          border-radius: 8px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
          margin-bottom: 10px;
          margin-left: 0;
        }
        #btnHeroMoins2:hover, #btnMonstreMoins2:hover {
          background: #555;
        }
      `;
      document.head.appendChild(style);

      function majBarre(idBarre, idRond, idIcone, vie, vieMax, iconePleine, iconeVide) {
        const barre = div.querySelector("#" + idBarre);
        const vieText = div.querySelector("#" + idRond);
        const icone = div.querySelector("#" + idIcone);
        if (!barre || !vieText || !icone) return;
        barre.style.width = (vie / vieMax) * 100 + "%";
        vieText.textContent = vie;
        icone.textContent = vie === 0 ? iconeVide : iconePleine;
      }

      let vieHeroCourant = vieHero;
      let vieMonstreCourant = vieMonstre;

      majBarre("vieHeroBarre", "vieHeroRestante", "iconeHeroVie", vieHeroCourant, vieHeroMax, "❤️", "💀");
      majBarre("vieMonstreBarre", "vieMonstreRestante", "iconeMonstreVie", vieMonstreCourant, vieMonstreMax, "👹", "💀");

      div.querySelector("#btnHeroMoins2").onclick = () => {
        vieHeroCourant = Math.max(0, vieHeroCourant - 2);
        majBarre("vieHeroBarre", "vieHeroRestante", "iconeHeroVie", vieHeroCourant, vieHeroMax, "❤️", "💀");
        localStorage.setItem('stat_end', vieHeroCourant);
        const inputEnd = document.getElementById('end');
        if (inputEnd) inputEnd.value = vieHeroCourant;
      };

      div.querySelector("#btnMonstreMoins2").onclick = () => {
        vieMonstreCourant = Math.max(0, vieMonstreCourant - 2);
        majBarre("vieMonstreBarre", "vieMonstreRestante", "iconeMonstreVie", vieMonstreCourant, vieMonstreMax, "👹", "💀");
        localStorage.setItem('stat_monstre', vieMonstreCourant);
        // Si le monstre est mort, on passe au suivant
        if (vieMonstreCourant <= 0) {
          setTimeout(() => {
            div.remove();
            lancerCombat(index + 1);
          }, 600);
        }
      };
    };

    // === Ajout des listeners pour boutons psy ===
    if (armesPsy) {
      const btn2 = div.querySelector("#btnPsy2");
      const btn0 = div.querySelector("#btnPsy0");

      if (btn2) {
        btn2.onclick = () => {
          const confirmationDiv = div.querySelector("#confirmationPsy");
          if (confirmationDiv) confirmationDiv.remove();
          div.querySelector("#zoneBarresCombat").style.display = "";
          afficherBarres(2, "(Psychique)", habHeroMax, vieHeroMax);
        };
      }
      if (btn0) {
        btn0.onclick = () => {
          const confirmationDiv = div.querySelector("#confirmationPsy");
          if (confirmationDiv) confirmationDiv.remove();
          div.querySelector("#zoneBarresCombat").style.display = "";
          afficherBarres(0, "", habHeroMax, vieHeroMax);
        };
      }
    } else {
      // Pas de discipline psy, on affiche directement les barres
      afficherBarres(0, "", habHeroMax, vieHeroMax);
    }
  };

  // Lance le premier combat
  lancerCombat(0);
}


  initParagraphNavigation() {
      const self = this;
    const paragraphs = document.querySelectorAll('.main-content p');
    const links = document.querySelectorAll('.main-content a');
    const introScreen = document.getElementById('intro-screen');
    const startButton = document.getElementById('start-button');

    const showParagraph = (id) => {
      paragraphs.forEach(p => p.style.display = p.id === id ? 'block' : 'none');
      localStorage.setItem('currentParagraph', id);
      window.scrollTo(0, 0);
  let visites = JSON.parse(localStorage.getItem('chapitres_visites') || '[]');
  if (!visites.includes(id)) {
  visites.push(id);
  localStorage.setItem('chapitres_visites', JSON.stringify(visites));
}
const paragraphe = document.getElementById(id);
const contientCombat = paragraphe && paragraphe.innerHTML.includes('<br><br><strong>');

if (contientCombat) {
  self.detecterCombatDansParagraphe(id);
} else {
  console.log("✅ Aucun combat, tentative de guérison...");
  self.guerisonPassive();
}


  
    };

const tutoScreen = document.getElementById('tuto-screen');
const tutoPages = Array.from(document.querySelectorAll('.tuto-page'));
const btnNext = document.getElementById('btn-tuto-next');
const btnPrev = document.getElementById('btn-tuto-prev');
if (localStorage.getItem('tuto_vue') === "1") {
  document.getElementById('tuto-screen')?.classList.add('hidden');
  document.getElementById('intro-screen')?.classList.remove('hidden');
}
const tutoVu = localStorage.getItem('tuto_vue');
document.getElementById('tuto-screen')?.classList.add('hidden');
if (tutoVu !== "1"  && tutoScreen && btnNext && btnPrev && tutoPages.length > 0) {
  introScreen.style.display = 'none';
  tutoScreen.classList.remove('hidden');
  window._currentTutoPage = 0;


  const updateTuto = () => {
  const box = document.getElementById('tuto-screen');
  if (box) box.scrollTo({ top: 0});

  tutoPages.forEach((page, i) => {
    page.classList.toggle('hidden', i !== window._currentTutoPage);
  });

  btnPrev.disabled = window._currentTutoPage === 0;
  btnNext.textContent = window._currentTutoPage === tutoPages.length - 1 ? "Commencer l’aventure ▶️" : "Suivant ▶️";

  if (window._currentTutoPage === 4) {
    const ids = ["discipline1", "discipline2", "discipline3", "discipline4", "discipline5"];
    const values = ids.map(id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : "";
    });
    const uniques = [...new Set(values.filter(v => v !== ""))];
    if (uniques.length === 5) {
      btnNext.disabled = false;
      btnNext.style.opacity = "1";
      btnNext.style.pointerEvents = "auto";
    } else {
      btnNext.disabled = true;
      btnNext.style.opacity = "0.5";
      btnNext.style.pointerEvents = "none";
    }
  } else {
    btnNext.disabled = false;
    btnNext.style.opacity = "1";
    btnNext.style.pointerEvents = "auto";
  }
};


  btnNext.addEventListener('click', () => {
  const totalPages = tutoPages.length;

  if (window._currentTutoPage < totalPages - 1) {
    window._currentTutoPage++;
    updateTuto();
    return;
  }

  // On est déjà sur la dernière page
  localStorage.setItem('tuto_vue', "1");
  location.reload();
  console.log("Bouton 'Commencer' cliqué, mais aucune action effectuée.");

  // Ne rien faire d'autre ici : pas de lancement de l'aventure ni changement d'écran
});




  btnPrev.addEventListener('click', () => {
    if (window._currentTutoPage > 0) {
      window._currentTutoPage--;
      updateTuto();
    }
  });
["discipline1","discipline2","discipline3","discipline4","discipline5"].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("change", () => {
      updateTuto(); // on appelle toujours updateTuto, sans condition
    });
  }
});





  updateTuto();
} else {
  introScreen.style.display = 'flex';
}


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

    const btnRetour = document.getElementById('btn-retour-chapitre');
if (btnRetour) {
  btnRetour.addEventListener('click', () => {
    let visites = JSON.parse(localStorage.getItem('chapitres_visites') || '[]');
    if (visites.length > 1) {
      visites.pop(); // On enlève le chapitre courant
      const precedent = visites[visites.length - 1];
      localStorage.setItem('chapitres_visites', JSON.stringify(visites));
      // Affiche le chapitre précédent
      paragraphs.forEach(p => p.style.display = p.id === precedent ? 'block' : 'none');
      localStorage.setItem('currentParagraph', precedent);
      document.getElementById('character-sheet').classList.add('hidden');
    }
  });
}
  }

  initSheetToggle() {
  const sheetToggle = document.getElementById('sheet-toggle');
  const sheet = document.getElementById('character-sheet');
  const closeBtn = document.getElementById('close-sheet');
  const textarea = document.getElementById('objetsSpeciaux');

  if (sheetToggle && sheet) {
    sheetToggle.addEventListener('click', () => {
  sheet.classList.toggle('hidden');

  if (!sheet.classList.contains('hidden') && textarea) {
    requestAnimationFrame(() => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    });
  }
});

  }

  if (closeBtn && sheet) {
    closeBtn.addEventListener('click', () => {
      sheet.classList.add('hidden');
    });
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
    const preservedKeys = ['userPreferences', 'settings','objetsSpeciaux'];
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

    guerisonPassive() {
  console.log("🩹 guérisonPassive appelée");

  // Affiche toutes les clés et valeurs dans localStorage (limitées à 10 pour lisibilité)
  const keys = Object.keys(localStorage).slice(0, 10);
  console.log("Clés localStorage (max 10):", keys);
  keys.forEach(key => {
    console.log(` - ${key} : ${localStorage.getItem(key)}`);
  });

  // Vérifie la présence de la valeur "Guérison"
  // Récupérer et parser la liste des disciplines choisies
const disciplinesRaw = localStorage.getItem("disciplines_choisies");
let hasGuerison = false;
try {
  const disciplines = JSON.parse(disciplinesRaw);
  hasGuerison = Array.isArray(disciplines) && disciplines.includes("Guérison");
} catch(e) {
  console.warn("Erreur lors du parsing de disciplines_choisies:", e);
}

console.log("Présence de 'Guérison' dans disciplines_choisies ? ", hasGuerison);

if (!hasGuerison) {
  console.warn("🛑 Guérison absente, fin prématurée de la fonction.");
  return;
}

  // Récupération des stats endurance
  const endRaw = localStorage.getItem("stat_end");
  const endMaxRaw = localStorage.getItem("stat_end_max");
  console.log("Valeurs brutes stat_end:", endRaw, "stat_end_max:", endMaxRaw);

  const end = parseInt(endRaw, 10);
  const endMax = parseInt(endMaxRaw, 10);

  if (isNaN(end) || isNaN(endMax)) {
    console.warn("🛑 stat_end ou stat_end_max est NaN, fin prématurée.");
    return;
  }

  console.log("Endurance actuelle:", end, "Endurance max:", endMax);

  if (end < endMax) {
    const newEnd = Math.min(end + 1, endMax);
    console.log(`Augmentation endurance : ${end} -> ${newEnd}`);

    localStorage.setItem("stat_end", newEnd);

    const input = document.getElementById("end");
    if (input) {
      input.value = newEnd;
      console.log("Champ #end mis à jour avec la nouvelle valeur :", newEnd);
    } else {
      console.warn("⚠️ Élément #end introuvable dans le DOM.");
    }

    // Affichage temporaire du message de guérison
    const zone = document.querySelector('.main-content');
    if (zone) {
      const msg = document.createElement('div');
      msg.textContent = "+1 ENDURANCE (Guérison)";
      msg.style = "background:#0a0; color:white; padding:6px 12px; border-radius:6px; position:fixed; top:20px; left:50%; transform:translateX(-50%); z-index:9999; font-weight:bold;";
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2500);
      console.log("Message de guérison affiché temporairement.");
    } else {
      console.warn("⚠️ Élément .main-content introuvable pour afficher le message.");
    }

    console.log("💚 Guérison appliquée avec succès.");
  } else {
    console.log("Endurance au maximum, aucune guérison appliquée.");
  }
}



}

// ======================
// Gestion de la zone de texte auto-redimensionnable
// ======================
class TextareaManager {
  init() {
    const textarea = document.getElementById('objetsSpeciaux');
    if (!textarea) {
      console.log('Textarea non trouvée');
      return;
    }
    console.log('Textarea trouvée');

    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
      console.log('resize appelé, hauteur ajustée à', textarea.style.height, 'scrollHeight:', textarea.scrollHeight);
    };

    const saved = localStorage.getItem('objetsSpeciaux');
    if (saved !== null) {
      textarea.value = saved;
      console.log('Valeur chargée depuis localStorage:', saved);
      console.log('Textarea visible?', textarea.offsetHeight > 0, textarea.offsetWidth > 0);

      setTimeout(() => {
        resize();
      }, 0);
    } else {
      console.log('Aucune valeur dans localStorage');
    }

    window.addEventListener('load', () => {
      console.log('Événement load déclenché');
      resize();
    });

    textarea.addEventListener('input', () => {
      console.log('input détecté, nouvelle valeur:', textarea.value);
      resize();
      localStorage.setItem('objetsSpeciaux', textarea.value);
    });
  }
}

const manager = new TextareaManager();
manager.init();



// ======================
// gestion du dé de dix
// ======================
  (function() {
    const canvas = document.getElementById('deCarre');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;

    function drawSquare() {
      ctx.clearRect(0, 0, size, size);

      // Dégradé radial centré, couvrant tout le carré
      const grad = ctx.createRadialGradient(
        size/2, size/2, size*0.1,
        size/2, size/2, size*0.7
      );
      grad.addColorStop(0, '#3CA7DF');
      grad.addColorStop(1, '#2980b9');

      // Dessin d'un carré à coins arrondis
      const radius = 20; // rayon des coins
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(size - radius, 0);
      ctx.quadraticCurveTo(size, 0, size, radius);
      ctx.lineTo(size, size - radius);
      ctx.quadraticCurveTo(size, size, size - radius, size);
      ctx.lineTo(radius, size);
      ctx.quadraticCurveTo(0, size, 0, size - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      ctx.fillStyle = grad;
      ctx.fill();

      // Contour
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#1f5f8a';
      ctx.stroke();
    }

    function drawNumber(num) {
      ctx.fillStyle = 'white';
      // Si c'est 10, on réduit la taille de la police
      if (num === 10) {
        ctx.font = 'bold 65px "Segoe UI", Arial';
      } else {
        ctx.font = 'bold 90px "Segoe UI", Arial';
      }
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(num, size/2, size/2 + 5);
    }

    function random1to10() {
      return Math.floor(Math.random() * 10);
    }

    function drawDie(num) {
      drawSquare();
      drawNumber(num);
    }

    let rafId;
    function animateRoll(duration = 500) {
      const start = performance.now();
      function frame(now) {
        if (now - start < duration) {
          drawDie(random1to10());
          rafId = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(rafId);
          drawDie(random1to10());
        }
      }
      rafId = requestAnimationFrame(frame);
    }

    drawDie(random1to10());
    canvas.addEventListener('click', () => animateRoll());
  })();

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

function updateArmesSelects() {
  const armesPossibles = ["", ...armes]; // Option vide
  const selects = [document.getElementById('arme1'), document.getElementById('arme2')];

  // Récupère la sélection courante
  const values = selects.map(sel => sel ? sel.value : "");

  selects.forEach((select, idx) => {
    if (!select) return;
    // Sauvegarde la sélection courante
    const current = select.value;
    // Vide les options
    select.innerHTML = '';
    armesPossibles.forEach(arme => {
      // N'affiche pas une arme déjà sélectionnée dans l'autre select (sauf si c'est la valeur courante)
      if (arme === "" || !values.includes(arme) || arme === current) {
        const opt = document.createElement('option');
        opt.value = arme;
        opt.textContent = arme === "" ? " " : arme;
        if (arme === current) opt.selected = true;
        select.appendChild(opt);
      }
    });
  });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  updateArmesSelects();
  ['arme1', 'arme2'].forEach(id => {
    const sel = document.getElementById(id);
    if (sel) {
      sel.addEventListener('change', () => {
        localStorage.setItem(id, sel.value);
        updateArmesSelects();
      });
      // Charge la valeur sauvegardée
      const stored = localStorage.getItem(id);
      if (stored) sel.value = stored;
    }
  });
});

if (typeof updateTuto === 'function') {
  CONFIG.disciplineIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", updateTuto);
    }
  });
}

// Ajoute ce listener juste après la déclaration de updateTuto
window.addEventListener('storage', function(e) {
  if (window._currentTutoPage === 4 && typeof updateTuto === 'function') {
    updateTuto();
  }
});

// À placer dans ton script principal, après la déclaration de updateTuto

function surveilleDisciplinesTuto() {
  let intervalId = setInterval(() => {
    if (window._currentTutoPage === 4) {
      let disciplines = [];
      try {
        disciplines = JSON.parse(localStorage.getItem("disciplines_choisies") || "[]");
      } catch { disciplines = []; }
      const uniques = [...new Set(disciplines.filter(x => x && x !== ""))];
      if (uniques.length === 5) {
  console.log("✅ 5 disciplines Kaï différentes sélectionnées !");
  const btnNext = document.getElementById('btn-tuto-next');
  if (btnNext) {
    btnNext.disabled = false;
    btnNext.style.opacity = "1";
    btnNext.style.pointerEvents = "auto";
  }
  clearInterval(intervalId); // ⛔ Arrête la surveillance
}
    }
  }, 500);
}


surveilleDisciplinesTuto();
