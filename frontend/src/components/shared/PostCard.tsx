import { Link } from 'react-router-dom'
import { Calendar, MessageSquare, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Post } from '@/types/post'
import { formatDate } from '@/lib/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          {post.category && (
            <Badge variant="secondary">{post.category.name}</Badge>
          )}
        </div>
        <Link to={`/posts/${post.slug}`}>
          <h2 className="text-xl font-semibold hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
      </CardHeader>
      <CardContent>
        {post.excerpt && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {post.author.name}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(post.createdAt)}
          </span>
          {post._count && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {post._count.comments} 則留言
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
