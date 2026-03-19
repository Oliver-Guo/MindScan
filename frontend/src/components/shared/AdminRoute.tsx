import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

interface AdminRouteProps {
  children: React.ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const user = useAuthStore(s => s.user)
  const token = useAuthStore(s => s.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
