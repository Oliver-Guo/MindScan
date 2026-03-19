export interface Category {
  id: number
  name: string
  slug: string
  createdAt: string
  updatedAt: string
  _count?: { posts: number }
}

export interface CreateCategoryDto {
  name: string
  slug: string
}

export interface UpdateCategoryDto {
  name?: string
  slug?: string
}
