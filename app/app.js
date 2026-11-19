// VICE TRACKER — GTA VI trophy guide & checklist.
// Loads the local trophy data, renders the checklist, and keeps earned ticks in localStorage.
// Everything runs offline: the only fetch is the relative data/trophies.json file.
const STORAGE_KEY = 'gta6-trophy-guide-v1';
const SPOILER_KEY = 'gta6-trophy-guide-spoilers-v1';

const grid = document.getElementById('trophyGrid');
const searchInput = document.getElementById('search');
const gradeFilter = document.getElementById('gradeFilter');
const kindFilter = document.getElementById('kindFilter');
const spoilerToggle = document.getElementById('spoilerToggle');
const hideEarnedBox = document.getElementById('hideEarned');
const resultCount = document.getElementById('resultCount');
const emptyState = document.getElementById('emptyState');

let trophies = [];
let earned = loadEarned();
let spoilerOn = localStorage.getItem(SPOILER_KEY) === '1';
spoilerToggle.checked = spoilerOn;

function loadEarned() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(saved) ? saved.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

function saveEarned() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

function isStorySpoiler(trophy) {
  return spoilerOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

function visibleTrophies() {
  const query = searchInput.value.trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (gradeFilter.value !== 'all' && trophy.grade !== gradeFilter.value) return false;
    if (kindFilter.value === 'online') return false; // No online trophies exist in this set.
    if (kindFilter.value === 'missable' && !trophy.missable) return false;
    if (kindFilter.value !== 'all' && kindFilter.value !== 'missable' && trophy.kind !== kindFilter.value) return false;
    if (hideEarnedBox.checked && earned.has(trophy.name)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function gradeLabel(trophy) {
  return trophy.grade === 'platinum' ? 'Platinum' : trophy.grade[0].toUpperCase() + trophy.grade.slice(1);
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  const percent = total ? Math.round((done / total) * 100) : 0;
  document.getElementById('earnedCount').textContent = String(done);
  document.getElementById('progressText').textContent =
    `${done} of ${total} earned — ${percent}% to the platinum`;
  const fill = document.getElementById('progressFill');
  fill.style.width = `${percent}%`;
  const wrap = document.getElementById('progressBarWrap');
  wrap.setAttribute('aria-valuenow', String(done));
  const grades = ['platinum', 'gold', 'silver', 'bronze'];
  document.getElementById('gradeCounts').innerHTML = grades
    .map((grade) => {
      const inGrade = trophies.filter((t) => t.grade === grade);
      const got = inGrade.filter((t) => earned.has(t.name)).length;
      return `<li class="grade-${grade}"><b>${got}/${inGrade.length}</b> ${gradeLabel({ grade })}</li>`;
    })
    .join('');
}

function renderList() {
  const shown = visibleTrophies();
  grid.replaceChildren();
  for (const trophy of shown) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'trophy-card' + (earned.has(trophy.name) ? ' earned' : '');
    card.dataset.name = trophy.name;

    const top = document.createElement('div');
    top.className = 'trophy-top';
    const pill = document.createElement('span');
    pill.className = `grade-pill grade-${trophy.grade}`;
    pill.textContent = gradeLabel(trophy);
    top.append(pill);
    if (earned.has(trophy.name)) {
      const mark = document.createElement('span');
      mark.className = 'earned-mark';
      mark.textContent = '✓ Earned';
      top.append(mark);
    }
    card.append(top);

    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = isStorySpoiler(trophy) ? 'Hidden story trophy' : trophy.name;
    card.append(name);

    const desc = document.createElement('p');
    desc.className = 'trophy-desc' + (isStorySpoiler(trophy) ? ' hidden-spoiler' : '');
    desc.textContent = isStorySpoiler(trophy)
      ? 'Hidden story trophy — earn it to reveal.'
      : trophy.description;
    card.append(desc);

    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    const kind = document.createElement('span');
    kind.className = 'kind-tag';
    kind.textContent = trophy.kind;
    meta.append(kind);
    if (trophy.count) {
      const count = document.createElement('span');
      count.className = 'count-tag';
      count.textContent = `× ${Number(trophy.count).toLocaleString('en-US')}`;
      meta.append(count);
    }
    if (trophy.missable) {
      const badge = document.createElement('span');
      badge.className = 'missable-badge';
      badge.textContent = '⚑ MISSABLE';
      meta.append(badge);
    }
    card.append(meta);

    card.addEventListener('click', () => openDetail(trophy));
    grid.append(card);
  }
  emptyState.hidden = shown.length !== 0;
  resultCount.textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
    (kindFilter.value === 'online' ? ' — there are no online trophies in GTA VI.' : '');
}

function render() {
  renderProgress();
  renderList();
}

function openDetail(trophy) {
  const backdrop = document.getElementById('detailBackdrop');
  document.getElementById('detailGrade').textContent = gradeLabel(trophy);
  document.getElementById('detailGrade').className = `detail-grade grade-${trophy.grade}`;
  document.getElementById('detailName').textContent = isStorySpoiler(trophy) ? 'Hidden story trophy' : trophy.name;
  document.getElementById('detailDesc').textContent = isStorySpoiler(trophy)
    ? 'Hidden story trophy — earn it to reveal.'
    : trophy.description;
  const flags = document.getElementById('detailFlags');
  flags.replaceChildren();
  if (trophy.missable) {
    const badge = document.createElement('span');
    badge.className = 'missable-badge';
    badge.textContent = '⚑ MISSABLE — do it when the game offers it';
    flags.append(badge);
  }
  if (trophy.count) {
    const count = document.createElement('span');
    count.className = 'count-tag';
    count.textContent = ` Target: ${Number(trophy.count).toLocaleString('en-US')}`;
    flags.append(count);
  }
  document.getElementById('detailGuide').textContent = trophy.guide;
  const sources = document.getElementById('detailSources');
  sources.replaceChildren();
  for (const source of trophy.sources ?? []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.name;
    item.append(link);
    sources.append(item);
  }
  const earnedBox = document.getElementById('detailEarned');
  earnedBox.checked = earned.has(trophy.name);
  earnedBox.onchange = () => {
    if (earnedBox.checked) earned.add(trophy.name);
    else earned.delete(trophy.name);
    saveEarned();
    render();
  };
  backdrop.hidden = false;
}

function closeDetail() {
  document.getElementById('detailBackdrop').hidden = true;
}

document.getElementById('detailClose').addEventListener('click', closeDetail);
document.getElementById('detailBackdrop').addEventListener('click', (event) => {
  if (event.target.id === 'detailBackdrop') closeDetail();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeDetail();
});

searchInput.addEventListener('input', renderList);
gradeFilter.addEventListener('change', renderList);
kindFilter.addEventListener('change', renderList);
hideEarnedBox.addEventListener('change', renderList);
spoilerToggle.addEventListener('change', () => {
  spoilerOn = spoilerToggle.checked;
  localStorage.setItem(SPOILER_KEY, spoilerOn ? '1' : '0');
  renderList();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set((Array.isArray(names) ? names : []).filter((n) => known.has(n)));
    saveEarned();
    render();
  } catch {
    resultCount.textContent = 'That file could not be imported — it is not a progress file from this guide.';
  }
  event.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (window.confirm('Clear all earned ticks?')) {
    earned = new Set();
    saveEarned();
    render();
  }
});

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies ?? doc;
render();
