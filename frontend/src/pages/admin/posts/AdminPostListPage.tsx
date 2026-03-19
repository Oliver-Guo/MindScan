import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { postApi } from '@/api/post.api'
import { formatDate } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'

export default function AdminPostListPage() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', page],
    queryFn: () => postApi.getAllPosts({ page, limit: 10 }),
  })

  const { mutate: deletePost } = useMutation({
    mutationFn: postApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      toast({ title: '文章已刪除' })
    },
    onError: () => {
      toast({ title: '刪除失敗', variant: 'destructive' })
    },
  })

  const handleDelete = (id: number, title: string) => {
    if (confirm(`確定要刪除「${title}」嗎？`)) {
      deletePost(id)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Button onClick={() => navigate('/admin/posts/create')}>
          <Plus className="h-4 w-4 mr-1" />
          新增文章
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">標題</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">分類</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">作者</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">建立時間</th>
                  <th className="text-left p-3 font-medium">狀態</th>
                  <th className="text-right p-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map(post => (
                  <tr key={post.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium max-w-[200px] truncate">{post.title}</td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">
                      {post.category?.name ?? '-'}
                    </td>
                    <td className="p-3 hidden md:table-cell text-muted-foreground">
                      {post.author.name}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="p-3">
                      <Badge variant={post.published ? 'default' : 'secondary'}>
                        {post.published ? '已發布' : '草稿'}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/posts/${post.id}/edit`)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(post.id, post.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data?.data.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                還沒有文章，立即新增第一篇！
              </div>
            )}
          </div>

          {data?.pagination && (
            <Pagination
              page={data.pagination.page}
              totalPages={data.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
