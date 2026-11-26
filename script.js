'use strict';
// Optional: replace this with your real Google Form URL for research sign-ups.
const INTEREST_FORM_URL = '';

const examples = [
  {
    id: 'spanish',
    title: 'Beginner Spanish Conversation',
    category: 'Languages', level: 'Beginner', duration: 30, mode: 'Online',
    schedule: 'Online conversational class · twice a week',
    availability: ['Tue 7–8 pm', 'Thu 7–8 pm'],
    teacher: { name: 'Sarah', bio: 'Lived in Valencia for two years and loves helping nervous beginners start speaking.' },
    desc: 'Practise everyday Spanish phrases and improve your confidence speaking.',
    image: 'spanish-lessons.png', alt: 'Illustration for learning Spanish'
  },
  {
    id: 'excel',
    title: 'Excel Formulas for Work',
    category: 'Business', level: 'Intermediate', duration: 60, mode: 'Online',
    schedule: 'Online workshop · weekly',
    availability: ['Mon 1–2 pm', 'Wed 1–2 pm'],
    teacher: { name: 'Daniel', bio: 'Uses Excel every day in a finance role and builds simple reporting templates.' },
    desc: 'Master SUMIFS, XLOOKUP and tidy tables so your weekly reports take half the time.',
    image: 'excel-lessons.png', alt: 'Laptop showing Excel on screen'
  },
  {
    id: 'coding',
    title: 'Your First Python Script',
    category: 'Technology', level: 'Beginner', duration: 60, mode: 'Online',
    schedule: 'Online session · weekly',
    availability: ['Sat 10–11 am', 'Sat 11 am–12 pm'],
    teacher: { name: 'Priya', bio: 'Software developer who taught herself Python and remembers what was confusing at the start.' },
    desc: 'Get comfortable with variables, loops and simple programs, and leave with a working script.',
    image: 'coding-lessons.png', alt: 'Computer screen showing code for a beginner coding lesson'
  },
  {
    id: 'guitar',
    title: 'Guitar Chords for Beginners',
    category: 'Music', level: 'Beginner', duration: 30, mode: 'In person',
    schedule: 'In-person lesson · weekly',
    availability: ['Mon 6–7 pm', 'Wed 6–7 pm'],
    teacher: { name: 'Liam', bio: 'Has played in local bands for ten years and keeps lessons relaxed and fun.' },
    desc: 'Learn your first four chords and play a simple song by the end of the session.',
    image: 'guitar-lessons.png', alt: 'Person playing guitar for a guitar lesson'
  },
  {
    id: 'cooking',
    title: 'Budget Meal Prep',
    category: 'Cooking', level: 'Beginner', duration: 30, mode: 'Online',
    schedule: 'Online cook-along · weekly',
    availability: ['Sun 2–3 pm', 'Sun 4–5 pm'],
    teacher: { name: 'Aoife', bio: 'Preps a full week of lunches every Sunday on a tight budget.' },
    desc: 'Plan and prep five healthy lunches for the week without spending much time or money.',
    image: 'meal-prep-lessons.png', alt: 'Prepared meal prep containers for a cooking lesson'
  },
  {
    id: 'photo',
    title: 'Smartphone Photography',
    category: 'Technology', level: 'Intermediate', duration: 30, mode: 'In person',
    schedule: 'In-person photo walk · fortnightly',
    availability: ['Sat 2–3 pm'],
    teacher: { name: 'Jamie', bio: 'Hobby photographer who shoots everything on a phone.' },
    desc: 'Improve composition, lighting and editing so your phone photos look professional.',
    image: 'photography-lessons.png', alt: 'Person holding a camera for photography lesson'
  },
  {
    id: 'running',
    title: 'Couch to 5K Running',
    category: 'Sports', level: 'Beginner', duration: 30, mode: 'In person',
    schedule: 'In-person run · weekly',
    availability: ['Sat 9–9:30 am', 'Sun 9–9:30 am'],
    teacher: { name: 'Conor', bio: 'Club runner who has helped friends complete their first 5K.' },
    desc: 'A friendly, beginner-paced run with tips on pacing, breathing and building a routine.'
  },
  {
    id: 'interview',
    title: 'Interview Practice: Mock Questions',
    category: 'Business', level: 'Intermediate', duration: 15, mode: 'Online',
    schedule: 'Online quick-fire session · on request',
    availability: ['Tue 6–8 pm', 'Thu 6–8 pm'],
    teacher: { name: 'Niamh', bio: 'Recently went through graduate interviews and now helps others prepare.' },
    desc: 'Answer three common interview questions and get quick, honest feedback on each answer.'
  },
  {
    id: 'french',
    title: 'Business French Phrases',
    category: 'Languages', level: 'Advanced', duration: 15, mode: 'Online',
    schedule: 'Online drop-in · twice a week',
    availability: ['Mon 8–9 am', 'Fri 8–9 am'],
    teacher: { name: 'Claire', bio: 'Fluent French speaker who uses it daily with clients.' },
    desc: 'Polish the phrases you need for meetings and emails with French-speaking colleagues.'
  }
];

const fallbackArtwork = {
  'Languages': '💬',
  'Technology': '💻',
  'Business': '📊',
  'Cooking': '🍳',
  'Sports': '🏃',
  'Music': '🎵'
};

const $ = id => document.getElementById(id);
const key = 'kfk-demo-v2';
const pilotKey = 'kfk-pilot-response-v1';
let pilotResponse = null;
try { pilotResponse = JSON.parse(localStorage.getItem(pilotKey)); } catch {}
const fresh = () => ({ tokens: 0, offers: [], booked: [], attended: [], history: [], interest: 0, ratings: {} });
let state = fresh();

try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Number.isInteger(saved.tokens) && Array.isArray(saved.offers) && Array.isArray(saved.booked)) state = saved;
} catch {}
if (!state.ratings || typeof state.ratings !== 'object') state.ratings = {};
if (!Array.isArray(state.attended)) state.attended = [];
if (!Array.isArray(state.history)) state.history = [];

let category = 'All';
let timer;
const categories = ['All', 'Languages', 'Technology', 'Business', 'Cooking', 'Sports', 'Music'];

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

function logActivity(text, kind) {
  state.history.unshift({ text, kind, at: Date.now() });
  state.history = state.history.slice(0, 8);
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

function modal(title, text, actions = [], body = []) {
  $('modalTitle').textContent = title;
  $('modalText').textContent = text;
  $('modalBody').replaceChildren(...body);
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
          logActivity(`Booked "${lesson.title}"`, 'spend');
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

function avatar(name) {
  const a = el('span', name.charAt(0), 'avatar');
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  a.style.background = `hsl(${h} 70% 45%)`;
  a.setAttribute('aria-hidden', 'true');
  return a;
}

function pill(text, cls = 'pill') {
  return el('span', text, cls);
}

function lessonCard(l) {
  const card = el('article', undefined, 'lesson');
  const art = makeArtwork(l);
  art.append(pill(l.level, 'level-badge level-' + l.level.toLowerCase()));
  if (state.booked.includes(l.id)) art.append(pill('✓ Booked', 'booked-badge'));
  const body = el('div', undefined, 'lesson-body');
  const teacher = el('div', undefined, 'teacher-row');
  teacher.append(avatar(l.teacher.name), el('span', `Taught by ${l.teacher.name} · ${l.level}`));
  const facts = el('div', undefined, 'lesson-facts');
  facts.append(pill(`⏱ ${l.duration}-minute session`), pill('📅 ' + l.availability[0] + (l.availability.length > 1 ? ' +' + (l.availability.length - 1) : '')));
  const foot = el('div', undefined, 'lesson-foot');
  const view = btn('View lesson', () => viewLesson(l));
  view.setAttribute('aria-label', 'View lesson: ' + l.title);
  foot.append(tokenPrice(), view);
  const rating = state.ratings[l.id];
  body.append(
    el('span', l.schedule, 'meta schedule'),
    el('h3', l.title),
    teacher,
    facts,
    el('p', l.desc)
  );
  if (rating) body.append(el('span', `★ Your demo rating: ${rating}/5`, 'meta my-rating'));
  body.append(foot);
  card.append(art, body);
  return card;
}

function ratingBlock(l) {
  const wrap = el('div', undefined, 'rating-block');
  wrap.append(el('strong', 'Lesson ratings'));
  const booked = state.attended.includes(l.id);
  const current = state.ratings[l.id] || 0;
  const stars = el('div', undefined, 'stars');
  stars.setAttribute('role', 'group');
  stars.setAttribute('aria-label', 'Rate this demo lesson');
  for (let i = 1; i <= 5; i++) {
    const s = btn(i <= current ? '★' : '☆', () => {
      state.ratings[l.id] = i; save(); viewLesson(l); notify(`Thanks! Demo rating saved: ${i}/5.`);
    }, 'star');
    s.setAttribute('aria-label', `${i} star${i > 1 ? 's' : ''}`);
    s.disabled = !booked;
    stars.append(s);
  }
  wrap.append(stars, el('p', booked
    ? (current ? `Your demo rating: ${current}/5. Stored on this device only.` : 'How was it? Tap a star to rate your demo lesson.')
    : 'No ratings yet. In the pilot, learners will rate each lesson after it finishes. Book and complete this demo lesson to try it.', 'small'));
  return wrap;
}

function viewLesson(l) {
  const booked = state.booked.includes(l.id);
  const body = [];
  body.push(makeArtwork(l));
  const profile = el('div', undefined, 'teacher-profile');
  const who = el('div');
  who.append(el('strong', l.teacher.name), el('span', `Sample teacher · ${l.category}`, 'meta'));
  const head = el('div', undefined, 'teacher-head');
  head.append(avatar(l.teacher.name), who);
  profile.append(head, el('p', l.teacher.bio));
  body.push(el('p', l.desc, 'detail-desc'));
  const facts = el('div', undefined, 'lesson-facts');
  facts.append(pill(l.level), pill(`⏱ ${l.duration} minutes`), pill(l.mode), tokenPrice());
  body.push(facts, profile);
  const avail = el('div', undefined, 'availability');
  avail.append(el('strong', 'Availability'), el('span', l.schedule, 'meta'));
  const slots = el('div', undefined, 'slots');
  for (const t of l.availability) slots.append(pill(t, 'slot'));
  avail.append(slots);
  body.push(avail, ratingBlock(l));
  const attended = state.attended.includes(l.id);
  const actions = [];
  if (booked && !attended) actions.push(btn('Mark lesson as completed', () => { markAttended(l); viewLesson(l); }));
  else {
    const book1 = btn(attended ? 'Lesson completed ✓' : 'Book with 1 token', () => book(l));
    book1.disabled = booked;
    actions.push(book1);
  }
  actions.push(btn('I want to learn this', () => showInterest(l), 'button secondary'));
  modal(l.title, '', actions, body);
}

function markAttended(l) {
  if (!state.booked.includes(l.id) || state.attended.includes(l.id)) return;
  state.attended.push(l.id);
  logActivity(`Completed "${l.title}"`, 'done');
  save();
  notify('Lesson marked as completed. Rate it from "View lesson".');
}

function cancelBooking(l) {
  if (!state.booked.includes(l.id) || state.attended.includes(l.id)) return;
  state.booked = state.booked.filter(id => id !== l.id);
  state.tokens++;
  logActivity(`Cancelled "${l.title}" · token returned`, 'gain');
  save();
  notify('Booking cancelled. Your token has been returned.');
}

const sampleMembers = [
  { name: 'Sarah', taught: 14 }, { name: 'Daniel', taught: 11 }, { name: 'Priya', taught: 9 },
  { name: 'Liam', taught: 6 }, { name: 'Aoife', taught: 4 }, { name: 'Conor', taught: 2 }
];

function timeAgo(t) {
  const m = Math.round((Date.now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + ' min ago';
  const h = Math.round(m / 60);
  if (h < 24) return h + ' h ago';
  return Math.round(h / 24) + ' d ago';
}

function renderDashboard() {
  const taught = state.offers.filter(o => o.completed).length;
  const completed = state.attended.length;
  const spent = state.booked.length;
  const pendingOffer = state.offers.find(o => !o.completed);
  $('dashBalance').textContent = state.tokens;
  $('dashBalanceLabel').textContent = state.tokens === 1 ? 'token' : 'tokens';
  $('statTaught').textContent = taught;
  $('statCompleted').textContent = completed;
  $('statEarned').textContent = taught;
  $('statSpent').textContent = spent;

  let pct, text, cta, href;
  if (state.tokens > 0) {
    pct = 100; text = `You have ${state.tokens} ${state.tokens === 1 ? 'token' : 'tokens'}: enough for ${state.tokens === 1 ? 'your next lesson' : state.tokens + ' lessons'}.`; cta = 'Choose a lesson'; href = '#market';
  } else if (pendingOffer) {
    pct = 50; text = `Your lesson "${pendingOffer.skill}" is listed. Complete it to earn your next token.`; cta = 'Go to my teaching offer'; href = '#teach';
  } else {
    pct = 0; text = 'Teach one lesson to earn the token for your next lesson.'; cta = 'Become a teacher'; href = '#teach';
  }
  $('dashNextBar').style.width = pct + '%';
  $('dashNextBarWrap').setAttribute('aria-valuenow', String(pct));
  $('dashNextPct').textContent = pct + '%';
  $('dashNext').textContent = text;
  $('dashCta').textContent = cta;
  $('dashCta').href = href;

  const milestones = [
    { name: 'First token', desc: 'Teach your first lesson', value: taught, goal: 1 },
    { name: 'Community teacher', desc: 'Teach 3 lessons', value: taught, goal: 3 },
    { name: 'Knowledge swapper', desc: 'Teach or complete 5 lessons', value: taught + completed, goal: 5 }
  ];
  $('milestones').replaceChildren(...milestones.map(m => {
    const done = m.value >= m.goal;
    const row = el('div', undefined, 'milestone' + (done ? ' done' : ''));
    const top = el('div', undefined, 'milestone-top');
    const label = el('div');
    label.append(el('strong', (done ? '🏅 ' : '') + m.name), el('span', m.desc, 'meta'));
    top.append(label, el('span', `${Math.min(m.value, m.goal)}/${m.goal}`, 'milestone-count'));
    const bar = el('div', undefined, 'bar small-bar');
    const fill = el('span');
    fill.style.width = Math.min(100, m.value / m.goal * 100) + '%';
    bar.append(fill);
    row.append(top, bar);
    return row;
  }));

  const board = [...sampleMembers, { name: 'You', taught, you: true }]
    .sort((a, b) => b.taught - a.taught || (a.you ? -1 : b.you ? 1 : 0));
  $('leaderboard').replaceChildren(...board.map((m, i) => {
    const li = el('li', undefined, m.you ? 'me' : '');
    li.append(el('span', String(i + 1), 'rank'), avatar(m.name), el('span', m.you ? 'You' : m.name, 'lb-name'), el('span', `${m.taught} taught`, 'lb-score'));
    return li;
  }));

  const mine = examples.filter(l => state.booked.includes(l.id));
  $('myBookings').replaceChildren(...(mine.length ? mine.map(l => {
    const row = el('div', undefined, 'booking-row');
    const done = state.attended.includes(l.id);
    const info = el('div');
    info.append(el('strong', l.title), el('span', `${l.teacher.name} · ${l.duration} min · ${done ? 'Completed' : 'Booked'}`, 'meta'));
    const acts = el('div', undefined, 'booking-actions');
    if (done) {
      acts.append(btn(state.ratings[l.id] ? `★ ${state.ratings[l.id]}/5` : 'Rate lesson', () => viewLesson(l), 'textbutton'));
    } else {
      acts.append(btn('Mark completed', () => markAttended(l), 'textbutton'), btn('Cancel (+1 token)', () => cancelBooking(l), 'textbutton'));
    }
    row.append(info, acts);
    return row;
  }) : [el('p', 'No lessons booked yet. Earn a token, then pick a lesson from the marketplace.', 'empty-note')]));

  $('activity').replaceChildren(...state.history.map(h => {
    const li = el('li', undefined, 'act-' + (h.kind || 'info'));
    const sign = h.kind === 'gain' ? '+1' : h.kind === 'spend' ? '−1' : '✓';
    li.append(el('span', sign, 'act-sign'), el('span', h.text), el('span', timeAgo(h.at), 'meta'));
    return li;
  }));
}

function render() {
  $('balance').textContent = state.tokens;
  $('tokenLabel').textContent = state.tokens === 1 ? 'token' : 'tokens';
  renderDashboard();

  $('filters').replaceChildren(...categories.map(c => {
    const b = btn(c, () => { category = c; render(); }, 'filter');
    b.setAttribute('aria-pressed', String(c === category));
    return b;
  }));

  const query = $('search').value.trim().toLowerCase();
  const level = $('levelFilter').value;
  const duration = $('durationFilter').value;
  const visible = examples.filter(l =>
    (category === 'All' || l.category === category) &&
    (!level || l.level === level) &&
    (!duration || String(l.duration) === duration) &&
    `${l.title} ${l.desc} ${l.category} ${l.teacher.name} ${l.level}`.toLowerCase().includes(query)
  );

  $('resultCount').textContent = visible.length + (visible.length === 1 ? ' lesson' : ' lessons') + ' found';
  $('clearFilters').hidden = category === 'All' && !query && !level && !duration;
  $('lessons').replaceChildren(...visible.map(lessonCard));
  if (!visible.length) $('lessons').append(el('p', 'No lessons match. Try another search or clear your filters.', 'empty-state'));

  $('myLessons').replaceChildren(...state.offers.map(o => {
    const a = el('div', undefined, 'own');
    a.append(el('strong', o.skill), el('span', o.format ? `${o.category} · ${o.format}` : `${o.category} · ${o.level} · ${o.mode} · ${o.duration} min`, 'meta'), el('p', o.description));
    if (o.completed) {
      a.append(el('span', 'Completed · +1 demo token', 'price'));
    } else {
      a.append(btn('Simulate completed teaching', () => {
        if (!o.completed) {
          o.completed = true;
          state.tokens++;
          logActivity(`Taught "${o.skill}"`, 'gain');
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
$('levelFilter').addEventListener('change', render);
$('durationFilter').addEventListener('change', render);
$('close').addEventListener('click', close);
$('clearFilters').addEventListener('click', () => { category = 'All'; $('search').value = ''; $('levelFilter').value = ''; $('durationFilter').value = ''; render(); $('search').focus(); });
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
  location.hash = 'tokens';
  $('tokens').focus({ preventScroll: true });
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
