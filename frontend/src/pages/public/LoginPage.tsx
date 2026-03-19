import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/useToast'
import axios from 'axios'

const loginSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(1, '請輸入密碼'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore(s => s.setAuth)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.login,
    onSuccess: data => {
      setAuth(data.token, data.user)
      toast({ title: '登入成功', description: `歡迎回來，${data.user.name}！` })
      if (data.user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate(from)
      }
    },
    onError: err => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || '登入失敗'
        : '登入失敗'
      toast({ title: '登入失敗', description: message, variant: 'destructive' })
    },
  })

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登入</CardTitle>
          <CardDescription>輸入你的帳號密碼登入</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="mt-1"
                {...register('email')}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '登入中...' : '登入'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            還沒有帳號？{' '}
            <Link to="/register" className="text-primary hover:underline">
              立即註冊
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
