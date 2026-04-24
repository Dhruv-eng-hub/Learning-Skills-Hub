import { motion } from 'framer-motion'
import { Heart, Star } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../hooks/useApp.js'
import { cn } from '../utils/cn.js'

export default function CourseCard({ course }) {
  const { state, actions } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const wished = state.wishlistIds.includes(course.id)

  return (
    <motion.article
      className="group relative overflow-hidden rounded-3xl glass-strong transition-shadow hover:shadow-2xl hover:shadow-indigo-600/10 focus-within:ring-2 focus-within:ring-indigo-500/25"
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-indigo-500/25 transition group-hover:ring-indigo-400/55 group-focus-within:ring-indigo-400/60" />
      <div className="pointer-events-none absolute inset-x-5 top-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="pointer-events-none absolute inset-x-5 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="pointer-events-none absolute inset-y-5 left-0 w-0.5 bg-gradient-to-b from-transparent via-indigo-400/65 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="pointer-events-none absolute inset-y-5 right-0 w-0.5 bg-gradient-to-b from-transparent via-indigo-400/65 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="badge bg-white/80 text-slate-900">
            {course.category}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-white">
              <span className="inline-flex max-w-full rounded-lg bg-gradient-to-r from-indigo-500/45 via-fuchsia-500/35 to-indigo-500/45 px-2 py-0.5 shadow-sm ring-1 ring-white/15 transition group-hover:from-indigo-400/55 group-hover:via-fuchsia-400/45 group-hover:to-indigo-400/55">
                <span className="truncate">{course.title}</span>
              </span>
            </p>
            <p className="mt-1 text-xs text-white/80">Premium course</p>
          </div>
          <div className="flex items-center gap-1 rounded-2xl bg-white/15 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15">
            <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
            {Number(course.rating).toFixed(1)}
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-extrabold">{course.price}</p>
          <span className="badge bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
            Rating {Number(course.rating).toFixed(1)} ★
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            className="btn-primary flex-1"
            onClick={() => {
              const ok = actions.addToCart(course.id)
              if (!ok) navigate('/login', { state: { from: location.pathname + location.search } })
            }}
          >
            Enroll Now
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
          <Link
            className="btn-soft h-10 w-10 rounded-2xl p-0"
            to={`/courses/${course.id}`}
            aria-label="View details"
            title="View details"
          >
            <span className="text-sm font-extrabold">i</span>
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

