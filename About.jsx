import { motion } from 'framer-motion'
import { Award, ShieldCheck, Zap, Target, Layers, Rocket } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function About() {
  const items = [
    {
      icon: Zap,
      title: 'Modern learning UX',
      text: 'A premium, responsive interface with glassmorphism, smooth motion, and dark/light mode.',
    },
    {
      icon: ShieldCheck,
      title: 'Production-ready patterns',
      text: 'Reusable components, code-splitting, loading states, and clean architecture built for scale.',
    },
    {
      icon: Award,
      title: 'Skills that matter',
      text: 'Software + marketing courses designed around practical outcomes and portfolio-ready work.',
    },
  ]

  return (
    <div className="container-page py-10">
      <section className="glass-strong overflow-hidden rounded-3xl">
        <div className="relative p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-[-6rem] h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            About
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Learning Skills Hub — learn, build, grow
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            Learning Skills Hub is a premium course platform for two high-impact tracks:{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">Software</span> and{' '}
            <span className="font-semibold text-slate-900 dark:text-slate-100">Digital Marketing</span>.
            We focus on practical learning paths, clean UI/UX, and a fast browsing experience so learners
            can confidently pick a course and take action.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" to="/courses">
              Browse courses
            </Link>
            <Link className="btn-soft" to="/categories">
              Explore categories
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {items.map((it) => (
              <motion.div
                key={it.title}
                className="rounded-3xl border border-black/5 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
                  <it.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="mt-4 text-lg font-extrabold">{it.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{it.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-200">
                  <Target className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm font-extrabold">Our mission</p>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Help learners build real skills that translate into projects, interviews, and measurable business growth.
              </p>
            </div>
            <div className="rounded-3xl border border-black/5 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-200">
                  <Layers className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm font-extrabold">How learning works</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true" />
                  <span>Pick a track (Software / Marketing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true" />
                  <span>Enroll and follow a structured curriculum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-indigo-600" aria-hidden="true" />
                  <span>Track progress in your dashboard</span>
                </li>
              </ul>
            </div>
            <div className="rounded-3xl border border-black/5 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200">
                  <Rocket className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm font-extrabold">What you’ll achieve</p>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                Confidence to build applications, run campaigns, and understand metrics that move results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

