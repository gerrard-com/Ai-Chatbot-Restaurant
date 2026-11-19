import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 'A5', label: 'Miyazaki Wagyu Grade' },
  { value: '45', label: 'Days Dry-Aged' },
  { value: '850°C', label: 'Binchotan Sear Temp' },
  { value: '5★', label: 'Luxembourg Rating' },
];

const FEATURES = [
  {
    icon: '🔥',
    title: 'Live Binchotan Fire',
    desc: "Every steak finishes over Kishu Binchotan charcoal at 850°C — the same wood charcoal used in Kyoto's finest yakitori."
  },
  {
    icon: '✦',
    title: 'AI Sommelier',
    desc: 'Describe what you love — bold, buttery, smoky — and your personal concierge curates the perfect cut, temperature and wine pairing.'
  },
  {
    icon: '🏔',
    title: 'Himalayan Salt Chamber',
    desc: 'Our 45-day dry-age room is lined with Himalayan pink salt bricks, drawing moisture from the air to concentrate every ounce of flavour.'
  },
  {
    icon: '🌿',
    title: 'Single-Origin Provenance',
    desc: 'Miyazaki Prefecture A5 Wagyu, Scottish Highlands Black Angus, and Charolais Heritage from France — named, traced, and tasted.'
  },
];

const QUOTES = [
  { text: 'The most memorable steak I have eaten outside of Japan.', author: 'Le Fooding Luxembourg, 2024' },
  { text: 'An obsessively curated experience from amuse-bouche to gold-dusted fondant.', author: 'Gault & Millau, 2024' },
  { text: 'Étoile Royale treats fire as an art form.', author: 'The Luxembourg Times' },
];

export default function LandingPage({ onEnter }) {
  const heroRef = useRef(null);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Auto-rotate quote
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(id);
  }, []);

  // Parallax on hero
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onScroll = () => {
      const scrolled = window.scrollY;
      el.style.setProperty('--parallax', `${scrolled * 0.4}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`landing ${loaded ? 'landing--visible' : ''}`}>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="lp-hero" ref={heroRef} aria-label="Welcome to Étoile Royale">
        <div className="lp-hero-overlay" aria-hidden="true" />
        <div className="lp-hero-grain" aria-hidden="true" />

        <header className="lp-nav container">
          <div className="lp-brand">
            <span className="lp-brand-star" aria-hidden="true">✦</span>
            <span>ÉTOILE ROYALE</span>
          </div>
          <nav className="lp-nav-links" aria-label="Quick links">
            <a href="#lp-story">Our story</a>
            <a href="#lp-menu">The menu</a>
            <a href="#lp-visit">Visit</a>
          </nav>
        </header>

        <div className="lp-hero-content container">
          <p className="lp-eyebrow">BINCHOTAN · DRY-AGED · LUXEMBOURG CITY</p>
          <h1 className="lp-headline">
            Where fire<br />
            <em>becomes</em><br />
            flavour.
          </h1>
          <p className="lp-subhead">
            Miyazaki A5 Wagyu. 45-day dry-aged Tomahawk. A five-course tasting that
            unfolds like a performance, 26 Rue Notre-Dame, Luxembourg.
          </p>
          <div className="lp-hero-actions">
            <button type="button" className="lp-btn lp-btn-primary lp-btn-enter" onClick={onEnter}>
              Enter the restaurant
              <span className="lp-btn-arrow" aria-hidden="true">→</span>
            </button>
            <a href="#lp-story" className="lp-btn lp-btn-ghost">Discover more</a>
          </div>
        </div>

        <div className="lp-stats" aria-label="Restaurant highlights">
          {STATS.map(({ value, label }) => (
            <div key={label} className="lp-stat">
              <span className="lp-stat-value">{value}</span>
              <span className="lp-stat-label">{label}</span>
            </div>
          ))}
        </div>

        <div className="lp-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <span className="lp-scroll-line" />
        </div>
      </section>

      {/* ── QUOTE ROTATOR ─────────────────────────────────── */}
      <section className="lp-quote-band" aria-label="Press quotes">
        <div className="container">
          <div className="lp-quote-wrap">
            {QUOTES.map((q, i) => (
              <blockquote
                key={q.author}
                className={`lp-quote ${i === quoteIdx ? 'lp-quote--active' : ''}`}
                aria-hidden={i !== quoteIdx}
              >
                <p>&ldquo;{q.text}&rdquo;</p>
                <footer>— {q.author}</footer>
              </blockquote>
            ))}
          </div>
          <div className="lp-quote-dots" aria-hidden="true">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`lp-qdot ${i === quoteIdx ? 'lp-qdot--active' : ''}`}
                onClick={() => setQuoteIdx(i)}
                aria-label={`Quote ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ─────────────────────────────────────────── */}
      <section id="lp-story" className="lp-story container" aria-labelledby="story-heading">
        <div className="lp-story-text">
          <p className="lp-section-eyebrow">OUR STORY</p>
          <h2 id="story-heading" className="lp-h2">
            A kitchen built on<br />obsession.
          </h2>
          <p className="lp-body">
            Executive Chef Laurent Beaumont spent three years in Hokkaido studying the
            art of binchotan fire before opening Étoile Royale in the heart of Ville
            Haute. Every decision — from the Himalayan salt dry-age chamber to the
            custom charcoal grate angle — exists to serve one idea: the most honest,
            most intense expression of a great cut of beef.
          </p>
          <p className="lp-body">
            The room is intimate by design. 36 seats, candlelit marble, and a
            sommelier who treats your glass with the same care your steak receives
            over the coals.
          </p>
          <button type="button" className="lp-btn lp-btn-primary" onClick={onEnter}>
            See the full menu
          </button>
        </div>
        <div className="lp-story-image" aria-hidden="true">
          <div className="lp-img-frame">
            <img
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=900&q=80"
              alt="Chef tending to steaks over binchotan charcoal"
              loading="lazy"
              width="900"
              height="600"
            />
            <div className="lp-img-badge">
              <span className="lp-img-badge-star">✦</span>
              <span>Est. Luxembourg, 2019</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section className="lp-features-band" aria-labelledby="features-heading">
        <div className="container">
          <div className="lp-features-head">
            <p className="lp-section-eyebrow">THE ÉTOILE DIFFERENCE</p>
            <h2 id="features-heading" className="lp-h2">Every detail, deliberate.</h2>
          </div>
          <ul className="lp-features-grid" role="list">
            {FEATURES.map(({ icon, title, desc }) => (
              <li key={title} className="lp-feature-card">
                <span className="lp-feature-icon" aria-hidden="true">{icon}</span>
                <h3 className="lp-feature-title">{title}</h3>
                <p className="lp-feature-desc">{desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── MENU TEASER ───────────────────────────────────── */}
      <section id="lp-menu" className="lp-menu-teaser container" aria-labelledby="menu-heading">
        <div className="lp-menu-teaser-text">
          <p className="lp-section-eyebrow">THE CUT BOOK</p>
          <h2 id="menu-heading" className="lp-h2">
            Eight cuts.<br />One obsession.
          </h2>
          <p className="lp-body">
            From a silky Charolais Filet Mignon at Rp 1.156.000 to the showstopping
            Royal Tomahawk at Rp 2.040.000 — every cut is dry-aged in-house and
            accompanied by house-made sauces, seasonal sides and a
            thoughtfully chosen wine pairing.
          </p>
          <p className="lp-body">
            The Royal Experience (Rp 2.465.000) brings everything to the table in
            five deliberate courses, orchestrated by Chef Beaumont personally.
          </p>
          <div className="lp-menu-teaser-actions">
            <button type="button" className="lp-btn lp-btn-primary" onClick={onEnter}>
              Explore the interactive menu
            </button>
            <span className="lp-menu-teaser-note">Rotate the 3D table · tap each dish · ask the AI sommelier</span>
          </div>
        </div>
        <div className="lp-menu-dishes" aria-hidden="true">
          {[
            { name: 'Japanese A5 Wagyu Ribeye', price: 'Rp 1.615.000', tag: "Chef's favourite" },
            { name: 'Royal Tomahawk Steak', price: 'Rp 2.040.000', tag: '45-day dry-aged' },
            { name: 'Black Truffle Tenderloin', price: 'Rp 1.326.000', tag: '24k gold leaf' },
            { name: 'The Royal Experience', price: 'Rp 2.465.000', tag: '5-course tasting' },
          ].map(({ name, price, tag }) => (
            <button
              key={name}
              type="button"
              className="lp-dish-row"
              onClick={onEnter}
            >
              <div>
                <span className="lp-dish-name">{name}</span>
                <span className="lp-dish-tag">{tag}</span>
              </div>
              <span className="lp-dish-price">{price}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── VISIT ─────────────────────────────────────────── */}
      <section id="lp-visit" className="lp-visit-band" aria-labelledby="visit-heading">
        <div className="container lp-visit-inner">
          <div className="lp-visit-info">
            <p className="lp-section-eyebrow">FIND US</p>
            <h2 id="visit-heading" className="lp-h2">Luxembourg City</h2>
            <address className="lp-address">
              26 Rue Notre-Dame<br />
              L-2240 Luxembourg City<br />
              <a href="tel:+352278644 10">+352 27 86 44 10</a><br />
              <a href="mailto:concierge@etoileroyale.lu">concierge@etoileroyale.lu</a>
            </address>
            <dl className="lp-hours">
              <div><dt>Tue – Fri</dt><dd>18:00 – 23:30</dd></div>
              <div><dt>Saturday</dt><dd>12:00 – 15:00 &amp; 18:00 – 00:00</dd></div>
              <div><dt>Sunday</dt><dd>18:00 – 22:30</dd></div>
              <div><dt>Monday</dt><dd>Closed</dd></div>
            </dl>
          </div>
          <div className="lp-visit-cta">
            <div className="lp-cta-card">
              <span className="lp-cta-star" aria-hidden="true">✦</span>
              <h3 className="lp-cta-title">Reserve your table</h3>
              <p className="lp-cta-body">
                Every reservation is confirmed personally. For the Salon Privé
                Royal (8–16 guests), our sommelier composes a bespoke menu.
              </p>
              <button type="button" className="lp-btn lp-btn-primary lp-btn-wide" onClick={onEnter}>
                Reserve now →
              </button>
              <p className="lp-cta-note">Dress code: Smart Elegant</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="container lp-footer-inner">
          <div>
            <p className="lp-brand-name-footer">ÉTOILE ROYALE</p>
            <p className="lp-footer-meta">26 Rue Notre-Dame, L-2240 Luxembourg City</p>
          </div>
          <div className="lp-footer-right">
            <button type="button" className="lp-btn lp-btn-ghost lp-btn-sm" onClick={onEnter}>
              Enter the restaurant →
            </button>
            <p className="lp-footer-meta">© 2025 Étoile Royale. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

