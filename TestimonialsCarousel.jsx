import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

export default function TestimonialsCarousel() {
  const items = useMemo(
    () => [
      {
        name: 'Riya S.',
        role: 'Frontend Engineer',
        text: 'The UI is premium and the course path is crystal-clear. I shipped a React project in a week.',
      },
      {
        name: 'James T.',
        role: 'Growth Marketer',
        text: 'The marketing courses are tactical. The templates alone paid for the subscription.',
      },
      {
        name: 'Maya K.',
        role: 'Product Designer',
        text: 'Beautiful glass UI, fast navigation, and the course details are actually useful for decision making.',
      },
    ],
    [],
  )
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6500)
    return () => clearInterval(id)
  }, [items.length])

  const current = items[index]

  return (
    <section className="container-page py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Testimonials
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Loved by builders and marketers
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button className="btn-soft" onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="btn-soft" onClick={() => setIndex((i) => (i + 1) % items.length)}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl glass-strong">
        <div className="relative p-6 sm:p-10">
          <Quote className="absolute right-6 top-6 h-10 w-10 text-indigo-600/25" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-lg font-semibold leading-relaxed text-slate-900 dark:text-slate-50 sm:text-xl">
                “{current.text}”
              </p>
              <div className="mt-6">
                <p className="text-sm font-extrabold">{current.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{current.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex gap-2 sm:hidden">
            <button className="btn-soft flex-1" onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}>
              Prev
            </button>
            <button className="btn-soft flex-1" onClick={() => setIndex((i) => (i + 1) % items.length)}>
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

