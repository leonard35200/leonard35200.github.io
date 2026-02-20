const liveConfigs = {
  odin: {
    title: 'Odin - score en direct',
    hint: 'Boutons +/- pour gérer les gains/pertes pendant la partie.',
    renderExtras: () => ''
  },
  'mille-sabords': {
    title: 'Mille Sabords - score en direct',
    hint: 'Ajoute chaque manche avec valeur positive ou négative.',
    renderExtras: () => '<input class="delta" type="number" value="0" /><button class="apply">Valider manche</button>'
  },
  'skull-king': {
    title: 'Skull King - score en direct',
    hint: 'Saisis pari + plis, le score est calculé automatiquement.',
    renderExtras: () => '<label>Pari<input class="bet" type="number" value="0"></label><label>Plis<input class="tricks" type="number" value="0"></label><button class="compute">Calculer</button>'
  },
  flip7: {
    title: 'Flip 7 - mode manuel',
    hint: 'Entrée manuelle des scores, avec boutons +2/+4/+6/+8/+10/X2.',
    renderExtras: () => `
      <div class="notice">Score manche: <strong class="manual-preview">0</strong></div>
      <div class="keypad">${[1,2,3,4,5,6,7,8,9,10,11,12,0].map(v => `<button class="digit" data-val="${v}">${v}</button>`).join('')}</div>
      <div class="mod-grid">
        <button class="mod" data-add="2">+2</button><button class="mod" data-add="4">+4</button><button class="mod" data-add="6">+6</button>
        <button class="mod" data-add="8">+8</button><button class="mod" data-add="10">+10</button><button class="mod" data-mul="2">X2</button>
      </div>
      <button class="apply primary" style="margin-top:.7rem; width:100%;">Confirmer</button>
    `
  }
};

const game = new URLSearchParams(location.search).get('game') || 'odin';
const conf = liveConfigs[game] || liveConfigs.odin;

document.getElementById('gameTitle').textContent = conf.title;
document.getElementById('gameHint').textContent = conf.hint;

document.getElementById('build').addEventListener('click', buildPlayers);
buildPlayers();

function buildPlayers() {
  const count = Math.max(1, Math.min(8, +document.getElementById('playerCount').value || 4));
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = document.createElement('article');
    card.className = 'player-live';
    card.dataset.score = '0';
    card.dataset.manual = '0';
    card.innerHTML = `
      <div class="row" style="justify-content:space-between;">
        <input type="text" value="Joueur ${i + 1}" style="max-width: 180px;" />
        <div class="live-score">0</div>
      </div>
      <div class="row" style="margin-top:.6rem;">
        <button class="minus">-1</button><button class="plus">+1</button>
        <button class="plus5">+5</button><button class="minus5">-5</button>
      </div>
      <div class="row extras" style="margin-top:.6rem;">${conf.renderExtras()}</div>
    `;
    wireCard(card);
    board.appendChild(card);
  }
}

function wireCard(card) {
  const refresh = () => card.querySelector('.live-score').textContent = card.dataset.score;
  const add = (n) => {
    card.dataset.score = String((+card.dataset.score || 0) + n);
    refresh();
  };
  card.querySelector('.plus').onclick = () => add(1);
  card.querySelector('.minus').onclick = () => add(-1);
  card.querySelector('.plus5').onclick = () => add(5);
  card.querySelector('.minus5').onclick = () => add(-5);

  if (game === 'mille-sabords') {
    card.querySelector('.apply').onclick = () => {
      add(+card.querySelector('.delta').value || 0);
      card.querySelector('.delta').value = '0';
    };
  }

  if (game === 'skull-king') {
    card.querySelector('.compute').onclick = () => {
      const bet = +card.querySelector('.bet').value || 0;
      const tricks = +card.querySelector('.tricks').value || 0;
      const delta = bet === tricks ? (bet === 0 ? 10 : bet * 20) : -(Math.abs(bet - tricks) * 10);
      add(delta);
    };
  }

  if (game === 'flip7') {
    const preview = card.querySelector('.manual-preview');
    const setManual = (n) => {
      card.dataset.manual = String(n);
      preview.textContent = n;
      card.querySelector('.apply').textContent = `Confirmer ${n}`;
    };
    card.querySelectorAll('.digit').forEach(btn => btn.onclick = () => setManual(+btn.dataset.val));
    card.querySelectorAll('.mod').forEach(btn => btn.onclick = () => {
      const current = +card.dataset.manual || 0;
      if (btn.dataset.add) setManual(current + (+btn.dataset.add));
      if (btn.dataset.mul) setManual(current * (+btn.dataset.mul));
    });
    card.querySelector('.apply').onclick = () => {
      add(+card.dataset.manual || 0);
      setManual(0);
    };
  }
}
