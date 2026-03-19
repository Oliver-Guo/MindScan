import api from '@/lib/axios'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Comment, CreateCommentDto } from '@/types/comment'

export const commentApi = {
  getByPostId: (postId: number) =>
    api.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`).then(r => r.data.data),

  getAllComments: (params?: { page?: number; limit?: number }) =>
    api.get<PaginatedResponse<Comment>>('/comments', { params }).then(r => r.data),

  create: (postId: number, dto: CreateCommentDto) =>
    api
      .post<ApiResponse<Comment>>(`/posts/${postId}/comments`, dto)
      .then(r => r.data.data),

  delete: (id: number) =>
    api.delete(`/comments/${id}`),
}
