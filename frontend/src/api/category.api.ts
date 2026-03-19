import api from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { Category, CreateCategoryDto, UpdateCategoryDto } from '@/types/category'

export const categoryApi = {
  getAll: () =>
    api.get<ApiResponse<Category[]>>('/categories').then(r => r.data.data),

  create: (dto: CreateCategoryDto) =>
    api.post<ApiResponse<Category>>('/categories', dto).then(r => r.data.data),

  update: (id: number, dto: UpdateCategoryDto) =>
    api.patch<ApiResponse<Category>>(`/categories/${id}`, dto).then(r => r.data.data),

  delete: (id: number) =>
    api.delete(`/categories/${id}`),
}
