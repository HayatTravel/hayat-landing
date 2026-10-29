import { ALL_TABS } from './SearchTabs'
import { store, useStore } from '../lib/store'
import { useMode } from '../lib/mode'

/* The home page follows the search tab the visitor picked: right under the search box we show what fits that
   choice, and the rest of the home page keeps its order (without repeating it).
   A search tab (src/search/*.jsx) can either:
     - set `Featured: Component` — its own section (rendered as is, should be a <section className="container-x …">), or
   - be listed below, which brings an existing home section (src/home/*.jsx id) to the top. */
const PROMOTE = { flights: 'flights', holidays: 'holidays', visa: 'visa', events: 'events', 'iq-tours': 'iq-tours', 'iq-visa': 'iq-visa' }

/** The tab currently selected in the home search (remembered between visits), valid for this audience. */
export function useActiveTab() {
  useStore()
  const { mode } = useMode()
  const tabs = ALL_TABS.filter((x) => (x.modes || ['out']).includes(mode))
  const id = store.get('tab', null)
  return tabs.find((x) => x.id === id) || tabs[0]
}

/** Render the featured block for the active tab and return the home-section id it took (so the page skips it later). */
export function useFeatured(sections) {
  const tab = useActiveTab()
  if (!tab) return { node: null, taken: null }
  if (tab.Featured) {
    const F = tab.Featured
    return { node: <div key={tab.id} className="animate-fade"><F /></div>, taken: null }
  }
  const sec = sections.find((s) => s.id === PROMOTE[tab.id])
  if (!sec) return { node: null, taken: null }
  const C = sec.Component
  return { node: <div key={tab.id} className="animate-fade"><C /></div>, taken: sec.id }
}
