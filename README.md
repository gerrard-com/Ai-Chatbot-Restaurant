# ÉTOILE ROYALE

React + Vite + Three.js site for a modern steakhouse in Luxembourg City: a half-round interactive 3D counter that presents one course at a time, an image-first swipeable paper menu, an order ticket, a reservation request form, and a multilingual (EN/FR/DE) steak and pairing guide.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview
npm run test:e2e   # Playwright desktop + mobile interaction checks
```

Node 18+ required.

Playwright runs the app on port 4173 and uses its Chromium browser. Install it once with `npx playwright install chromium`.

## Project layout

| File | Purpose |
| --- | --- |
| `src/data.js` | Restaurant facts, hours, all 13 menu items, FAQ. Edit content here. |
| `src/hours.js` | Opening schedule (Luxembourg time) that drives the live "Open now" line. Keep in sync with `HOURS` in `data.js`. |
| `src/MarbleTable3D.jsx`, `src/textures.js` | Half-round 3D counter, one-at-a-time courses, and procedural tabletop/food textures (lazy-loaded). |
| `src/MenuFlipbook.jsx` | Image-first paper carte with desktop controls and swipe gestures. |
| `src/Reservation.jsx` | Booking request form. |
| `src/Concierge.jsx`, `src/concierge.js` | Chat panel and reply logic. |
| `src/styles.css`, `DESIGN.md` | Design tokens and the reasoning behind them. |

## Concierge

By default it answers from the menu data (EN/FR/DE), with no network calls and no cost. The chat offers image-led recommendations with cut details, doneness, pairing and add-to-ticket actions.

For live AI replies, run a server endpoint that holds your provider key, then set its URL in `.env`:

```
VITE_CONCIERGE_PROXY_URL=https://your-server.example/concierge
```

Contract: `POST { lang, messages: [{ role, content }] }` returns `{ text, recommendedIds? }`. Messages include a system message with restaurant hours and menu facts, followed by the recent conversation. `recommendedIds` should contain menu item IDs from `src/data.js`. The browser aborts requests after 20 seconds; failed requests are shown and answered with the local menu guide.

Keep the provider key on the server. Share only the proxy URL and its request/response contract when configuring this integration; never put the key in a `VITE_` variable.

## Before you launch

- All restaurant details (address, phone, email, chef, dishes, prices, allergens) came from the original draft. Replace anything that is not real, and have the kitchen verify the allergen and gluten-free claims.
- The reservation form opens an email to `concierge@etoileroyale.lu`. Swap `submit` in `Reservation.jsx` for your booking system when you have one.
- Add Terms and Privacy pages before collecting guest details at scale.
