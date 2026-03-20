import { Request, Response, NextFunction } from 'express'
import * as analyzeService from '../services/analyze.service'
import { sendSuccess } from '../utils/response'

/**
 * @swagger
 * /analyze/emotion:
 *   post:
 *     tags: [Analyze]
 *     summary: 情緒急救包分析
 *     description: 分析使用者輸入的情緒描述，回傳情緒類型、強度、紓壓建議與鼓勵信
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyzeInput'
 *     responses:
 *       200:
 *         description: 分析成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/EmotionResult'
 *                 message:
 *                   type: string
 *                   example: 分析完成
 *       400:
 *         description: 輸入驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: API 額度限制
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: AI 服務異常
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const emotion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyzeService.analyzeEmotion(req.body.text as string)
    sendSuccess(res, result, '分析完成')
  } catch (error) {
    next(error)
  }
}

/**
 * @swagger
 * /analyze/lie:
 *   post:
 *     tags: [Analyze]
 *     summary: 謊言偵測器分析
 *     description: 分析文字的可信度，標記語言風險並回傳可信度報告
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AnalyzeInput'
 *     responses:
 *       200:
 *         description: 分析成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/LieResult'
 *                 message:
 *                   type: string
 *                   example: 分析完成
 *       400:
 *         description: 輸入驗證失敗
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: API 額度限制
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       502:
 *         description: AI 服務異常
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const lie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyzeService.analyzeLie(req.body.text as string)
    sendSuccess(res, result, '分析完成')
  } catch (error) {
    next(error)
  }
}
