export interface Comment {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  author: { id: number; name: string }
  post?: { id: number; title: string; slug: string }
}

export interface CreateCommentDto {
  content: string
}
