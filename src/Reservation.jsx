import { useMemo, useState, useEffect } from 'react';
import { MENU_DATA, RESTAURANT } from './data.js';

const SALON = 'Salon Privé Royal';
const BIG_PARTY = '8–16 Guests (Salon Privé Royal)';
const GUESTS = ['1 Guest', '2 Guests', '3 Guests', '4 Guests', '6 Guests', BIG_PARTY];
const SEATING = ['Le Grand Salon', 'Velvet Royal Alcove', 'Binchotan Hearth Counter', SALON];

const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function timesFor(date) {
  if (!date) return ['12:00', '13:30', '18:00', '19:30', '20:30', '21:30', '22:30'];
  const day = new Date(`${date}T12:00:00`).getDay();
  if (day === 1) return [];
  if (day === 0) return ['18:00', '19:30', '20:30', '21:30'];
  if (day === 6) return ['12:00', '13:30', '18:00', '19:30', '21:00', '22:30'];
  return ['18:00', '19:30', '20:30', '21:30', '22:30'];
}

export default function Reservation({ form, setForm }) {
  const [error, setError] = useState('');
  const [prepared, setPrepared] = useState(false);
  const [period, setPeriod] = useState('dinner');
  const today = useMemo(localToday, []);
  const times = useMemo(() => timesFor(form.date), [form.date]);
  const closed = form.date && times.length === 0;
  const availableTimes = times.filter((time) => period === 'lunch' ? time < '16:00' : time >= '16:00');
  const dish = MENU_DATA.find((m) => m.id === form.dishId) || MENU_DATA[0];

  useEffect(() => {
    if (period === 'lunch' && form.date && new Date(`${form.date}T12:00:00`).getDay() !== 6) {
      setPeriod('dinner');
      return;
    }
    if (availableTimes.length && !availableTimes.includes(form.time)) {
      setForm((f) => ({ ...f, time: availableTimes.includes('19:30') ? '19:30' : availableTimes[0] }));
    }
  }, [availableTimes, form.date, form.time, period, setForm]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setGuests = (e) => {
    const guests = e.target.value;
    setForm({ ...form, guests, seating: guests === BIG_PARTY ? SALON : form.seating === SALON ? SEATING[0] : form.seating });
  };
  const setSeating = (e) => {
    const seating = e.target.value;
    setForm({ ...form, seating, guests: seating === SALON ? BIG_PARTY : form.guests === BIG_PARTY ? '2 Guests' : form.guests });
  };

  const submit = (e) => {
    e.preventDefault();
    setPrepared(false);
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.date) {
      setError('Please add your name, email, phone number and a date.');
      return;
    }
    if (closed) {
      setError('ÉTOILE ROYALE is closed on Mondays. Please choose Tuesday to Sunday.');
      return;
    }
    if (form.date < today) {
      setError('Please choose today or a later date.');
      return;
    }
    setError('');
    const body = [
      'Reservation request',
      '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Date: ${form.date} at ${form.time}`,
      `Party: ${form.guests}`,
      `Seating: ${form.seating}`,
      `Dish of interest: ${dish.name} (€${dish.price})`,
      `Notes: ${form.notes || 'None'}`
    ].join('\n');
    window.location.href = `mailto:${RESTAURANT.email}?subject=${encodeURIComponent('Reservation request')}&body=${encodeURIComponent(body)}`;
    setPrepared(true);
  };

  return (
    <div className="res-grid">
      <form onSubmit={submit} className="res-form" noValidate>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="schedule-picker">
          <div className="schedule-heading">
            <div><p className="hero-eyebrow">PICK YOUR SERVICE</p><h3>Choose a seating</h3></div>
            <span className="schedule-note">Requests confirmed personally</span>
          </div>
          <div className="schedule-cards">
            <button type="button" className="schedule-card" aria-pressed={period === 'lunch'} disabled={Boolean(closed) || Boolean(form.date && new Date(`${form.date}T12:00:00`).getDay() !== 6)} onClick={() => { setPeriod('lunch'); if (times.includes('12:00')) setForm((f) => ({ ...f, time: '12:00' })); }}>
              <span className="schedule-symbol">☀</span><strong>Long lunch</strong><span>Saturday · 12:00–15:00</span>
            </button>
            <button type="button" className="schedule-card" aria-pressed={period === 'dinner'} disabled={Boolean(closed)} onClick={() => { setPeriod('dinner'); setForm((f) => ({ ...f, time: times.includes('19:30') ? '19:30' : times.find((time) => time >= '16:00') || '18:00' })); }}>
              <span className="schedule-symbol">✦</span><strong>Firelight dinner</strong><span>Tue–Sun · 18:00 onwards</span>
            </button>
          </div>
          <div className="seating-choice">
            <span>Table mood</span>
            {['Binchotan Hearth Counter', 'Velvet Royal Alcove', 'Le Grand Salon'].map((seat) => (
              <button key={seat} type="button" className="seat-chip" aria-pressed={form.seating === seat} onClick={() => setForm((current) => ({ ...current, seating: seat, guests: current.guests === BIG_PARTY ? '2 Guests' : current.guests }))}>
                {seat === 'Binchotan Hearth Counter' ? 'Grill-side' : seat === 'Velvet Royal Alcove' ? 'Velvet booth' : 'Grand salon'}
              </button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="r-name">Full name</label>
            <input id="r-name" type="text" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your Name" required />
          </div>
          <div className="field">
            <label htmlFor="r-email">Email</label>
            <input id="r-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="email@example.com" required />
          </div>
        </div>

        <div className="field-row three">
          <div className="field">
            <label htmlFor="r-phone">Phone</label>
            <input id="r-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="+352 …" required />
          </div>
          <div className="field">
            <label htmlFor="r-date">Date (closed Mondays)</label>
            <input id="r-date" type="date" min={today} value={form.date} onChange={set('date')} required />
          </div>
          <div className="field">
            <label htmlFor="r-time">Seating time</label>
            <select id="r-time" value={form.time} onChange={set('time')} disabled={closed}>
              {closed ? <option>Closed on Mondays</option> : availableTimes.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="r-guests">Party size</label>
            <select id="r-guests" value={form.guests} onChange={setGuests}>
              {GUESTS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="r-seat">Seating</label>
            <select id="r-seat" value={form.seating} onChange={setSeating}>
              {SEATING.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="r-dish">Dish of interest</label>
          <select id="r-dish" value={form.dishId} onChange={set('dishId')}>
            {MENU_DATA.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, €{d.price}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="r-notes">Allergies and special requests</label>
          <textarea id="r-notes" rows={3} value={form.notes} onChange={set('notes')} placeholder="Allergies, vegetarian risotto, steak doneness…" />
        </div>

        <button type="submit" className="btn btn-primary btn-wide">
          Prepare reservation email
        </button>
        <p className="meta">This opens your email app with the request written out. The restaurant confirms by reply; nothing is booked until then.</p>
      </form>

      <aside className="res-summary" aria-label="Reservation summary">
        <h3 className="summary-title">Your request</h3>
        <dl className="facts">
          <div><dt>Guest</dt><dd>{form.name || 'Not yet entered'}</dd></div>
          <div><dt>When</dt><dd>{form.date ? `${form.date}, ${closed ? 'closed' : form.time}` : 'Choose a date'}</dd></div>
          <div><dt>Party</dt><dd>{form.guests}, {form.seating}</dd></div>
          <div><dt>Dish</dt><dd>{dish.name} (€{dish.price})</dd></div>
        </dl>
        {prepared && (
          <p className="notice" role="status">
            Your email app should now be open with the request ready to send. If nothing opened, write to{' '}
            <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a> or call {RESTAURANT.phone}.
          </p>
        )}
      </aside>
    </div>
  );
}
