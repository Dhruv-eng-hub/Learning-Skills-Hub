import { createContext, useEffect, useMemo, useReducer } from 'react'
import toast from 'react-hot-toast'
import { safeJsonParse } from '../utils/storage.js'

const STORAGE_KEY = 'lshub:v1'

const initialState = {
  theme: 'dark',
  user: null, // { id, name, email, role }
  wishlistIds: [],
  cartIds: [],
  pendingCartAddId: null,
  enrolledIds: [],
  enrollments: [], // { id, orderId, courseId, title, priceValue, userName, userEmail, ...paymentAndAddress }
  customCourses: [],
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null
  return { ...user, role: user.role === 'admin' ? 'admin' : 'learner' }
}

function sameCourseId(a, b) {
  return String(a) === String(b)
}

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
        user: normalizeUser(action.payload?.user),
        enrollments: Array.isArray(action.payload?.enrollments) ? action.payload.enrollments : [],
        customCourses: Array.isArray(action.payload?.customCourses)
          ? action.payload.customCourses
          : [],
      }
    case 'THEME_SET':
      return { ...state, theme: action.payload }
    case 'AUTH_LOGIN':
      return { ...state, user: action.payload }
    case 'AUTH_LOGOUT':
      return { ...state, user: null, cartIds: [], wishlistIds: [], pendingCartAddId: null }
    case 'WISHLIST_TOGGLE': {
      const id = action.payload
      const exists = state.wishlistIds.some((x) => sameCourseId(x, id))
      return {
        ...state,
        wishlistIds: exists
          ? state.wishlistIds.filter((x) => !sameCourseId(x, id))
          : [...state.wishlistIds, id],
      }
    }
    case 'CART_ADD': {
      const id = action.payload
      if (state.cartIds.some((x) => sameCourseId(x, id))) return state
      return { ...state, cartIds: [...state.cartIds, id] }
    }
    case 'CART_ADD_PENDING': {
      return { ...state, pendingCartAddId: action.payload }
    }
    case 'CART_CLEAR_PENDING': {
      return { ...state, pendingCartAddId: null }
    }
    case 'CART_REMOVE': {
      const id = action.payload
      return { ...state, cartIds: state.cartIds.filter((x) => !sameCourseId(x, id)) }
    }
    case 'CART_CLEAR':
      return { ...state, cartIds: [] }
    case 'ENROLL': {
      const payload =
        typeof action.payload === 'object' && action.payload !== null
          ? action.payload
          : { courseId: action.payload }
      const id = payload.courseId
      if (state.enrolledIds.some((x) => sameCourseId(x, id))) return state
      return {
        ...state,
        enrolledIds: [...state.enrolledIds, id],
        enrollments: [
          {
            id: payload.id || crypto.randomUUID(),
            orderId: payload.orderId || `ORD-${Date.now()}`,
            courseId: id,
            title: payload.title || '',
            priceValue: Number(payload.priceValue) || 0,
            userName: payload.userName || state.user?.name || 'Learner',
            userEmail: payload.userEmail || state.user?.email || '',
            phone: payload.phone || '',
            addressLine: payload.addressLine || '',
            city: payload.city || '',
            stateName: payload.stateName || '',
            pincode: payload.pincode || '',
            paymentMethod: payload.paymentMethod || 'UPI',
            paymentRef: payload.paymentRef || `PAY-${Date.now()}`,
            enrolledAt: payload.enrolledAt || new Date().toISOString(),
          },
          ...state.enrollments,
        ],
      }
    }
    case 'ADMIN_COURSE_ADD':
      return { ...state, customCourses: [action.payload, ...state.customCourses] }
    case 'ADMIN_COURSE_UPDATE': {
      const next = state.customCourses.map((c) =>
        c.id === action.payload.id ? { ...c, ...action.payload } : c,
      )
      return { ...state, customCourses: next }
    }
    case 'ADMIN_COURSE_DELETE':
      return {
        ...state,
        customCourses: state.customCourses.filter((c) => c.id !== action.payload),
        wishlistIds: state.wishlistIds.filter((id) => !sameCourseId(id, action.payload)),
        cartIds: state.cartIds.filter((id) => !sameCourseId(id, action.payload)),
        enrolledIds: state.enrolledIds.filter((id) => !sameCourseId(id, action.payload)),
        enrollments: state.enrollments.filter((x) => !sameCourseId(x.courseId, action.payload)),
      }
    default:
      return state
  }
}

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    const stored = safeJsonParse(raw)
    if (stored && typeof stored === 'object') {
      dispatch({ type: 'HYDRATE', payload: stored })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const root = document.documentElement
    const theme = state.theme
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.theme])

  const actions = useMemo(() => {
    return {
      setTheme(theme) {
        dispatch({ type: 'THEME_SET', payload: theme })
      },
      toggleTheme() {
        dispatch({
          type: 'THEME_SET',
          payload: state.theme === 'dark' ? 'light' : 'dark',
        })
      },
      login({ name, email, role = 'learner' }) {
        const user = {
          id: crypto.randomUUID(),
          name,
          email,
          role: role === 'admin' ? 'admin' : 'learner',
        }
        dispatch({ type: 'AUTH_LOGIN', payload: user })
        if (state.pendingCartAddId) {
          dispatch({ type: 'CART_ADD', payload: state.pendingCartAddId })
          dispatch({ type: 'CART_CLEAR_PENDING' })
          toast.success('Added to cart')
        }
        toast.success('Welcome back!')
      },
      register({ name, email }) {
        const user = { id: crypto.randomUUID(), name, email, role: 'learner' }
        dispatch({ type: 'AUTH_LOGIN', payload: user })
        if (state.pendingCartAddId) {
          dispatch({ type: 'CART_ADD', payload: state.pendingCartAddId })
          dispatch({ type: 'CART_CLEAR_PENDING' })
          toast.success('Added to cart')
        }
        toast.success('Account created!')
      },
      logout() {
        dispatch({ type: 'AUTH_LOGOUT' })
        toast('Logged out')
      },
      toggleWishlist(courseId) {
        dispatch({ type: 'WISHLIST_TOGGLE', payload: courseId })
        const inWishlist = state.wishlistIds.some((id) => sameCourseId(id, courseId))
        toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
      },
      addToCart(courseId) {
        if (!state.user) {
          dispatch({ type: 'CART_ADD_PENDING', payload: courseId })
          toast.error('Please login to add to cart')
          return false
        }
        if (state.cartIds.some((x) => sameCourseId(x, courseId))) {
          toast('Already in cart')
          return true
        }
        dispatch({ type: 'CART_ADD', payload: courseId })
        toast.success('Added to cart')
        return true
      },
      removeFromCart(courseId) {
        dispatch({ type: 'CART_REMOVE', payload: courseId })
        toast('Removed from cart')
      },
      clearCart() {
        dispatch({ type: 'CART_CLEAR' })
      },
      enroll(courseOrId) {
        if (typeof courseOrId === 'object' && courseOrId !== null) {
          dispatch({
            type: 'ENROLL',
            payload: {
              courseId: courseOrId.id,
              title: courseOrId.title,
              priceValue: courseOrId.priceValue,
            },
          })
        } else {
          dispatch({ type: 'ENROLL', payload: { courseId: courseOrId } })
        }
        toast.success('Enrolled!')
      },
      checkoutEnrollments({ courses, learnerDetails, paymentDetails }) {
        if (!state.user) {
          toast.error('Please login to continue checkout')
          return false
        }
        const validCourses = Array.isArray(courses) ? courses.filter(Boolean) : []
        if (!validCourses.length) {
          toast.error('No courses available for checkout')
          return false
        }
        const newCourses = validCourses.filter(
          (course) => !state.enrolledIds.some((id) => sameCourseId(id, course.id)),
        )
        if (!newCourses.length) {
          toast('All selected courses are already enrolled')
          return false
        }

        const orderId = `ORD-${Date.now()}`
        const enrolledAt = new Date().toISOString()
        newCourses.forEach((course) => {
          dispatch({
            type: 'ENROLL',
            payload: {
              courseId: course.id,
              title: course.title,
              priceValue: course.priceValue,
              orderId,
              userName: learnerDetails?.fullName || state.user?.name || 'Learner',
              userEmail: learnerDetails?.email || state.user?.email || '',
              phone: learnerDetails?.phone || '',
              addressLine: learnerDetails?.addressLine || '',
              city: learnerDetails?.city || '',
              stateName: learnerDetails?.stateName || '',
              pincode: learnerDetails?.pincode || '',
              paymentMethod: paymentDetails?.method || 'UPI',
              paymentRef: paymentDetails?.reference || `PAY-${Date.now()}`,
              enrolledAt,
            },
          })
        })
        dispatch({ type: 'CART_CLEAR' })
        toast.success(`Payment successful. ${newCourses.length} course(s) enrolled.`)
        return true
      },
      addCustomCourse(payload) {
        if (state.user?.role !== 'admin') {
          toast.error('Only admin can add courses')
          return false
        }
        dispatch({ type: 'ADMIN_COURSE_ADD', payload })
        toast.success('Course added')
        return true
      },
      updateCustomCourse(payload) {
        if (state.user?.role !== 'admin') {
          toast.error('Only admin can update courses')
          return false
        }
        dispatch({ type: 'ADMIN_COURSE_UPDATE', payload })
        toast.success('Course updated')
        return true
      },
      deleteCustomCourse(courseId) {
        if (state.user?.role !== 'admin') {
          toast.error('Only admin can delete courses')
          return false
        }
        dispatch({ type: 'ADMIN_COURSE_DELETE', payload: courseId })
        toast.success('Course deleted')
        return true
      },
    }
  }, [
    state.cartIds,
    state.pendingCartAddId,
    state.theme,
    state.user,
    state.wishlistIds,
  ])

  const value = useMemo(() => ({ state, actions }), [state, actions])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

