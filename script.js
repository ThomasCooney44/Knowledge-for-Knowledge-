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
  $('modal').close();
}

function showInterest() {
  if (INTEREST_FORM_URL) {
    window.open(INTEREST_FORM_URL, '_blank', 'noopener,noreferrer');
    return;
  }
  modal(
    'Register your interest',
    'This demo has no connected research form yet. You can record a practice interest action on this device only.',
    [btn('Register demo interest', () => { state.interest++; save(); close(); notify('Demo interest recorded on this device.'); })]
  );
}

function book(lesson) {
  if (state.booked.includes(lesson.id)) return;
  if (state.tokens < 1) {
    modal(
      'Teach first, then learn',
      'You need one token to reserve this sample lesson. List a skill and simulate completing your first teaching session.',
      [
        btn('Teach a skill', () => { close(); location.hash = 'teach'; }),
        btn('Register interest', showInterest, 'button secondary')
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
    wrapper.append(img);
  } else {
    const fallback = el('div', fallbackArtwork[lesson.category] || '◈', 'lesson-fallback');
    wrapper.append(fallback);
  }
  return wrapper;
}

function render() {
  $('balance').textContent = state.tokens;

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

  $('lessons').replaceChildren(...visible.map(l => {
    const card = el('article', undefined, 'lesson');
    const body = el('div', undefined, 'lesson-body');
    const booked = state.booked.includes(l.id);
    const b = btn(booked ? 'Demo booked' : 'Learn this skill', () => book(l));
    b.disabled = booked;
    body.append(
      el('span', `${l.category} · Sample listing`, 'meta'),
      el('h3', l.title),
      el('p', l.desc),
      el('span', l.format, 'meta'),
      el('span', '◈ 1 token', 'price'),
      b
    );
    card.append(makeArtwork(l), body);
    return card;
  }));

  if (!visible.length) $('lessons').append(el('p', 'No lessons match your search.'));

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
          notify('You earned 1 demo token.');
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
  state.offers.push({ ...data, completed: false });
  e.currentTarget.reset();
  save();
  notify('Your demo teaching offer has been listed locally.');
});

$('search').addEventListener('input', render);
$('close').addEventListener('click', close);
$('interest').addEventListener('click', showInterest);
$('wallet').addEventListener('click', () => modal(
  'Your demo wallet',
  `Available tokens: ${state.tokens}. Completed teaching sessions: ${state.offers.filter(o => o.completed).length}. Demo bookings: ${state.booked.length}. This balance is stored only in this browser.`
));
$('reset').addEventListener('click', () => modal(
  'Reset this demo?',
  'This will clear your locally stored teaching offers, token balance and demo bookings.',
  [
    btn('Reset', () => { state = fresh(); save(); close(); notify('Demo reset.'); }),
    btn('Cancel', close, 'button secondary')
  ]
));

render();
