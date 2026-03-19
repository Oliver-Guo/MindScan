import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // 建立管理員帳號
  const adminPassword = await bcrypt.hash('admin5678', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // 建立預設分類
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'tech' },
      update: {},
      create: { name: '技術', slug: 'tech' },
    }),
    prisma.category.upsert({
      where: { slug: 'life' },
      update: {},
      create: { name: '生活', slug: 'life' },
    }),
    prisma.category.upsert({
      where: { slug: 'announcement' },
      update: {},
      create: { name: '公告', slug: 'announcement' },
    }),
  ])
  console.log('✅ Categories created:', categories.map(c => c.name).join(', '))

  // 建立示範文章
  const post = await prisma.post.upsert({
    where: { slug: 'hello-world' },
    update: {},
    create: {
      title: 'Hello World',
      slug: 'hello-world',
      content: `# 歡迎來到部落格！

這是第一篇文章，很高興你來訪。

## 關於這個部落格

這個部落格使用以下技術建構：

- **後端**：Node.js + Express + TypeScript + Prisma
- **前端**：React 18 + Vite + shadcn/ui
- **資料庫**：MySQL 8.0

## 開始探索

你可以瀏覽文章列表，登入後也可以留言分享你的想法。`,
      excerpt: '歡迎來到這個部落格！這是第一篇示範文章。',
      published: true,
      authorId: admin.id,
      categoryId: categories[0].id,
    },
  })
  console.log('✅ Demo post created:', post.title)

  console.log('🎉 Seed completed!')
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
