/**
 * OpenAPI schema fragments (type-only; no runtime dependency on Nest/Swagger).
 * Use these types in backend DTOs with @ApiProperty() for consistent docs.
 * Re-exports shared types that map to OpenAPI schemas.
 */
export type { ApiError, HttpStatus } from './error';
export type { UserId, JwtPayload } from './auth';
export type { PaginationResult } from './pagination';
export type { JobStatus, WorkflowStep, IntentWorkflow } from './job';
