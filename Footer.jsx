import { NavLink } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/10">
      <div className="container-page py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-extrabold">Learning Skills Hub</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Premium software and digital marketing training with a modern, delightful UI.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Platform
              </p>
              <NavLink className="block hover:underline" to="/courses">
                Courses
              </NavLink>
              <NavLink className="block hover:underline" to="/categories">
                Categories
              </NavLink>
              <NavLink className="block hover:underline" to="/dashboard">
                Dashboard
              </NavLink>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Company
              </p>
              <NavLink className="block hover:underline" to="/about">
                About
              </NavLink>
              <NavLink className="block hover:underline" to="/contact">
                Contact
              </NavLink>
            </div>
          </div>
          <div className="glass rounded-3xl p-5">
            <p className="text-sm font-semibold">Newsletter</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Get new course drops and growth tactics weekly.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
              }}
            >
              <label className="sr-only" htmlFor="footer-email">
                Email
              </label>
              <input
                id="footer-email"
                className="input"
                placeholder="you@company.com"
                type="email"
                required
              />
              <button className="btn-primary whitespace-nowrap" type="submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-black/5 pt-6 text-xs text-slate-600 dark:border-white/10 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Learning Skills Hub. All rights reserved.</span>
          <span>Built with React, Tailwind, Framer Motion.</span>
        </div>
      </div>
    </footer>
  )
}

