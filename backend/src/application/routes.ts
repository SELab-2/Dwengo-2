import { Express, RequestHandler } from "express";
import { Controller } from "./controller";
import { requestFromExpress, responseToExpress } from "./helpersExpress";
import { HttpMethod, Request, Response } from "./types";
import { errorLogger, logger } from "../config/logger";

/**
 * Configuration for a single route mapping HTTP methods to controller actions
 */
interface RouteConfig {
    app: Express;
    method: HttpMethod;
    urlPattern: string;
    controller?: Controller;
    extractor?: <T>(req: Request) => T;
    handler?: <T>(req: Request, params: T) => Promise<Response>;
    middleware?: RequestHandler[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncMiddleware = (fn: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (req: any, res: any, next: any) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

/**
 * Configures a single route using the provided configuration and method map.
 * Maps HTTP requests to the controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * @param config - Route configuration object containing app, method, urlPattern, and controller
 * @param methodMap - Array of [HttpMethod, Express method name] pairs defining supported methods
 */
export function configureRoute(
    { app, method, urlPattern, controller, extractor, handler, middleware = [] }: RouteConfig,
    methodMap: [HttpMethod, keyof Express][],
): void {
    if (!controller && middleware.length === 0) {
        logger.warn(`Route ${urlPattern} for method ${method} has no controller or middleware.`);
        return;
    }
    if (controller && (!extractor || !handler)) {
        errorLogger.error(
            `Route ${urlPattern} for method ${method} has a controller but is missing required extractor or handler.`,
        );
        return;
    }
    let reqHandler: RequestHandler = (req, res, next) => next();
    if (controller) {
        reqHandler = async (req, res, next) => {
            try {
                const request = requestFromExpress(req);
                const response = await controller.handle(
                    request,
                    extractor as <T>(req: Request) => T,
                    handler as <T>(req: Request, params: T) => Promise<Response>,
                );
                responseToExpress(response, res);
            } catch (error) {
                next(error);
            }
        };
    }

    for (const [httpMethod, appMethod] of methodMap) {
        if (httpMethod === method) {
            const wrappedMiddleware = middleware.map(mw => asyncMiddleware(mw));
            app[appMethod](urlPattern, ...wrappedMiddleware, reqHandler);
            return;
        }
    }

    errorLogger.error(`Unsupported HTTP method: ${method}`);
    throw new Error(`Unsupported HTTP method: ${method}`);
}

/**
 * Configures multiple routes using an array of route configurations and a method map.
 *
 * @param configs - Array of route configuration objects
 * @param methodMap - Array of [HttpMethod, Express method name] pairs defining supported methods
 */
export function configureRoutes(configs: RouteConfig[], methodMap: [HttpMethod, keyof Express][]): void {
    configs.forEach(config => {
        configureRoute(config, methodMap);
    });
}

// Default method map for common use
export const DEFAULT_METHOD_MAP: [HttpMethod, keyof Express][] = [
    [HttpMethod.GET, "get"],
    [HttpMethod.POST, "post"],
    [HttpMethod.PATCH, "patch"],
    [HttpMethod.DELETE, "delete"],
];
