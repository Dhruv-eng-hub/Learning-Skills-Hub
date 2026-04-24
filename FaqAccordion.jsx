import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn.js'

export default function FaqAccordion() {
  const items = useMemo(
    () => [
      {
        q: 'Is this a real checkout?',
        a: 'This project is frontend-only. Cart and enroll actions are simulated using local state + localStorage.',
      },
      {
        q: 'Do courses include certificates?',
        a: 'In a real product, yes. Here the dashboard displays enrolled courses and a static progress UI.',
      },
      {
        q: 'Can I switch between dark and light mode?',
        a: 'Yes — use the toggle in the navbar. Your preference is saved in localStorage.',
      },
      {
        q: 'How is data loaded?',
        a: 'Courses are sourced from a dedicated data file and fetched via a simulated Axios API with loading and error states.',
      },
    ],
    [],
  )
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="container-page py-12">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            FAQ
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
            Quick answers, zero fluff
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Everything you need to know about the platform experience and features.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => {
            const open = idx === openIndex
            return (
              <div key={item.q} className="overflow-hidden rounded-3xl glass-strong">
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenIndex(open ? -1 : idx)}
                  aria-expanded={open}
                >
                  <span className="text-sm font-extrabold">{item.q}</span>
                  <ChevronDown
                    className={cn('h-5 w-5 transition', open ? 'rotate-180' : '')}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-6 text-sm text-slate-600 dark:text-slate-300">
                        {item.a}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

