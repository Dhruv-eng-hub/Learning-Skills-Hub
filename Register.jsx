import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp.js'
import { isEmail, validatePassword } from '../utils/validation.js'

export default function Register() {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Name should be at least 2 characters'
    if (!isEmail(form.email)) e.email = 'Enter a valid email'
    const pwErr = validatePassword(form.password)
    if (pwErr) e.password = pwErr
    return e
  }, [form])

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  function submit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true })
    if (Object.keys(errors).length > 0) return
    actions.register({ name: form.name.trim(), email: form.email })
    navigate('/dashboard', { replace: true })
  }

  if (state.user) {
    return (
      <div className="container-page py-10">
        <div className="glass-strong rounded-3xl p-8 text-sm text-slate-600 dark:text-slate-300">
          You’re already logged in. Go to{' '}
          <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-200" to="/dashboard">
            dashboard
          </Link>
          .
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-lg glass-strong rounded-3xl p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Register
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Access your dashboard and enroll in courses (demo).
        </p>

        <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="input mt-2"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
              required
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
              type="email"
              autoComplete="email"
              required
            />
            {touched.email && errors.email ? (
              <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.email}</p>
            ) : null}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input mt-2"
              value={form.password}
              onChange={(e) => setField('password', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              type="password"
              autoComplete="new-password"
              required
            />
            {touched.password && errors.password ? (
              <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.password}</p>
            ) : (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Must be 8+ chars, include an uppercase letter and a number.
              </p>
            )}
          </div>

          <button className="btn-primary w-full" type="submit">
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{' '}
          <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-200" to="/login">
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

