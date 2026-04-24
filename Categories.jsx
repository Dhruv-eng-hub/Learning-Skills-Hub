import CategoryCard from '../components/CategoryCard.jsx'
import { Code2, Megaphone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Categories() {
  return (
    <div className="container-page py-10">
      <div className="glass-strong rounded-3xl p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Categories
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Two tracks. Unlimited momentum.
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Choose a learning track that matches your goals — build software or grow an audience.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <CategoryCard
            title="Software"
            description="React, Node.js, automation, architecture, and production patterns."
            to="/courses?category=Software"
            icon={Code2}
            image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80"
          />
          <CategoryCard
            title="Marketing"
            description="SEO, paid ads, content distribution, email lifecycle, and conversion."
            to="/courses?category=Marketing"
            icon={Megaphone}
            image="https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1600&q=80"
          />
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary" to="/courses">
            Browse all courses
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link className="btn-soft" to="/about">
            Learn about us
          </Link>
        </div>
      </div>
    </div>
  )
}

