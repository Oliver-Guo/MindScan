export class AppError extends Error {
  constructor(
    public code: string,
    public override message: string,
    public statusCode: number = 500
  ) {
    super(message)
    this.name = 'AppError'
  }
}
