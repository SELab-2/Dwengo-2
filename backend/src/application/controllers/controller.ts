import { ApiError, Request, Response, RouteHandlers} from '../types';
import { extractPathParams } from '../helpersExpress';
import { Services } from '../services/service';

/**
 * Abstract base Controller class implementing RESTful routing with path parameter-based routing.
 *
 * Controllers follow a declarative routing approach using RouteHandlers to define
 * path patterns and their corresponding handler functions. This eliminates repetitive
 * route matching logic while centralizing error handling.
 */
export abstract class Controller {
  protected services: Services;
  protected handlers: RouteHandlers;

  /**
   * Create a controller with injected services and route handlers.
   *
   * @param services - Service objects needed by this controller
   * @param handlers - Mapping of HTTP methods to route pattern definitions
   */
  public constructor(services: Services, handlers: RouteHandlers) {
    this.services = services;
    this.handlers = handlers;
  }

  /**
   * Process incoming request by matching against defined route patterns.
   * This is the main entry point called by the router.
   *
   * @param req - HTTP request object
   * @returns HTTP response with appropriate status and body
   */
  public handle(req: Request): Response {
    const { method } = req;
    const { id, idParent, parent } = extractPathParams(req);

    const methodHandlers = this.handlers[method];
    if (!methodHandlers)
      return this.response(404, { code: "NOT_FOUND", message: "Method not supported" });

    const match = methodHandlers.find(
      p => p.hasId === !!id && p.hasParentId === !!idParent && (!p.parent || p.parent === parent)
    );

    if (!match) return this.response(404, { code: "NOT_FOUND", message: "Endpoint not found" });

    try { return match.handler(req); }
    catch (error) { return this.handleError(error); }
  }

  /**
   * Create standardized HTTP response object.
   *
   * @param status - HTTP status code
   * @param body - Response body object (will be serialized to JSON)
   * @param headers - Optional additional HTTP headers
   * @returns Complete response object
   */
  protected response(status: number, body: object, headers: Record<string, string> = {}): Response {
    return {status, headers: { 'Content-Type': 'application/json', ...headers }, body};
  }

  /**
   * Standardized error handling for controller exceptions.
   * Maps error codes to appropriate HTTP status codes.
   *
   * @param error - Error object, preferably with code and message properties
   * @returns Error response with appropriate status and formatted message
   */
  protected handleError(error: ApiError | unknown): Response {
    const statusMap: Record<string, number> = {
      NOT_FOUND: 404, UNAUTHORIZED: 401, BAD_REQUEST: 400, FORBIDDEN: 403, CONFLICT: 409
    };
    if (!(error && typeof error === 'object' && 'code' in error && 'message' in error)) {
      return this.response(500, { code: 'INTERNAL_ERROR', message: 'Unexpected server error' });
    }
    const apiError = error as ApiError;
    const status = statusMap[apiError.code] || 500;
    return this.response(status, {
      code: apiError.code || "INTERNAL_ERROR", message: apiError.message || "Server error"
    });
  }
}