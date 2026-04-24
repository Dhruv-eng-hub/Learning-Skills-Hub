import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp.js'
import { isEmail, validatePassword } from '../utils/validation.js'

export default function Login() {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from
  const [role, setRole] = useState('learner')

  const [form, setForm] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({})

  const errors = useMemo(() => {
    const e = {}
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
    setTouched({ email: true, password: true })
    if (Object.keys(errors).length > 0) return
    const selectedRole = role === 'admin' ? 'admin' : 'learner'
    const target =
      from ?? (selectedRole === 'admin' ? '/admin' : '/dashboard')
    actions.login({
      name: selectedRole === 'admin' ? 'Admin' : 'Learner',
      email: form.email,
      role: selectedRole,
    })
    navigate(target, { replace: true })
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
          Login
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Choose login type and sign in (frontend-only auth).
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            className={role === 'learner' ? 'btn-primary' : 'btn-soft'}
            onClick={() => setRole('learner')}
            type="button"
          >
            Learner Login
          </button>
          <button
            className={role === 'admin' ? 'btn-primary' : 'btn-soft'}
            onClick={() => setRole('admin')}
            type="button"
          >
            Admin Login
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
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
              autoComplete="current-password"
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
            {role === 'admin' ? 'Sign in as admin' : 'Sign in as learner'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600 dark:text-slate-300">
          New here?{' '}
          <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-200" to="/register">
            Create an account
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

