/* Carte « Poubelle » — custom:appliance-poubelle-card
 * Poubelle animée pour les jours de collecte : se remplit au fil des jours, tremble la veille, saute le jour J, brille une fois vidée.
 * Intégrée depuis skyrotter/ha-poubelle-card (MIT), fusionnée en une seule carte autonome : localize, normalize, schedule,
 * calendars, assets, éditeur puis carte. Les traductions viennent de la section « poubelle » de src/i18n/*.json.
 */
(() => {
  const TAG = 'appliance-poubelle-card';
  if (customElements.get(TAG)) return;

/* Translations live in src/lang/<code>.json and are bundled into the card at build time.
 * To add a language: copy en.json to <code>.json (HA language code, e.g. de, pt-BR), translate the values,
 * and add it to LANGS below. Missing keys fall back to English. Day and month names come from Intl. */

// traductions : section « poubelle » de src/i18n/<langue>.json, remplie à la compilation (langue absente → anglais)
const LANGS = /*@i18n poubelle*/{};
const DEFAULT_LANG = 'en';

/* The HA user's language (profile setting), falling back to the browser. */
function haLanguage(hass) {
  const h = hass || document.querySelector('home-assistant')?.hass;
  return h?.locale?.language || h?.language || navigator.language || DEFAULT_LANG;
}

/* Maps a language code to one we ship: exact → case/separator-insensitive → base language → English. */
function resolveLang(code) {
  if (!code) return DEFAULT_LANG;
  const c = String(code).replace('_', '-');
  if (LANGS[c]) return c;
  const lc = c.toLowerCase();
  const hit = Object.keys(LANGS).find(k => k.toLowerCase() === lc);
  if (hit) return hit;
  const base = lc.split('-')[0];
  return LANGS[base] ? base : DEFAULT_LANG;
}

/* Language for a card: the card's `language` option, or the HA user's language when "auto". */
function cardLanguage(pref, hass) {
  const raw = !pref || pref === 'auto' ? haLanguage(hass) : pref;
  const lang = resolveLang(raw);
  // dates use the full HA locale (e.g. en-AU → "4 Nov") when it shares the base language
  const dateLocale = String(raw).split(/[-_]/)[0].toLowerCase() === lang.split('-')[0].toLowerCase() ? String(raw).replace('_', '-') : lang;
  return { lang, dateLocale };
}

const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? vars[k] : m));

/* t('fr', 'card.in_days', { n: 3 }) → "Dans 3 j" */
function t(lang, path, vars) {
  const v = get(LANGS[lang], path) ?? get(LANGS[DEFAULT_LANG], path);
  if (v == null) return path;
  return typeof v === 'string' ? fill(v, vars) : v;
}

const safeLocale = l => { try { new Intl.DateTimeFormat(l); return l; } catch { return DEFAULT_LANG; } };

/* 0 = Monday … 6 = Sunday (1 Jan 2024 was a Monday) */
const weekdayName = (locale, idx, style = 'long') =>
  new Intl.DateTimeFormat(safeLocale(locale), { weekday: style }).format(new Date(2024, 0, 1 + idx));
const monthName = (locale, m, style = 'long') =>
  new Intl.DateTimeFormat(safeLocale(locale), { month: style }).format(new Date(2024, m - 1, 1));
const shortDate = (locale, d) =>
  d.toLocaleDateString(safeLocale(locale), { day: 'numeric', month: 'short' });

/* Config values are English (canonical). French and older English spellings stay accepted
 * as aliases forever, so existing dashboards keep working. */

const table = groups => {
  const out = {};
  for (const [canon, aliases] of Object.entries(groups)) for (const a of [canon, ...aliases]) out[a] = canon;
  return out;
};

const BIN_ALIASES = table({
  grey: ['gray', 'grise', 'gris'],
  black: ['noire', 'noir'],
  yellow: ['jaune'],
  green: ['verte', 'vert'],
  blue: ['bleue', 'bleu'],
  brown: ['marron', 'brune', 'brun'],
  red: ['rouge'],
  purple: ['violet', 'violette', 'mauve'],
  burgundy: ['maroon', 'bordeaux'],
  lime: ['lime_green', 'lime-green', 'citron_vert', 'vert_clair'],
});
const BINS = ['grey', 'black', 'yellow', 'green', 'blue', 'brown', 'red', 'purple', 'burgundy', 'lime'];

const CONTAINER_ALIASES = table({
  wheelie_bin: ['bac', 'bin', 'wheelie', 'conteneur'],
  bag: ['bags', 'sac', 'sacs'],
  bulky: ['bulky_waste', 'encombrants', 'encombrant'],
});
const CONTAINERS = ['wheelie_bin', 'bag', 'bulky'];

const WEEKS_ALIASES = table({
  all: ['every', 'toutes', 'toute', 'tous'],
  even: ['paires', 'paire', 'pair'],
  odd: ['impaires', 'impaire', 'impair'],
});
const WEEKS = ['all', 'even', 'odd'];

/* next_day changed meaning in 2.0: it now means the next calendar day.
   The old "next working day" behaviour is next_work_day (French report / shift keep mapping to it). */
const HOLIDAY_ALIASES = table({
  none: ['aucun', 'ignore', 'off'],
  next_day: [],
  next_work_day: ['report', 'reportee', 'reportée', 'shift', 'next_workday', 'next_working_day'],
  shift_week: ['skip_week', 'next_week'],
  shift_rest_of_week: ['decalage', 'décalage', 'week', 'semaine'],
  cancel: ['annule', 'annulée', 'annulee', 'skip'],
});
const HOLIDAY_MODES = ['none', 'next_day', 'next_work_day', 'shift_week', 'shift_rest_of_week', 'cancel'];
const HOLIDAY_NEEDS_WORKDAY = new Set(['next_work_day']);

const DAY_NAMES = {
  monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6,
  mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
  lundi: 0, mardi: 1, mercredi: 2, jeudi: 3, vendredi: 4, samedi: 5, dimanche: 6,
  lun: 0, mar: 1, mer: 2, jeu: 3, ven: 4, sam: 5, dim: 6,
};
const MONTH_NAMES = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
  jan: 1, feb: 2, mar: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, sept: 9, oct: 10, nov: 11, dec: 12,
  janvier: 1, fevrier: 2, février: 2, mars: 3, avril: 4, mai: 5, juin: 6, juillet: 7, aout: 8, août: 8, septembre: 9, octobre: 10, novembre: 11, decembre: 12, décembre: 12,
  fev: 2, fév: 2, avr: 4, juil: 7, déc: 12,
};

const lower = v => String(v ?? '').trim().toLowerCase();
const isName = v => typeof v === 'string' && v.trim() !== '' && isNaN(v);
const parseDay = d => (isName(d) ? DAY_NAMES[lower(d)] : Number(d));
const parseMonth = m => (isName(m) ? MONTH_NAMES[lower(m)] : Number(m));

const normBin = v => BIN_ALIASES[lower(v)];
const normContainer = v => (v == null || v === '' ? undefined : CONTAINER_ALIASES[lower(v)]);
const normWeeks = v => (v == null || v === '' ? undefined : WEEKS_ALIASES[lower(v)]);
const normHolidays = v => (v == null || v === '' ? undefined : HOLIDAY_ALIASES[lower(v)]);

/* Returns a copy of the config with canonical English values (unknown values are left as written,
   so setConfig can report them). Used by both the card and the visual editor. */
function normalizeConfig(c) {
  const out = { ...c };
  if (out.bin != null) {
    let b = normBin(out.bin) ?? out.bin;
    if (b === 'grey' && ['noire', 'black'].includes(lower(out.tint))) b = 'black'; // v0 compatibility
    out.bin = b;
  }
  delete out.tint;
  for (const [k, fn] of [['container', normContainer], ['weeks', normWeeks], ['holidays', normHolidays]]) {
    if (out[k] == null || out[k] === '') continue;
    const v = fn(out[k]);
    if (v) out[k] = v;
  }
  if (out.container === 'wheelie_bin') delete out.container; // default
  if (out.weeks === 'all') delete out.weeks;                 // default
  if (out.holidays === 'none') delete out.holidays;          // default
  if ('region' in out) delete out.region;                    // French holiday regions: replaced by the Holiday integration
  return out;
}

/* Pure scheduling logic (no DOM, no hass) so it can be unit-tested with node --test. */
const DAY_MS = 86400000;
const midnight = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + (Number(n) || 0)); return x; };
const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
/* whole days between two dates, safe across DST changes */
const daysBetween = (a, b) => Math.round((midnight(b) - midnight(a)) / DAY_MS);
/* 0 = Monday … 6 = Sunday */
const weekdayIdx = d => (d.getDay() + 6) % 7;
const mondayOf = d => addDays(midnight(d), -weekdayIdx(d));
/* ISO 8601 week number (used by weeks: even / odd) */
const isoWeek = d => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / DAY_MS + 1) / 7);
};
/* "2026-11-04" → local midnight (never UTC); anything else → Date or null */
const parseDate = v => {
  if (v == null || v === '') return null;
  if (v instanceof Date) return isNaN(v) ? null : midnight(v);
  const s = String(v).trim();
  const d = /^\d{4}-\d{2}-\d{2}$/.test(s) ? new Date(s + 'T00:00:00') : new Date(s);
  return isNaN(d) ? null : midnight(d);
};

/* Turns a (normalised) card config into the rule used by computeFixed. */
function buildRule(c) {
  const mday = c.month_day != null && c.month_day !== ''
    ? [].concat(c.month_day).map(Number).filter(x => x >= 1 && x <= 31) : [];
  const startDate = parseDate(c.start_date);
  let days = [].concat(c.days ?? []).map(parseDay).filter(d => d >= 0 && d <= 6);
  if (!days.length && startDate && !mday.length) days = [weekdayIdx(startDate)];
  const months = [].concat(c.months ?? []).map(parseMonth).filter(m => m >= 1 && m <= 12);
  const monthWeeks = (Array.isArray(c.month_week) ? c.month_week : String(c.month_week ?? '').split(/[\s,;]+/))
    .map(x => String(x).trim().toLowerCase())
    .map(x => (['last', 'dernier', 'derniere', 'dernière', '-1'].includes(x) ? -1 : (Number(x) >= 1 && Number(x) <= 5 ? Number(x) : 0)))
    .filter(Boolean);
  const w = normWeeks(c.weeks);
  return {
    days, mday, months, monthWeeks, startDate,
    every: Math.max(1, Math.round(Number(c.every) || 1)),
    weeks: w === 'even' ? 0 : w === 'odd' ? 1 : null,
    holidays: normHolidays(c.holidays) || 'none',
    hour: Number(c.hour ?? 9),
  };
}

/* Is a collection planned on day d (before any holiday adjustment)? */
function planned(rule, d) {
  if (rule.months.length && !rule.months.includes(d.getMonth() + 1)) return false;
  if (rule.mday.length) {
    const lastDom = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    return rule.mday.some(x => d.getDate() === Math.min(x, lastDom));
  }
  if (!rule.days.includes(weekdayIdx(d))) return false;
  if (rule.monthWeeks.length) {
    const isLast = addDays(d, 7).getMonth() !== d.getMonth();
    return rule.monthWeeks.some(w => (w === -1 ? isLast : Math.ceil(d.getDate() / 7) === w));
  }
  if (rule.startDate) {
    // whole weeks between the anchor's week and d's week (Monday-based), every N weeks
    const wk = Math.round(daysBetween(mondayOf(rule.startDate), mondayOf(d)) / 7);
    return ((wk % rule.every) + rule.every) % rule.every === 0;
  }
  return rule.weeks === null || isoWeek(d) % 2 === rule.weeks;
}

/* Actual date of a collection planned on d, or null if cancelled.
   ctx.isHoliday(d) → bool; ctx.isWorkday(d) → bool, or null when no Workday calendar is available. */
function effective(rule, d, ctx) {
  const hol = x => !!ctx.isHoliday(x);
  switch (rule.holidays) {
    case 'next_day':
      return hol(d) ? addDays(d, 1) : d;
    case 'next_work_day': {
      if (!hol(d)) return d;
      for (let x = addDays(d, 1), i = 0; i < 14; i++, x = addDays(x, 1)) {
        const wd = ctx.isWorkday(x);
        // without a Workday calendar: skip holidays and Sundays (pre-2.0 behaviour)
        if (wd === null ? (!hol(x) && x.getDay() !== 0) : (wd && !hol(x))) return x;
      }
      return addDays(d, 1);
    }
    case 'shift_week': {
      let x = d;
      for (let i = 0; i < 5 && hol(x); i++) x = addDays(x, 7);
      return x;
    }
    case 'shift_rest_of_week': {
      // a holiday earlier in the same week (or on the day) pushes this collection back one day
      for (let x = mondayOf(d); x <= d; x = addDays(x, 1)) if (x.getDay() !== 0 && hol(x)) return addDays(d, 1);
      return d;
    }
    case 'cancel':
      return hol(d) ? null : d;
    default:
      return d;
  }
}

/* Collections around today: [{ k: days from today, moved: bool }], sorted, de-duplicated. */
function collections(rule, now, ctx, range) {
  const today = midnight(now);
  // fenêtre : au moins un intervalle complet (every semaines) de part et d'autre, plus une marge pour les reports de jours fériés
  const K = range ?? (rule.months.length ? 370 : Math.max(75, rule.every * 7 + 42));
  const seen = new Map();
  for (let k = -K; k <= K; k++) {
    const d = addDays(today, k);
    if (!planned(rule, d)) continue;
    const e = effective(rule, d, ctx);
    if (!e) continue;
    const ek = daysBetween(today, e), moved = dayKey(e) !== dayKey(d);
    // a moved collection landing on a regular one counts once, as regular
    const prev = seen.get(ek);
    seen.set(ek, { k: ek, moved: prev ? prev.moved && moved : moved });
  }
  return [...seen.values()].sort((a, b) => a.k - b.k);
}

/* Card state from a fixed schedule: { state: ''|'eve'|'today'|'emptied'|'unknown', n, fill, moved } */
function computeFixed(rule, now, ctx) {
  const h = now.getHours() + now.getMinutes() / 60, H = rule.hour;
  const list = collections(rule, now, ctx);
  const next = list.find(x => x.k > 0 || (x.k === 0 && h < H));
  const last = [...list].reverse().find(x => x.k < 0 || (x.k === 0 && h >= H));
  if (!next || !last) return { state: 'unknown', n: null, fill: 0 };
  const n = next.k, l = -last.k, moved = next.moved;
  const fill = (l + n) ? l / (l + n) : 0;
  if (l === 0) return { state: 'emptied', n, fill: 0 };
  if (n === 0) return { state: 'today', n, fill: 1, moved };
  return { state: n === 1 ? 'eve' : '', n, fill, moved };
}

/* Expands calendar.get_events events into a Set of local "YYYY-MM-DD" keys (all-day end is exclusive). */
function eventDays(events) {
  const set = new Set();
  for (const ev of events || []) {
    const s = String(ev.start?.date || ev.start?.dateTime || ev.start || '');
    const e = String(ev.end?.date || ev.end?.dateTime || ev.end || '');
    const allDay = /^\d{4}-\d{2}-\d{2}$/.test(s);
    const a = parseDate(s);
    if (!a) continue;
    let b = parseDate(e);
    if (!b || b <= a) b = addDays(a, 1);
    else if (!allDay && (new Date(e) - b) > 0) b = addDays(b, 1); // timed event ending mid-day covers that day
    for (let x = a, i = 0; x < b && i < 400; x = addDays(x, 1), i++) set.add(dayKey(x));
  }
  return set;
}

/* Holiday / Workday calendars: one fetch per calendar per day, shared by every card on the page. */
const cache = new Map(); // `${entity}|${day}` → Promise<Set|null>

/* First calendar entity created by an integration ('holiday' or 'workday'), from the entity registry. */
function findCalendar(hass, platform) {
  const reg = hass?.entities || {};
  return Object.keys(reg).filter(id => id.startsWith('calendar.') && reg[id]?.platform === platform && hass.states?.[id]).sort()[0] || null;
}

/* Set of 'YYYY-MM-DD' days with an event, from about a year back to a year and a bit ahead
   (enough for seasonal schedules and holiday shifts). null if the calendar can't be read. */
function calendarDays(hass, entityId) {
  if (!hass?.callWS || !entityId) return Promise.resolve(null);
  const today = midnight(new Date()), key = `${entityId}|${dayKey(today)}`;
  if (cache.has(key)) return cache.get(key);
  for (const k of cache.keys()) if (k.startsWith(entityId + '|')) cache.delete(k); // yesterday's copy
  const p = hass.callWS({
    type: 'call_service', domain: 'calendar', service: 'get_events', return_response: true,
    target: { entity_id: entityId },
    service_data: { start_date_time: addDays(today, -380).toISOString(), end_date_time: addDays(today, 420).toISOString() },
  }).then(r => eventDays(r?.response?.[entityId]?.events), () => {
    setTimeout(() => cache.delete(key), 10 * 60000); // retry in 10 min
    return null;
  });
  cache.set(key, p);
  return p;
}

/* Artwork: bin images, bag / bulky-waste SVGs, overflowing contents, effects.
 * Originally from skyrotter/ha-poubelle-card (MIT). */
const PB_IMG = {
  grey: { lid: 'data:image/webp;base64,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', body: 'data:image/webp;base64,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' },
  yellow: { lid: 'data:image/webp;base64,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', body: 'data:image/webp;base64,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' },
};

/* Couleurs de poubelle : image de base + filtres CSS */
const PB_BINS = {
  grey:  { img: 'grey', color: '#9ea6b8', content: 'rubbish' },
  black:  { img: 'grey', color: '#7c8496', content: 'rubbish',
            body: 'brightness(.42) contrast(1.15)', lid: 'brightness(.42) contrast(1.15)' },
  yellow:  { img: 'yellow', color: '#ffc107', content: 'recycling', paint: '#f5b400' },
  green:  { img: 'yellow', color: '#4caf50', content: 'glass', paint: '#2f9e44', lid: 'hue-rotate(68deg) saturate(.85) brightness(.8)' },
  blue:  { img: 'yellow', color: '#42a5f5', content: 'paper', paint: '#1e6fd9', lid: 'hue-rotate(165deg) saturate(1.1) brightness(.85)' },
  brown: { img: 'yellow', color: '#a1887f', content: 'organics', paint: '#8a5a2b', lid: 'hue-rotate(-14deg) saturate(.75) brightness(.5)' },
  red:  { img: 'yellow', color: '#ef5350', content: 'rubbish', paint: '#d32f2f', lid: 'hue-rotate(-62deg) saturate(2.6) brightness(.72)' },
  purple: { img: 'yellow', color: '#ab47bc', content: 'glass', paint: '#7b2fa8', lid: 'hue-rotate(-140deg) saturate(1.2) brightness(.7)' },
  burgundy: { img: 'yellow', color: '#b0415a', content: 'organics', paint: '#7a1f35', paintBody: 'brightness(.55)', lid: 'hue-rotate(-75deg) saturate(1.5) brightness(.45)' },
  lime: { img: 'yellow', color: '#9ccc3c', content: 'organics', paint: '#8cc63f', lid: 'hue-rotate(40deg) saturate(1.1) brightness(1)' },
};
/* proportions des images de corps (largeur / hauteur), pour caler la peinture de full_color */
const PB_BODY_RATIO = { grey: '190/295', yellow: '190/291' };
/* la roue (en bas à droite de l'image) garde son noir : on la retire de la zone peinte */
const PB_WHEEL_HOLE = 'radial-gradient(ellipse 10% 15% at 89% 82%, transparent 96%, #000 100%)';

/* ---- sac poubelle (communes sans conteneurs) : couleur, et translucide ou non ---- */
const PB_BAG_COLORS = {
  grey: ['#5b6270', 1], black: ['#1f2328', 1], yellow: ['#f5c518', .7], green: ['#2f9e44', .9],
  blue: ['#2f6fd6', .85], brown: ['#7a4a26', 1], red: ['#d32f2f', .92],
  purple: ['#7b2fa8', .9], burgundy: ['#7a1f35', 1], lime: ['#8cc63f', .85],
};
/* sac noué vu de face, dans le même cadre 150 × 253 que la poubelle ; le contenu se devine dans un sac translucide */
const pbBagSvg = (col, op, content) => `<svg class="bagsvg" viewBox="0 0 150 253" aria-hidden="true">
 <defs><clipPath id="pbbag"><path d="M28 250 C8 248 6 196 14 150 C20 112 40 92 60 86 L90 86 C110 92 130 112 136 150 C144 196 142 248 122 250 Z"/></clipPath>
  <linearGradient id="pbbagsh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
 <g class="bagg">
  ${op < 1 ? `<g clip-path="url(#pbbag)"><g transform="translate(10 120) scale(1 1.6)">${content}</g></g>` : ''}
  <path d="M28 250 C8 248 6 196 14 150 C20 112 40 92 60 86 L90 86 C110 92 130 112 136 150 C144 196 142 248 122 250 Z" fill="${col}" fill-opacity="${op}"/>
  <path d="M28 250 C8 248 6 196 14 150 C20 112 40 92 60 86 L90 86 C110 92 130 112 136 150 C144 196 142 248 122 250 Z" fill="url(#pbbagsh)" stroke="#fff" stroke-opacity=".16" stroke-width="1.5"/>
  <g fill="none" stroke-linecap="round">
   <path d="M44 120 C36 150 34 190 40 236" stroke="#fff" stroke-opacity=".22" stroke-width="5"/>
   <path d="M108 112 C118 130 122 150 120 170" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>
   <path d="M62 100 C70 130 66 170 74 206 M98 104 C92 140 104 176 96 222 M30 196 C52 204 78 200 104 214" stroke="#000" stroke-opacity=".22" stroke-width="2"/>
  </g>
  <!-- col froncé et nœud -->
  <path d="M58 90 C64 82 68 76 70 70 L80 70 C82 76 86 82 92 90 Z" fill="${col}"/>
  <path d="M62 86 L70 72 M75 88 V71 M88 86 L80 72" stroke="#000" stroke-opacity=".25" stroke-width="1.6"/>
  <ellipse cx="75" cy="69" rx="9" ry="6" fill="${col}"/>
  <path d="M70 66 C56 58 50 48 58 44 C66 41 72 54 74 64 Z" fill="${col}"/><path d="M80 66 C94 58 100 48 92 44 C84 41 78 54 76 64 Z" fill="${col}"/>
  <path d="M70 66 C56 58 50 48 58 44 C66 41 72 54 74 64 Z M80 66 C94 58 100 48 92 44 C84 41 78 54 76 64 Z" fill="#000" fill-opacity=".18"/>
 </g></svg>`;

/* ---- encombrants : tas d'objets (frigo, matelas, télé, pneu, carton, chaise, planche), même cadre 150 × 253 ---- */
const PB_BULKY_SVG = `<svg class="bulkysvg" viewBox="0 0 150 253" aria-hidden="true">
 <defs><linearGradient id="pbfr" x1="0" x2="1"><stop offset="0" stop-color="#e9edf1"/><stop offset=".55" stop-color="#ffffff"/><stop offset="1" stop-color="#c3cad1"/></linearGradient>
  <linearGradient id="pbmat" x1="0" x2="1"><stop offset="0" stop-color="#9fb8d6"/><stop offset="1" stop-color="#6f8fb6"/></linearGradient></defs>
 <g class="bulkyg"><g transform="translate(75 252) scale(1.32) translate(-80 -252)">
  <!-- matelas appuyé à gauche -->
  <g transform="rotate(-14 30 250)"><rect x="8" y="118" width="40" height="134" rx="8" fill="url(#pbmat)"/>
   <path d="M14 140h28M14 166h28M14 192h28M14 218h28" stroke="#fff" stroke-opacity=".45" stroke-width="2" stroke-dasharray="3 4"/></g>
  <!-- vieux frigo -->
  <rect x="58" y="96" width="52" height="154" rx="5" fill="url(#pbfr)" stroke="#8d969f" stroke-width="1.2"/>
  <path d="M58 146h52" stroke="#8d969f" stroke-width="1.6"/>
  <rect x="62" y="104" width="4" height="30" rx="2" fill="#9aa3ac"/><rect x="62" y="154" width="4" height="40" rx="2" fill="#9aa3ac"/>
  <path d="M90 108l12 14M84 170l18 26" stroke="#c8ced4" stroke-width="2" stroke-linecap="round"/>
  <!-- chaise renversée sur le frigo -->
  <g transform="rotate(158 98 86)" fill="none" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"><path d="M80 70h34M84 70v30M110 70v30M80 70v-26M80 50h22"/></g>
  <!-- planche -->
  <rect x="96" y="196" width="56" height="9" rx="2" fill="#c08a4e" transform="rotate(-28 120 200)"/>
  <!-- carton -->
  <g transform="rotate(6 128 232)"><rect x="110" y="212" width="38" height="38" rx="2" fill="#c49a62"/><path d="M110 222h38M129 212v10" stroke="#8d6538" stroke-width="2"/></g>
  <!-- pneu -->
  <ellipse cx="34" cy="238" rx="27" ry="13" fill="#24272b"/><ellipse cx="34" cy="236" rx="13" ry="5.5" fill="#4a4f56"/>
  <path d="M10 236q24 -10 48 0" stroke="#3b3f45" stroke-width="2" fill="none"/>
  <!-- vieille télé, écran fendu -->
  <g transform="rotate(-6 62 222)"><rect x="34" y="194" width="56" height="44" rx="5" fill="#7a5a3a" stroke="#4e3a26" stroke-width="1.2"/>
   <rect x="39" y="199" width="36" height="34" rx="4" fill="#5f8f86"/><path d="M50 202l6 12l-8 8l10 9M62 214l10 -6" stroke="#e9f3f1" stroke-width="1.3" fill="none"/>
   <circle cx="83" cy="206" r="3" fill="#2b2f33"/><circle cx="83" cy="216" r="3" fill="#2b2f33"/></g>
 </g></g></svg>`;

/* ---- contenu qui dépasse quand c'est plein ---- */
const PB_CONTENT = {
  rubbish: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <ellipse cx="34" cy="48" rx="30" ry="24" fill="#3a3f4b"/><path d="M28 24 l6 -12 l6 12z" fill="#3a3f4b"/><path d="M22 36 q10 -8 24 0" stroke="#6b7385" stroke-width="3" fill="none"/>
 <ellipse cx="88" cy="44" rx="32" ry="27" fill="#454b59"/><path d="M82 17 l7 -13 l7 13z" fill="#454b59"/><path d="M72 32 q15 -9 30 0" stroke="#727b8f" stroke-width="3" fill="none"/>
 <ellipse cx="60" cy="58" rx="24" ry="15" fill="#525a6b"/><path d="M40 20 q4 -14 12 -4" stroke="#e8c547" stroke-width="4" fill="none" stroke-linecap="round"/>
 <circle cx="112" cy="28" r="5" fill="#6b4f2c"/></svg>`,
  recycling: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <rect x="6" y="20" width="44" height="46" rx="3" fill="#b98a53" transform="rotate(-8 28 43)"/><path d="M8 26 l40 -6" stroke="#8d6538" stroke-width="3" transform="rotate(-8 28 43)"/>
 <rect x="54" y="8" width="16" height="56" rx="7" fill="#5aa9e6" opacity=".9"/><rect x="58" y="2" width="8" height="8" rx="2" fill="#2a6fb0"/><rect x="54" y="30" width="16" height="10" fill="#e6f2ff" opacity=".8"/>
 <rect x="78" y="24" width="18" height="40" rx="4" fill="#d9dde3" transform="rotate(12 87 44)"/><rect x="78" y="34" width="18" height="12" fill="#e53935" transform="rotate(12 87 44)"/>
 <rect x="98" y="16" width="28" height="48" rx="2" fill="#f1ede4" transform="rotate(10 112 40)"/><path d="M103 26h18M103 32h18M103 38h12" stroke="#9b978d" stroke-width="2" transform="rotate(10 112 40)"/></svg>`,
  glass: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <rect x="14" y="14" width="18" height="52" rx="7" fill="#2e7d32" opacity=".9" transform="rotate(-10 23 40)"/><rect x="19" y="4" width="8" height="12" rx="2" fill="#1b5e20" transform="rotate(-10 23 40)"/>
 <rect x="44" y="22" width="22" height="44" rx="8" fill="#a5d6a7" opacity=".8"/><rect x="50" y="12" width="10" height="12" rx="2" fill="#81c784"/>
 <rect x="76" y="10" width="17" height="56" rx="7" fill="#6d4c41" opacity=".9" transform="rotate(8 84 38)"/><rect x="80" y="0" width="8" height="12" rx="2" fill="#4e342e" transform="rotate(8 84 38)"/>
 <rect x="100" y="28" width="22" height="38" rx="5" fill="#e0f2f1" opacity=".75"/><rect x="102" y="22" width="18" height="8" rx="2" fill="#b0bec5"/></svg>`,
  paper: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <rect x="8" y="22" width="46" height="44" rx="3" fill="#c49a62" transform="rotate(-10 31 44)"/><path d="M10 28 l42 -6" stroke="#8d6538" stroke-width="3" transform="rotate(-10 31 44)"/>
 <rect x="50" y="12" width="34" height="50" rx="2" fill="#f5f2ea" transform="rotate(6 67 37)"/><path d="M56 22h22M56 29h22M56 36h22M56 43h14" stroke="#9b978d" stroke-width="2" transform="rotate(6 67 37)"/>
 <rect x="86" y="18" width="36" height="46" rx="2" fill="#dfe7f2" transform="rotate(14 104 41)"/><rect x="90" y="24" width="28" height="12" fill="#90a4ae" transform="rotate(14 104 41)"/></svg>`,
  organics: `<svg viewBox="0 0 130 70" width="100%" height="100%" aria-hidden="true">
 <ellipse cx="30" cy="50" rx="26" ry="20" fill="#6d8b3a"/><path d="M18 34 q12 -22 26 -4" fill="#8bc34a"/>
 <ellipse cx="72" cy="46" rx="24" ry="22" fill="#7a5a3a"/><circle cx="64" cy="36" r="9" fill="#e53935"/><path d="M64 27 q3 -6 7 -5" stroke="#4e342e" stroke-width="2.5" fill="none"/>
 <path d="M90 60 q10 -40 34 -46 q-6 30 -34 46z" fill="#9ccc65"/><path d="M92 58 q14 -22 30 -40" stroke="#558b2f" stroke-width="2" fill="none"/>
 <circle cx="44" cy="22" r="6" fill="#ffb74d"/></svg>`,
};

const PB_FX_FLY = `<span class="fly f1"></span><span class="fly f2"></span><span class="fly f3"></span>`;
const PB_FX_STINK = [1, 2, 3].map(i => `<span class="stink s${i}"><svg viewBox="0 0 14 40"><path d="M7 38 C0 30 14 24 7 16 C0 8 14 4 7 0" stroke="rgba(160,200,120,.75)" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg></span>`).join('');
const PB_FX_SPARK = [1, 2, 3].map(i => `<svg class="spark sp${i}" viewBox="0 0 20 20"><path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8Z" fill="#b8f5bb"/></svg>`).join('');

/* Visual editor: ha-form with labels in the HA user's language, fields shown only when they apply,
 * and legacy (French) values shown as their English equivalents. */
/* ha-form is only registered once HA has loaded one of its own editors */
let formReady;
const ensureForm = () => formReady ??= (async () => {
  if (customElements.get('ha-form')) return;
  try {
    const helpers = await window.loadCardHelpers?.();
    const el = await helpers?.createCardElement({ type: 'entities', entities: [] });
    await el?.constructor?.getConfigElement?.();
  } catch (e) { /* ignore: falls back to whenDefined */ }
  await customElements.whenDefined('ha-form');
})();

/* valeur CSS de la config (couleur, filtre) insérée dans <style> : refusée si elle peut sortir de la déclaration */
const cssSafe = v => { const s = String(v ?? '').trim(); return /[<>{};"'\\]/.test(s) ? '' : s; };

const isEmpty = v => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);

class PoubelleCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = normalizeConfig(config || {});
    this._render();
  }

  set hass(h) {
    this._hass = h;
    if (this._form) this._form.hass = h;
    else this._render();
  }

  _schema(lang, loc) {
    const c = this._config, opt = (group, values) => values.map(v => ({ value: v, label: t(lang, `editor.options.${group}.${v}`) }));
    const sel = options => ({ select: { mode: 'dropdown', options } });
    const entity = String(c.entity || ''), mode = c.holidays || 'none';
    const s = [
      { name: 'bin', required: true, selector: sel(BINS.map(b => ({ value: b, label: t(lang, `card.bin.${b}`) }))) },
      { name: 'name', selector: { text: {} } },
      { name: 'container', selector: sel(opt('container', CONTAINERS)) },
      { name: 'image', selector: { text: {} } },
      { name: 'entity', selector: { entity: { filter: { domain: ['sensor', 'calendar', 'input_datetime'] } } } },
    ];
    if (entity.startsWith('calendar.')) s.push(
      { name: 'calendar_filter', selector: { text: {} } },
      { name: 'calendar_offset', selector: { number: { min: -7, max: 7, mode: 'box' } } });
    if (!entity) {
      s.push(
        { name: 'days', selector: { select: { multiple: true, options: [0, 1, 2, 3, 4, 5, 6].map(i => ({ value: String(i), label: weekdayName(loc, i) })) } } },
        { name: 'start_date', selector: { date: {} } });
      if (c.start_date) s.push({ name: 'every', selector: { number: { min: 1, max: 12, mode: 'box' } } });
      else s.push({ name: 'weeks', selector: sel(opt('weeks', WEEKS)) });
      s.push(
        { name: 'month_week', selector: sel(['', '1', '2', '3', '4', 'last'].map(v => ({ value: v, label: t(lang, `editor.options.month_week.${v}`) }))) },
        { name: 'month_day', selector: { number: { min: 1, max: 31, mode: 'box' } } },
        { name: 'months', selector: { select: { multiple: true, options: Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: monthName(loc, i + 1) })) } } },
        { name: 'holidays', selector: sel(opt('holidays', HOLIDAY_MODES)) });
      if (mode !== 'none') s.push({ name: 'holiday_calendar', selector: { entity: { filter: { domain: 'calendar', integration: 'holiday' } } } });
      if (mode === 'next_work_day') s.push({ name: 'workday_calendar', selector: { entity: { filter: { domain: 'calendar', integration: 'workday' } } } });
    }
    s.push(
      { type: 'grid', name: '', schema: [
        { name: 'hour', selector: { number: { min: 0, max: 23.5, step: 0.5, mode: 'box' } } },
        ...(entity && !entity.startsWith('calendar.') ? [{ name: 'interval', selector: { number: { min: 1, max: 60, mode: 'box' } } }] : []),
        { name: 'scale', selector: { number: { min: 0.3, max: 1.2, step: 0.01, mode: 'slider' } } },
        { name: 'headroom', selector: { number: { min: 0, max: 70, mode: 'box' } } },
      ] },
      { type: 'grid', name: '', schema: ['compact', 'show_meter', 'show_status', 'theme_background', 'full_color'].map(n => ({ name: n, selector: { boolean: {} } })) },
      { name: 'language', selector: sel([{ value: 'auto', label: t(lang, 'editor.options.language.auto') },
        ...Object.entries(LANGS).map(([k, v]) => ({ value: k, label: v.language_name }))]) },
    );
    return s;
  }

  async _render() {
    if (!this._hass || !this._config) return;
    await ensureForm();
    if (!this._form) {
      this._form = document.createElement('ha-form');
      this._form.addEventListener('value-changed', e => this._changed(e));
      this.appendChild(this._form);
    }
    const { lang, dateLocale } = cardLanguage('auto', this._hass); // the editor follows the HA user's language
    const c = this._config;
    this._form.hass = this._hass;
    this._form.data = {
      show_meter: true, show_status: true, ...c,
      container: c.container || 'wheelie_bin', weeks: c.weeks || 'all', holidays: c.holidays || 'none', language: c.language || 'auto',
      month_week: c.month_week == null ? '' : String(c.month_week),
      days: [].concat(c.days ?? []).map(parseDay).filter(d => d >= 0 && d <= 6).map(String),
      months: [].concat(c.months ?? []).map(parseMonth).filter(m => m >= 1 && m <= 12).map(String),
    };
    this._form.schema = this._schema(lang, dateLocale);
    this._form.computeLabel = s => t(lang, `editor.labels.${s.name}`);
    this._form.computeHelper = s => { const h = t(lang, `editor.helpers.${s.name}`); return h.startsWith('editor.') ? undefined : h; };
  }

  _changed(ev) {
    ev.stopPropagation();
    const v = { ...ev.detail.value };
    if (Array.isArray(v.days)) v.days = v.days.map(Number);
    if (Array.isArray(v.months)) v.months = v.months.map(Number);
    if (v.language === 'auto') delete v.language;
    if (v.show_meter === true) delete v.show_meter;
    if (v.show_status === true) delete v.show_status;
    if (!v.start_date) delete v.every;
    if (!v.holidays || v.holidays === 'none') { delete v.holiday_calendar; delete v.workday_calendar; }
    if (v.holidays !== 'next_work_day') delete v.workday_calendar;
    for (const k of Object.keys(v)) if (isEmpty(v[k])) delete v[k];
    const config = normalizeConfig(v);
    this._config = config;
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }));
    this._render();
  }
}

customElements.define(`${TAG}-editor`, PoubelleCardEditor);

/*!
 * poubelle-card — animated Lovelace card for bin collection days
 * https://github.com/skyrotter/ha-poubelle-card — MIT License
 */
// Set by the release workflow from the release tag (v2.1.0 -> '2.1.0'); don't edit by hand.
const CONTENT_ALIASES = { ordures: 'rubbish', recyclables: 'recycling', verre: 'glass', papier: 'paper', biodechets: 'organics' };
/* internal state → CSS class (French class names kept so existing card-mod styles still apply) */
const STATE_CLASS = { eve: 'veille', today: 'jour', emptied: 'videe', unknown: '', '': '' };

class PoubelleCard extends HTMLElement {
  static getStubConfig() { return { bin: 'yellow', days: [1], hour: 9 }; }
  static getConfigElement() { return document.createElement(`${TAG}-editor`); }

  setConfig(raw) {
    const err = (key, vars) => new Error(`${TAG}: ` + t(resolveLang(raw?.language && raw.language !== 'auto' ? raw.language : haLanguage(this._hass)), `errors.${key}`, vars));
    if (!raw) throw err('bin_required', { bins: BINS.join(', ') });
    let c = normalizeConfig(raw);
    // bulky waste: no bin colour needed, grey meter by default
    if (!c.bin && c.container === 'bulky') c = { ...c, bin: 'grey' };
    if (!c.bin) throw err('bin_required', { bins: BINS.join(', ') });
    if (!PB_BINS[c.bin]) throw err('bin_unknown', { bin: raw.bin, bins: BINS.join(', ') });
    if (c.holidays && !HOLIDAY_MODES.includes(c.holidays)) throw err('holidays_unknown', { value: raw.holidays, values: HOLIDAY_MODES.join(', ') });
    if (c.start_date != null && c.start_date !== '' && !parseDate(c.start_date)) throw err('start_date_invalid');
    const rule = buildRule(c);
    if (!c.entity && !rule.mday.length && !rule.days.length) throw err('schedule_required');
    this._rule = rule;
    this._bin = c.bin;
    this._bag = c.container === 'bag';
    this._bulky = c.container === 'bulky';
    this._c = Object.assign({ hour: 9, interval: 7, scale: 0.62, headroom: 70, language: 'auto' }, c);
    this._cal = null; this._calAt = 0; this._calKey = null;
    this._hol = null; this._work = null; this._holKey = null;
    this._build();
    this._loadCal(true);
    this._loadHolidays();
  }

  set hass(h) {
    const old = this._hass;
    this._hass = h;
    const e = this._c && this._c.entity;
    if (e && (!old || old.states[e] !== h.states[e])) this._loadCal(true);
    if (!old || old.entities !== h.entities) this._loadHolidays();
    if (!old || (e && old.states[e] !== h.states[e]) || (old.locale?.language !== h.locale?.language)) this._render();
  }

  /* calendar.* entity: HA's state only shows the next event (any title), so read the events of the
     past and next 60 days (calendar.get_events) to filter by title and base the fill on the real last pickup. */
  async _loadCal(force) {
    const c = this._c, e = c && c.entity, h = this._hass;
    if (!h || !e || !e.startsWith('calendar.') || !h.callWS) return;
    const key = `${e}|${[].concat(c.calendar_filter ?? []).join('|')}|${c.calendar_offset ?? 0}`;
    if (!force && this._calKey === key && Date.now() - this._calAt < 30 * 60000) return;
    this._calKey = key; this._calAt = Date.now();
    const start = midnight(new Date()); start.setDate(start.getDate() - 60);
    const end = new Date(start); end.setDate(end.getDate() + 121);
    try {
      const r = await h.callWS({ type: 'call_service', domain: 'calendar', service: 'get_events', target: { entity_id: e },
        service_data: { start_date_time: start.toISOString(), end_date_time: end.toISOString() }, return_response: true });
      const words = [].concat(c.calendar_filter ?? []).map(w => String(w).trim().toLowerCase()).filter(Boolean);
      const evs = (r?.response?.[e]?.events || []).filter(ev => !words.length
        || words.some(w => String(ev.summary || '').toLowerCase().includes(w)));
      // all-day event: "2026-11-03" must stay a local date (otherwise UTC shifts it)
      this._cal = evs.map(ev => addDays(parseDate(String(ev.start?.date || ev.start?.dateTime || ev.start || '')) || new Date(NaN), c.calendar_offset))
        .filter(d => !isNaN(d));
    } catch (err) { this._cal = null; } // service unavailable: fall back to the entity's start_time
    this._render();
  }

  /* Holiday and Workday calendars (configured, or found automatically from the entity registry). */
  _calendars() {
    const c = this._c, h = this._hass, mode = this._rule?.holidays || 'none';
    if (!h || c.entity || mode === 'none') return { holiday: null, workday: null };
    return {
      holiday: c.holiday_calendar || findCalendar(h, 'holiday'),
      workday: HOLIDAY_NEEDS_WORKDAY.has(mode) ? (c.workday_calendar || findCalendar(h, 'workday')) : null,
    };
  }

  async _loadHolidays() {
    const h = this._hass; if (!h || !this._c) return;
    const { holiday, workday } = this._calendars();
    const key = `${holiday}|${workday}|${dayKey(new Date())}`;
    if (key === this._holKey) return;
    this._holKey = key;
    const [hol, work] = await Promise.all([calendarDays(h, holiday), calendarDays(h, workday)]);
    if (key !== this._holKey) return; // config changed meanwhile
    // échec de lecture (null alors qu'un calendrier est configuré) : on oublie la clé pour réessayer au prochain tour
    // (calendarDays garde l'échec en cache 10 min, puis relance vraiment la lecture)
    if ((holiday && !hol) || (workday && !work)) this._holKey = null;
    this._hol = hol; this._work = work;
    this._render();
  }

  getCardSize() { return 4; }
  getGridOptions() { return { columns: 6, rows: 'auto', min_columns: 3 }; }
  connectedCallback() {
    clearInterval(this._t);
    this._t = setInterval(() => { this._loadCal(); this._loadHolidays(); this._render(); }, 60000);
    this._render();
  }
  disconnectedCallback() { clearInterval(this._t); }

  _lang() { return cardLanguage(this._c?.language, this._hass); }

  _build() {
    const c = this._c, s = Number(c.scale), hr = Number(c.headroom ?? 70), B = PB_BINS[this._bin];
    const color = cssSafe(c.color) || B.color;
    const content = PB_CONTENT[CONTENT_ALIASES[c.content] || c.content] || PB_CONTENT[B.content];
    // full_color : tout le bac prend la couleur (et pas seulement le couvercle). Une couche de la couleur,
    // découpée à la forme du corps, colorise le gris en gardant ses ombres et ses reflets (mix-blend-mode: color).
    const img = String(c.image || '').trim();
    const paint = c.full_color && !this._bag && !this._bulky && !img ? (cssSafe(c.body_color) || B.paint || '') : '';
    // dark colours (burgundy) darken the grey body under the paint, which only sets hue and saturation
    const bodyF = cssSafe(c.body_filter) || (paint && !cssSafe(c.body_color) && B.paintBody) || B.body || '', lidF = cssSafe(c.lid_filter) || B.lid || '';
    const [bagCol, bagOp] = PB_BAG_COLORS[this._bin];
    const bodyImg = PB_IMG[B.img].body;
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>
    :host{display:block}
    ha-card{background:var(--poubelle-card-background,linear-gradient(170deg,rgba(30,36,56,.75),rgba(20,24,38,.7)));backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--poubelle-card-border-color,rgba(255,255,255,.08));border-radius:var(--ha-card-border-radius,22px);padding:12px 12px 14px;display:grid;gap:8px;justify-items:center;overflow:hidden;transition:box-shadow .6s,border-color .6s;animation:fadeUp .6s ease both;color:var(--poubelle-card-text-color,#eef1f8)}
    ${c.theme_background ? 'ha-card{background:var(--ha-card-background,var(--card-background-color));border:var(--ha-card-border-width,1px) solid var(--ha-card-border-color,var(--divider-color));color:var(--primary-text-color)}'
      // fond du thème (souvent clair) : textes des badges mélangés à la couleur de texte du thème, lisibles en clair comme en sombre
      // (préfixe ha-card : passe devant les règles .pill plus bas)
      + 'ha-card .pill{color:var(--poubelle-card-secondary-color,var(--secondary-text-color))}'
      + 'ha-card .pill.veille{color:color-mix(in srgb,#ff5a4e 65%,var(--primary-text-color))}ha-card .pill.jour{color:color-mix(in srgb,#3d7bff 65%,var(--primary-text-color))}ha-card .pill.videe{color:color-mix(in srgb,#3a9b3e 65%,var(--primary-text-color))}' : ''}
    ha-card.clickable{cursor:pointer}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    .card.veille{border-color:rgba(255,90,78,.55);box-shadow:0 0 0 1px rgba(255,90,78,.25),0 10px 34px rgba(255,90,78,.18)}
    .card.videe{border-color:rgba(76,175,80,.5);box-shadow:0 10px 34px rgba(76,175,80,.16)}
    .head{width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px}
    .name{font-weight:700;font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .pill{font-weight:600;font-size:11px;padding:4px 8px;border-radius:999px;background:rgba(127,127,127,.14);color:var(--poubelle-card-secondary-color,#9aa3b8);white-space:nowrap}
    .pill.veille{background:rgba(255,90,78,.18);color:#ffb3ad}.pill.jour{background:rgba(111,168,255,.18);color:#bcd4ff}.pill.videe{background:rgba(76,175,80,.18);color:#a8e0aa}
    .scaler{width:${150 * s}px;height:${(253 + hr) * s}px;position:relative}
    .stage-wrap{position:absolute;left:0;top:${-(70 - hr) * s}px;transform:scale(${s});transform-origin:0 0;width:150px;height:${253 + 70}px}
    /* ---- la poubelle ---- */
    .stage{position:relative;width:150px;height:253px;margin-top:70px}
    .bin{position:absolute;inset:0;transform-origin:50% 100%}
    .body{position:absolute;left:0;bottom:0;width:150px;z-index:2;filter:${bodyF} drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    /* .lift éclaircit les gris moyens (overlay blanc : le noir des roues reste noir), puis .paint les colore */
    .lift,.paint{position:absolute;left:0;bottom:0;width:150px;aspect-ratio:${PB_BODY_RATIO[B.img]};z-index:2;pointer-events:none;
      -webkit-mask:url("${bodyImg}") center/100% 100% no-repeat,${PB_WHEEL_HOLE};-webkit-mask-composite:source-in;
      mask:url("${bodyImg}") center/100% 100% no-repeat,${PB_WHEEL_HOLE};mask-composite:intersect;${paint ? '' : 'display:none'}}
    .lift{background:#fff;mix-blend-mode:overlay;opacity:.75}
    .paint{background:${paint || 'transparent'};mix-blend-mode:color}
    .trash{position:absolute;left:12px;right:12px;top:-44px;height:80px;z-index:1;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)}
    .lid{position:absolute;left:0;top:${B.img === 'yellow' ? 3 : 0}px;width:150px;z-index:3;transform-origin:92% 100%;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1);${lidF ? `filter:${lidF};` : ''}}
    .bagsvg{position:absolute;left:0;bottom:0;width:150px;height:253px;z-index:2;overflow:visible;filter:drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    .bagg{transform-origin:75px 250px;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)}
    .bagmode .fx{top:40px}
    .bulkysvg{position:absolute;left:0;bottom:0;width:150px;height:253px;z-index:2;overflow:visible;filter:drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    .bulkyg{transform-origin:75px 252px;transition:transform 1.1s cubic-bezier(.3,1.4,.5,1)}
    .custom{position:absolute;left:0;bottom:0;width:150px;height:253px;object-fit:contain;object-position:50% 100%;z-index:2;filter:drop-shadow(0 14px 16px rgba(0,0,0,.45))}
    .shadow{position:absolute;left:10px;right:10px;bottom:-8px;height:14px;border-radius:50%;background:rgba(0,0,0,.45);filter:blur(6px);z-index:0}
    .card.veille .bin{animation:shake 1.8s ease-in-out infinite}
    .card.jour .bin{animation:hop 1.1s ease-in-out infinite}
    .card.plein .trash{animation:wobble 2.6s ease-in-out infinite}
    @keyframes shake{0%,55%,100%{transform:rotate(0)}60%{transform:rotate(-4deg)}66%{transform:rotate(3.5deg)}72%{transform:rotate(-3deg)}78%{transform:rotate(2deg)}84%{transform:rotate(-1deg)}}
    @keyframes hop{0%,100%{transform:translateY(0)}45%{transform:translateY(-8px)}}
    @keyframes wobble{0%,100%{rotate:0deg}50%{rotate:-1.5deg}}
    /* mouches + odeurs quand c'est plein */
    .fx{position:absolute;inset:-95px -20px auto -20px;height:110px;z-index:4;pointer-events:none;opacity:0;transition:opacity .6s}
    .card.plein .fx{opacity:1}
    .fly{position:absolute;width:5px;height:5px;border-radius:50%;background:#0b0b0b;box-shadow:0 0 0 1px rgba(255,255,255,.25)}
    .fly::before,.fly::after{content:"";position:absolute;top:-3px;width:5px;height:4px;border-radius:50%;background:rgba(220,235,255,.55)}
    .fly::before{left:-3px}.fly::after{right:-3px}
    .f1{animation:orbit1 3.2s linear infinite}.f2{animation:orbit2 2.6s linear infinite}.f3{animation:orbit1 4.1s linear infinite reverse}
    @keyframes orbit1{0%{transform:translate(40px,60px)}25%{transform:translate(110px,30px)}50%{transform:translate(160px,70px)}75%{transform:translate(90px,95px)}100%{transform:translate(40px,60px)}}
    @keyframes orbit2{0%{transform:translate(150px,40px)}33%{transform:translate(70px,20px)}66%{transform:translate(120px,90px)}100%{transform:translate(150px,40px)}}
    .stink{position:absolute;bottom:18px;width:14px;height:40px;opacity:0;animation:rise 2.8s ease-in infinite}
    .stink svg{width:100%;height:100%}
    .s1{left:60px}.s2{left:100px;animation-delay:1s}.s3{left:135px;animation-delay:1.8s}
    @keyframes rise{0%{transform:translateY(20px);opacity:0}30%{opacity:.8}100%{transform:translateY(-30px);opacity:0}}
    /* étincelles quand c'est vidé */
    .spark{position:absolute;z-index:4;width:14px;height:14px;opacity:0;pointer-events:none}
    .card.videe .spark{animation:twinkle 2.4s ease-in-out infinite}
    .sp1{left:6px;top:40px}.sp2{right:8px;top:70px;animation-delay:.8s!important}.sp3{left:40px;top:4px;animation-delay:1.5s!important}
    @keyframes twinkle{0%,100%{opacity:0;transform:scale(.4) rotate(0)}40%{opacity:1;transform:scale(1) rotate(45deg)}}
    .status{font-size:13px;font-weight:600;text-align:center;min-height:1.3em}
    .warn{font-size:11px;text-align:center;color:var(--warning-color,#ffa600)}.warn[hidden]{display:none}
    .meter{width:100%;display:grid;gap:4px}
    .meter-top{display:flex;justify-content:space-between;color:var(--poubelle-card-secondary-color,#9aa3b8);font-size:11px;font-variant-numeric:tabular-nums}
    .bar{height:6px;border-radius:99px;background:rgba(127,127,127,.14);overflow:hidden}
    .bar i{display:block;height:100%;border-radius:99px;transition:width 1.1s ease;background:${color}}
    ${c.show_meter === false ? '.meter{display:none}' : ''}
    ${c.show_status === false ? '.status{display:none}' : ''}
    ${c.compact ? 'ha-card{padding:8px 10px 10px;gap:4px}.status{font-size:12px}' : ''}
    @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
    </style>
    <ha-card class="card${c.entity ? ' clickable' : ''}"><div class="head"><span class="name"></span><span class="pill"></span></div>
     <div class="scaler"><div class="stage-wrap"><div class="stage${this._bag || this._bulky || img ? ' bagmode' : ''}">
      <div class="fx">${PB_FX_FLY}${PB_FX_STINK}</div>${PB_FX_SPARK}<div class="shadow"></div>
      <div class="bin">${img ? `<img class="custom" src="${img.replace(/["<>]/g, '')}" alt="">` : this._bulky ? PB_BULKY_SVG : this._bag ? pbBagSvg(bagCol, bagOp, content) : `<div class="trash">${content}</div>
       <img class="body" src="${bodyImg}" alt=""><div class="lift"></div><div class="paint"></div><img class="lid" src="${PB_IMG[B.img].lid}" alt="">`}</div>
     </div></div></div>
     <div class="status"></div><div class="warn" hidden></div>
     <div class="meter"><div class="meter-top"><span class="ml"></span><span class="pct"></span></div><div class="bar"><i></i></div></div>
    </ha-card>`;
    this.shadowRoot.querySelector('ha-card').addEventListener('click', () => {
      if (!this._c.entity) return;
      this.dispatchEvent(new CustomEvent('hass-more-info', { bubbles: true, composed: true, detail: { entityId: this._c.entity } }));
    });
    this._render();
  }

  /* Next pickup date read from an entity (null if unknown) */
  _entityDate() {
    const st = this._hass?.states?.[this._c.entity];
    if (!st) return null;
    const a = st.attributes || {}, s = st.state;
    const today = midnight(new Date());
    const fromDays = n => addDays(today, Number(n));
    // nombre de jours : null, '', 'unknown' ou 'unavailable' ne valent pas 0 (« aujourd'hui »)
    const isNum = v => v != null && typeof v !== 'boolean' && String(v).trim() !== '' && isFinite(Number(v));
    if (isNum(a.daysTo)) return fromDays(a.daysTo);                                      // Waste Collection Schedule
    if (st.entity_id.startsWith('calendar.')) return a.start_time ? addDays(new Date(String(a.start_time).replace(' ', 'T')), this._c.calendar_offset) : null;
    if (st.entity_id.startsWith('input_datetime.') && a.year) return new Date(a.year, a.month - 1, a.day);
    if (s === 'unknown' || s === 'unavailable' || s === '' || s == null) return null;
    if (isNum(s)) return fromDays(s);                                                    // number of days
    const lower = String(s).toLowerCase();
    if (['today', "aujourd'hui", 'aujourdhui'].includes(lower)) return today;
    if (['tomorrow', 'demain'].includes(lower)) return fromDays(1);
    for (const k of ['nextDate', 'next_date', 'next_collection', 'date']) { const d = a[k] != null ? parseDate(a[k]) : null; if (d) return d; }   // date attributes
    const txt = String(s).trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(txt)) return parseDate(txt);                           // ISO date / timestamp
    // texte libre (Waste Collection Schedule : « on Thu, 03.12.2026 », « dans 3 jours »…) : jour.mois.année (ou /, -), année sur 2 chiffres acceptée
    // date ISO dans le texte (« Restmüll on 2026-11-04 ») d'abord : sinon jour.mois.année lirait 26-11-04
    const iso = txt.match(/(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/);
    if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
    const dmy = txt.match(/(?<!\d)(\d{1,2})[./-](\d{1,2})[./-](\d{4}|\d{2})(?!\d)/);
    if (dmy) {
      const y = Number(dmy[3]) < 100 ? 2000 + Number(dmy[3]) : Number(dmy[3]), m = Number(dmy[2]), dd = Number(dmy[1]);
      const dt = new Date(y, m - 1, dd);
      if (m >= 1 && m <= 12 && dt.getMonth() === m - 1) return dt;
    }
    const inDays = lower.match(/(?:\bin\b|\bdans\b|\ben\b|\bover\b|\bza\b)\s+(\d+)\s*(?:day|jour|tag|dag|d[ií]a|giorn)/);
    if (inDays) return fromDays(inDays[1]);
    if (['heute', 'hoy', 'oggi', 'vandaag'].includes(lower)) return today;
    if (['morgen', 'mañana', 'domani'].includes(lower)) return fromDays(1);
    return parseDate(s);                                                                 // date / timestamp
  }

  /* Card state: { state: ''|'eve'|'today'|'emptied'|'unknown', n, fill, moved } */
  _compute() {
    const c = this._c, now = new Date();
    const h = now.getHours() + now.getMinutes() / 60, H = Number(c.hour);
    if (c.entity && this._cal) {
      // calendar: real next and last pickups, as with a fixed schedule
      const ks = this._cal.map(d => daysBetween(now, d));
      const next = ks.filter(k => k > 0 || (k === 0 && h < H)).sort((a, b) => a - b)[0];
      const last = ks.filter(k => k < 0 || (k === 0 && h >= H)).sort((a, b) => b - a)[0];
      if (next === undefined) return { state: last === 0 ? 'emptied' : 'unknown', n: null, fill: 0 };
      const n = next;
      if (n === 0) return { state: 'today', n, fill: 1 };
      // no earlier pickup in the calendar: estimate the fill from interval
      if (last === undefined) return { state: n === 1 ? 'eve' : '', n, fill: Math.max(0, 1 - n / Math.max(1, Number(c.interval) || 7)) };
      if (last === 0) return { state: 'emptied', n, fill: 0 };
      return { state: n === 1 ? 'eve' : '', n, fill: Math.min(1, Math.max(0, -last / (n - last))) };
    }
    if (c.entity) {
      const d = this._entityDate();
      if (!d) return { state: 'unknown', n: null, fill: 0 };
      const n = daysBetween(now, d);
      const I = Math.max(1, Number(c.interval) || 7);
      if (n < 0) return { state: 'unknown', n: null, fill: 0 };
      if (n === 0) return h < H ? { state: 'today', n, fill: 1 } : { state: 'emptied', n, fill: 0 };
      // far-off pickup (n >= interval): empty bin but date shown, not "emptied today"
      return { state: n === 1 ? 'eve' : '', n, fill: Math.min(1, Math.max(0, 1 - n / I)) };
    }
    const extra = new Set([].concat(c.holiday_dates ?? []).map(v => { const d = parseDate(v); return d ? dayKey(d) : String(v); }));
    const hol = this._hol, work = this._work;
    return computeFixed(this._rule, now, {
      isHoliday: d => extra.has(dayKey(d)) || !!hol?.has(dayKey(d)),
      isWorkday: d => (work ? work.has(dayKey(d)) : null),
    });
  }

  /* Warning shown when the holiday mode needs a calendar that doesn't exist */
  _warning(lang) {
    const mode = this._rule?.holidays || 'none';
    if (this._c.entity || mode === 'none' || !this._hass?.entities) return '';
    const { holiday, workday } = this._calendars();
    if (!holiday && !(this._c.holiday_dates || []).length) return t(lang, 'card.warn_no_holiday_calendar');
    if (HOLIDAY_NEEDS_WORKDAY.has(mode) && !workday) return t(lang, 'card.warn_no_workday_calendar');
    return '';
  }

  _render() {
    const r = this.shadowRoot; if (!r || !this._c) return;
    const q = x => r.querySelector(x), { lang, dateLocale } = this._lang(), now = new Date();
    const { state, n, fill, moved } = this._compute();
    let pill, text;
    if (state === 'unknown') { pill = '—'; text = t(lang, 'card.unknown'); }
    else if (state === 'emptied') { pill = t(lang, 'card.emptied'); text = t(lang, 'card.emptied_txt'); }
    else if (state === 'today') { pill = t(lang, 'card.today'); text = t(lang, 'card.today_txt'); }
    else if (state === 'eve') { pill = t(lang, 'card.eve'); text = t(lang, 'card.eve_txt'); }
    else {
      const d = addDays(midnight(now), n);
      pill = t(lang, 'card.in_days', { n });
      text = n < 7 ? t(lang, 'card.next_weekday', { day: weekdayName(dateLocale, weekdayIdx(d)) })
        : t(lang, 'card.next_date', { date: shortDate(dateLocale, d) });
    }
    const cls = STATE_CLASS[state] ?? '';
    q('ha-card').className = 'card ' + cls + (fill >= 0.6 && state !== 'emptied' ? ' plein' : '') + (this._c.entity ? ' clickable' : '');
    q('.name').textContent = this._c.name || (this._bulky ? t(lang, 'card.bulky') : t(lang, `card.${this._bag ? 'bag' : 'bin'}.${this._bin}`));
    const p = q('.pill'); p.className = 'pill ' + cls; p.textContent = pill;
    q('.status').textContent = moved && state !== 'emptied' ? `${text} · ${t(lang, 'card.moved')}` : text;
    const w = this._warning(lang), we = q('.warn'); we.textContent = w; we.hidden = !w;
    q('.ml').textContent = t(lang, 'card.fill');
    const f = state === 'emptied' ? 0 : (state === 'today' ? 1 : fill), pct = Math.round(f * 100);
    q('.pct').textContent = pct + ' %'; q('.bar i').style.width = pct + '%';
    const peek = f * 72;
    if (String(this._c.image || '').trim()) return; // custom image: no animation of the drawing
    if (this._bulky) {
      // the pile grows with the fill level: a few items at first, a big heap the day before pickup
      q('.bulkyg').style.transform = `scale(${(0.72 + 0.28 * f).toFixed(3)})`;
      return;
    }
    if (this._bag) {
      // the bag inflates with the fill level: flat and crumpled when empty, round when full
      q('.bagg').style.transform = `scale(${(0.82 + 0.18 * f).toFixed(3)}, ${(0.38 + 0.62 * f).toFixed(3)})`;
      return;
    }
    q('.trash').style.transform = `translateY(${86 - peek}px)`;
    q('.lid').style.transform = f > 0.25 ? `translateY(${-peek * 0.85}px) rotate(${-f * 26}deg)` : 'none';
  }
}

customElements.define(TAG, PoubelleCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === TAG))
  window.customCards.push({ type: TAG, name: 'Appliance – Poubelle / Bin collection', preview: true,
    description: 'Animated bin that fills up and empties with your collection days',
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards/blob/main/docs/cards/poubelle.md' });

})();
