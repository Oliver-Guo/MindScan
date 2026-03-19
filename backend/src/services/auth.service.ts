import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { userRepository } from '../repositories/user.repository'
import { AppError } from '../utils/AppError'
import { env } from '../config/env'
import { LoginDto, RegisterDto } from '../schemas/auth.schema'

const signToken = (payload: { id: number; email: string; role: string }) => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  })
}

export const authService = {
  register: async (dto: RegisterDto) => {
    const existing = await userRepository.findByEmail(dto.email)
    if (existing) {
      throw new AppError('EMAIL_ALREADY_EXISTS', '此 Email 已被註冊', 400)
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await userRepository.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    })

    const token = signToken({ id: user.id, email: user.email, role: user.role })
    return { user, token }
  },

  login: async (dto: LoginDto) => {
    const user = await userRepository.findByEmail(dto.email)
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Email 或密碼錯誤', 401)
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password)
    if (!isPasswordValid) {
      throw new AppError('INVALID_CREDENTIALS', 'Email 或密碼錯誤', 401)
    }

    const { password: _, ...userWithoutPassword } = user
    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    return { user: userWithoutPassword, token }
  },

  me: async (userId: number) => {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new AppError('USER_NOT_FOUND', '用戶不存在', 404)
    }
    return user
  },
}
