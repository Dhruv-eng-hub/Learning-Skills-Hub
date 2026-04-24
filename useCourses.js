import { useEffect, useMemo, useState } from 'react'
import { fetchCourses } from '../utils/api.js'

export function useCourses() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetchCourses()
      .then((courses) => {
        if (!alive) return
        setData(courses)
      })
      .catch((e) => {
        if (!alive) return
        setError(e)
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })
    return () => {
      alive = false
    }
  }, [])

  return useMemo(() => ({ data, loading, error }), [data, loading, error])
}

