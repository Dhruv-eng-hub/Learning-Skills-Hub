import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../hooks/useApp.js'

export default function ProtectedRoute({ children }) {
  const { state } = useApp()
  const location = useLocation()

  if (!state.user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

