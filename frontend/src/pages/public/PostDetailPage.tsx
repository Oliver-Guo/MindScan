import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Calendar, User, MessageSquare } from 'lucide-react'
import { postApi } from '@/api/post.api'
import { commentApi } from '@/api/comment.api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CommentItem from '@/components/shared/CommentItem'
import CommentForm from '@/components/shared/CommentForm'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/lib/utils'
import { toast } from '@/hooks/useToast'

export default function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { isLoggedIn } = useAuth()
  const queryClient = useQueryClient()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => postApi.getPostBySlug(slug!),
    enabled: !!slug,
  })

  const { mutate: deleteComment } = useMutation({
    mutationFn: commentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', slug] })
      toast({ title: '留言已刪除' })
    },
    onError: () => {
      toast({ title: '刪除失敗', variant: 'destructive' })
    },
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
          <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
          <div className="h-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">文章不存在</p>
        <Link to="/">
          <Button variant="outline" className="mt-4">返回首頁</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* 返回按鈕 */}
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          返回文章列表
        </Link>

        {/* 文章標題區 */}
        <div className="mb-6">
          {post.category && (
            <Badge variant="secondary" className="mb-3">{post.category.name}</Badge>
          )}
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author.name}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {post.comments.length} 則留言
            </span>
          </div>
        </div>

        {/* 文章內容 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div
              className="prose prose-gray max-w-none"
              style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
            >
              {post.content}
            </div>
          </CardContent>
        </Card>

        {/* 留言區 */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            留言 ({post.comments.length})
          </h2>

          {/* 留言表單 */}
          {isLoggedIn ? (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <CommentForm postId={post.id} />
              </CardContent>
            </Card>
          ) : (
            <Card className="mb-6 border-dashed">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-3">請先登入才能留言</p>
                <div className="flex justify-center gap-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">登入</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">立即註冊</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 留言列表 */}
          {post.comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">還沒有留言，第一個留言吧！</p>
          ) : (
            <div className="space-y-3">
              {post.comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onDelete={deleteComment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
