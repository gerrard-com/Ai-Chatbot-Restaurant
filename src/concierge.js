import { HOURS, MENU_DATA, RESTAURANT } from './data.js';

// Optional live replies. Point this at YOUR server endpoint (see README).
// A provider key must never be shipped to the browser.
const PROXY_URL = import.meta.env.VITE_CONCIERGE_PROXY_URL || '';
export const isLive = Boolean(PROXY_URL);

const REPLIES = {
  diet: {
    ids: ['the-royal-experience', 'royal-berry-sparkle'],
    en: 'Chef Laurent Beaumont prepares an Aged Parmesan & Périgord Black Truffle Risotto for vegetarian guests on request. The Signature Steaks and Beverages are naturally gluten-free. Please add any allergy to your reservation notes.',
    fr: 'Le chef Laurent Beaumont prépare sur demande un risotto au Parmesan affiné et à la truffe noire du Périgord pour les convives végétariens. Nos steaks signature et boissons sont naturellement sans gluten. Merci de signaler toute allergie dans votre réservation.',
    de: 'Küchenchef Laurent Beaumont bereitet auf Wunsch ein Risotto mit gereiftem Parmesan und Périgord-Trüffel für vegetarische Gäste zu. Unsere Signature-Steaks und -Getränke sind von Natur aus glutenfrei. Bitte vermerken Sie Allergien in Ihrer Reservierung.'
  },
  dessert: {
    ids: ['midnight-chocolate-fondant', 'parisian-creme-brulee', 'raspberry-pistachio-royale'],
    en: 'Our signature finale is the Midnight Chocolate Fondant (€18) with 72% Valrhona and gold leaf. The Parisian Crème Brûlée (€15) and the Raspberry Pistachio Royale (€17) are close behind.',
    fr: 'Notre final signature est le Midnight Chocolate Fondant (€18) au Valrhona 72 % et à la feuille d’or. La Crème Brûlée parisienne (€15) et le Raspberry Pistachio Royale (€17) suivent de près.',
    de: 'Unser Signature-Finale ist das Midnight Chocolate Fondant (€18) mit 72 % Valrhona und Blattgold. Dicht dahinter folgen die Parisian Crème Brûlée (€15) und das Raspberry Pistachio Royale (€17).'
  },
  drinks: {
    ids: ['royal-berry-sparkle', 'golden-passion', 'emerald-matcha-latte'],
    en: 'Our zero-proof pairings are the Royal Berry Sparkle (€14), Golden Passion (€12), Emerald Matcha Latte (€11) and Lemon Royale (€10).',
    fr: 'Nos accords sans alcool : Royal Berry Sparkle (€14), Golden Passion (€12), Emerald Matcha Latte (€11) et Lemon Royale (€10).',
    de: 'Unsere alkoholfreien Begleiter: Royal Berry Sparkle (€14), Golden Passion (€12), Emerald Matcha Latte (€11) und Lemon Royale (€10).'
  },
  visit: {
    ids: ['the-royal-experience'],
    en: `We are at ${RESTAURANT.address}. Open Tue–Fri 18:00–23:30, Sat 12:00–15:00 and 18:00–00:00, Sun 18:00–22:30; closed Mondays. You can request a table in the reservation section, including the Salon Privé Royal for 8–16 guests.`,
    fr: `Nous sommes au ${RESTAURANT.address}. Ouvert du mardi au vendredi 18h00–23h30, samedi 12h00–15h00 et 18h00–00h00, dimanche 18h00–22h30 ; fermé le lundi. Vous pouvez demander une table dans la section réservation, y compris le Salon Privé Royal (8–16 personnes).`,
    de: `Sie finden uns im ${RESTAURANT.address}. Geöffnet Di–Fr 18:00–23:30, Sa 12:00–15:00 und 18:00–00:00, So 18:00–22:30; montags geschlossen. Tischanfragen, auch für den Salon Privé Royal (8–16 Gäste), stellen Sie im Reservierungsbereich.`
  },
  steak: {
    ids: ['wagyu-ribeye', 'royal-tomahawk', 'black-truffle-tenderloin'],
    en: 'For an unforgettable evening I suggest the Japanese A5 Wagyu Ribeye (€95), seared over Binchotan charcoal, or the Royal Tomahawk Steak (€120), aged 45 days in Himalayan salt.',
    fr: 'Pour une soirée inoubliable, je suggère le Japanese A5 Wagyu Ribeye (€95), saisi au charbon Binchotan, ou le Royal Tomahawk (€120), affiné 45 jours au sel de l’Himalaya.',
    de: 'Für einen unvergesslichen Abend empfehle ich das Japanese A5 Wagyu Ribeye (€95) vom Binchotan-Grill oder das Royal Tomahawk Steak (€120), 45 Tage im Himalaya-Salz gereift.'
  },
  about: {
    ids: ['the-royal-experience', 'wagyu-ribeye', 'royal-berry-sparkle'],
    en: 'Welcome to ÉTOILE ROYALE in Luxembourg City. Explore our dry-aged Signature Steaks, the five-course Royal Experience (€145 per person), or ask me about pairings, hours and dietary needs.',
    fr: 'Bienvenue à ÉTOILE ROYALE, à Luxembourg-Ville. Découvrez nos steaks signature maturés, le menu The Royal Experience en cinq services (€145 par personne), ou interrogez-moi sur les accords, les horaires et les régimes.',
    de: 'Willkommen im ÉTOILE ROYALE in Luxemburg-Stadt. Entdecken Sie unsere gereiften Signature-Steaks, das Fünf-Gänge-Menü The Royal Experience (€145 pro Person) oder fragen Sie mich zu Pairings, Öffnungszeiten und Ernährungswünschen.'
  }
};
const MENU_CONTEXT = MENU_DATA.map((dish) => (
  `${dish.id}: ${dish.name}, €${dish.price}, ${dish.weight}; ${dish.flavorProfile}; ${dish.recommendedTemp}; pairing: ${dish.pairing}; allergens: ${dish.allergens}.`
)).join('\n');
const SYSTEM_CONTEXT = `You are ÉTOILE ROYALE's warm, polished AI steak sommelier in Luxembourg City. Reply in the requested language (EN, FR, or DE). Help guests discover cuts, doneness, sauces, drinks and complete dinners. Ask one brief follow-up when preferences are unclear. Only recommend items and facts in the menu below; never invent availability, ingredients, prices or allergen guarantees. Reservation requests are not confirmed until the restaurant replies. Return concise, useful prose and up to three exact recommendedIds from the menu.
Restaurant: ${RESTAURANT.name}, ${RESTAURANT.address}.
Hours: ${HOURS.map(([day, time]) => `${day}: ${time}`).join('; ')}.
Menu:
${MENU_CONTEXT}`;

const has = (q, words) => words.some((w) => q.includes(w));

export function groundedReply(text, lang = 'EN') {
  const q = text.toLowerCase();
  let key = 'about';
  if (has(q, ['vegetar', 'vegan', 'allerg', 'gluten', 'végétar'])) key = 'diet';
  else if (has(q, ['dessert', 'sweet', 'chocolate', 'brûlée', 'brulee', 'pistachio', 'nachtisch'])) key = 'dessert';
  else if (has(q, ['drink', 'beverage', 'sparkle', 'matcha', 'pairing', 'boisson', 'getränk'])) key = 'drinks';
  else if (has(q, ['reserv', 'book', 'hour', 'open', 'location', 'address', 'horaire', 'öffnungs'])) key = 'visit';
  else if (has(q, ['steak', 'wagyu', 'tomahawk', 'filet', 'truffle', 'recommend', 'menu', 'carte', 'pair', 'cut', 'rich', 'lean', 'tender', 'dinner', 'bold red'])) key = 'steak';
  const r = REPLIES[key];
  return { text: r[lang.toLowerCase()] || r.en, recommendedIds: r.ids, provider: 'grounded' };
}

export async function askConcierge({ messages, lang, signal }) {
  const last = messages[messages.length - 1]?.content || '';
  if (!isLive) return groundedReply(last, lang);

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify({
      lang,
      messages: [
        { role: 'system', content: SYSTEM_CONTEXT },
        ...messages.filter(({ role }) => role === 'user' || role === 'assistant').slice(-8).map(({ role, content }) => ({ role, content }))
      ]
    })
  });
  if (!res.ok) throw new Error(`The concierge service answered with status ${res.status}.`);
  const data = await res.json();
  if (!data || typeof data.text !== 'string' || !data.text.trim()) {
    throw new Error('The concierge service returned an empty reply.');
  }
  const recommendedIds = Array.isArray(data.recommendedIds)
    ? [...new Set(data.recommendedIds.filter((id) => MENU_DATA.some((dish) => dish.id === id)))].slice(0, 3)
    : [];
  return { text: data.text.trim(), recommendedIds, provider: 'live' };
}
