import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { setCookie } from './store'

/* Two audiences, two sites:
   'out' — travelling from Iraq (Iraqi market: flights, hotels, holidays, visas for Iraqi passports…)
   'in'  — visiting Iraq (inbound tourism: places, tours, visa to Iraq, international languages)
   Chosen on the home page or in the header; remembered in a cookie; ?mode=in|out overrides. */
const Ctx = createContext(null)

export function ModeProvider({ children, mode: mode0 }) {
  const [mode, setModeState] = useState(mode0) // from the root loader (query or cookie)
  const setMode = useCallback((m) => { setCookie('hayat-mode', m); setModeState(m) }, [])
  const value = useMemo(() => ({ mode, setMode, incoming: mode === 'in' }), [mode, setMode])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useMode = () => useContext(Ctx)
