import { airlineLogo, flag, iqd } from '../lib/format'
import Icon from './Icon'
import { Photo } from './ui'

// Persistent trip summary: sticky strip under the nav on desktop, fixed bottom bar on mobile.
export default function TripBar({ order, action }) {
  if (!order) return null
  const button = action && (
    <button type={action.form ? 'submit' : 'button'} form={action.form} onClick={action.onClick} disabled={action.disabled} className="btn-primary shrink-0 px-6 py-2.5 text-sm">
      {action.label} <Icon name="arrow" className="size-4 -scale-x-100" />
    </button>
  )
  return (
    <>
      <div className="sticky top-18 z-30 hidden border-b border-line bg-white/95 backdrop-blur lg:block">
        <div className="container-x flex h-16 items-center gap-5">
          {order.logo && <img src={airlineLogo(order.logo)} alt="" className="h-7 w-16 object-contain" />}
          {order.flag && <img src={flag(order.flag)} alt="" className="size-8 rounded-full object-cover" />}
          {order.img && <Photo id={order.img} w={120} className="h-9 w-12 rounded-md" />}
          <div className="min-w-0">
            <p className="truncate font-semibold">{order.title}</p>
            <p className="truncate text-xs text-muted">{order.subtitle}</p>
          </div>
          <div className="ms-auto text-end">
            <p className="text-xs text-muted">الإجمالي</p>
            <p key={order.total} className="animate-fade text-lg font-bold">{iqd(order.total)}</p>
          </div>
          {button}
        </div>
      </div>
      <div className="tripbar-mobile fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs text-muted">{order.title}</p>
            <p className="text-lg font-bold">{iqd(order.total)}</p>
          </div>
          {button}
        </div>
      </div>
    </>
  )
}
