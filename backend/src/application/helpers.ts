import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { Request, Response, HttpMethod } from "./types";

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
