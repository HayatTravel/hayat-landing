/* Every file in this folder exports default { key: [ar, en, ku] }. They are merged here automatically,
   so each product area keeps its own strings (core.js, checkout.js, flights.js, stays.js, …). */
const files = import.meta.glob('./*.strings.js', { eager: true })
export const STRINGS = Object.assign({}, ...Object.values(files).map((m) => m.default))
