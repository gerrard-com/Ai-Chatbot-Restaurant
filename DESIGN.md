# DESIGN.md: ÉTOILE ROYALE

Purpose: a fine-dining steakhouse in Luxembourg City. The page has one job: let a guest see the dishes, pick one, and request a table. Everything serves that.

## Palette (2 core + neutral + 1 accent)
- Ivory `#F6F1E8` base, near-black ink `#1B1613`, warm stone neutrals for panels and lines. This is the colour of a printed carte and of the Carrara marble in the hero.
- Accent: oxblood `#7A1F2B` (`#D9788A` in dark theme). Used for the primary action, the current-section marker, focus rings and the 3D selection ring. Nowhere else.
- Brass appears only as a material inside the 3D scene (plate rims, cloche), never as a UI colour.
- Theme: light by default, with a working dark toggle that follows the system setting. No fixed dark mode: the restaurant has no reason to force one.

## Type
- Newsreader (serif) for names, headings and prices: the voice of a printed menu.
- Hanken Grotesk for UI and body text. Both are self-hosted through Fontsource (no third-party requests).
- Sentence case labels, no wide-tracked uppercase.

## Shape, depth, motion
- Radius 4px everywhere. One exception: the hero "Reserve a table" button is a pill, as the single most important action.
- Flat surfaces with 1px lines. Shadow only on the two overlays (dish dialog, concierge panel).
- No glass, glow, gradients, grid textures, decorative emoji or icon library.
- Motion: none that loops. The 3D table moves only when the guest drags, taps, steps or starts the tour; it renders only while moving. Reduced-motion users get no tour and no easing.

## Structure
- Hero is asymmetric (headline and facts, then table and spotlight). The menu is a typographic carte with a full-width flagship tasting menu. Visit is text-heavy and two-column. Reservations is a form beside a live summary. Sections vary in composition and spacing on purpose.
- No "trusted by", testimonials, feature grid or stat cards: the restaurant has no verified content for them.

## Honesty rules
- Opening status is computed from the real schedule in Luxembourg time.
- The reservation form prepares an email. It never shows a fake booking code.
- Concierge answers come from the real menu, or from the restaurant's own server endpoint. No API key ships in the browser.
