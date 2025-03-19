import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ErrorCode, Request, Response, HttpMethod } from "./types";

/* ************* Constants ************* */

export const statusMap: Record<ErrorCode, number> = {
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    FORBIDDEN: 403,
    CONFLICT: 409,
};

export const prefixPatterns: Record<string, Record<string, string>> = {
    users: { "t-": "teacher", "s-": "student" },
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
            ...(req.headers as Record<string, string>),
            path: req.path,
        },
        body: req.body,
        pathParams: req.params,
        queryParams: req.query,
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
        body: req.body,
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
        body: {},
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
    expressRes.setHeader("Content-Type", "application/json");

    Object.entries(res.headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== "content-type") {
            expressRes.setHeader(key, value);
        }
    });

    expressRes.json(res.body);

    return expressRes;
}
