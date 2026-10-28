/* Checkout contract. Each file in src/orders/*.js exports default { <type>: (q, i18n) => order | null }.
   order = {
     title, sub, img,                       // strings; img = media name (public/media) or full URL
     facts: [[label, value]],               // shown in the summary
     price: [{ label, usd }],               // base price lines
     travellers: { count, fields: ['name','dob','nationality','passport'], note } | null,
     extras: [{ id, label, sub, usd, per: 'booking'|'traveller', checked }],
     uploads: [{ id, label }],
     hold: minutes | null,                  // price held before payment
     terms: 'one plain sentence',
     docs: ['documents the customer receives'],
     back: '/path?query'                    // change the choice
   }
   Checkout URL: /checkout?type=<type>&…product params */
const files = import.meta.glob('../orders/*.js', { eager: true })
export const ORDERS = Object.assign({}, ...Object.values(files).map((m) => m.default))
export const buildOrder = (q, i18n) => ORDERS[q.type]?.(q, i18n) ?? null
