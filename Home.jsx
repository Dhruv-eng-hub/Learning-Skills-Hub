import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import CourseCard from '../components/CourseCard.jsx'
import CategoryCard from '../components/CategoryCard.jsx'
import TestimonialsCarousel from '../components/TestimonialsCarousel.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import { courses } from '../data/courses.js'
import { Code2, Megaphone } from 'lucide-react'

export default function Home() {
  const featured = courses.slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-24 right-[-6rem] h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        </div>

        <div className="container-page py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <motion.div
                className="inline-flex items-center gap-2 rounded-full bg-indigo-600/10 px-4 py-2 text-xs font-semibold text-indigo-700 ring-1 ring-black/5 dark:text-indigo-200 dark:ring-white/10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Premium learning paths for 2026
              </motion.div>

              <motion.h1
                className="mt-5 text-4xl font-black tracking-tight sm:text-5xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                Learn skills that ship products and grow revenue.
              </motion.h1>
              <motion.p
                className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                Learning Skills Hub is a premium platform for software training and digital
                marketing courses — with modern UX, glass UI, and smooth animations.
              </motion.p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" to="/courses">
                  Browse courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className="btn-soft" to="/categories">
                  Explore categories
                </Link>
              </div>

              <div className="mt-7 grid gap-3 text-sm text-slate-700 dark:text-slate-200 sm:grid-cols-2">
                {[
                  'Curated, job-relevant curricula',
                  'Modern UI + dark mode',
                  'Wishlist + cart (UI)',
                  'Dashboard with progress',
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              className="glass-strong relative overflow-hidden rounded-3xl p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
            >
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                {featured.map((c) => (
                  <div key={c.id} className="overflow-hidden rounded-3xl bg-white/40 dark:bg-white/5">
                    <img src={c.image} alt={c.title} className="h-24 w-full object-cover" loading="lazy" />
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-extrabold">{c.title}</p>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                        {c.category} • {c.price}
                      </p>
                      <Link className="mt-3 inline-flex text-xs font-semibold text-indigo-700 hover:underline dark:text-indigo-200" to={`/courses/${c.id}`}>
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-[1px]">
                <div className="rounded-2xl bg-slate-950/90 px-5 py-4 text-white">
                  <p className="text-sm font-extrabold">Upgrade your skill stack</p>
                  <p className="mt-1 text-sm text-white/75">
                    Switch tracks anytime — Software or Marketing.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Categories
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Pick your track
            </h2>
          </div>
          <Link className="hidden text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-200 sm:inline-flex" to="/categories">
            View all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CategoryCard
            title="Software"
            description="Frontend, backend, automation, and modern product engineering."
            to="/courses?category=Software"
            icon={Code2}
            image="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80"
          />
          <CategoryCard
            title="Marketing"
            description="SEO, paid ads, content strategy, lifecycle, and conversion."
            to="/courses?category=Marketing"
            icon={Megaphone}
            image="https://images.unsplash.com/photo-1556761175-129418cb2dfe?auto=format&fit=crop&w=1600&q=80"
          />
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Featured courses
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
              Start with a premium pick
            </h2>
          </div>
          <Link className="hidden text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-200 sm:inline-flex" to="/courses">
            Browse all
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      </section>

      <TestimonialsCarousel />
      <FaqAccordion />

      <section className="container-page pb-14">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 p-[1px]">
          <div className="glass-strong rounded-3xl p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Newsletter
                </p>
                <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                  Get new courses and growth tactics
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  One email per week. No spam.
                </p>
              </div>
              <form
                className="flex w-full flex-col gap-2 sm:flex-row md:w-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <label className="sr-only" htmlFor="home-email">
                  Email
                </label>
                <input
                  id="home-email"
                  className="input w-full sm:w-80"
                  placeholder="you@company.com"
                  type="email"
                  required
                />
                <button className="btn-primary whitespace-nowrap" type="submit">
                  Subscribe
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

