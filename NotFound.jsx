import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl glass-strong rounded-3xl p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          404
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" to="/">
            Go home
          </Link>
          <Link className="btn-soft" to="/courses">
            Browse courses
          </Link>
        </div>
      </div>
    </div>
  )
}

