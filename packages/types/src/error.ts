/**
 * Shared API error type for gateway and services.
 * OpenAPI-friendly: use with @nestjs/swagger ApiResponse for 4xx/5xx.
 */
export interface ApiError {
  /** HTTP status code (400, 401, 403, 404, 429, 500) */
  statusCode: number;
  /** Machine-readable code (e.g. VALIDATION_FAILED, UNAUTHORIZED) */
  code: string;
  /** Human-readable message */
  message: string;
  /** Optional details (e.g. validation errors) */
  details?: Record<string, unknown>;
}

export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;
