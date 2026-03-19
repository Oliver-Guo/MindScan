import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { postApi } from '@/api/post.api'
import { categoryApi } from '@/api/category.api'
import PostCard from '@/components/shared/PostCard'
import Pagination from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['posts', page, selectedCategory],
    queryFn: () => postApi.getPublishedPosts({ page, limit: 10, categoryId: selectedCategory }),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.getAll,
  })

  const handleCategoryChange = (categoryId?: number) => {
    setSelectedCategory(categoryId)
    setPage(1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">最新文章</h1>
        <p className="text-muted-foreground">探索所有精彩內容</p>
      </div>

      {/* 分類篩選 */}
      {categories && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedCategory === undefined ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleCategoryChange(undefined)}
          >
            全部
          </Button>
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      )}

      {/* 文章列表 */}
      {postsLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : postsData?.data.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">目前還沒有文章</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {postsData?.data.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {postsData?.pagination && (
            <Pagination
              page={postsData.pagination.page}
              totalPages={postsData.pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
