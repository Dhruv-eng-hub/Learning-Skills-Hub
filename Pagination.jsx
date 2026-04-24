import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clamp } from '../utils/format.js'

export default function Pagination({ page, pageCount, onPageChange }) {
  if (pageCount <= 1) return null
  const safePage = clamp(page, 1, pageCount)

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Page <span className="font-semibold">{safePage}</span> of{' '}
        <span className="font-semibold">{pageCount}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          className="btn-soft"
          onClick={() => onPageChange(safePage - 1)}
          disabled={safePage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <button
          className="btn-soft"
          onClick={() => onPageChange(safePage + 1)}
          disabled={safePage >= pageCount}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

