import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <div className="container-page py-16">
      <div className="glass-strong rounded-3xl p-8">
        <div className="flex items-center gap-4">
          <motion.div
            className="h-10 w-10 rounded-2xl bg-indigo-600/20"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Loading…
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Preparing your premium learning experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

