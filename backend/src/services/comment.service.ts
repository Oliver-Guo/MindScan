import { commentRepository } from '../repositories/comment.repository'
import { postRepository } from '../repositories/post.repository'
import { AppError } from '../utils/AppError'
import { CreateCommentDto } from '../schemas/comment.schema'

export const commentService = {
  getCommentsByPostId: async (postId: number) => {
    const post = await postRepository.findById(postId)
    if (!post) {
      throw new AppError('POST_NOT_FOUND', '文章不存在', 404)
    }
    return commentRepository.findByPostId(postId)
  },

  getAllComments: async (params: { page: number; limit: number }) => {
    const [comments, total] = await commentRepository.findAll(params)
    return { comments, total }
  },

  createComment: async (
    postId: number,
    dto: CreateCommentDto,
    authorId: number
  ) => {
    const post = await postRepository.findById(postId)
    if (!post) {
      throw new AppError('POST_NOT_FOUND', '文章不存在', 404)
    }

    return commentRepository.create({
      content: dto.content,
      authorId,
      postId,
    })
  },

  deleteComment: async (id: number) => {
    const comment = await commentRepository.findById(id)
    if (!comment) {
      throw new AppError('COMMENT_NOT_FOUND', '留言不存在', 404)
    }
    await commentRepository.delete(id)
  },
}
