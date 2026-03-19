import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { commentApi } from '@/api/comment.api'
import { formatDate } from '@/lib/utils'
import { toast } from '@/hooks/useToast'
import Pagination from '@/components/shared/Pagination'

export default function AdminCommentPage() {
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-comments', page],
    queryFn: () => commentApi.getAllComments({ page, limit: 20 }),
  })

  const { mutate: deleteComment } = useMutation({
    mutationFn: commentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      toast({ title: '留言已刪除' })
    },
    onError: () => {
      toast({ title: '刪除失敗', variant: 'destructive' })
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('確定要刪除這則留言嗎？')) deleteComment(id)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">留言管理</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded" />)}
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">留言者</th>
                  <th className="text-left p-3 font-medium">留言內容</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">所屬文章</th>
                  <th className="text-left p-3 font-medium hidden lg:table-cell">時間</th>
                  <th className="text-right p-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data?.data.map(comment => (
                  <tr key={comment.id} className="hover:bg-muted/30">
                    <td className="p-3 font-medium whitespace-nowrap">{comment.author.name}</td>
                    <td className="p-3 text-muted-foreground max-w-[200px] truncate">
                      {comment.content}
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      {comment.post && (
                        <Link
                          to={`/posts/${comment.post.slug}`}
                          target="_blank"
                          className="flex items-center gap-1 text-primary hover:underline text-xs max-w-[150px] truncate"
                        >
                          {comment.post.title}
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                        </Link>
                      )}
                    </td>
                    <td className="p-3 hidden lg:table-cell text-muted-foreground whitespace-nowrap">
                      {formatDate(comment.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(comment.id)}
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
              <div className="text-center py-12 text-muted-foreground">目前沒有留言</div>
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
