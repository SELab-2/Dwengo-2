import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ErrorCode, Request, Response, HttpMethod, PathParams } from "./types";

export const statusMap: Record<ErrorCode, number> = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  CONFLICT: 409
}

/**
 * Convert an Express Request object to a Request object
 * @param req the Express Request object
 * @returns the Request object
 */
export function requestFromExpress(req: ExpressRequest): Request {
  return {
    method: HttpMethod[req.method as keyof typeof HttpMethod],
    headers: {
      ...req.headers as Record<string, string>,
      'path': req.path
    },
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
 * Converts a Response object to an Express Response object and sends it as JSON.
 * Ensures the Content-Type is always application/json and sends the response.
 *
 * @param res - The Response object containing status, headers, and body
 * @param expressRes - The Express Response object to modify and send
 * @returns The modified Express Response object
 */
export function responseToExpress(res: Response, expressRes: ExpressResponse): ExpressResponse {
  expressRes.status(res.status);
  expressRes.setHeader('Content-Type', 'application/json');

  Object.entries(res.headers).forEach(([key, value]) => {
    if (key.toLowerCase() !== 'content-type') {
      expressRes.setHeader(key, value);
    }
  });

  expressRes.json(res.body);

  return expressRes;
}

/**
 * Extracts path parameters from a Request object's path header.
 * Removes specified prefixes from `id` when entity matches and from `idParent` when parent matches,
 * based on a predefined mapping of entity types to prefix patterns.
 *
 * @param req - The Request object containing a `headers` property with a `path` field.
 * @returns A `PathParams` object with `id` and optionally `idParent` properties, or an empty object if no valid path is found.
 * @example
 * // For req.headers['path'] = "/users/t-123"
 * extractPathParams(req) // Returns { entity: "users", id: "123" }
 *
 * // For req.headers['path'] = "/users/s-123/orders/456"
 * extractPathParams(req) // Returns { parent: "users", idParent: "123", entity: "orders", id: "456" }
 *
 * // For req.headers['path'] = "/classes/789/users/x-012"
 * extractPathParams(req) // Returns { parent: "classes", idParent: "789", entity: "users", id: "012" }
 */
export function extractPathParams(req: Request): PathParams {
  const prefixPatterns: Record<string, string[]> = {
    'users': ['t-', 's-']
  };

  // Function to remove prefixes from an ID based on entity type
  const removePrefixes = (id: string, entityType: string | undefined): string => {
    if (!entityType || !prefixPatterns[entityType] || !id) return id;
    let result = id;
    for (const prefix of prefixPatterns[entityType]) {
      const regex = new RegExp(`^${prefix}`);
      if (regex.test(result)) {
        result = result.replace(regex, '');
        break;
      }
    }
    return result;
  };

  const path = req.headers['path']?.split('?')[0] || '';
  const pathParts = path.split('/').slice(1).filter(Boolean);
  const params: PathParams = {};

  if (pathParts.length === 2 || pathParts.length === 3) {
    params.entity = pathParts[0];
    params.id = pathParts[1];
    params.id = removePrefixes(params.id, params.entity);
  } else if (pathParts.length === 4) {
    params.parent = pathParts[0];
    params.idParent = pathParts[1];
    params.entity = pathParts[2];
    params.id = pathParts[3];
    params.id = removePrefixes(params.id, params.entity);
    params.idParent = removePrefixes(params.idParent, params.parent);
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
