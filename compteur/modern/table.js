const configs = {
  'seven-classic': {
    title: 'Seven Wonders (Classique)',
    hint: 'Couleurs bleu/or/sable pour rappeler l\'Antiquité.',
    categories: ['Militaire', 'Trésor', 'Civil', 'Scientifique', 'Guildes', 'Merveilles']
  },
  'seven-duel': {
    title: 'Seven Wonders Duel',
    hint: 'Version 2 joueurs mais tu peux comparer plusieurs parties.',
    categories: ['Militaire', 'Pièces', 'Bleu', 'Vert', 'Jaune', 'Guilde', 'Merveille']
  },
  'seven-architects': {
    title: 'Seven Wonders Architects',
    hint: 'Comptage rapide et lisible sur téléphone.',
    categories: ['Merveille', 'Progrès', 'Conflit', 'Chat', 'Décorations', 'Jetons bonus']
  },
  'nidavellir-conspiracy': {
    title: 'Nidavellir Conspiracy',
    hint: 'Tons violets/cuir, focus sur les sets et héros.',
    categories: ['Pièces', 'Nains', 'Héros', 'Sets', 'Conspiracy', 'Bonus fin']
  },
  'petites-bourgades': {
    title: 'Petites Bourgades',
    hint: 'Thème vert/ville avec colonnes pratiques.',
    categories: ['Bâtiments violets', 'Bâtiments verts', 'Monuments', 'Pièces', 'Objectifs', 'Divers']
  }
};

const game = new URLSearchParams(location.search).get('game') || 'seven-classic';
const config = configs[game] || configs['seven-classic'];
const table = document.getElementById('scoreTable');

document.getElementById('gameTitle').textContent = config.title;
document.getElementById('gameHint').textContent = config.hint;

autoBuild(3);

document.getElementById('addPlayer').addEventListener('click', () => {
  autoBuild(table.querySelectorAll('tbody tr').length + 1);
});

function autoBuild(playerCount) {
  const players = Array.from({ length: playerCount }, (_, i) => `Joueur ${i + 1}`);
  const head = `<thead><tr><th>Joueur</th>${config.categories.map(c => `<th>${c}</th>`).join('')}<th>Total</th></tr></thead>`;
  const body = `<tbody>${players.map((name, r) => `<tr>
    <td><input type="text" value="${name}" aria-label="Nom du joueur ${r + 1}"></td>
    ${config.categories.map((_, c) => `<td><input data-r="${r}" data-c="${c}" type="number" value="0"></td>`).join('')}
    <td class="score-pill" data-total="${r}">0</td>
  </tr>`).join('')}</tbody>`;
  table.innerHTML = head + body;
  table.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('input', recalc);
  });
  recalc();
}

function recalc() {
  table.querySelectorAll('tbody tr').forEach((row, r) => {
    const total = [...row.querySelectorAll('input[type="number"]')].reduce((acc, n) => acc + (+n.value || 0), 0);
    table.querySelector(`[data-total="${r}"]`).textContent = total;
  });
}
