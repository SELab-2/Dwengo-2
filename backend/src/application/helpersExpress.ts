import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { ErrorCode, Request, Response, HttpMethod, PathParams, QueryParams } from "./types";

/* ************* Constants ************* */

export const statusMap: Record<ErrorCode, number> = {
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  CONFLICT: 409
}

export const prefixPatterns: Record<string, Record<string, string>> = {
  'users': { 't-': 'teacher', 's-': 'student' }
};

/* ************* Request/Response Conversion ************* */

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

/* ************* Path Parameter Processing ************* */

/**
 * Function to remove prefixes from an ID based on entity type
 * Returns both the ID without prefix and the identified type if a prefix was found
 *
 * @param id - The ID with potential prefix
 * @param entityType - The entity type to check for prefixes
 * @param customPrefixPatterns - Optional custom prefix patterns to use
 * @returns Object containing the ID without prefix and the identified type if a prefix was found
 */
function removePrefixes(
  id: string, entityType: string | undefined,
  customPrefixPatterns?: Record<string, Record<string, string>>
): {id: string; type?: string} {
  const patterns = customPrefixPatterns || prefixPatterns;
  if (!entityType || !patterns[entityType] || !id) return { id };

  const entityPrefixes = patterns[entityType];
  for (const [prefix, prefixType] of Object.entries(entityPrefixes)) {
    const regex = new RegExp(`^${prefix}`);
    if (regex.test(id)) {
      return { id: id.replace(regex, ''), type: prefixType };
    }
  }

  return { id: id, type: undefined };
}

/**
 * Extracts path parameters from a Request object's path header.
 * Removes specified prefixes from `id` when entity matches and from `idParent` when parent matches,
 * based on a predefined or custom mapping of entity types to prefix patterns.
 * Also extracts and stores the type information when a prefix is matched.
 *
 * @param req - The Request object containing a `headers` property with a `path` field.
 * @param customPrefixPatterns - Optional custom prefix patterns to use instead of the default
 * @returns A `PathParams` object with `id` and optionally `idParent` properties,
 *          plus `type` and `parentType` if prefixes were matched.
 * @example
 * // For req.headers['path'] = "/users/t-123"
 * extractPathParams(req) // Returns { entity: "users", id: "123", type: "teacher" }
 *
 * // For req.headers['path'] = "/users/s-123/orders/456"
 * extractPathParams(req) // Returns { parent: "users", idParent: "123", parentType: "student", entity: "orders", id: "456" }
 */
export function extractPathParams(req: Request, customPrefixPatterns?: Record<string, Record<string, string>>): PathParams {
  const path = req.headers['path']?.split('?')[0] || '';
  const pathParts = path.split('/').slice(1).filter(Boolean);
  const params: PathParams = {};

  if (pathParts.length === 1) {
    params.entity = pathParts[0];
  }
  else if (pathParts.length === 2) {
    params.entity = pathParts[0];
    params.id = pathParts[1];

    const { id, type } = removePrefixes(params.id, params.entity, customPrefixPatterns);
    params.id = id;
    if (type) params.idType = type;
  }
  else if (pathParts.length === 3) {
    params.parent = pathParts[0];
    params.idParent = pathParts[1];
    params.entity = pathParts[2];

    const { id: parentId, type: parentType } = removePrefixes(params.idParent, params.parent, customPrefixPatterns);
    params.idParent = parentId;
    if (parentType) params.idParentType = parentType;
  }
  else if (pathParts.length === 4) {
    params.parent = pathParts[0];
    params.idParent = pathParts[1];
    params.entity = pathParts[2];
    params.id = pathParts[3];

    const { id, type } = removePrefixes(params.id, params.entity, customPrefixPatterns);
    const { id: parentId, type: parentType } = removePrefixes(params.idParent, params.parent, customPrefixPatterns);
    params.id = id;
    params.idParent = parentId;
    if (type) params.idType = type;
    if (parentType) params.idParentType = parentType;
  }

  return params;
}

/* ************* Query Parameter Processing ************* */

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
export function extractQueryParams(req: Request): QueryParams {
  const path = req.headers['path'] || '';
  const queryString = path.split('?')[1] || '';
  if (!queryString) return {};

  const result: QueryParams = {};

  queryString.split('&').forEach(param => {
    if (!param) return;
    const [key, value] = param.split('=');
    if (key) {
      const actualValue = value === undefined ? 'true' : value;
      const numValue = Number(value);
      result[key] = value === '' ? '' : !isNaN(numValue) && actualValue !== 'true' ? numValue : actualValue;
    }
  });

  return result;
}
