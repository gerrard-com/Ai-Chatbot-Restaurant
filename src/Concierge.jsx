import { useRef, useState } from 'react';
import { MENU_DATA } from './data.js';
import { useDialog } from './hooks.js';

const QUICK_PROMPTS = [
  'I love a rich, buttery steak',
  'Pair a cut with a bold red',
  'Build me a full steak dinner',
  'I prefer something lean and tender'
];
const PLACEHOLDER = {
  EN: 'Tell us what you crave: rich, lean, smoky…',
  FR: 'Dites-nous ce qui vous ferait plaisir…',
  DE: 'Worauf haben Sie Appetit?'
};
const FOOD_IMAGES = [
  'photo-1546833999-b9f581a1996d',
  'photo-1544025162-d76694265947',
  'photo-1600891964599-f61ba0e24092',
  'photo-1558030006-450675393462'
];

const imageFor = (dish, index) => {
  const imageIndex = dish.dishType === 'tomahawk' ? 3 : dish.dishType === 'filet' ? 2 : index % FOOD_IMAGES.length;
  return `https://images.unsplash.com/${FOOD_IMAGES[imageIndex]}?auto=format&fit=crop&w=700&q=80`;
};

export default function Concierge({ open, onClose, lang, onLang, messages, typing, error, providerLabel, onSend, onPickDish, onAddDish }) {
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const [draft, setDraft] = useState('');
  useDialog({ open, onClose, containerRef: panelRef, initialRef: inputRef, trap: true });

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!draft.trim() || typing) return;
    onSend(draft);
    setDraft('');
    requestAnimationFrame(() => endRef.current?.scrollIntoView({ block: 'end' }));
  };

  return (
    <section ref={panelRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="ÉTOILE AI Sommelier" className="concierge">
      <header className="concierge-head">
        <div className="concierge-identity">
          <div className="sommelier-mark" aria-hidden="true"><span>✦</span></div>
          <div>
            <p className="concierge-kicker">ÉTOILE ROYALE · AI SOMMELIER</p>
            <h2 className="concierge-title">Your night, well done.</h2>
            <p className="concierge-sub">{providerLabel}</p>
          </div>
        </div>
        <div className="concierge-tools">
          {['EN', 'FR', 'DE'].map((l) => (
            <button key={l} type="button" className="btn btn-quiet btn-sm" aria-pressed={lang === l} onClick={() => onLang(l)}>
              {l}
            </button>
          ))}
          <button type="button" className="btn btn-quiet btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </header>

      <div className="chat-log" role="log" aria-live="polite" aria-label="Conversation">
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <p>{m.content}</p>
            {m.role === 'assistant' && m.recommendedIds?.length > 0 && (
              <div className="recommendation-grid">
                {m.recommendedIds.slice(0, 3).map((id, recommendationIndex) => {
                  const dish = MENU_DATA.find((d) => d.id === id);
                  return dish ? (
                    <article key={id} className="recommendation-card">
                      <div className="recommendation-image">
                        <img src={imageFor(dish, recommendationIndex)} alt="" loading="lazy" />
                        <span>CHEF’S TABLE · 0{recommendationIndex + 1}</span>
                      </div>
                      <div className="recommendation-copy">
                        <div className="recommendation-title"><h3>{dish.name}</h3><b>Rp {dish.price}</b></div>
                        <p>{dish.flavorProfile}</p>
                        <span className="recommendation-temp">BEST AT · {dish.recommendedTemp}</span>
                      </div>
                      <div className="recommendation-actions">
                        <button type="button" className="btn btn-quiet btn-sm" onClick={() => onPickDish(dish)}>Explore</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => onAddDish(dish)}>Add to ticket</button>
                      </div>
                    </article>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
        {typing && <p className="chat-status"><span className="typing-orbit" aria-hidden="true"><i /><i /><i /></span>Reading your palate and finding the right pour…</p>}
        {error && (
          <p className="chat-error" role="alert">
            {error} Showing a menu-based answer instead.
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className="quick-prompts">
        {QUICK_PROMPTS.map((q) => (
          <button key={q} type="button" className="chip" disabled={typing} onClick={() => onSend(q)}>
            {q}
          </button>
        ))}
      </div>

      <form className="chat-form" onSubmit={submit}>
        <label htmlFor="concierge-input" className="sr-only">
          Message to the concierge
        </label>
        <input
          id="concierge-input"
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={PLACEHOLDER[lang]}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={typing || !draft.trim()}>
          Send
        </button>
      </form>
    </section>
  );
}

