export class AppError extends Error {
  public statusCode: number;
  public errorMessage: string | null;

  constructor(
    statusCode: number,
    message: string,
    errorMessage: string | null,
    stack?: string,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
    if (stack == undefined) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = stack;
    }
  }
}
