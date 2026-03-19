import api from '@/lib/axios'
import { ApiResponse, PaginatedResponse } from '@/types/api'
import { Post, PostDetail, CreatePostDto, UpdatePostDto } from '@/types/post'

export const postApi = {
  getPublishedPosts: (params?: { page?: number; limit?: number; categoryId?: number }) =>
    api
      .get<PaginatedResponse<Post>>('/posts', { params })
      .then(r => r.data),

  getAllPosts: (params?: { page?: number; limit?: number }) =>
    api
      .get<PaginatedResponse<Post>>('/posts/admin/all', { params })
      .then(r => r.data),

  getPostBySlug: (slug: string) =>
    api.get<ApiResponse<PostDetail>>(`/posts/${slug}`).then(r => r.data.data),

  createPost: (dto: CreatePostDto) =>
    api.post<ApiResponse<Post>>('/posts', dto).then(r => r.data.data),

  updatePost: (id: number, dto: UpdatePostDto) =>
    api.patch<ApiResponse<Post>>(`/posts/${id}`, dto).then(r => r.data.data),

  deletePost: (id: number) =>
    api.delete(`/posts/${id}`),
}
