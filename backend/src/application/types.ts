// TODO - Move some types to proper subdirectory like routes etc

import { Service } from "./services";

/**
 * The HTTP methods as defined in: https://www.rfc-editor.org/rfc/rfc9110.html
 */
export enum HttpMethod {
  GET     = "GET"     ,
  HEAD    = "HEAD"    ,
  OPTIONS = "OPTIONS" ,
  TRACE   = "TRACE"   ,
  PUT     = "PUT"     ,
  DELETE  = "DELETE"  ,
  POST    = "POST"    ,
  PATCH   = "PATCH"   ,
  CONNECT = "CONNECT" ,
}

export enum ErrorCode {
  NOT_FOUND     = "NOT_FOUND"     ,
  UNAUTHORIZED  = "UNAUTHORIZED"  ,
  BAD_REQUEST   = "BAD_REQUEST"   ,
  FORBIDDEN     = "FORBIDDEN"     ,
  CONFLICT      = "CONFLICT"      ,
}

export type RequestHeaders = Record<string, string>;
export type ResponseHeaders = Record<string, string>;
export type RequestBody = Record<string, unknown>;
export type ResponseBody = Record<string, unknown>;

/**
 * Interface defining an HTTP request object.
 * Based on the standardized HTTP Request structure.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export interface Request {
  headers: RequestHeaders;
  method: HttpMethod;
  body: object;
}


/**
 * Interface defining an HTTP response object.
 * Based on the standardized HTTP Response structure.
 * See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export interface Response {
  headers: ResponseHeaders;
  body: ResponseBody;
  status: number;
}

/**
 * Interface defining a structured error object for API responses.
 * Used to standardize error handling across controllers and services.
 *
 * @example
 * ```typescript
 * throw { code: 'BAD_REQUEST', message: 'Missing required fields' };
 * ```
 * @see {@link Controller.handleError} for error handling implementation
 */
export interface ApiError {
  code: ErrorCode; // e.g., 'BAD_REQUEST', 'NOT_FOUND'
  message: string; // Human-readable error message
  [key: string]: unknown; // Optional additional properties (for flexibility)
}

/**
 * Interface representing path parameters extracted from URL segments.
 * Used for RESTful route pattern matching and parameter extraction.
 */
export interface PathParams {
  entity?: string;
  parent?: string;
  id?: string;
  idParent?: string;
}

/**
 * Route pattern definition for declarative routing.
 * Used to match incoming requests to their appropriate handler functions
 * based on URL structure and parameters.
 */
export interface RoutePattern {
  parent?: string;
  hasId: boolean;
  hasParentId: boolean;
  extractor:(req: Request) => object;
  handler: (req: Request, data: object) => Response;
}

export type RouteHandlers = Partial<Record<HttpMethod, RoutePattern[]>>;