import { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  X,
} from 'lucide-react'
import Modal from './Modal.jsx'
import { useApp } from '../hooks/useApp.js'
import { cn } from '../utils/cn.js'
import CartPanel from './cart/CartPanel.jsx'
import AuthModal from './auth/AuthModal.jsx'

const navLinkBase =
  'rounded-xl px-3 py-2 text-sm font-semibold transition hover:bg-slate-900/5 dark:hover:bg-white/10'

export default function Navbar() {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [q, setQ] = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cartCount = state.cartIds.length
  const wishlistCount = state.wishlistIds.length

  const links = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/courses', label: 'Courses' },
      { to: '/categories', label: 'Categories' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
    [],
  )

  function submitSearch(e) {
    e.preventDefault()
    const query = q.trim()
    navigate(query ? `/courses?q=${encodeURIComponent(query)}` : '/courses')
    setMenuOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition',
          scrolled ? 'backdrop-blur-xl' : '',
        )}
      >
        <div className="container-page">
          <div
            className={cn(
              'mt-3 flex items-center justify-between rounded-3xl px-3 py-3 ring-1 transition',
              scrolled
                ? 'glass-strong ring-black/5 dark:ring-white/10'
                : 'glass ring-black/5 dark:ring-white/10',
            )}
          >
            <div className="flex items-center gap-3">
              <button
                className="btn-ghost h-10 w-10 rounded-2xl p-0 lg:hidden"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <NavLink to="/" className="flex items-center gap-2">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                  <span className="text-sm font-black tracking-tight">LS</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-extrabold leading-4">Learning Skills Hub</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Premium courses
                  </p>
                </div>
              </NavLink>
            </div>

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    cn(
                      navLinkBase,
                      isActive
                        ? 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-200'
                        : 'text-slate-800 dark:text-slate-100',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <form onSubmit={submitSearch} className="hidden md:block">
                <label className="sr-only" htmlFor="nav-search">
                  Search courses
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
                  <input
                    id="nav-search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="input w-72 pl-9"
                    placeholder="Search courses…"
                  />
                </div>
              </form>

              <button
                className="btn-soft h-10 w-10 rounded-2xl p-0"
                onClick={actions.toggleTheme}
                aria-label="Toggle theme"
                title={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {state.theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <button
                className="btn-soft relative h-10 w-10 rounded-2xl p-0"
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
                title="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-extrabold text-white">
                    {cartCount}
                  </span>
                ) : null}
              </button>

              {state.user ? (
                <>
                  <button
                    className="btn-primary hidden sm:inline-flex"
                    onClick={() => navigate('/dashboard')}
                  >
                    Dashboard
                  </button>
                  {state.user.role === 'admin' ? (
                    <button
                      className="btn-soft hidden sm:inline-flex"
                      onClick={() => navigate('/admin')}
                    >
                      Admin
                    </button>
                  ) : null}
                  <button
                    className="btn-ghost hidden sm:inline-flex"
                    onClick={actions.logout}
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="btn-primary hidden sm:inline-flex"
                  onClick={() => {
                    setAuthMode('login')
                    setAuthOpen(true)
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              )}
            </div>
          </div>

          <AnimatePresence>
            {menuOpen ? (
              <motion.div
                className="mt-3 overflow-hidden rounded-3xl glass-strong lg:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
              >
                <div className="p-4">
                  <form onSubmit={submitSearch} className="md:hidden">
                    <label className="sr-only" htmlFor="nav-search-mobile">
                      Search courses
                    </label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-300" />
                      <input
                        id="nav-search-mobile"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="input pl-9"
                        placeholder="Search courses…"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>Wishlist: {wishlistCount}</span>
                      <span>Cart: {cartCount}</span>
                    </div>
                  </form>

                  <div className="mt-4 grid gap-1">
                    {links.map((l) => (
                      <NavLink
                        key={l.to}
                        to={l.to}
                        onClick={() => setMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                            isActive
                              ? 'bg-indigo-600/10 text-indigo-700 dark:text-indigo-200'
                              : 'hover:bg-slate-900/5 dark:hover:bg-white/10',
                          )
                        }
                      >
                        {l.label}
                      </NavLink>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {state.user ? (
                      <>
                        <button
                          className="btn-primary flex-1"
                          onClick={() => {
                            setMenuOpen(false)
                            navigate('/dashboard')
                          }}
                        >
                          Dashboard
                        </button>
                        {state.user.role === 'admin' ? (
                          <button
                            className="btn-soft flex-1"
                            onClick={() => {
                              setMenuOpen(false)
                              navigate('/admin')
                            }}
                          >
                            Admin
                          </button>
                        ) : null}
                        <button className="btn-ghost" onClick={actions.logout}>
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn-primary flex-1"
                          onClick={() => {
                            setMenuOpen(false)
                            setAuthMode('login')
                            setAuthOpen(true)
                          }}
                        >
                          Login
                        </button>
                        <button
                          className="btn-ghost flex-1"
                          onClick={() => {
                            setMenuOpen(false)
                            setAuthMode('register')
                            setAuthOpen(true)
                          }}
                        >
                          Create account
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      <Modal open={cartOpen} onClose={() => setCartOpen(false)} title="Your cart">
        <CartPanel onClose={() => setCartOpen(false)} />
      </Modal>

      <Modal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in or create account"
      >
        <AuthModal mode={authMode} onDone={() => setAuthOpen(false)} />
      </Modal>
    </>
  )
}

