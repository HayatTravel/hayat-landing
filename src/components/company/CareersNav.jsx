import { NavLink } from 'react-router'
import { useI18n } from '../../lib/i18n'

export const CAREERS_NAV = [['/careers', 'hr.nav.roles', true], ['/careers/how-we-hire', 'hr.nav.how'], ['/careers/life', 'hr.nav.life'], ['/careers/students', 'hr.nav.students'], ['/careers/track', 'hr.nav.track'], ['/careers/onboarding', 'hr.nav.onboarding']]

/** Sub-navigation of the careers section (sits inside the dark page head). */
export default function CareersNav() {
  const { t } = useI18n()
  return (
    <nav aria-label={t('hr.nav.label')} className="mt-6 -mb-2 flex gap-1 overflow-x-auto pb-2 [scrollbar-width:none]">
      {CAREERS_NAV.map(([to, k, end]) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `shrink-0 rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-white text-ink' : 'text-white/80 hover:bg-white/10 hover:text-white'}`}>{t(k)}</NavLink>
      ))}
    </nav>
  )
}
