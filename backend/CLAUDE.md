# Backend — CLAUDE.md

> 後端開發指南。詳細任務請使用對應 skill 指令（見下方）。

---

## 可用 Skills（按需呼叫，節省 context）

| 指令 | 觸發時機 |
|------|---------|
| `/backend-crud <ResourceName>` | 新增完整 CRUD 模組（Controller/Service/Repository/Routes/Schema） |
| `/backend-test <resource>` | 為指定資源產生整合測試 |
| `/backend-templates [AppError\|error\|validate\|auth\|env\|all]` | 產生或修復後端基礎設施檔案 |
| `/backend-prisma [migrate\|seed\|query\|reset]` | Prisma 操作協助 |

---

## 目錄結構

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts      # Prisma client 初始化
│   │   ├── env.ts           # 環境變數驗證 (Zod)
│   │   └── swagger.ts       # Swagger 設定
│   ├── controllers/         # HTTP 層，只處理 req/res
│   ├── services/            # 業務邏輯層
│   ├── repositories/        # 資料存取層 (Prisma)
│   ├── routes/              # Express Router
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── schemas/             # Zod 驗證 Schema
│   ├── utils/
│   │   ├── AppError.ts
│   │   ├── response.ts
│   │   └── logger.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── tests/
└── .env.example
```

---

## 🗄️ 資料庫規範

### Prisma Schema 範例
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  role      UserRole @default(USER)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

enum UserRole { ADMIN USER }
```

### 命名規則
- 表名：`snake_case` 複數（`users`, `order_items`）
- 欄位名：`snake_case`（`created_at`, `user_id`）
- Prisma Model：`PascalCase` 單數（`User`, `OrderItem`）

---

## 🏗️ 三層架構範例

```typescript
// Controller — 只處理 HTTP
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.findById(Number(req.params.id))
    res.json({ success: true, data: user })
  } catch (error) { next(error) }
}

// Service — 業務邏輯
export const findById = async (id: number): Promise<UserResponse> => {
  const user = await userRepository.findById(id)
  if (!user) throw new AppError('USER_NOT_FOUND', '用戶不存在', 404)
  return user
}

// Repository — 只碰資料庫
export const findById = (id: number) =>
  prisma.user.findUnique({ where: { id } })
```

---

## 環境變數清單

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=           # MySQL 連線字串
JWT_SECRET=             # 至少 32 字元
JWT_EXPIRES_IN=7d
CORS_ORIGIN=
LOG_LEVEL=info          # error | warn | info | debug
```
