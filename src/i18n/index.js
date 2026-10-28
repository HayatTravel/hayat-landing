/* Every file in this folder named *.strings.js exports default { key: [ar, en, ku] }; they are merged here,
   so each product area keeps its own strings. International languages live in extra/<lang>.js as { key: text }
   (several files per language allowed: extra/<lang>.<area>.js). */
const files = import.meta.glob('./*.strings.js', { eager: true })
export const STRINGS = Object.assign({}, ...Object.values(files).map((m) => m.default))

const extra = import.meta.glob('./extra/*.js', { eager: true })
export const EXTRA = {}
for (const [path, m] of Object.entries(extra)) {
  const lang = path.split('/').pop().split('.')[0]
  EXTRA[lang] = Object.assign(EXTRA[lang] || {}, m.default)
}
