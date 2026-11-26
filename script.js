'use strict';
// Optional: replace this with your real Google Form URL for research sign-ups.
const INTEREST_FORM_URL = '';

const examples = [
  {
    id: 'excel',
    title: 'Excel for everyday work',
    category: 'Career & tech',
    format: 'Online · 45 min',
    desc: 'Learn formulas, shortcuts and how to organise your data with confidence.',
    image: 'excel-lessons.png',
    alt: 'Laptop showing Excel on screen'
  },
  {
    id: 'spanish',
    title: 'Conversational Spanish',
    category: 'Languages',
    format: 'In person · 30 min',
    desc: 'Practise useful everyday phrases in a relaxed beginner-friendly Spanish session.',
    image: 'spanish-lessons.png',
    alt: 'Illustration for learning Spanish'
  },
  {
    id: 'photo',
    title: 'Better photography basics',
    category: 'Creative',
    format: 'In person · 45 min',
    desc: 'Improve composition, framing and storytelling while learning the foundations of photography.',
    image: 'photography-lessons.png',
    alt: 'Person holding a camera for photography lesson'
  },
  {
    id: 'coding',
    title: 'Your first Python script',
    category: 'Career & tech',
    format: 'Online · 60 min',
    desc: 'Get comfortable with variables, loops and simple programs in a beginner session.',
    image: 'coding-lessons.png',
    alt: 'Computer screen showing code for a beginner coding lesson'
  },
  {
    id: 'guitar',
    title: 'Guitar for complete beginners',
    category: 'Creative',
    format: 'In person · 30 min',
    desc: 'Learn your first chords and practise a simple progression with a friendly teacher.',
    image: 'guitar-lessons.png',
    alt: 'Person playing guitar for a guitar lesson'
  },
  {
    id: 'cooking',
    title: 'Student-friendly meal prep',
    category: 'Lifestyle',
    format: 'Online · 30 min',
    desc: 'Learn how to plan affordable meals for the week without spending too much time.',
    image: 'meal-prep-lessons.png',
    alt: 'Prepared meal prep containers for a cooking lesson'
  }
];

const fallbackArtwork = {
  'Career & tech': '⌘',
  'Languages': 'Aa',
  'Creative': '◌',
  'Lifestyle': '✦'
};

const $ = id => document.getElementById(id);
const key = 'kfk-demo-v2';
const pilotKey = 'kfk-pilot-response-v1';
let pilotResponse = null;
try { pilotResponse = JSON.parse(localStorage.getItem(pilotKey)); } catch {}
const fresh = () => ({ tokens: 0, offers: [], booked: [], interest: 0 });
let state = fresh();

try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Number.isInteger(saved.tokens) && Array.isArray(saved.offers) && Array.isArray(saved.booked)) state = saved;
} catch {}

let category = 'All';
let timer;
const categories = ['All', 'Career & tech', 'Languages', 'Creative', 'Lifestyle'];

function save() {
  try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  render();
}

function el(tag, text, cls) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (cls) node.className = cls;
  return node;
}

function tokenPrice() {
  const price = el('span', undefined, 'price');
  const icon = el('img', undefined, 'token-icon');
  icon.src = 'token.png';
  icon.alt = '';
  price.append(icon, ' 1 token');
  return price;
}

function btn(text, fn, cls = 'button') {
  const b = el('button', text, cls);
  b.type = 'button';
  b.addEventListener('click', fn);
  return b;
}

function notify(text) {
  $('toast').textContent = text;
  $('toast').style.display = 'block';
  clearTimeout(timer);
  timer = setTimeout(() => $('toast').style.display = 'none', 3800);
}

function modal(title, text, actions = []) {
  $('modalTitle').textContent = title;
  $('modalText').textContent = text;
  $('modalActions').replaceChildren(...actions);
  if (!$('modal').open) $('modal').showModal();
}

function close() {
  if ($('modal').open) $('modal').close();
}

function showInterest(lesson) {
  close();
  if (lesson && lesson.title) $('pilotLearn').value = lesson.title;
  location.hash = 'pilot';
  $('pilotLearn').focus({preventScroll:true});
}

function updatePilot() {
  const status = $('pilotStatus');
  $('exportPilot').hidden = !pilotResponse;
  status.textContent = pilotResponse ? 'Response saved on this device. Download and share it with the project team if you choose.' : '';
}

function csvField(value) {
  let s = String(value ?? '');
  if (/^[=+\-@\t\r\n]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function exportPilot() {
  if (!pilotResponse) return;
  const fields = ['submitted_at','learn','willingness','teach','time','format'];
  const csv = fields.map(csvField).join(',') + '\r\n' + fields.map(k => csvField(pilotResponse[k])).join(',') + '\r\n';
  const url = URL.createObjectURL(new Blob([csv], {type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a');
  a.href = url; a.download = 'knowledge-for-knowledge-pilot.csv';
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function book(lesson) {
  if (state.booked.includes(lesson.id)) return;
  if (state.tokens < 1) {
    modal(
      'Teach first, then learn',
      'You need one token to reserve this sample lesson. List a skill and simulate completing your first teaching session.',
      [
        btn('Teach a skill', () => { close(); location.hash = 'teach'; }),
        btn('Express pilot interest', () => showInterest(lesson), 'button secondary')
      ]
    );
    return;
  }
  modal(
    'Reserve a demo lesson?',
    `Use 1 demo token for ${lesson.title}. No real lesson will be booked.`,
    [
      btn('Confirm demo booking', () => {
        if (state.tokens > 0 && !state.booked.includes(lesson.id)) {
          state.tokens--;
          state.booked.push(lesson.id);
          save();
        }
        close();
        notify('Demo booking confirmed.');
      }),
      btn('Cancel', close, 'button secondary')
    ]
  );
}

function makeArtwork(lesson) {
  const wrapper = el('div', undefined, 'lesson-image');
  if (lesson.image) {
    const img = document.createElement('img');
    img.src = lesson.image;
    img.alt = lesson.alt || lesson.title;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => wrapper.replaceChildren(el('div', fallbackArtwork[lesson.category] || '◈', 'lesson-fallback')), {once:true});
    wrapper.append(img);
  } else {
    const fallback = el('div', fallbackArtwork[lesson.category] || '◈', 'lesson-fallback');
    wrapper.append(fallback);
  }
  return wrapper;
}

function render() {
  $('balance').textContent = state.tokens;
  $('tokenLabel').textContent = state.tokens === 1 ? 'token' : 'tokens';

  $('filters').replaceChildren(...categories.map(c => {
    const b = btn(c, () => { category = c; render(); }, 'filter');
    b.setAttribute('aria-pressed', String(c === category));
    return b;
  }));

  const query = $('search').value.trim().toLowerCase();
  const visible = examples.filter(l =>
    (category === 'All' || l.category === category) &&
    `${l.title} ${l.desc} ${l.category}`.toLowerCase().includes(query)
  );

  $('resultCount').textContent = visible.length + (visible.length === 1 ? ' lesson' : ' lessons') + ' found';
  $('clearFilters').hidden = category === 'All' && !query;
  $('lessons').replaceChildren(...visible.map(l => {
    const card = el('article', undefined, 'lesson');
    const body = el('div', undefined, 'lesson-body');
    const booked = state.booked.includes(l.id);
    const b = btn(booked ? 'Demo booked' : 'Try demo booking', () => book(l));
    b.disabled = booked;
    const interest = btn('I want to learn this', () => showInterest(l), 'lesson-interest');
    interest.setAttribute('aria-label', 'Express pilot interest in ' + l.title);
    body.append(
      el('span', `${l.category} · Sample listing`, 'meta'),
      el('h3', l.title),
      el('p', l.desc),
      el('span', l.format, 'meta'),
      tokenPrice(),
      b, interest
    );
    card.append(makeArtwork(l), body);
    return card;
  }));

  if (!visible.length) $('lessons').append(el('p', 'No lessons match. Try another search or clear your filters.', 'empty-state'));

  $('myLessons').replaceChildren(...state.offers.map(o => {
    const a = el('div', undefined, 'own');
    a.append(el('strong', o.skill), el('span', `${o.category} · ${o.format}`, 'meta'), el('p', o.description));
    if (o.completed) {
      a.append(el('span', 'Completed · +1 demo token', 'price'));
    } else {
      a.append(btn('Simulate completed teaching', () => {
        if (!o.completed) {
          o.completed = true;
          state.tokens++;
          save();
          notify('You earned 1 demo token. Explore lessons to spend it.');
        }
      }, 'button secondary'));
    }
    return a;
  }));
}

$('teachForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget));
  if (!data.skill.trim() || !data.description.trim()) return;
  state.offers.push({ ...data, skill:data.skill.trim(), description:data.description.trim(), completed: false });
  e.currentTarget.reset();
  save();
  notify('Your demo teaching offer has been listed locally.');
});

$('search').addEventListener('input', render);
$('close').addEventListener('click', close);
$('clearFilters').addEventListener('click', () => { category = 'All'; $('search').value = ''; render(); $('search').focus(); });
$('pilotForm').addEventListener('submit', e => {
  e.preventDefault();
  const answer = Object.fromEntries(new FormData(e.currentTarget));
  pilotResponse = {...answer, teach:answer.teach.trim(), submitted_at:new Date().toISOString()};
  let saved = true;
  try {localStorage.setItem(pilotKey, JSON.stringify(pilotResponse));} catch {saved = false;}
  updatePilot();
  if (!saved) $('pilotStatus').textContent = 'Response held temporarily. Download it before leaving this page.';
  notify(saved ? 'Anonymous response saved locally — not sent.' : 'Response ready to download.');
});
$('exportPilot').addEventListener('click', exportPilot);
if (INTEREST_FORM_URL) {
  $('externalSurvey').href = INTEREST_FORM_URL;
  $('externalSurvey').hidden = false;
}
if (pilotResponse) {
  for (const name of ['learn','willingness','teach','time','format']) {
    const field = $('pilotForm').elements.namedItem(name);
    if (field && typeof pilotResponse[name] === 'string') field.value = pilotResponse[name];
  }
}
updatePilot();
$('wallet').addEventListener('click', () => {
  const booked = examples.filter(l => state.booked.includes(l.id));
  const actions = [];
  for (const lesson of booked) actions.push(btn('Cancel ' + lesson.title + ' (+1 token)', () => {
    if (state.booked.includes(lesson.id)) {
      state.booked = state.booked.filter(id => id !== lesson.id);
      state.tokens++; save(); close(); notify('Demo booking cancelled. Token returned.');
    }
  }, 'button secondary'));
  actions.push(btn('Explore lessons', () => { close(); location.hash = 'market'; }));
  modal('Your demo wallet', 'Available tokens: ' + state.tokens + '. Completed teaching sessions: ' + state.offers.filter(o => o.completed).length + '. Demo bookings: ' + booked.length + '. ' + (booked.length ? 'Your bookings: ' + booked.map(l => l.title).join('; ') + '. ' : '') + 'Stored on this browser only.', actions);
});
$('reset').addEventListener('click', () => modal(
  'Reset this demo?',
  'This will clear your locally stored teaching offers, token balance, demo bookings and anonymous pilot response.',
  [
    btn('Reset', () => { state = fresh(); pilotResponse = null; try {localStorage.removeItem(pilotKey);} catch {} $('pilotForm').reset(); updatePilot(); save(); close(); notify('Demo reset.'); }),
    btn('Cancel', close, 'button secondary')
  ]
));

render();
