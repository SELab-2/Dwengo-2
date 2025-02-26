import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Request, Response, HttpMethod } from "./types";

/**
 * Convert an Express Request object to a Request object
 * @param req the Express Request object
 * @returns the Request object
 */
export function requestFromExpress(req: ExpressRequest): Request {
  return {
    // convert the string method to the enum value
    method: HttpMethod[req.method as keyof typeof HttpMethod],
    // these headers already have the correct type, but they should be converted to a Record instead of an IncommingHttpHeaders object
    headers: req.headers as Record<string, string>,
    // convert the body to a string, or an empty string if it is undefined
    body: req.body ? JSON.stringify(req.body) : ""
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
    body: req.body ? JSON.parse(req.body) : undefined
  };
}

/**
 * Convert an Express Response object to a Response object
 * @param res the Express Response object
 * @returns the Response object
 */
export function responseFromExpress(res: ExpressResponse): Response {
  return {
    headers: Object.fromEntries(Object.entries(res.getHeaders()).map(([key, value]) => [key, value?.toString() || ""])),
    status: res.statusCode,
    body: {} // Express does not provide direct access to response body
  };
}

/**
 * Convert a Response object to an Express Response object
 * @param res the Response object
 * @returns the Express Response object
 */
export function responseToExpress(res: Response, expressRes: ExpressResponse): ExpressResponse {
  Object.entries(res.headers).forEach(([key, value]) => {
    expressRes.setHeader(key, value);
  });
  expressRes.status(res.status);
  expressRes.json(res.body);
  return expressRes;
}
