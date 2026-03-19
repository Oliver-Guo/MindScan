import { Request, Response, NextFunction } from 'express'
import * as analyzeService from '../services/analyze.service'
import { sendSuccess } from '../utils/response'

/**
 * @swagger
 * /analyze/emotion:
 *   post:
 *     summary: 情緒急救包分析
 *     description: 分析使用者輸入的情緒描述，回傳情緒類型、強度、紓壓建議與鼓勵信
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: 最近工作壓力很大，睡眠品質很差，感覺很迷茫
 *     responses:
 *       200:
 *         description: 分析成功
 *       400:
 *         description: 輸入驗證失敗
 *       502:
 *         description: AI 服務異常
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
 *     summary: 謊言偵測器分析
 *     description: 分析文字的可信度，標記語言風險並回傳可信度報告
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [text]
 *             properties:
 *               text:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 2000
 *                 example: 我絕對沒有說過那些話，你可能記錯了
 *     responses:
 *       200:
 *         description: 分析成功
 *       400:
 *         description: 輸入驗證失敗
 *       502:
 *         description: AI 服務異常
 */
export const lie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await analyzeService.analyzeLie(req.body.text as string)
    sendSuccess(res, result, '分析完成')
  } catch (error) {
    next(error)
  }
}
