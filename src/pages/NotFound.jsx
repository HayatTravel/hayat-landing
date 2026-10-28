import Icon from '../components/Icon'
import { PageHead } from '../components/Layout'
import { Cta } from '../components/ui'

export default function NotFound() {
  return (
    <PageHead className="grid min-h-dvh place-content-center pb-20 text-center">
      <Icon name="plane" className="mx-auto size-14 animate-float text-sky" />
      <p className="text-shimmer mt-6 font-display text-[clamp(6rem,22vw,14rem)] leading-none font-bold" dir="ltr">404</p>
      <div>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">يبدو أن هذه الرحلة غير موجودة</h1>
        <p className="mt-2 text-muted">ربما غيّرت مسارها. لنعدك إلى صالة المغادرة.</p>
        <Cta to="/" className="mt-8">العودة للرئيسية</Cta>
      </div>
    </PageHead>
  )
}
