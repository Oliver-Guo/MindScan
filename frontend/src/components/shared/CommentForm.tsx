import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { commentApi } from '@/api/comment.api'
import { toast } from '@/hooks/useToast'

const commentSchema = z.object({
  content: z.string().min(1, '留言不能為空').max(1000, '留言最多 1000 個字元'),
})

type CommentFormData = z.infer<typeof commentSchema>

interface CommentFormProps {
  postId: number
}

export default function CommentForm({ postId }: CommentFormProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CommentFormData) => commentApi.create(postId, data),
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries({ queryKey: ['post'] })
      toast({ title: '留言成功', description: '您的留言已發表' })
    },
    onError: () => {
      toast({ title: '留言失敗', variant: 'destructive', description: '請稍後再試' })
    },
  })

  return (
    <form onSubmit={handleSubmit(data => mutate(data))} className="space-y-3">
      <div>
        <Label htmlFor="content">發表留言</Label>
        <Textarea
          id="content"
          placeholder="寫下你的想法..."
          className="mt-1 min-h-[100px]"
          {...register('content')}
        />
        {errors.content && (
          <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? '送出中...' : '送出留言'}
      </Button>
    </form>
  )
}
