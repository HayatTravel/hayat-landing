import { readdirSync } from 'node:fs'
import { index, layout, route } from '@react-router/dev/routes'

/* Each product area adds its pages in src/routes/<area>.js (export default [route(path, 'pages/X.jsx')]); they are collected here. */
const dir = new URL('./routes/', import.meta.url)
const areas = await Promise.all(readdirSync(dir).filter((f) => f.endsWith('.js')).sort().map((f) => import(new URL(f, dir).href)))

export default [
  route('/health', 'health.js'),
  layout('components/Layout.jsx', [
    index('pages/Home.jsx'),
    ...areas.flatMap((m) => m.default),
    route('/checkout', 'pages/Checkout.jsx'),
    route('/done/:ref', 'pages/Done.jsx'),
    route('*', 'pages/NotFound.jsx'),
  ]),
]
