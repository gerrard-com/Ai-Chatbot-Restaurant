import { useRef } from 'react';
import { useDialog } from './hooks.js';

export default function DishModal({ dish, onClose, onReserve, onInspect }) {
  const ref = useRef(null);
  const closeRef = useRef(null);
  useDialog({ open: Boolean(dish), onClose, containerRef: ref, initialRef: closeRef, trap: true });
  if (!dish) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="dish-title" className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-top">
          <p className="meta">{dish.category}</p>
          <button ref={closeRef} type="button" className="btn btn-quiet btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="row-head">
          <h3 id="dish-title" className="modal-title">{dish.name}</h3>
          <span className="price">€{dish.price}</span>
        </div>
        <p className="meta">{dish.provenance}</p>
        <p className="modal-copy">{dish.description}</p>

        <h4 className="label">Ingredients</h4>
        <ul className="ingredients">
          {dish.ingredients.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>

        <dl className="facts">
          <div><dt>Flavour</dt><dd>{dish.flavorProfile}</dd></div>
          <div><dt>Pairing</dt><dd>{dish.pairing}</dd></div>
          <div><dt>Allergens</dt><dd>{dish.allergens}</dd></div>
        </dl>

        <div className="actions">
          <button type="button" className="btn btn-primary" onClick={() => onReserve(dish)}>
            Book with this dish
          </button>
          {dish.tableIndex !== null && (
            <button type="button" className="btn" onClick={() => onInspect(dish)}>
              View on the 3D table
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
