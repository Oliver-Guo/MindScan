import api from '@/lib/axios'
import { ApiResponse } from '@/types/api'
import { LoginDto, RegisterDto, User, AuthResult } from '@/types/user'

export const authApi = {
  register: (dto: RegisterDto) =>
    api.post<ApiResponse<AuthResult>>('/auth/register', dto).then(r => r.data.data),

  login: (dto: LoginDto) =>
    api.post<ApiResponse<AuthResult>>('/auth/login', dto).then(r => r.data.data),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me').then(r => r.data.data),
}
