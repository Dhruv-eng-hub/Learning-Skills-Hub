import { useMemo } from 'react'
import { BookOpen, Heart, User, TrendingUp } from 'lucide-react'
import { useApp } from '../hooks/useApp.js'
import { useCourses } from '../hooks/useCourses.js'
import { Link } from 'react-router-dom'

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10" aria-hidden="true">
      <div className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600" style={{ width: `${value}%` }} />
    </div>
  )
}

export default function Dashboard() {
  const { state, actions } = useApp()
  const { data: courses } = useCourses()

  const enrolled = useMemo(() => {
    return state.enrolledIds
      .map((id) => courses.find((c) => String(c.id) === String(id)))
      .filter(Boolean)
  }, [courses, state.enrolledIds])

  const wishlist = useMemo(() => {
    return state.wishlistIds
      .map((id) => courses.find((c) => String(c.id) === String(id)))
      .filter(Boolean)
  }, [courses, state.wishlistIds])

  const stats = useMemo(() => {
    const spent = enrolled.reduce((sum, c) => sum + (Number(c.priceValue) || 0), 0)
    return { spent, enrolledCount: enrolled.length, wishlistCount: wishlist.length }
  }, [enrolled, wishlist])
  const spentLabel = `₹${stats.spent.toLocaleString('en-IN')}`

  const user = state.user

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Welcome, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage your enrolled courses and wishlist.
          </p>
        </div>
        <button className="btn-ghost sm:w-auto" onClick={actions.logout}>
          Log out
        </button>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-4">
        <div className="glass-strong rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
              <User className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold">Profile</p>
              <p className="truncate text-sm text-slate-600 dark:text-slate-300">{user?.email}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-600 dark:text-slate-300">Enrolled</p>
              <p className="mt-2 text-2xl font-black">{stats.enrolledCount}</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-600 dark:text-slate-300">Wishlist</p>
              <p className="mt-2 text-2xl font-black">{stats.wishlistCount}</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs text-slate-600 dark:text-slate-300">Spent</p>
              <p className="mt-2 text-2xl font-black">{spentLabel}</p>
            </div>
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-200">
              <TrendingUp className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-extrabold">Progress</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Static demo UI</p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {[
              { label: 'Weekly streak', value: 62 },
              { label: 'Completion', value: 38 },
              { label: 'Skill score', value: 74 },
            ].map((x) => (
              <div key={x.label}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <span>{x.label}</span>
                  <span>{x.value}%</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={x.value} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-strong rounded-3xl p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200">
              <Heart className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-extrabold">Wishlist</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">Quick access</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {wishlist.length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-300">
                No saved courses yet. Browse{' '}
                <Link className="font-semibold text-indigo-700 hover:underline dark:text-indigo-200" to="/courses">
                  courses
                </Link>
                .
              </p>
            ) : (
              wishlist.slice(0, 3).map((c) => (
                <Link
                  key={c.id}
                  to={`/courses/${c.id}`}
                  className="block rounded-2xl border border-black/5 bg-white/40 p-4 text-sm transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                >
                  <p className="font-extrabold">{c.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {c.category} • {formatCurrency(c.price)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <section className="mt-6 glass-strong rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Enrolled courses</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Your learning library
              </p>
            </div>
          </div>
          <Link className="btn-soft" to="/courses">
            Add more
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrolled.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-3xl border border-black/5 bg-white/40 p-8 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              You haven’t enrolled in any courses yet. Add items to your cart and checkout (UI), or use “Enroll now (UI)” on a course.
            </div>
          ) : (
            enrolled.map((c) => (
              <Link
                key={c.id}
                to={`/courses/${c.id}`}
                className="group overflow-hidden rounded-3xl border border-black/5 bg-white/40 transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <img src={c.image} alt={c.title} className="h-32 w-full object-cover transition duration-500 group-hover:scale-[1.02]" loading="lazy" />
                <div className="p-5">
                  <p className="text-sm font-extrabold">{c.title}</p>
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                    {c.category} • {c.details?.duration || 'Self-paced'}
                  </p>
                  <div className="mt-4">
                    <ProgressBar value={Math.floor((c.rating / 5) * 100)} />
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Progress is static (demo).
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

