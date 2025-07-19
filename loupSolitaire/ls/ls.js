// ======================
// Configuration générale
// ======================

// Colonnes : quotient d'attaque de -11 ou moins à +11 ou plus (index 0 à 12)
// Lignes : chiffre de la table de hasard (0 à 9)
  const htmlCC = document.querySelector('html');

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
  [ -7,  -6,     -5,    -4,    -4,    -3,    -2,   -2,    -2,    -2,    -2,    -2,    -1 ], // 5
  [ -6,  -6,     -5,    -4,    -3,    -2,   -2,  -2,   -2,   -1,   -1,   -1,   -1 ], // 6
  [ -5,  -5,     -4,    -3,    -2,    -2,   -1,  -1,   -1,   0,   0,   0,   0 ], // 7
  [ -4,  -4,     -3,    -2,    -1,    -1,    0,  0,   0,  0,   0,   0,    0], // 8
  [ -3,  -3,     -2,     0,     0,     0,    0,  0,   0,   0,   0,   0,    0], // 9
  [ 0,    0,      0,     0,     0,     0,    0,  0,   0,   0,   0,   0,   0]  // 0
];
function afficherFinCombat() {
  const zoneCombat = document.getElementById('zoneBarresCombat');
  zoneCombat.innerHTML = `
    <div style="text-align:center; padding:40px; font-size:32px; color:#900; user-select:none;">
      <div style="font-size:80px;">💀</div>
      <p>Vous êtes mort.</p>
    </div>
  `;
}

function remapperLancerDe(lancerDe) {
  if (lancerDe === 0) return 9; // 0 → ligne 10 (index 9)
  else return lancerDe - 1;     // 1→0 (ligne1), 2→1 (ligne2), ..., 9→8 (ligne9)
}


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


 logCombat(paragraphe, ennemi) {
    const vuln = paragraphe.dataset.vulnerablepsy || 'False';
    const attaquePsy = paragraphe.dataset.attaquepsy || 'False';
    const quotient = paragraphe.dataset.attaquequotient || '0hab';
    const bonus = paragraphe.dataset.bonus || '0hab';

    console.log(`🛡️ [COMBAT - ${paragraphe.id}]`);
    console.log(`Nom ennemi         : ${ennemi.nom}`);
    console.log(`HABILETÉ / ENDURANCE : ${ennemi.hab} / ${ennemi.end}`);
    console.log(`Vulnérable psy     : ${vuln}`);
    console.log(`Attaque psy        : ${attaquePsy}`);
    console.log(`Malus sur quotient : ${quotient}`);
    console.log(`Bonus combat       : ${bonus}`);
    console.log('------------------------------------');
  }

  appliquerEffetsCombatTemporaire(paragraphe, ennemi, habHeroBase) {
  let bonusCombat = 0;
  let malusQuotient = 0;
  let message = "";

  const isVulnerable = paragraphe.dataset.vulnerablepsy === "True";
  const subitAttaquePsy = paragraphe.dataset.attaquepsy === "True";
  const dataQuotient = paragraphe.dataset.attaquequotient || "0hab";
  const dataBonus = paragraphe.dataset.bonus || "0hab";

  const bonusMatch = dataBonus.match(/([-+]?\d+)hab/);
  if (bonusMatch) {
    bonusCombat += parseInt(bonusMatch[1], 10);
    if (bonusCombat !== 0) message += `🟢 Bonus combat temporaire : ${bonusCombat} HABILETÉ\n`;
  }

  const malusMatch = dataQuotient.match(/([-+]?\d+)hab/);
  if (malusMatch) {
    malusQuotient += parseInt(malusMatch[1], 10);
    if (malusQuotient !== 0) message += ` `;
  }

  const psyActive = isVulnerable && Object.values(localStorage).some(val => val && val.includes("Puissance psychique"));
  if (psyActive) {
    bonusCombat += 2;
    message += `🧠 Ennemi sensible à la puissance psychique : +2 HABILETÉ\n`;
  }

  const psySubit = subitAttaquePsy && !Object.values(localStorage).some(val => val && val.includes("Bouclier psychique"));
  if (psySubit) {
    bonusCombat += malusQuotient;
    message += `🧠 Attaque mentale subie : ${malusQuotient} HABILETÉ\n`;
  }

  const habCombat = habHeroBase + bonusCombat;
  const quotientFinal = habCombat - ennemi.hab;

  console.log(`[COMBAT TEMPORAIRE] Héros: ${habHeroBase} → ${habCombat}, quotient ajusté: ${quotientFinal}`);
  if (message) console.log(message.trim());

  return {
    habCombat,
    quotientFinal,
    resume: message
  };
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
    this.logCombat(p, ennemi);
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

    
    const afficherBarres(bonusPsy, messagePsy, habHeroMax, vieHeroMax) => {
const effetsCombat = this.appliquerEffetsCombatTemporaire(p, ennemi, habHeroMax + bonusPsy + bonusArme);
const quotient = effetsCombat.quotientFinal;
const messageEffet = effetsCombat.resume;
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
        <div class="barre-container" style="margin-bottom:10px;">
          <div class="vie-remplissage" id="vieMonstreBarre"></div>
          <div class="contenu-barre">
            <div class="coeur" id="iconeMonstreVie">👹</div>
            <div class="nom">${ennemi.nom}</div>
            <div class="rond-vie" id="vieMonstreRestante">${vieMonstre}</div>
          </div>
        </div>

<button id="btnRoundCombat"