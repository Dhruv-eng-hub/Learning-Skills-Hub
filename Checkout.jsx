import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp.js'
import { useCourses } from '../hooks/useCourses.js'
import { isEmail } from '../utils/validation.js'

const initialDetails = {
  fullName: '',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  stateName: '',
  pincode: '',
}

export default function Checkout() {
  const { state, actions } = useApp()
  const { data: courses } = useCourses()
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    ...initialDetails,
    fullName: state.user?.name || '',
    email: state.user?.email || '',
  })
  const [paymentMethod, setPaymentMethod] = useState('UPI')
  const [paymentRef, setPaymentRef] = useState('')
  const [touched, setTouched] = useState(false)

  const items = useMemo(
    () => state.cartIds.map((id) => courses.find((course) => course.id === id)).filter(Boolean),
    [courses, state.cartIds],
  )
  const total = items.reduce((sum, c) => sum + (Number(c.priceValue) || 0), 0)
  const upiPayee = 'learninghub@upi'
  const qrUpiUrl = useMemo(() => {
    const amount = Number(total || 0).toFixed(2)
    const txnRef = paymentRef.trim() || `LSH${Date.now()}`
    const upiPayload =
      `upi://pay?pa=${encodeURIComponent(upiPayee)}` +
      `&pn=${encodeURIComponent('Learning Skills Hub')}` +
      `&am=${encodeURIComponent(amount)}` +
      `&cu=INR` +
      `&tn=${encodeURIComponent(`Course enrollment ${txnRef}`)}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPayload)}`
  }, [paymentRef, total])

  const errors = useMemo(() => {
    const e = {}
    if (details.fullName.trim().length < 2) e.fullName = 'Enter full name'
    if (!isEmail(details.email)) e.email = 'Enter valid email'
    if (!/^\d{10}$/.test(details.phone.trim())) e.phone = 'Enter 10-digit phone number'
    if (details.addressLine.trim().length < 8) e.addressLine = 'Enter full address'
    if (details.city.trim().length < 2) e.city = 'Enter city'
    if (details.stateName.trim().length < 2) e.stateName = 'Enter state'
    if (!/^\d{6}$/.test(details.pincode.trim())) e.pincode = 'Enter 6-digit pincode'
    if (paymentRef.trim().length < 4) e.paymentRef = 'Enter payment reference'
    return e
  }, [details, paymentRef])

  function setField(key, value) {
    setDetails((s) => ({ ...s, [key]: value }))
  }

  function submitCheckout(e) {
    e.preventDefault()
    setTouched(true)
    if (items.length === 0 || Object.keys(errors).length > 0) return

    const ok = actions.checkoutEnrollments({
      courses: items,
      learnerDetails: details,
      paymentDetails: { method: paymentMethod, reference: paymentRef.trim() },
    })
    if (ok) navigate('/dashboard')
  }

  return (
    <div className="container-page py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="glass-strong rounded-3xl p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">Complete enrollment</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Fill learner and payment details. Enrollment happens only after successful payment.
          </p>

          {items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-black/5 bg-white/40 p-5 text-sm dark:border-white/10 dark:bg-white/5">
              Cart is empty. Go to{' '}
              <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-200" to="/courses">
                courses
              </Link>
              .
            </div>
          ) : (
            <form className="mt-6 grid gap-3 md:grid-cols-2" onSubmit={submitCheckout} noValidate>
              <input className="input" placeholder="Full name" value={details.fullName} onChange={(e) => setField('fullName', e.target.value)} />
              <input className="input" placeholder="Email" value={details.email} onChange={(e) => setField('email', e.target.value)} />
              <input className="input" placeholder="Phone number" value={details.phone} onChange={(e) => setField('phone', e.target.value)} />
              <input className="input" placeholder="Pincode" value={details.pincode} onChange={(e) => setField('pincode', e.target.value)} />
              <input className="input" placeholder="City" value={details.city} onChange={(e) => setField('city', e.target.value)} />
              <input className="input" placeholder="State" value={details.stateName} onChange={(e) => setField('stateName', e.target.value)} />
              <textarea className="input min-h-20 md:col-span-2" placeholder="Address line" value={details.addressLine} onChange={(e) => setField('addressLine', e.target.value)} />

              <select className="input md:col-span-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="UPI">UPI</option>
                <option value="Card">Credit/Debit Card</option>
                <option value="NetBanking">Net Banking</option>
              </select>
              {paymentMethod === 'UPI' ? (
                <div className="md:col-span-2 rounded-2xl border border-black/5 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-semibold">Scan QR and pay</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    UPI ID: {upiPayee} • Amount: ₹{total.toLocaleString('en-IN')}
                  </p>
                  <img
                    src={qrUpiUrl}
                    alt="UPI payment QR code"
                    className="mt-3 h-44 w-44 rounded-xl border border-black/5 bg-white p-2 dark:border-white/10"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <input
                className="input md:col-span-2"
                placeholder="Payment reference / transaction ID"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
              />
              {touched && Object.keys(errors).length > 0 ? (
                <div className="md:col-span-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-700 dark:text-red-200">
                  Please complete all required details correctly.
                </div>
              ) : null}

              <button className="btn-primary md:col-span-2" type="submit">
                Pay ₹{total.toLocaleString('en-IN')} and enroll
              </button>
            </form>
          )}
        </section>

        <aside className="glass-strong rounded-3xl p-6">
          <h2 className="text-lg font-extrabold">Order summary</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-black/5 bg-white/40 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{item.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-black/5 pt-3 dark:border-white/10">
            <p className="flex items-center justify-between text-sm">
              <span>Total</span>
              <span className="font-extrabold">₹{total.toLocaleString('en-IN')}</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
