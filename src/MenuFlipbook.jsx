import { useRef, useState } from 'react';

const IMAGES = [
  'photo-1546833999-b9f581a1996d',
  'photo-1544025162-d76694265947',
  'photo-1600891964599-f61ba0e24092',
  'photo-1558030006-450675393462',
  'photo-1547592180-85f173990554',
  'photo-1551024506-0bccd828d307'
];

const imageFor = (dish, index) => {
  const imageIndex = dish.dishType === 'tomahawk' ? 3
    : dish.dishType === 'filet' ? 2
      : dish.dishType === 'fondant' || dish.dishType === 'pistachio' ? 5
        : index % IMAGES.length;
  return `https://images.unsplash.com/${IMAGES[imageIndex]}?auto=format&fit=crop&w=1100&q=85`;
};

export default function MenuFlipbook({ items, page, onPage, onDetails, onReserve, onClearFilters }) {
  const [direction, setDirection] = useState('');
  const touchStart = useRef(null);
  const pageCount = Math.max(1, Math.ceil(items.length / 2));
  const currentPage = Math.min(page, pageCount - 1);
  const shown = items.slice(currentPage * 2, currentPage * 2 + 2);

  const flip = (next) => {
    const target = Math.max(0, Math.min(pageCount - 1, next));
    if (target === currentPage) return;
    setDirection(target > currentPage ? 'flip-forward' : 'flip-back');
    onPage(target);
    window.setTimeout(() => setDirection(''), 420);
  };

  return (
    <div className="flipbook-shell" aria-label="Interactive steakhouse menu">
      <div
        className={`flipbook-spread ${direction}`}
        onPointerDown={(event) => {
          touchStart.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerUp={(event) => {
          if (touchStart.current === null) return;
          const delta = event.clientX - touchStart.current;
          if (Math.abs(delta) > 45) flip(currentPage + (delta < 0 ? 1 : -1));
          touchStart.current = null;
        }}
      >
        {shown.length ? shown.map((dish, index) => {
          const absoluteIndex = currentPage * 2 + index;
          return (
            <article className="book-page" key={dish.id}>
              <div className="book-image">
                <img src={imageFor(dish, absoluteIndex)} alt={`${dish.name}, served at Étoile Royale`} loading="lazy" />
                <span className="receipt-stamp">{dish.chefRecommended ? 'CHEF PICK' : dish.category}</span>
                <span className="image-index">0{absoluteIndex + 1} / {String(items.length).padStart(2, '0')}</span>
              </div>
              <div className="book-copy">
                <p className="book-kicker">{dish.provenance}</p>
                <div className="row-head">
                  <h3 className="book-title">{dish.name}</h3>
                  <span className="book-price">€{dish.price}</span>
                </div>
                <p className="book-description">{dish.description}</p>
                <div className="book-specs">
                  <span>{dish.weight}</span>
                  <span>{dish.recommendedTemp}</span>
                  <span>{dish.flavorProfile}</span>
                </div>
                <div className="book-actions">
                  <button type="button" className="btn btn-quiet btn-sm" onClick={() => onDetails(dish)}>Tasting notes</button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onReserve(dish)}>Add to booking</button>
                </div>
              </div>
            </article>
          );
        }) : (
          <div className="book-empty">
            <p>No cuts match those filters.</p>
            <button type="button" className="btn btn-primary" onClick={onClearFilters}>Clear filters</button>
          </div>
        )}
        <button type="button" className="page-corner page-corner-left" aria-label="Previous menu spread" onClick={() => flip(currentPage - 1)} disabled={currentPage === 0} />
        <button type="button" className="page-corner page-corner-right" aria-label="Next menu spread" onClick={() => flip(currentPage + 1)} disabled={currentPage >= pageCount - 1} />
      </div>
      <div className="flipbook-controls">
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => flip(currentPage - 1)} disabled={currentPage === 0}>← Previous</button>
        <div className="flipbook-progress" aria-live="polite">
          <span>CARTE • {String(currentPage + 1).padStart(2, '0')} / {String(pageCount).padStart(2, '0')}</span>
          <div className="progress-track"><span style={{ width: `${((currentPage + 1) / pageCount) * 100}%` }} /></div>
        </div>
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => flip(currentPage + 1)} disabled={currentPage >= pageCount - 1}>Next →</button>
      </div>
      <p className="flipbook-hint">Swipe, use the page corners, or navigate the carte.</p>
    </div>
  );
}
