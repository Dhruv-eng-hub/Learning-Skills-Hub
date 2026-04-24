import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ title, description, to, icon: Icon, image }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-3xl glass-strong transition-shadow hover:shadow-2xl hover:shadow-indigo-600/10 focus-within:ring-2 focus-within:ring-indigo-500/25"
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {image ? (
        <div className="relative h-32 overflow-hidden">
          <img
            src={image}
            alt={`${title} category`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-5 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 text-white ring-1 ring-white/15">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <p className="text-lg font-extrabold text-white">{title}</p>
          </div>
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          {!image ? (
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
          ) : (
            <span />
          )}
          <ArrowRight
            className="h-5 w-5 text-slate-500 dark:text-slate-300"
            aria-hidden="true"
          />
        </div>
        {!image ? <h3 className="mt-4 text-lg font-extrabold">{title}</h3> : null}
        <p className={image ? 'text-sm text-slate-600 dark:text-slate-300' : 'mt-2 text-sm text-slate-600 dark:text-slate-300'}>
          {description}
        </p>
        <Link
          className="mt-5 inline-flex text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-200"
          to={to}
        >
          Explore {title}
        </Link>
      </div>
    </motion.div>
  )
}

