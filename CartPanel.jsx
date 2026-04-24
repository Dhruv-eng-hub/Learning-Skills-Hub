import { Link, useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useApp } from '../../hooks/useApp.js'
import { useCourses } from '../../hooks/useCourses.js'

export default function CartPanel({ onClose }) {
  const { state, actions } = useApp()
  const { data: courses } = useCourses()
  const navigate = useNavigate()
  const items = state.cartIds
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean)

  const total = items.reduce((sum, c) => sum + (Number(c.priceValue) || 0), 0)
  const totalLabel = `₹${total.toLocaleString('en-IN')}`

  return (
    <div>
      {items.length === 0 ? (
        <div className="text-sm text-slate-600 dark:text-slate-300">
          Your cart is empty. Browse our{' '}
          <Link className="font-semibold text-indigo-600 dark:text-indigo-300" to="/courses" onClick={onClose}>
            courses
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/50 p-3 dark:border-white/10 dark:bg-white/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{c.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {c.category} • {c.price}
                </p>
              </div>
              <button
                className="btn-ghost h-10 w-10 rounded-xl p-0"
                onClick={() => actions.removeFromCart(c.id)}
                aria-label={`Remove ${c.title}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-black/5 pt-3 text-sm dark:border-white/10">
            <span className="font-semibold">Total</span>
            <span className="font-extrabold">{totalLabel}</span>
          </div>

          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={actions.clearCart}>
              Clear
            </button>
            <button
              className="btn-primary flex-1"
              onClick={() => {
                navigate('/checkout')
                onClose?.()
              }}
            >
              Proceed to checkout
            </button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Secure checkout flow (frontend demo).
          </p>
        </div>
      )}
    </div>
  )
}

