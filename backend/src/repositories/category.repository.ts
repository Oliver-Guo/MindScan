import { prisma } from '../config/database'
import { CreateCategoryDto, UpdateCategoryDto } from '../schemas/category.schema'

export const categoryRepository = {
  findAll: () =>
    prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    }),

  findById: (id: number) =>
    prisma.category.findUnique({ where: { id } }),

  findBySlug: (slug: string) =>
    prisma.category.findUnique({ where: { slug } }),

  findByName: (name: string) =>
    prisma.category.findUnique({ where: { name } }),

  create: (data: CreateCategoryDto) =>
    prisma.category.create({ data }),

  update: (id: number, data: UpdateCategoryDto) =>
    prisma.category.update({ where: { id }, data }),

  delete: (id: number) => prisma.category.delete({ where: { id } }),
}
