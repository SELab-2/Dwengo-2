import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { ErrorCode, Request, Response, HttpMethod, ApiError, ResponseHeaders, ResponseBody } from "./types";
import { errorLogger, logger } from "../config/logger";

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

/* ************* Error Handling ************* */

export type ResponderFunction = (status: number, body: unknown, headers?: ResponseHeaders) => Response;

/**
 * Creates an error handler function that uses the provided responder to generate responses
 *
 * @param responder - Function to create standardized responses
 * @returns An error handling function
 */
export function createErrorHandler(responder: ResponderFunction): (error: ApiError | unknown) => Response {
    return function handleError(error: ApiError | unknown): Response {
        if (!(error && typeof error === "object" && "code" in error && "message" in error)) {
            errorLogger.error("Unhandled error:", error);
            return responder(500, { code: "INTERNAL_ERROR", message: "Unexpected server error" });
        }

        const apiError = error as ApiError;
        const status = statusMap[apiError.code] || 500;

        if (status >= 500) {
            errorLogger.error(`Server error (${apiError.code}): ${apiError.message}`);
        } else if (status >= 400) {
            logger.warn(`Client error (${apiError.code}): ${apiError.message}`);
        } else {
            logger.info(`Response (${apiError.code}): ${apiError.message}`);
        }

        if (status === 500) {
            return responder(500, { code: "INTERNAL_ERROR", message: "Unexpected server error" });
        } else {
            return responder(status, {
                code: apiError.code,
                message: apiError.message || "Unknown error",
                ...Object.fromEntries(Object.entries(apiError).filter(([key]) => !["code", "message"].includes(key))),
            });
        }
    };
}

/**
 * Default function to serialize service responses to ResponseBody objects
 *
 * @param response The response from the service
 * @returns The response as a ResponseBody object
 */
export function defaultSerializer(response: unknown): ResponseBody {
    try {
        return response as ResponseBody;
    } catch (error) {
        throw new Error(`Failed to serialize service response: ${error}`);
    }
}

/**
 * Creates a default responder function that converts responses to the standard format
 *
 * @param serializer Optional custom serializer function
 * @returns A responder function
 */
export function createResponder(serializer: (resp: unknown) => ResponseBody = defaultSerializer): ResponderFunction {
    return (status: number, responseBody: unknown, headers: ResponseHeaders = {}): Response => {
        const body = serializer(responseBody);
        return { status, headers: { "Content-Type": "application/json", ...headers }, body };
    };
}

export const defaultResponder = createResponder();
export const defaultErrorHandler = createErrorHandler(defaultResponder);

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
