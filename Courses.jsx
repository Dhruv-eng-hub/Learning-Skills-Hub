import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCourses } from '../hooks/useCourses.js'
import CourseCard from '../components/CourseCard.jsx'
import { CourseCardSkeleton } from '../components/Skeleton.jsx'
import { cn } from '../utils/cn.js'

const PER_PAGE = 12

export default function Courses() {
  const { data, loading, error } = useCourses()
  const [params, setParams] = useSearchParams()
  const query = (params.get('q') ?? '').trim()
  const activeCategory = params.get('category') ?? 'All'
  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)

  function updateParams(nextPartial) {
    const next = new URLSearchParams(params)
    Object.entries(nextPartial).forEach(([k, v]) => {
      if (v === null || v === undefined || v === '' || v === 'All') next.delete(k)
      else next.set(k, String(v))
    })
    setParams(next, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    let list = data

    if (activeCategory !== 'All') {
      list = list.filter((c) => c.category === activeCategory)
    }
    if (q) {
      list = list.filter((c) => {
        const hay = `${c.title} ${c.description}`.toLowerCase()
        return hay.includes(q)
      })
    }
    return list
  }, [data, query, activeCategory])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Courses
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Browse premium training
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Search and filter premium courses. “Enroll Now” adds to cart (UI).
          </p>
        </div>
      </div>

      <div className="mt-6 glass-strong rounded-3xl p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {['All', 'Software', 'Marketing'].map((c) => (
              <button
                key={c}
                className={cn(
                  'btn-soft',
                  activeCategory === c ? 'ring-2 ring-indigo-500/30' : '',
                )}
                onClick={() => {
                  updateParams({ category: c, page: 1 })
                }}
                type="button"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Showing <span className="font-semibold">{filtered.length}</span> courses
            {query.trim() ? (
              <>
                {' '}
                for <span className="font-semibold">“{query.trim()}”</span>
              </>
            ) : null}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Page {safePage} / {pageCount}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-6 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-800 dark:text-red-200">
          Something went wrong while loading courses. Please refresh.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)
          : pageItems.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>

      {!loading && filtered.length === 0 ? (
        <div className="mt-6 rounded-3xl glass-strong p-8 text-sm text-slate-600 dark:text-slate-300">
          No courses match your search.
        </div>
      ) : null}

      {!loading && pageCount > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            className="btn-soft"
            onClick={() => updateParams({ page: safePage - 1 })}
            disabled={safePage <= 1}
          >
            Prev
          </button>
          <button
            className="btn-soft"
            onClick={() => updateParams({ page: safePage + 1 })}
            disabled={safePage >= pageCount}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}

