import { useI18n } from '../lib/i18n'
import { Hero, Input, MockForm } from '../components/company/ui'

const TYPES = ['complaint', 'suggestion', 'thanks']

/** /feedback — complaints and suggestions, and how we handle them. */
export default function Feedback() {
  const { t } = useI18n()
  return (
    <>
      <Hero title={t('cp.fb.title')} lede={t('cp.fb.lede')} />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr]">
        <MockForm submitLabel={t('cp.send')} doneTitle={t('cp.fb.done')} doneText={t('cp.fb.doneD')}>
          <fieldset><legend className="label">{t('cp.fb.type')}</legend>
            <div className="flex flex-wrap gap-2">{TYPES.map((k, n) => (
              <label key={k} className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-3 py-2 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5">
                <input type="radio" name="fb-type" value={k} defaultChecked={n === 0} className="accent-[var(--color-brand)]" />{t(`cp.fb.${k}`)}</label>))}</div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="f-name" label={t('cp.f.name')} required autoComplete="name" />
            <Input id="f-phone" label={t('sign.phone')} required inputMode="tel" dir="ltr" autoComplete="tel" />
          </div>
          <Input id="f-ref" label={t('cp.f.ref')} optional dir="ltr" placeholder="HY…" />
          <Input id="f-msg" label={t('cp.f.message')} as="textarea" required />
        </MockForm>
        <aside>
          <h2 className="mb-4 text-lg font-bold">{t('cp.fb.how')}</h2>
          <ol className="space-y-5">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex gap-4"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{n}</span>
                <span><b className="block">{t(`cp.fb.s${n}`)}</b><span className="text-sm leading-6 text-ink/70">{t(`cp.fb.s${n}d`)}</span></span></li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  )
}
