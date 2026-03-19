import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FileText, Tag, MessageSquare, LayoutDashboard, LogOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: '總覽', icon: LayoutDashboard, end: true },
  { to: '/admin/posts', label: '文章管理', icon: FileText, end: false },
  { to: '/admin/categories', label: '分類管理', icon: Tag, end: false },
  { to: '/admin/comments', label: '留言管理', icon: MessageSquare, end: false },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen">
      {/* 側邊欄 */}
      <aside className="w-56 border-r bg-muted/30 flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">🛠 後台管理</h2>
          <p className="text-xs text-muted-foreground mt-1 truncate">{user?.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => navigate('/')}
          >
            <Home className="h-4 w-4" />
            前台首頁
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            登出
          </Button>
        </div>
      </aside>

      {/* 主內容 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
