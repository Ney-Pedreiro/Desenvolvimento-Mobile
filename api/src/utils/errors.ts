export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const createError = (statusCode: number, code: string, message: string) => {
  return new ApiError(statusCode, code, message);
};
