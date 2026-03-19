import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { categoryApi } from '@/api/category.api'
import { toast } from '@/hooks/useToast'
import { Category } from '@/types/category'

const categorySchema = z.object({
  name: z.string().min(1, '名稱不能為空').max(50),
  slug: z.string().min(1, 'Slug 不能為空').regex(/^[a-z0-9-]+$/, '只能包含小寫字母、數字、連字號'),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function AdminCategoryPage() {
  const [editingId, setEditingId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  const { register: registerCreate, handleSubmit: handleCreate, reset: resetCreate, formState: { errors: createErrors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const { register: registerEdit, handleSubmit: handleEdit, reset: resetEdit, formState: { errors: editErrors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const { mutate: createCategory, isPending: creating } = useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      resetCreate()
      toast({ title: '分類建立成功' })
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast({ title: err?.response?.data?.message || '建立失敗', variant: 'destructive' })
    },
  })

  const { mutate: updateCategory, isPending: updating } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setEditingId(null)
      toast({ title: '分類更新成功' })
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast({ title: err?.response?.data?.message || '更新失敗', variant: 'destructive' })
    },
  })

  const { mutate: deleteCategory } = useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast({ title: '分類已刪除' })
    },
    onError: () => {
      toast({ title: '刪除失敗', variant: 'destructive' })
    },
  })

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    resetEdit({ name: cat.name, slug: cat.slug })
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">分類管理</h1>

      {/* 新增分類 */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">新增分類</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate(data => createCategory(data))} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="name">分類名稱</Label>
                <Input id="name" placeholder="例：技術" className="mt-1" {...registerCreate('name')} />
                {createErrors.name && <p className="text-xs text-destructive mt-1">{createErrors.name.message}</p>}
              </div>
              <div className="flex-1">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="例：tech" className="mt-1" {...registerCreate('slug')} />
                {createErrors.slug && <p className="text-xs text-destructive mt-1">{createErrors.slug.message}</p>}
              </div>
            </div>
            <Button type="submit" disabled={creating} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {creating ? '建立中...' : '新增'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 分類列表 */}
      <Card>
        <CardHeader><CardTitle className="text-base">所有分類</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}
            </div>
          ) : categories?.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">還沒有分類</p>
          ) : (
            <div className="space-y-2">
              {categories?.map(cat => (
                <div key={cat.id} className="flex items-center gap-3 p-3 border rounded-md">
                  {editingId === cat.id ? (
                    <form
                      className="flex flex-1 items-center gap-2"
                      onSubmit={handleEdit(data => updateCategory({ id: cat.id, data }))}
                    >
                      <Input placeholder="名稱" {...registerEdit('name')} className="h-8" />
                      <Input placeholder="slug" {...registerEdit('slug')} className="h-8" />
                      <Button type="submit" size="sm" variant="ghost" disabled={updating}>
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">/{cat.slug}</span>
                        {cat._count && (
                          <span className="text-xs text-muted-foreground ml-2">
                            ({cat._count.posts} 篇文章)
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => startEdit(cat)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`確定要刪除「${cat.name}」？`)) deleteCategory(cat.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
