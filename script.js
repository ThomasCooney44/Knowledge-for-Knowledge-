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
const fresh = () => ({ tokens: 0, offers: [], booked: [], attended: [], history: [], interest: 0, ratings: {}, reviews: {}, reports: [], refunded: [], verified: false });
let state = fresh();

try {
  const saved = JSON.parse(localStorage.getItem(key));
  if (saved && Number.isInteger(saved.tokens) && Array.isArray(saved.offers) && Array.isArray(saved.booked)) state = saved;
} catch {}
if (!state.ratings || typeof state.ratings !== 'object') state.ratings = {};
if (!Array.isArray(state.attended)) state.attended = [];
if (!Array.isArray(state.history)) state.history = [];
if (!state.reviews || typeof state.reviews !== 'object') state.reviews = {};
if (!Array.isArray(state.reports)) state.reports = [];
if (!Array.isArray(state.refunded)) state.refunded = [];
state.verified = state.verified === true;

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

function offerTitle(o) {
  return (o.title && o.title.trim()) || o.skill;
}

function offerToLesson(o, i) {
  let duration = Number(o.duration);
  if (!duration && o.format) duration = Number((o.format.match(/(\d+) min/) || [])[1]) || 30;
  const mode = o.mode || (o.format && o.format.startsWith('In person') ? 'In person' : 'Online');
  return {
    id: 'own-' + i, own: true, offer: o,
    title: offerTitle(o), category: o.category || 'Languages', level: o.level || 'Beginner',
    duration: duration || 30, mode,
    schedule: `${mode} lesson · your listing`,
    availability: [o.availability && o.availability.trim() ? o.availability.trim() : 'Flexible times'],
    teacher: { name: 'You', bio: '' },
    desc: o.description
  };
}

function lessonCard(l, preview = false) {
  const card = el('article', undefined, 'lesson');
  const art = makeArtwork(l);
  art.append(pill(l.level, 'level-badge level-' + l.level.toLowerCase()));
  if (l.own) art.append(pill(preview ? 'Preview' : 'Your listing', 'booked-badge own-badge'));
  else if (state.booked.includes(l.id)) art.append(pill('✓ Booked', 'booked-badge'));
  const body = el('div', undefined, 'lesson-body');
  const teacher = el('div', undefined, 'teacher-row');
  teacher.append(avatar(l.teacher.name), el('span', `Taught by ${l.teacher.name} · ${l.level}`));
  const facts = el('div', undefined, 'lesson-facts');
  facts.append(pill(`⏱ ${l.duration}-minute session`), pill('📅 ' + l.availability[0] + (l.availability.length > 1 ? ' +' + (l.availability.length - 1) : '')));
  const foot = el('div', undefined, 'lesson-foot');
  if (l.own) {
    const manage = btn(preview ? 'View lesson' : (l.offer.completed ? 'Taught ✓' : 'Manage'), () => { location.hash = 'teach'; }, 'button secondary');
    manage.disabled = preview || l.offer.completed;
    foot.append(tokenPrice(), manage);
  } else {
    const view = btn('View lesson', () => viewLesson(l));
    view.setAttribute('aria-label', 'View lesson: ' + l.title);
    foot.append(tokenPrice(), view);
  }
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
  wrap.append(stars);
  if (booked && current) {
    const saved = state.reviews[l.id];
    if (saved) {
      const q = el('blockquote', saved, 'my-review');
      wrap.append(el('span', 'Your review (demo, stored on this device):', 'meta'), q,
        btn('Edit review', () => { delete state.reviews[l.id]; save(); viewLesson(l); }, 'textbutton'));
    } else {
      const box = el('label', 'Add a short written review (optional)');
      const ta = el('textarea');
      ta.maxLength = 200; ta.rows = 3;
      ta.placeholder = 'What did you learn? Did the lesson match its description?';
      box.append(ta);
      wrap.append(box, btn('Save review', () => {
        const t = ta.value.trim();
        if (t.length < 5) { notify('Write a few words first.'); return; }
        state.reviews[l.id] = t; logActivity(`Reviewed "${l.title}"`, 'info'); save(); viewLesson(l); notify('Thanks! Your review has been saved.');
      }, 'button secondary'));
    }
  }
  wrap.append(el('p', booked
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
  const nameRow = el('div', undefined, 'name-row');
  nameRow.append(el('strong', l.teacher.name), el('span', '✓ Verified email', 'verify-pill verified'));
  who.append(nameRow, el('span', `Sample teacher · ${l.category}`, 'meta'));
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
  const rep = btn('⚑ Report a problem with this lesson', () => openReport(l), 'textbutton report-link');
  body.push(avail, ratingBlock(l), rep);
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
  if (!state.booked.includes(l.id) || state.attended.includes(l.id) || state.refunded.includes(l.id)) return;
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
  const spent = state.booked.filter(id => !state.refunded.includes(id)).length;
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
    pct = 50; text = `Your lesson "${offerTitle(pendingOffer)}" is published. Complete it to earn your next token.`; cta = 'Go to my teaching offer'; href = '#teach';
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
    const refunded = state.refunded.includes(l.id);
    const info = el('div');
    info.append(el('strong', l.title), el('span', `${l.teacher.name} · ${l.duration} min · ${refunded ? 'Reported · token returned' : done ? 'Completed' : 'Booked'}`, 'meta'));
    const acts = el('div', undefined, 'booking-actions');
    if (refunded) {
      acts.append(btn('View lesson', () => viewLesson(l), 'textbutton'));
    } else if (done) {
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

const reportReasons = [
  ['mismatch', "The lesson didn't match its description"],
  ['behaviour', 'Inappropriate or disrespectful behaviour'],
  ['safety', 'I felt unsafe'],
  ['noshow', "The teacher didn't show up"],
  ['other', 'Something else']
];

function openReport(l) {
  const form = el('form', undefined, 'report-form');
  const fs = el('fieldset');
  fs.append(el('legend', 'What happened?'));
  const reasons = l ? reportReasons : reportReasons.filter(r => r[0] !== 'mismatch' && r[0] !== 'noshow');
  reasons.forEach(([v, text], i) => {
    const lab = el('label', undefined, 'radio');
    const r = el('input'); r.type = 'radio'; r.name = 'reason'; r.value = v; if (i === 0) r.required = true;
    lab.append(r, el('span', text));
    fs.append(lab);
  });
  const det = el('label', 'Tell us more (optional)');
  const ta = el('textarea'); ta.maxLength = 300; ta.rows = 3; ta.name = 'details';
  ta.placeholder = 'Describe what happened. Please do not include names, phone numbers or email addresses.';
  det.append(ta);
  form.append(fs, det);
  const note = el('p', l && state.booked.includes(l.id) && !state.refunded.includes(l.id)
    ? "Token-back promise: if you report that this lesson didn't match its description, your token is returned."
    : 'In the pilot, the project team reviews every report and can suspend members who break the community guidelines.', 'small');
  form.append(note);
  const submit = btn('Submit report', () => {
    const chosen = form.querySelector('input[name=reason]:checked');
    if (!chosen) { notify('Choose what happened first.'); return; }
    submitReport(l, chosen.value, ta.value.trim());
  });
  modal(l ? 'Report a problem: ' + l.title : 'Report a concern', '', [submit, btn('Cancel', close, 'button secondary')], [form]);
}

function submitReport(l, reason, details) {
  state.reports.push({ lesson: l ? l.id : null, reason, details, at: Date.now() });
  let refunded = false;
  if (l && reason === 'mismatch' && state.booked.includes(l.id) && !state.refunded.includes(l.id)) {
    state.refunded.push(l.id);
    state.tokens++;
    refunded = true;
    logActivity(`Token returned: "${l.title}" didn't match its description`, 'gain');
  } else {
    logActivity('Report submitted' + (l ? ` about "${l.title}"` : ''), 'info');
  }
  save();
  modal('Thank you for reporting this',
    (reason === 'safety' ? 'If you are in immediate danger, contact emergency services on 112 or 999. ' : '') +
    (refunded ? 'Your token has been returned to your wallet. ' : '') +
    'In the pilot, the project team would review your report within 48 hours, contact both members if needed, and remove listings or suspend members who break the community guidelines. This demo report is stored on your device only and has not been sent.',
    [btn('Close', close)]);
}

function verifyEmail(then) {
  state.verified = true;
  logActivity('Email verified (demo)', 'info');
  save();
  notify('Email verified (simulated). Your profile now shows a verified badge.');
  if (then) then();
}

function renderTrust() {
  const v = state.verified;
  $('verifyStatus').textContent = v ? '✓ Verified email (demo)' : 'Email not verified';
  $('verifyStatus').className = 'verify-pill ' + (v ? 'verified' : 'unverified');
  $('verifyBtn').hidden = v;
  $('profTaught').textContent = state.offers.filter(o => o.completed).length;
  $('profCompleted').textContent = state.attended.length;
  $('profReviews').textContent = Object.keys(state.reviews).length;
}

function render() {
  $('balance').textContent = state.tokens;
  $('tokenLabel').textContent = state.tokens === 1 ? 'token' : 'tokens';
  renderDashboard();
  renderTrust();

  $('filters').replaceChildren(...categories.map(c => {
    const b = btn(c, () => { category = c; render(); }, 'filter');
    b.setAttribute('aria-pressed', String(c === category));
    return b;
  }));

  const query = $('search').value.trim().toLowerCase();
  const level = $('levelFilter').value;
  const duration = $('durationFilter').value;
  const pool = [...state.offers.map(offerToLesson), ...examples];
  const visible = pool.filter(l =>
    (category === 'All' || l.category === category) &&
    (!level || l.level === level) &&
    (!duration || String(l.duration) === duration) &&
    `${l.title} ${l.desc} ${l.category} ${l.teacher.name} ${l.level}`.toLowerCase().includes(query)
  );

  $('resultCount').textContent = visible.length + (visible.length === 1 ? ' lesson' : ' lessons') + ' found';
  $('clearFilters').hidden = category === 'All' && !query && !level && !duration;
  $('lessons').replaceChildren(...visible.map(l => lessonCard(l)));
  if (!visible.length) $('lessons').append(el('p', 'No lessons match. Try another search or clear your filters.', 'empty-state'));

  const offerRows = state.offers.map(o => {
    const a = el('div', undefined, 'own');
    const l = offerToLesson(o, 0);
    a.append(el('strong', offerTitle(o)), el('span', `${l.category} · ${l.level} · ${l.mode} · ${l.duration} min`, 'meta'));
    if (o.completed) {
      a.append(el('span', 'Taught · +1 demo token earned', 'price'));
    } else {
      a.append(btn('Simulate teaching this lesson (+1 token)', () => {
        if (!o.completed) {
          o.completed = true;
          state.tokens++;
          logActivity(`Taught "${offerTitle(o)}"`, 'gain');
          save();
          notify('You earned 1 demo token. Explore lessons to spend it.');
        }
      }, 'button secondary'));
    }
    return a;
  });
  $('myLessons').replaceChildren(...(offerRows.length ? [el('h3', 'Your published offers'), ...offerRows] : []));
}

const form = $('teachForm');
let wizStep = 1;

function draftOffer() {
  const d = Object.fromEntries(new FormData(form));
  for (const k of Object.keys(d)) d[k] = String(d[k]).trim();
  return d;
}

function setError(step, msg) {
  const e = form.querySelector(`[data-error="${step}"]`);
  if (e) e.textContent = msg || '';
}

function validStep(step) {
  const d = draftOffer();
  if (step === 1 && d.skill.length < 2) {
    setError(1, 'Tell us the skill you could teach, or pick one of the ideas above.');
    form.elements.skill.focus();
    return false;
  }
  if (step === 2 && d.description.length < 30) {
    setError(2, 'Add a bit more detail so learners know what to expect. Aim for at least 30 characters, and use the example if you need inspiration.');
    form.elements.description.focus();
    return false;
  }
  setError(step, '');
  return true;
}

function renderPreview() {
  const d = draftOffer();
  $('offerPreview').replaceChildren(lessonCard(offerToLesson(d, 'preview'), true));
  const checks = [
    [!!d.title, d.title ? 'Clear lesson title' : 'No title yet, so your skill name will be used. A specific title attracts more learners.'],
    [d.description.length >= 80, d.description.length >= 80 ? 'Detailed description' : 'Short description. Consider saying who it is for and what they will leave with.'],
    [!!d.availability, d.availability ? 'Availability shown' : 'No availability added. Learners like to know when you are free.'],
    [state.verified, state.verified ? 'Verified email' : "Email not verified yet. You'll be asked to verify when you publish."]
  ];
  $('offerChecklist').replaceChildren(...checks.map(([ok, text]) => el('li', (ok ? '✓ ' : '• ') + text, ok ? 'ok' : 'tip')));
}

function showStep(n) {
  wizStep = n;
  form.querySelectorAll('.wizard-panel').forEach(p => { p.hidden = Number(p.dataset.panel) !== n; });
  form.querySelectorAll('.wizard-steps li').forEach(li => {
    const step = Number(li.dataset.step);
    li.classList.toggle('active', step === n);
    li.classList.toggle('done', step < n);
    if (step === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  if (n === 3) renderPreview();
  const first = form.querySelector(`[data-panel="${n}"] input, [data-panel="${n}"] textarea, [data-panel="${n}"] button`);
  if (first && n !== 1) first.focus({ preventScroll: true });
}

form.querySelectorAll('[data-next]').forEach(b => b.addEventListener('click', () => { if (validStep(wizStep)) showStep(wizStep + 1); }));
form.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', () => showStep(wizStep - 1)));
form.querySelectorAll('.idea').forEach(b => b.addEventListener('click', () => {
  form.elements.skill.value = b.dataset.skill;
  form.elements.category.value = b.dataset.category;
  form.querySelectorAll('.idea').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  setError(1, '');
}));
form.querySelectorAll('.idea').forEach(b => b.setAttribute('aria-pressed', 'false'));
form.elements.description.addEventListener('input', () => { $('descCount').textContent = form.elements.description.value.length; });
form.addEventListener('input', () => { setError(wizStep, ''); });
$('useExample').addEventListener('click', () => {
  form.elements.description.value = $('exampleText').textContent.trim();
  form.elements.description.dispatchEvent(new Event('input'));
  form.elements.description.focus();
  notify('Example added. Now edit it so it describes your lesson.');
});

form.addEventListener('submit', e => {
  e.preventDefault();
  if (wizStep < 3) { if (validStep(wizStep)) showStep(wizStep + 1); return; }
  if (!validStep(1)) { showStep(1); return; }
  if (!validStep(2)) { showStep(2); return; }
  if (!state.verified) {
    modal('Verify your email to publish',
      'To keep the community safe, every teacher in the pilot verifies a university email address before their listing goes live. This demo simulates that step: no email is asked for or stored.',
      [btn('Simulate verification & publish', () => { close(); verifyEmail(publishOffer); }), btn('Not now', close, 'button secondary')]);
    return;
  }
  publishOffer();
});

function publishOffer() {
  const d = draftOffer();
  state.offers.push({ skill: d.skill, title: d.title, category: d.category, level: d.level, mode: d.mode, duration: d.duration, availability: d.availability, description: d.description, completed: false, created: Date.now() });
  logActivity(`Published "${d.title || d.skill}"`, 'info');
  form.reset();
  $('descCount').textContent = '0';
  form.querySelectorAll('.idea').forEach(x => x.setAttribute('aria-pressed', 'false'));
  showStep(1);
  save();
  notify('Published! Your listing now appears in the marketplace (visible only to you).');
  $('myLessons').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

$('verifyBtn').addEventListener('click', () => verifyEmail());
$('reportGeneral').addEventListener('click', () => openReport(null));
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
