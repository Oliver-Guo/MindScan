import { User, Calendar, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Comment } from '@/types/comment'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface CommentItemProps {
  comment: Comment
  onDelete?: (id: number) => void
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
  const { isAdmin } = useAuth()

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="font-medium text-foreground">{comment.author.name}</span>
          <Calendar className="h-3 w-3" />
          <span>{formatDate(comment.createdAt)}</span>
        </div>
        {isAdmin && onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
            onClick={() => onDelete(comment.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
    </div>
  )
}
