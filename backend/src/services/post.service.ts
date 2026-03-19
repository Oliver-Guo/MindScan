import slugify from 'slugify'
import { postRepository } from '../repositories/post.repository'
import { AppError } from '../utils/AppError'
import { CreatePostDto, UpdatePostDto } from '../schemas/post.schema'

const generateSlug = (title: string) =>
  slugify(title, { lower: true, strict: true, locale: 'zh' })

export const postService = {
  getPublishedPosts: async (params: {
    page: number
    limit: number
    categoryId?: number
  }) => {
    return postRepository.findMany({ ...params, publishedOnly: true })
  },

  getAllPosts: async (params: { page: number; limit: number }) => {
    return postRepository.findMany({ ...params, publishedOnly: false })
  },

  getPostBySlug: async (slug: string) => {
    const post = await postRepository.findBySlug(slug)
    if (!post) {
      throw new AppError('POST_NOT_FOUND', '文章不存在', 404)
    }
    return post
  },

  getPostById: async (id: number) => {
    const post = await postRepository.findById(id)
    if (!post) {
      throw new AppError('POST_NOT_FOUND', '文章不存在', 404)
    }
    return post
  },

  createPost: async (dto: CreatePostDto, authorId: number) => {
    let slug = generateSlug(dto.title)

    // 確保 slug 唯一
    const existing = await postRepository.slugExists(slug)
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    return postRepository.create({ ...dto, authorId, slug })
  },

  updatePost: async (id: number, dto: UpdatePostDto) => {
    const post = await postRepository.findById(id)
    if (!post) {
      throw new AppError('POST_NOT_FOUND', '文章不存在', 404)
    }

    let slug: string | undefined
    if (dto.title) {
      slug = generateSlug(dto.title)
      const existing = await postRepository.slugExists(slug, id)
      if (existing) {
        slug = `${slug}-${Date.now()}`
      }
    }

    return postRepository.update(id, { ...dto, ...(slug ? { slug } : {}) })
  },

  deletePost: async (id: number) => {
    const post = await postRepository.findById(id)
    if (!post) {
      throw new AppError('POST_NOT_FOUND', '文章不存在', 404)
    }
    await postRepository.delete(id)
  },
}
