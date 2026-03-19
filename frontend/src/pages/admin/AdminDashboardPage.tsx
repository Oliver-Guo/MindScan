import { useQuery } from '@tanstack/react-query'
import { FileText, Tag, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { postApi } from '@/api/post.api'
import { categoryApi } from '@/api/category.api'
import { commentApi } from '@/api/comment.api'

export default function AdminDashboardPage() {
  const { data: postsData } = useQuery({
    queryKey: ['admin-posts-count'],
    queryFn: () => postApi.getAllPosts({ page: 1, limit: 1 }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  const { data: commentsData } = useQuery({
    queryKey: ['admin-comments-count'],
    queryFn: () => commentApi.getAllComments({ page: 1, limit: 1 }),
  })

  const stats = [
    {
      title: '文章總數',
      value: postsData?.pagination.total ?? '-',
      icon: FileText,
      description: '包含草稿',
    },
    {
      title: '分類數量',
      value: categories?.length ?? '-',
      icon: Tag,
      description: '文章分類',
    },
    {
      title: '留言總數',
      value: commentsData?.pagination.total ?? '-',
      icon: MessageSquare,
      description: '所有留言',
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">總覽</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
