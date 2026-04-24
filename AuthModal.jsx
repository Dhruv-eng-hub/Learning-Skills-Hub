import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../hooks/useApp.js'
import { isEmail, validatePassword } from '../../utils/validation.js'
import { cn } from '../../utils/cn.js'

export default function AuthModal({ mode = 'login', onDone }) {
  const { actions } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState(mode)
  const [loginRole, setLoginRole] = useState('learner')
  const [touched, setTouched] = useState({})
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const errors = useMemo(() => {
    const e = {}
    if (tab === 'register' && form.name.trim().length < 2) e.name = 'Name should be at least 2 characters'
    if (!isEmail(form.email)) e.email = 'Enter a valid email'
    const pwErr = validatePassword(form.password)
    if (pwErr) e.password = pwErr
    return e
  }, [form, tab])

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  function submit(e) {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true })
    if (Object.keys(errors).length > 0) return
    if (tab === 'login') {
      actions.login({
        name: loginRole === 'admin' ? 'Admin' : 'Learner',
        email: form.email,
        role: loginRole,
      })
    }
    else actions.register({ name: form.name.trim(), email: form.email })
    onDone?.()
    navigate(tab === 'login' && loginRole === 'admin' ? '/admin' : '/dashboard')
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          className={cn('btn-soft flex-1', tab === 'login' ? 'ring-2 ring-indigo-500/30' : '')}
          onClick={() => setTab('login')}
          type="button"
        >
          Login
        </button>
        <button
          className={cn('btn-soft flex-1', tab === 'register' ? 'ring-2 ring-indigo-500/30' : '')}
          onClick={() => setTab('register')}
          type="button"
        >
          Register
        </button>
      </div>

      <form className="mt-5 space-y-4" onSubmit={submit} noValidate>
        {tab === 'login' ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              className={cn('btn-soft', loginRole === 'learner' ? 'ring-2 ring-indigo-500/30' : '')}
              onClick={() => setLoginRole('learner')}
              type="button"
            >
              Learner
            </button>
            <button
              className={cn('btn-soft', loginRole === 'admin' ? 'ring-2 ring-indigo-500/30' : '')}
              onClick={() => setLoginRole('admin')}
              type="button"
            >
              Admin
            </button>
          </div>
        ) : null}

        {tab === 'register' ? (
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="am-name">
              Full name
            </label>
            <input
              id="am-name"
              className="input mt-2"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              autoComplete="name"
            />
            {touched.name && errors.name ? (
              <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.name}</p>
            ) : null}
          </div>
        ) : null}

        <div>
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="am-email">
            Email
          </label>
          <input
            id="am-email"
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
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300" htmlFor="am-password">
            Password
          </label>
          <input
            id="am-password"
            className="input mt-2"
            value={form.password}
            onChange={(e) => setField('password', e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            type="password"
            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
            required
          />
          {touched.password && errors.password ? (
            <p className="mt-2 text-xs font-semibold text-red-600 dark:text-red-300">{errors.password}</p>
          ) : (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              8+ chars, uppercase letter, and a number.
            </p>
          )}
        </div>

        <button className="btn-primary w-full" type="submit">
          {tab === 'login' ? 'Sign in' : 'Create account'}
        </button>
      </form>
    </div>
  )
}

