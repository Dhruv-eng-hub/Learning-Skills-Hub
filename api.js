import axios from 'axios'
import { courses } from '../data/courses.js'

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL ?? '/api',
  timeout: 8000,
})

function getCustomCoursesFromStorage() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem('lshub:v1')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed?.customCourses) ? parsed.customCourses : []
  } catch {
    return []
  }
}

function mergeWithCustomCourses(baseCourses) {
  const custom = getCustomCoursesFromStorage()
  if (!custom.length) return baseCourses
  const map = new Map(baseCourses.map((course) => [String(course.id), course]))
  custom.forEach((course) => {
    map.set(String(course.id), course)
  })
  return Array.from(map.values())
}

export async function fetchCourses() {
  try {
    const res = await api.get('/courses')
    return mergeWithCustomCourses(res.data)
  } catch {
    // Fallback for offline/dev environments
    return mergeWithCustomCourses(courses)
  }
}

export async function fetchCourseById(courseId) {
  try {
    const mergedCourses = await fetchCourses()
    const numeric = Number(courseId)
    const byId = mergedCourses.find(
      (c) => String(c.id) === String(courseId) || c.id === numeric,
    )
    if (byId) {
      return byId
    }
    const res = await api.get(`/courses/${courseId}`)
    if (res.data) return res.data
  } catch {
    const numeric = Number(courseId)
    const course = mergeWithCustomCourses(courses).find(
      (c) => String(c.id) === String(courseId) || c.id === numeric,
    )
    if (!course) {
      const err = new Error('Course not found')
      err.status = 404
      throw err
    }
    return course
  }
}

