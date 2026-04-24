import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star, ChevronDown, GraduationCap, Clock3 } from 'lucide-react'
import { fetchCourseById } from '../utils/api.js'
import { useApp } from '../hooks/useApp.js'
import { cn } from '../utils/cn.js'
import { Skeleton } from '../components/Skeleton.jsx'

function Curriculum({ sections = [] }) {
  const [open, setOpen] = useState(0)
  if (!sections.length) return null
  return (
    <div className="mt-3 space-y-3">
      {sections.map((s, idx) => {
        const isOpen = idx === open
        return (
          <div key={s.title} className="overflow-hidden rounded-3xl border border-black/5 bg-white/50 dark:border-white/10 dark:bg-white/5">
            <button
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              onClick={() => setOpen(isOpen ? -1 : idx)}
              aria-expanded={isOpen}
              type="button"
            >
              <span className="text-sm font-extrabold">{s.title}</span>
              <ChevronDown className={cn('h-5 w-5 transition', isOpen ? 'rotate-180' : '')} aria-hidden="true" />
            </button>
            {isOpen ? (
              <div className="px-6 pb-6">
                <ul className="grid gap-2 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default function CourseDetails() {
  const { courseId } = useParams()
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetchCourseById(courseId)
      .then((c) => {
        if (!alive) return
        setCourse(c)
      })
      .catch((e) => {
        if (!alive) return
        setError(e)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [courseId])

  const wished = course
    ? state.wishlistIds.some((id) => String(id) === String(course.id))
    : false
  const enrolled = course
    ? state.enrolledIds.some((id) => String(id) === String(course.id))
    : false
  const details = course?.details || {}

  if (loading) {
    return (
      <div className="container-page py-10">
        <div className="glass-strong rounded-3xl p-6 sm:p-10">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-4 h-10 w-3/4" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-11/12" />
          <Skeleton className="mt-8 h-56 w-full rounded-3xl" />
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container-page py-10">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-sm text-red-800 dark:text-red-200">
          Course not found. Go back to{' '}
          <Link className="font-semibold underline" to="/courses">
            courses
          </Link>
          .
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
        <section className="glass-strong overflow-hidden rounded-3xl">
          <div className="relative h-56 overflow-hidden sm:h-72">
            <img
              src={course.image}
              alt={course.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/15">
                {course.category} • {course.price}
              </p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white drop-shadow sm:text-4xl">
                <span className="inline-flex rounded-2xl bg-gradient-to-r from-indigo-500/45 via-fuchsia-500/35 to-indigo-500/45 px-4 py-2 ring-1 ring-white/15">
                  {course.title}
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
                {course.description}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {Number(course.rating).toFixed(1)}
              </span>
              <span className="badge bg-white/50 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                <GraduationCap className="h-3.5 w-3.5" />
                {details.level || 'Premium content'}
              </span>
              {details.duration ? (
                <span className="badge bg-white/50 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                  <Clock3 className="h-3.5 w-3.5" />
                  {details.duration}
                </span>
              ) : null}
              {details.lessons ? (
                <span className="badge bg-white/50 text-slate-700 dark:bg-white/5 dark:text-slate-200">
                  {details.lessons} lessons
                </span>
              ) : null}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-extrabold">What you’ll learn</h2>
              {Array.isArray(details.whatYouWillLearn) && details.whatYouWillLearn.length ? (
                <ul className="mt-3 grid gap-2 rounded-3xl border border-black/5 bg-white/50 p-5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 sm:grid-cols-2">
                  {details.whatYouWillLearn.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-3 rounded-3xl border border-black/5 bg-white/50 p-5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                  This course is designed to help you build practical skills with hands-on learning,
                  guided practice, and real-world use cases.
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-extrabold">Curriculum</h2>
              <Curriculum sections={details.curriculum || []} />
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-extrabold">Requirements</h2>
              {Array.isArray(details.requirements) && details.requirements.length ? (
                <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                  {details.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  No prerequisites — just bring curiosity and consistency.
                </p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-extrabold">Instructor</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {details.instructor || 'Learning Skills Hub Team'}
                </span>{' '}
                • Practical, hands-on guidance with a focus on outcomes.
              </p>
            </div>
          </div>
        </section>

        <aside className="glass-strong rounded-3xl p-6 lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Enrollment
          </p>
          <p className="mt-2 text-3xl font-black">{course.price}</p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Includes lifetime access. Dashboard progress is static for this demo.
          </p>

          <div className="mt-6 flex gap-2">
            <button
              className="btn-primary flex-1"
              onClick={() => {
                const ok = actions.addToCart(course.id)
                if (!ok) navigate('/login', { state: { from: location.pathname + location.search } })
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to cart
            </button>
            <button
              className={cn(
                'btn-soft h-10 w-10 rounded-2xl p-0',
                wished ? 'text-pink-600 dark:text-pink-300' : '',
              )}
              onClick={() => actions.toggleWishlist(course.id)}
              aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('h-5 w-5', wished ? 'fill-current' : '')} />
            </button>
          </div>

          <button
            className={cn('mt-3 w-full', enrolled ? 'btn-soft' : 'btn-ghost')}
            onClick={() => {
              const ok = actions.addToCart(course.id)
              if (!ok) {
                navigate('/login', { state: { from: location.pathname + location.search } })
                return
              }
              navigate('/checkout')
            }}
            disabled={enrolled}
          >
            {enrolled ? 'Already enrolled' : 'Buy now'}
          </button>

          <div className="mt-6 space-y-3 rounded-3xl border border-black/5 bg-white/40 p-5 text-sm dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 dark:text-slate-300">Category</span>
              <span className="font-semibold">{course.category}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-600 dark:text-slate-300">Rating</span>
              <span className="font-semibold">{Number(course.rating).toFixed(1)} ★</span>
            </div>
          </div>

          <motion.div
            className="mt-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-[1px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-3xl bg-slate-950/90 p-5 text-white">
              <p className="text-sm font-extrabold">Not sure?</p>
              <p className="mt-1 text-sm text-white/75">
                Browse more courses and compare ratings.
              </p>
              <Link className="mt-3 inline-flex text-sm font-semibold text-white underline" to="/courses">
                Back to courses
              </Link>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  )
}

