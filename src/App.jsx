import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORIES, FAQ_ITEMS, HOURS, MENU_DATA, RESTAURANT, TABLE_DISHES } from './data.js';
import { getServiceStatus } from './hours.js';
import { askConcierge, groundedReply, isLive } from './concierge.js';
import { useTheme } from './hooks.js';
import Concierge from './Concierge.jsx';
import DishModal from './DishModal.jsx';
import MenuFlipbook from './MenuFlipbook.jsx';
import Reservation from './Reservation.jsx';
import LandingPage from './LandingPage.jsx';

const MarbleTable3D = lazy(() => import('./MarbleTable3D.jsx'));

const NAV = [
  { id: 'restaurant-app', label: 'Restaurant' },
  { id: 'table', label: 'The Table' },
  { id: 'menu', label: 'Menu' },
  { id: 'visit', label: 'Visit' },
  { id: 'reservations', label: 'Reservations' }
];

const GREETING = {
  role: 'assistant',
  content: "Bonsoir. I'm your ÉTOILE ROYALE sommelier. Tell me what you love—rich and buttery, lean and tender, or bold and smoky—and I'll find your cut, doneness and perfect pairing.",
  recommendedIds: ['wagyu-ribeye', 'the-royal-experience']
};

export default function App() {
  const scrollToApp = () => {
    document.getElementById('restaurant-app')?.scrollIntoView({ behavior: 'smooth' });
  };

  const [theme, toggleTheme] = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('table');
  const [status, setStatus] = useState(() => getServiceStatus());

  const [tableIdx, setTableIdx] = useState(0);
  const [autoTour, setAutoTour] = useState(false);
  const [ticket, setTicket] = useState([]);
  const [doneness, setDoneness] = useState('Medium-Rare');
  const [menuPage, setMenuPage] = useState(0);

  const [category, setCategory] = useState('All');
  const [chefOnly, setChefOnly] = useState(false);
  const [glutenFreeOnly, setGlutenFreeOnly] = useState(false);
  const [query, setQuery] = useState('');
  const [modalDish, setModalDish] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', date: '', time: '19:30',
    guests: '2 Guests', seating: 'Le Grand Salon', dishId: 'wagyu-ribeye', notes: ''
  });

  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [lang, setLang] = useState('EN');
  const [messages, setMessages] = useState([GREETING]);
  const [typing, setTyping] = useState(false);
  const [chatError, setChatError] = useState('');
  const [provider, setProvider] = useState(isLive ? 'live' : 'grounded');

  useEffect(() => {
    const id = setInterval(() => setStatus(getServiceStatus()), 60000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
      if (modalDish || chatOpen) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        setAutoTour(false);
        setTableIdx((i) => (i - 1 + TABLE_DISHES.length) % TABLE_DISHES.length);
      } else if (e.key === 'ArrowRight') {
        setAutoTour(false);
        setTableIdx((i) => (i + 1) % TABLE_DISHES.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalDish, chatOpen]);

  const showToast = useCallback((text) => {
    setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3400);
  }, []);

  const goTo = (id) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView();
  };

  const inspectOn3D = (dish) => {
    setModalDish(null);
    setChatOpen(false);
    if (dish.tableIndex !== null) {
      setAutoTour(false);
      setTableIdx(dish.tableIndex);
      goTo('table');
      showToast(`The table now shows ${dish.name}.`);
    } else {
      setCategory(dish.category);
      goTo('menu');
      showToast(`Showing ${dish.name} in the menu.`);
    }
  };

  const reserveWith = (dish) => {
    setModalDish(null);
    setForm((f) => ({ ...f, dishId: dish.id }));
    goTo('reservations');
    showToast(`${dish.name} added to your reservation request.`);
  };

  const sendPrompt = useCallback(
    async (text) => {
      const clean = text.trim();
      if (!clean || typing) return;
      setChatError('');
      const next = [...messages, { role: 'user', content: clean }];
      setMessages(next);
      setTyping(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      const push = (r) => {
        setProvider(r.provider);
        setMessages((prev) => [...prev, { role: 'assistant', content: r.text, recommendedIds: r.recommendedIds }]);
      };
      try {
        push(await askConcierge({ messages: next, lang, signal: controller.signal }));
      } catch (err) {
        setChatError(err.name === 'AbortError'
          ? 'The AI sommelier took too long to reply.'
          : err.message || 'The concierge service could not be reached.');
        push(groundedReply(clean, lang));
      } finally {
        clearTimeout(timeout);
        setTyping(false);
      }
    },
    [messages, typing, lang]
  );

  const askAbout = (dish) => {
    setModalDish(null);
    setChatOpen(true);
    sendPrompt(`Tell me about ${dish.name} (€${dish.price}), its flavour profile and the best pairing.`);
  };

  const spotlight = TABLE_DISHES[tableIdx] || TABLE_DISHES[0];

  const filteredMenu = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU_DATA.filter((d) => {
      if (category !== 'All' && d.category !== category) return false;
      if (chefOnly && !d.chefRecommended) return false;
      if (glutenFreeOnly && !d.glutenFree) return false;
      if (q && !`${d.name} ${d.category} ${d.description} ${d.ingredients.join(' ')}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, chefOnly, glutenFreeOnly, query]);

  const addToTicket = useCallback((dish, temperature = doneness) => {
    setTicket((current) => {
      const existing = current.find((item) => item.id === dish.id && item.temperature === temperature);
      return existing
        ? current.map((item) => item === existing ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { id: dish.id, name: dish.name, price: dish.price, temperature, quantity: 1 }];
    });
    showToast(`${dish.name} added to your table ticket.`);
  }, [doneness, showToast]);

  const inspectProp = useCallback((prop) => {
    if (prop === 'menu') {
      goTo('menu');
      showToast('The carte is open. Turn a page to explore the menu.');
    } else if (prop === 'ticket') {
      showToast(ticket.length ? `${ticket.length} selection${ticket.length === 1 ? '' : 's'} on your ticket.` : 'Your ticket is ready for its first cut.');
    } else {
      const notes = {
        chimichurri: 'Chimichurri: bright parsley, garlic and red-wine vinegar.',
        pepper: 'Black pepper jus: cracked Kampot pepper with a cognac finish.',
        butter: 'Garlic butter: cultured Normandy butter, roasted garlic and thyme.',
        salt: 'Smoked sea salt: a crisp mineral finish for the charcoal crust.',
        steak: 'Our signature steak is seared over Kishu Binchotan charcoal.'
      };
      showToast(notes[prop] || 'A detail from the Étoile table.');
    }
  }, [showToast, ticket.length]);

  const resetFilters = () => {
    setCategory('All');
    setChefOnly(false);
    setGlutenFreeOnly(false);
    setQuery('');
  };

  const providerLabel = provider === 'live'
    ? 'LIVE AI · tailored to your palate'
    : chatError ? 'HOUSE MODE · local menu guide' : isLive ? 'Connecting to your restaurant AI' : 'HOUSE MODE · connect your AI endpoint';

  return (
    <>
      {/* Landing Page - Full sections as part of scroll */}
      <LandingPage onEnter={scrollToApp} />

      {/* Restaurant App - starts here after landing */}
      <div id="restaurant-app">
        <a href="#table" className="skip-link">Skip to content</a>

        <header className="site-header">
          <div className="container header-inner">
            <a href="#table" className="brand" aria-label="ÉTOILE ROYALE, Luxembourg City">
              <span className="brand-name">ÉTOILE ROYALE</span>
              <span className="brand-place">Luxembourg City</span>
            </a>

            <nav aria-label="Primary" className="nav-desktop">
              {NAV.slice(1).map((n) => (
                <a key={n.id} href={`#${n.id}`} aria-current={activeSection === n.id ? 'location' : undefined}>
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="header-actions">
              <button type="button" className="btn btn-quiet btn-sm hide-sm" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
              <button type="button" className="btn btn-quiet btn-sm hide-sm" onClick={() => setChatOpen(true)}>
                Concierge
              </button>
              <a href="#reservations" className="btn btn-primary btn-sm hide-sm">Reserve</a>
              <button type="button" className="btn btn-quiet btn-sm show-sm" aria-expanded={navOpen} aria-controls="mobile-nav" onClick={() => setNavOpen(!navOpen)}>
                {navOpen ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>

          {navOpen && (
            <nav id="mobile-nav" aria-label="Mobile" className="nav-mobile">
              {NAV.slice(1).map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setNavOpen(false)} aria-current={activeSection === n.id ? 'location' : undefined}>
                  {n.label}
                </a>
              ))}
              <button type="button" className="btn" onClick={() => { setNavOpen(false); setChatOpen(true); }}>Concierge</button>
              <button type="button" className="btn" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
                {theme === 'dark' ? 'Light theme' : 'Dark theme'}
              </button>
            </nav>
          )}
        </header>

        <main id="main">
          <section id="table" className="section hero">
            <div className="container">
              <div className="hero-top">
                <div>
                  <p className="hero-eyebrow">BINCHOTAN • DRY-AGED • LUXEMBOURG</p>
                  <h1 className="display">A little fire.<br />A lot of <em>character.</em></h1>
                </div>
                <div className="hero-side">
                  <p className="lede">
                    {RESTAURANT.tagline} Miyazaki A5, 45-day dry-age and the theatre of live fire in the heart of Ville Haute.
                  </p>
                  <p className="status">
                    <span className={`status-dot ${status.open ? 'is-open' : ''}`} aria-hidden="true" />
                    <span>{status.label}</span>
                    <span className="status-sep">·</span>
                    <span>{RESTAURANT.address}</span>
                  </p>
                  <div className="actions">
                    <a href="#reservations" className="btn btn-primary btn-pill">Reserve a table</a>
                    <a href="#menu" className="btn">View the menu</a>
                  </div>
                  <button type="button" className="sommelier-teaser" onClick={() => setChatOpen(true)}>
                    <span className="sommelier-teaser-mark" aria-hidden="true">✦</span>
                    <span><b>Meet your AI sommelier</b><small>Tell us what you love. Find your perfect cut.</small></span>
                    <span className="sommelier-teaser-arrow" aria-hidden="true">↗</span>
                  </button>
                </div>
              </div>

              <div className="hero-main">
                <Suspense fallback={<div className="stage stage-loading">Loading the 3D table…</div>}>
                  <MarbleTable3D
                    dishes={TABLE_DISHES}
                    activeIndex={tableIdx}
                    onSelectDish={setTableIdx}
                    autoTour={autoTour}
                    onToggleAutoTour={setAutoTour}
                    ticket={ticket}
                    doneness={doneness}
                    onDoneness={setDoneness}
                    onAddDish={addToTicket}
                    onInspectProp={inspectProp}
                    onOpenMenu={() => inspectProp('menu')}
                  />
                </Suspense>

                <article className="spotlight" aria-label="Selected course">
                  <p className="meta">{spotlight.category}</p>
                  <div className="row-head">
                    <h2 className="spot-title">{spotlight.name}</h2>
                    <span className="price">€{spotlight.price}</span>
                  </div>
                  <p className="spot-copy">{spotlight.description}</p>
                  <dl className="facts">
                    <div><dt>Portion</dt><dd>{spotlight.weight}</dd></div>
                    <div><dt>Preparation</dt><dd>{spotlight.recommendedTemp}</dd></div>
                    <div><dt>Pairing</dt><dd>{spotlight.pairing}</dd></div>
                  </dl>
                  <div className="actions">
                    <button type="button" className="btn btn-primary" onClick={() => reserveWith(spotlight)}>Book with this dish</button>
                    <button type="button" className="btn" onClick={() => askAbout(spotlight)}>Ask the concierge</button>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section id="menu" className="section section-alt">
            <div className="container">
              <header className="section-head">
                <div>
                  <p className="hero-eyebrow">THE ÉTOILE CUT BOOK</p>
                  <h2 className="h2">Turn up the heat.</h2>
                </div>
                <p className="meta">{filteredMenu.length} selections · all prices in EUR</p>
              </header>

              <div className="filters">
                <div className="filter-group" role="group" aria-label="Category">
                  {['All', ...CATEGORIES].map((c) => (
                    <button key={c} type="button" className="btn btn-quiet btn-sm" aria-pressed={category === c} onClick={() => setCategory(c)}>
                      {c === 'All' ? `All ${MENU_DATA.length}` : c}
                    </button>
                  ))}
                </div>
                <div className="filter-group">
                  <button type="button" className="btn btn-quiet btn-sm" aria-pressed={chefOnly} onClick={() => setChefOnly(!chefOnly)}>
                    Chef's choice
                  </button>
                  <button type="button" className="btn btn-quiet btn-sm" aria-pressed={glutenFreeOnly} onClick={() => setGlutenFreeOnly(!glutenFreeOnly)}>
                    Gluten-free
                  </button>
                  <label htmlFor="menu-search" className="sr-only">Search the menu</label>
                  <input id="menu-search" type="search" className="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Wagyu, truffle…" />
                </div>
              </div>

              <MenuFlipbook
                items={filteredMenu}
                page={menuPage}
                onPage={setMenuPage}
                onDetails={setModalDish}
                onReserve={reserveWith}
                onClearFilters={resetFilters}
              />
            </div>
          </section>

          <section id="visit" className="section">
            <div className="container visit-grid">
              <div className="visit-text">
                <h2 className="h2">Salon Privé Royal</h2>
                <p className="lede-dark">
                  Eight to sixteen guests, in complete privacy at {RESTAURANT.address.split(',')[0]}. Executive Chef Laurent Beaumont writes a bespoke five-course menu, with a dedicated sommelier.
                </p>
                <button type="button" className="btn btn-primary" onClick={() => { setForm((f) => ({ ...f, guests: '8–16 Guests (Salon Privé Royal)', seating: 'Salon Privé Royal' })); goTo('reservations'); }}>
                  Request the Salon Privé
                </button>

                <h3 className="label mt">Opening hours</h3>
                <dl className="hours">
                  {HOURS.map(([day, time]) => (
                    <div key={day}><dt>{day}</dt><dd>{time}</dd></div>
                  ))}
                </dl>
                <h3 className="label mt">Dress code</h3>
                <p className="dish-copy">{RESTAURANT.dressCode}</p>
              </div>

              <div className="faq">
                <h3 className="label">Questions</h3>
                {FAQ_ITEMS.map((f, i) => (
                  <div key={f.q} className="faq-item">
                    <h4>
                      <button type="button" className="faq-q" aria-expanded={openFaq === i} aria-controls={`faq-${i}`} onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                        <span>{f.q}</span>
                        <span aria-hidden="true">{openFaq === i ? '–' : '+'}</span>
                      </button>
                    </h4>
                    {openFaq === i && <p id={`faq-${i}`} className="faq-a">{f.a}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="reservations" className="section section-alt">
            <div className="container">
              <header className="section-head stack">
                <h2 className="h2">Reserve your table</h2>
                <p className="lede-dark">Tell us when and how many. We confirm every request personally.</p>
              </header>
              <Reservation form={form} setForm={setForm} />
            </div>
          </section>
        </main>

        <footer className="site-footer">
          <div className="container footer-inner">
            <div>
              <p className="brand-name">{RESTAURANT.name}</p>
              <p>{RESTAURANT.address}</p>
              <p>
                <a href={`tel:${RESTAURANT.phone.replace(/\s/g, '')}`}>{RESTAURANT.phone}</a> · <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
              </p>
            </div>
            <p className="meta">Tue–Fri 18:00–23:30 · Sat 12:00–15:00 & 18:00–00:00 · Sun 18:00–22:30 · Closed Mondays</p>
          </div>
        </footer>
      </div>

      <DishModal dish={modalDish} onClose={() => setModalDish(null)} onReserve={reserveWith} onInspect={inspectOn3D} />

      {!chatOpen && (
        <button type="button" className="launcher btn btn-primary" onClick={() => setChatOpen(true)}>
          ✦ Ask the Sommelier
        </button>
      )}
      {chatOpen && <button type="button" className="concierge-backdrop" aria-label="Close AI sommelier" onClick={() => setChatOpen(false)} />}
      <Concierge
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        lang={lang}
        onLang={setLang}
        messages={messages}
        typing={typing}
        error={chatError}
        providerLabel={providerLabel}
        onSend={sendPrompt}
        onPickDish={(dish) => (dish.tableIndex !== null ? inspectOn3D(dish) : setModalDish(dish))}
        onAddDish={addToTicket}
      />

      {toast && (
        <div role="status" className="toast">
          {toast}
        </div>
      )}
    </>
  );
}

