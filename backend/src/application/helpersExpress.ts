import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Request, Response, HttpMethod, PathParams } from "./types";

/**
 * Convert an Express Request object to a Request object
 * @param req the Express Request object
 * @returns the Request object
 */
export function requestFromExpress(req: ExpressRequest): Request {
  return {
    method: HttpMethod[req.method as keyof typeof HttpMethod],
    headers: req.headers as Record<string, string>,
    body: req.body
  };
}

/**
 * Convert a Request object to an Express Request object (not fully possible due to Express limitations)
 * @param req the Request object
 * @returns a partial Express Request object
 */
export function requestToExpress(req: Request): Partial<ExpressRequest> {
  return {
    method: HttpMethod[req.method],
    headers: req.headers,
    body: req.body
  };
}

/**
 * Convert an Express Response object to a Response object
 * @param res the Express Response object
 * @returns the Response object
 */
export function responseFromExpress(res: ExpressResponse): Response {
  return {
    headers: res.getHeaders() as Record<string, string>,
    status: res.statusCode,
    body: {}
  };
}

/**
 * Convert a Response object to an Express Response object
 * @param res the Response object
 * @param expressRes the Express Response object to modify
 * We have to "modify" the Express Response object because it is not possible to create a new one
 * @returns the modified Express Response object
 */
export function responseToExpress(res: Response, expressRes: ExpressResponse): ExpressResponse {
  expressRes.status(res.status);
  expressRes.json(res.body);

  Object.entries(res.headers).forEach(([key, value]) => {
    expressRes.setHeader(key, value);
  });

  return expressRes;
}

/**
 * Extracts path parameters from a Request object's path header.
 *
 * @param req - The Request object containing a `headers` property with a `path` field.
 * @returns A `PathParams` object with `id` and optionally `idParent` properties, or an empty object if no valid path is found.
 * @example
 * // For req.headers['path'] = "/users/123" or "/users/123/groups"
 * extractPathParams(req) // Returns { id: "123" }
 *
 * // For req.headers['path'] = "/users/123/orders/456"
 * extractPathParams(req) // Returns { id: "456", idParent: "123" }
 */
export function extractPathParams(req: Request): PathParams {
  // Remove query string if present before splitting
  const path = req.headers['path']?.split('?')[0] || '';
  const pathParts = path.split('/').slice(1).filter(Boolean);
  const params: PathParams = {};

  if (pathParts.length === 2 || pathParts.length === 3) {
    params.entity = pathParts[0];
    params.id = pathParts[1];
  }
  else if (pathParts.length === 4) {
    params.parent = pathParts[0];
    params.idParent = pathParts[1];
    params.entity = pathParts[2];
    params.id = pathParts[3];
  }

  return params;
}

/**
 * Extracts query parameters from a Request object's path header.
 * Converts values to appropriate types (string, number)
 *
 * @param req - The Request object containing a `headers` property with a `path` field.
 * @returns A Record of query parameters with converted values.
 * @example
 * // For req.headers['path'] = "/users?page=2&limit=10"
 * extractQueryParams(req) // Returns { page: 2, limit: 10 }
 */
export function extractQueryParams(req: Request): Record<string, string | number> {
  const path = req.headers['path'] || '';
  const queryString = path.split('?')[1] || '';
  if (!queryString) return {};

  const result: Record<string, string | number> = {};

  queryString.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value !== undefined) {
      // Convert to number if it's numeric
      const numValue = Number(value);
      result[key] = !isNaN(numValue) ? numValue : value;
    }
  });

  return result;
}
