import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, ShoppingCart, Users, UserCheck } from 'lucide-react'
import { useApp } from '../hooks/useApp.js'
import { useCourses } from '../hooks/useCourses.js'

const defaultForm = {
  title: '',
  category: 'Software',
  image: '',
  priceValue: '',
  rating: '4.5',
  description: '',
  duration: '',
  lessons: '',
  level: '',
  instructor: '',
  whatYouWillLearn: '',
  curriculum: '',
  requirements: '',
  tools: '',
}

function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-3">
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  const { state, actions } = useApp()
  const { data: allCourses } = useCourses()
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState(null)

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }))
  }

  function resetForm() {
    setForm(defaultForm)
    setEditingId(null)
  }

  function toCoursePayload(id) {
    const priceValue = Number(form.priceValue) || 0
    const rating = Number(form.rating) || 4.5
    const requirements = form.requirements
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
    const whatYouWillLearn = form.whatYouWillLearn
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
    const tools = form.tools
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
    const curriculum = form.curriculum
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [titleRaw, itemsRaw] = line.split('::')
        const title = (titleRaw || '').trim()
        const items = (itemsRaw || '')
          .split('|')
          .map((x) => x.trim())
          .filter(Boolean)
        return {
          title: title || 'Module',
          items: items.length ? items : ['Overview'],
        }
      })

    return {
      id,
      title: form.title.trim(),
      category: form.category.trim() || 'Software',
      image:
        form.image.trim() ||
        'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
      priceValue,
      price: `₹${priceValue.toLocaleString('en-IN')}`,
      rating,
      description: form.description.trim(),
      details: {
        duration: form.duration.trim() || '8 weeks',
        lessons: Number(form.lessons) || 30,
        level: form.level.trim() || 'Beginner',
        instructor: form.instructor.trim() || 'Learning Skills Hub Team',
        whatYouWillLearn: whatYouWillLearn.length
          ? whatYouWillLearn
          : [
              'Understand fundamentals with practical examples',
              'Apply concepts in hands-on exercises',
              'Build confidence through guided projects',
            ],
        curriculum: curriculum.length
          ? curriculum
          : [
              {
                title: 'Foundations',
                items: ['Core concepts', 'Setup and workflow', 'Best practices'],
              },
              {
                title: 'Hands-on Practice',
                items: ['Mini project', 'Debugging scenarios', 'Implementation tips'],
              },
            ],
        requirements: requirements.length ? requirements : ['Laptop and internet connection'],
        tools: tools.length ? tools : ['Practical exercises', 'Project templates'],
      },
    }
  }

  function submitCourse(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim() || !Number(form.priceValue)) return

    if (editingId) {
      actions.updateCustomCourse(toCoursePayload(editingId))
    } else {
      const id = `custom-${Date.now()}`
      actions.addCustomCourse(toCoursePayload(id))
    }
    resetForm()
  }

  function startEdit(course) {
    setEditingId(course.id)
    setForm({
      title: course.title || '',
      category: course.category || 'Software',
      image: course.image || '',
      priceValue: String(course.priceValue || ''),
      rating: String(course.rating || 4.5),
      description: course.description || '',
      duration: course.details?.duration || '',
      lessons: String(course.details?.lessons || ''),
      level: course.details?.level || '',
      instructor: course.details?.instructor || '',
      whatYouWillLearn: Array.isArray(course.details?.whatYouWillLearn)
        ? course.details.whatYouWillLearn.join(', ')
        : '',
      curriculum: Array.isArray(course.details?.curriculum)
        ? course.details.curriculum
            .map((module) => `${module.title || 'Module'}::${(module.items || []).join(' | ')}`)
            .join('\n')
        : '',
      requirements: Array.isArray(course.details?.requirements)
        ? course.details.requirements.join(', ')
        : '',
      tools: Array.isArray(course.details?.tools) ? course.details.tools.join(', ') : '',
    })
  }

  const report = useMemo(() => {
    const enrollmentItems = state.enrollments
      .map((item) => {
        const course = allCourses.find((x) => x.id === item.courseId)
        return {
          ...item,
          title: item.title || course?.title || 'Course',
          category: course?.category || 'General',
          priceValue: Number(item.priceValue ?? course?.priceValue ?? 0),
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime())
    const revenue = enrollmentItems.reduce(
      (sum, item) => sum + (Number(item.priceValue) || 0),
      0,
    )

    return {
      totalCourses: allCourses.length,
      customCount: state.customCourses.length,
      enrolledCount: enrollmentItems.length,
      cartCount: state.cartIds.length,
      revenueLabel: `₹${revenue.toLocaleString('en-IN')}`,
      recentEnrollments: enrollmentItems.slice(0, 10),
    }
  }, [allCourses, state.cartIds.length, state.customCourses.length, state.enrollments])

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Admin control panel
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            High-level snapshot of users, courses, enrollments, and revenue.
          </p>
        </div>
        <Link className="btn-soft" to="/dashboard">
          Back to dashboard
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Active users"
          value={state.user ? 1 : 0}
          tone="bg-indigo-600/10 text-indigo-700 dark:text-indigo-200"
        />
        <StatCard
          icon={GraduationCap}
          label="Published courses"
          value={report.totalCourses}
          tone="bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
        />
        <StatCard
          icon={UserCheck}
          label="Enrollments"
          value={report.enrolledCount}
          tone="bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200"
        />
        <StatCard
          icon={ShoppingCart}
          label="Revenue (demo)"
          value={report.revenueLabel}
          tone="bg-amber-500/10 text-amber-700 dark:text-amber-200"
        />
      </div>

      <section className="mt-6 glass-strong rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-extrabold">Course management</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Add new course details and maintain admin-created courses.
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Admin-created courses: {report.customCount}
        </p>

        <form className="mt-5 grid gap-3 md:grid-cols-2" onSubmit={submitCourse}>
          <input
            className="input"
            placeholder="Course title"
            value={form.title}
            onChange={(e) => setField('title', e.target.value)}
            required
          />
          <select
            className="input"
            value={form.category}
            onChange={(e) => setField('category', e.target.value)}
          >
            <option value="Software">Software</option>
            <option value="Marketing">Marketing</option>
          </select>
          <input
            className="input"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setField('image', e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="100"
            placeholder="Price (number)"
            value={form.priceValue}
            onChange={(e) => setField('priceValue', e.target.value)}
            required
          />
          <input
            className="input"
            placeholder="Rating (e.g. 4.5)"
            value={form.rating}
            onChange={(e) => setField('rating', e.target.value)}
          />
          <input
            className="input"
            placeholder="Duration (e.g. 8 weeks)"
            value={form.duration}
            onChange={(e) => setField('duration', e.target.value)}
          />
          <input
            className="input"
            placeholder="Lessons count"
            type="number"
            min="1"
            value={form.lessons}
            onChange={(e) => setField('lessons', e.target.value)}
          />
          <input
            className="input"
            placeholder="Level"
            value={form.level}
            onChange={(e) => setField('level', e.target.value)}
          />
          <input
            className="input md:col-span-2"
            placeholder="Instructor name"
            value={form.instructor}
            onChange={(e) => setField('instructor', e.target.value)}
          />
          <textarea
            className="input min-h-20 md:col-span-2"
            placeholder="What you will learn (comma separated)"
            value={form.whatYouWillLearn}
            onChange={(e) => setField('whatYouWillLearn', e.target.value)}
          />
          <textarea
            className="input min-h-24 md:col-span-2"
            placeholder={'Curriculum (one module per line)\nExample: Foundations::Intro | Setup | Basics'}
            value={form.curriculum}
            onChange={(e) => setField('curriculum', e.target.value)}
          />
          <textarea
            className="input min-h-24 md:col-span-2"
            placeholder="Course description"
            value={form.description}
            onChange={(e) => setField('description', e.target.value)}
            required
          />
          <textarea
            className="input min-h-20 md:col-span-2"
            placeholder="Requirements (comma separated)"
            value={form.requirements}
            onChange={(e) => setField('requirements', e.target.value)}
          />
          <textarea
            className="input min-h-20 md:col-span-2"
            placeholder="Tools (comma separated)"
            value={form.tools}
            onChange={(e) => setField('tools', e.target.value)}
          />
          <div className="flex gap-2 md:col-span-2">
            <button className="btn-primary" type="submit">
              {editingId ? 'Update course' : 'Add course'}
            </button>
            <button className="btn-soft" type="button" onClick={resetForm}>
              Clear
            </button>
          </div>
        </form>
      </section>

      <section className="mt-6 glass-strong rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-extrabold">Admin-created courses</h2>
        <div className="mt-5 space-y-3">
          {state.customCourses.length === 0 ? (
            <p className="rounded-2xl border border-black/5 bg-white/40 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              No admin-created courses yet.
            </p>
          ) : (
            state.customCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-black/5 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <p className="font-extrabold">{course.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {course.category} • {course.price} • Rating {Number(course.rating).toFixed(1)}
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="btn-soft" onClick={() => startEdit(course)} type="button">
                    Edit
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => actions.deleteCustomCourse(course.id)}
                    type="button"
                  >
                    Delete
                  </button>
                  <Link className="btn-soft" to={`/courses/${course.id}`}>
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-6 glass-strong rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-extrabold">Recent enrollments</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Latest learner enrollments with date/time from stored enrollment records.
        </p>

        <div className="mt-5 space-y-3">
          {report.recentEnrollments.length === 0 ? (
            <p className="rounded-2xl border border-black/5 bg-white/40 p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              No enrollments yet. Visit the courses page and enroll in a course to populate this
              section.
            </p>
          ) : (
            report.recentEnrollments.map((item) => (
              <Link
                key={item.id}
                to={`/courses/${item.courseId}`}
                className="block rounded-2xl border border-black/5 bg-white/40 p-4 transition hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <p className="font-extrabold">{item.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {item.category} • ₹{Number(item.priceValue || 0).toLocaleString('en-IN')} • {item.userName} (
                  {item.userEmail || 'no-email'})
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {new Date(item.enrolledAt).toLocaleString('en-IN')} • {item.paymentMethod} •{' '}
                  {item.paymentRef}
                </p>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
