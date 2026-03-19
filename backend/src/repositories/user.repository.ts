import { prisma } from '../config/database'

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findById: (id: number) =>
    prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),

  create: (data: {
    email: string
    password: string
    name: string
  }) =>
    prisma.user.create({
      data,
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    }),
}
