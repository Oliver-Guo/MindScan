import { Comment } from './comment'

export interface Post {
  id: number
  title: string
  slug: string
  excerpt: string | null
  published: boolean
  createdAt: string
  updatedAt: string
  author: { id: number; name: string }
  category: { id: number; name: string; slug: string } | null
  _count?: { comments: number }
}

export interface PostDetail extends Post {
  content: string
  comments: Comment[]
}

export interface CreatePostDto {
  title: string
  content: string
  excerpt?: string
  categoryId?: number | null
  published: boolean
}

export interface UpdatePostDto {
  title?: string
  content?: string
  excerpt?: string
  categoryId?: number | null
  published?: boolean
}
