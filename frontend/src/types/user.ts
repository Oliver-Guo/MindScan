export type UserRole = 'ADMIN' | 'USER'

export interface User {
  id: number
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthResult {
  user: User
  token: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface LoginDto {
  email: string
  password: string
}
