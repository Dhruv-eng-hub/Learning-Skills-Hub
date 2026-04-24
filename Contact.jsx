import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'

function isEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase())
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!isEmail(form.email)) e.email = 'Enter a valid email'
    if (form.message.trim().length < 10) e.message = 'Message should be at least 10 characters'
    return e
  }, [form])

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  function submit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errors).length > 0) return
    toast.success('Message sent (simulated)')
    setForm({ name: '', email: '', message: '' })
    setTouched({})
  }

  return (
    <div className="container-page py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="glass-strong rounded-3xl p-8 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Contact
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Let’s talk learning
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Send a message and we’ll get back to you. Form submission is simulated.
          </p>

          <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="input mt-2"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                required
                autoComplete="name"
              />
              {touched.name && errors.name ? (
                <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="input mt-2"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                required
                type="email"
                autoComplete="email"
              />
              {touched.email && errors.email ? (
                <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.email}</p>
              ) : null}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                className="input mt-2 min-h-32"
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, message: true }))}
                required
              />
              {touched.message && errors.message ? (
                <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.message}</p>
              ) : null}
            </div>

            <button className="btn-primary w-full" type="submit">
              Send message
            </button>
          </form>
        </section>

        <aside className="glass-strong rounded-3xl p-8 lg:sticky lg:top-24 lg:h-fit">
          <p className="text-sm font-extrabold">Support</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Email: <span className="font-semibold">support@learningskillshub.test</span>
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Hours: <span className="font-semibold">Mon–Fri, 9am–6pm</span>
          </p>
          <div className="mt-6 rounded-3xl border border-black/5 bg-white/40 p-5 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Tip: Try enrolling in a course and then visit the dashboard to see your enrolled list.
          </div>
        </aside>
      </div>
    </div>
  )
}

