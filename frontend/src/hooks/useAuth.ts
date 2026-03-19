import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { token, user, setAuth, logout, isAdmin } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return {
    token,
    user,
    isLoggedIn: !!token,
    isAdmin: isAdmin(),
    setAuth,
    logout: handleLogout,
  }
}
