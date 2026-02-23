/**
 * Shared auth types for JWT and user context.
 * OpenAPI-friendly: use for secured endpoints.
 */
export type UserId = string;

/** JWT payload (claims) – align with backend JWT strategy */
export interface JwtPayload {
  /** Subject (user id) */
  sub: UserId;
  /** Expiration (seconds since epoch) */
  exp: number;
  /** Issued at (seconds since epoch) */
  iat: number;
  /** Optional: email */
  email?: string;
  /** Optional: roles for RBAC */
  roles?: string[];
}
