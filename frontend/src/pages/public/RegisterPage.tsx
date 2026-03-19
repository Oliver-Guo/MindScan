import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/stores/authStore'
import { toast } from '@/hooks/useToast'
import axios from 'axios'

const registerSchema = z.object({
  name: z.string().min(1, '暱稱不能為空').max(50, '暱稱最多 50 個字元'),
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(6, '密碼至少 6 個字元'),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.register,
    onSuccess: data => {
      setAuth(data.token, data.user)
      toast({ title: '註冊成功', description: `歡迎加入，${data.user.name}！` })
      navigate('/')
    },
    onError: err => {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || '註冊失敗'
        : '註冊失敗'
      toast({ title: '註冊失敗', description: message, variant: 'destructive' })
    },
  })

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>建立帳號</CardTitle>
          <CardDescription>填寫以下資訊完成註冊</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-4">
            <div>
              <Label htmlFor="name">暱稱</Label>
              <Input
                id="name"
                placeholder="你的暱稱"
                className="mt-1"
                {...register('name')}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

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
                placeholder="至少 6 個字元"
                className="mt-1"
                {...register('password')}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? '註冊中...' : '建立帳號'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            已有帳號？{' '}
            <Link to="/login" className="text-primary hover:underline">
              立即登入
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
