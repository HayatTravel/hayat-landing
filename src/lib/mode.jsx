import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { store } from './store'

/* Two audiences, two sites:
   'out' — travelling from Iraq (Iraqi market: flights, hotels, holidays, visas for Iraqi passports…)
   'in'  — visiting Iraq (inbound tourism: places, tours, visa to Iraq, international languages)
   Chosen on the home page or in the header; remembered; ?mode=in|out overrides. */
const Ctx = createContext(null)

export function ModeProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    const q = new URLSearchParams(location.search).get('mode')
    const m = q || store.get('mode', 'out')
    return m === 'in' ? 'in' : 'out'
  })
  const setMode = useCallback((m) => { store.set('mode', m); setModeState(m) }, [])
  const value = useMemo(() => ({ mode, setMode, incoming: mode === 'in' }), [mode, setMode])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useMode = () => useContext(Ctx)
