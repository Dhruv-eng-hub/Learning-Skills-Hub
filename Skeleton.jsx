import { cn } from '../utils/cn.js'

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-slate-200/70 dark:bg-white/10',
        className,
      )}
      aria-hidden="true"
    />
  )
}

export function CourseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl glass-strong">
      <Skeleton className="h-44 w-full sm:h-48" />
      <div className="p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="mt-2 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-11/12" />
        <div className="mt-5 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  )
}

