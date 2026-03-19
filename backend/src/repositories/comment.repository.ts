import { prisma } from '../config/database'

export const commentRepository = {
  findByPostId: (postId: number) =>
    prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { id: true, name: true } },
      },
    }),

  findAll: (params: { page: number; limit: number }) => {
    const { page, limit } = params
    const skip = (page - 1) * limit
    return Promise.all([
      prisma.comment.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, name: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
      }),
      prisma.comment.count(),
    ])
  },

  findById: (id: number) =>
    prisma.comment.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true } } },
    }),

  create: (data: { content: string; authorId: number; postId: number }) =>
    prisma.comment.create({
      data,
      include: {
        author: { select: { id: true, name: true } },
      },
    }),

  delete: (id: number) => prisma.comment.delete({ where: { id } }),
}
