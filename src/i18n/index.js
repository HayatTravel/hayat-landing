/* Every file in this folder named *.strings.js exports default { key: [ar, en, ku] }; they are merged here,
   so each product area keeps its own strings. International languages live in extra/<lang>.<area>.js as
   { key: text } and are loaded only when that language is chosen (loadExtra). */
const files = import.meta.glob('./*.strings.js', { eager: true })
export const STRINGS = Object.assign({}, ...Object.values(files).map((m) => m.default))

const extra = import.meta.glob('./extra/*.js')
export const EXTRA = {}
/** Load (once) every extra/<lang>.*.js file for a language. Resolves when EXTRA[lang] is ready. */
export function loadExtra(lang) {
  if (EXTRA[lang]) return Promise.resolve(EXTRA[lang])
  const loads = Object.entries(extra).filter(([path]) => path.split('/').pop().split('.')[0] === lang).map(([, load]) => load())
  return Promise.all(loads).then((mods) => (EXTRA[lang] = Object.assign({}, ...mods.map((m) => m.default))))
}
