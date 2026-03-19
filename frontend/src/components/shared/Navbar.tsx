import { Link, useNavigate } from 'react-router-dom'
import { PenSquare, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
          📝 Blog
        </Link>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block">
                Hi, {user?.name}
              </span>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">後台管理</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">登出</span>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                登入
              </Button>
              <Button size="sm" onClick={() => navigate('/register')}>
                <PenSquare className="h-4 w-4 mr-1" />
                註冊
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
