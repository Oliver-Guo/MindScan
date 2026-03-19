import { prisma } from '../config/database'
import { CreatePostDto, UpdatePostDto } from '../schemas/post.schema'

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { comments: true } },
}

export const postRepository = {
  findMany: async (params: {
    page: number
    limit: number
    categoryId?: number
    publishedOnly?: boolean
  }) => {
    const { page, limit, categoryId, publishedOnly = false } = params
    const skip = (page - 1) * limit
    const where = {
      ...(publishedOnly ? { published: true } : {}),
      ...(categoryId ? { categoryId } : {}),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: postSelect,
      }),
      prisma.post.count({ where }),
    ])

    return { posts, total }
  },

  findBySlug: (slug: string) =>
    prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true } },
        category: { select: { id: true, name: true, slug: true } },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            author: { select: { id: true, name: true } },
          },
        },
      },
    }),

  findById: (id: number) =>
    prisma.post.findUnique({
      where: { id },
      select: { ...postSelect, content: true },
    }),

  create: (data: CreatePostDto & { authorId: number; slug: string }) =>
    prisma.post.create({
      data,
      select: postSelect,
    }),

  update: (id: number, data: UpdatePostDto & { slug?: string }) =>
    prisma.post.update({
      where: { id },
      data,
      select: postSelect,
    }),

  delete: (id: number) => prisma.post.delete({ where: { id } }),

  slugExists: (slug: string, excludeId?: number) =>
    prisma.post.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
    }),
}
