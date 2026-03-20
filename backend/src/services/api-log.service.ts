import { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma'
import { logger } from '../utils/logger'

interface ApiLogEntry {
  companyType: string
  modelType: string
  status: number
  request: Prisma.InputJsonValue
  response: Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput
}

/**
 * 以 fire-and-forget 方式記錄 AI API 呼叫至資料庫。
 * 不會阻塞呼叫端，失敗時僅寫入 Winston 日誌。
 */
export const logApiCall = (entry: ApiLogEntry): void => {
  prisma.aiApiLog
    .create({ data: entry })
    .catch((err: unknown) => {
      logger.error('[api-log] 寫入 API 日誌失敗', err)
    })
}
