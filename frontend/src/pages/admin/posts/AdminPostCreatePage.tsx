import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { postApi } from '@/api/post.api'
import { categoryApi } from '@/api/category.api'
import { toast } from '@/hooks/useToast'

const postSchema = z.object({
  title: z.string().min(1, '標題不能為空').max(200),
  content: z.string().min(1, '內容不能為空'),
  excerpt: z.string().max(500).optional(),
  categoryId: z.string().optional(),
  published: z.boolean().default(false),
})

type PostFormData = z.infer<typeof postSchema>

export default function AdminPostCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  const { register, handleSubmit, control, formState: { errors } } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: { published: false },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: PostFormData) =>
      postApi.createPost({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        categoryId: data.categoryId ? Number(data.categoryId) : undefined,
        published: data.published,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      toast({ title: '文章建立成功' })
      navigate('/admin/posts')
    },
    onError: () => {
      toast({ title: '建立失敗', variant: 'destructive' })
    },
  })

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/posts')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">新增文章</h1>
      </div>

      <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-4">
        <Card>
          <CardHeader><CardTitle>基本資訊</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">標題 *</Label>
              <Input id="title" placeholder="文章標題" className="mt-1" {...register('title')} />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="excerpt">摘要</Label>
              <Textarea
                id="excerpt"
                placeholder="文章摘要（選填）"
                className="mt-1"
                rows={2}
                {...register('excerpt')}
              />
              {errors.excerpt && <p className="text-sm text-destructive mt-1">{errors.excerpt.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">分類</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="選擇分類（選填）" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-center gap-3">
              <Controller
                name="published"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>立即發布</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>文章內容 *</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              id="content"
              placeholder="在這裡撰寫文章內容..."
              className="min-h-[400px] font-mono text-sm"
              {...register('content')}
            />
            {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending ? '建立中...' : '建立文章'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/posts')}>
            取消
          </Button>
        </div>
      </form>
    </div>
  )
}
