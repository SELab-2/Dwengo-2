import { Express, RequestHandler } from "express";
import { Controller } from "../controllers/controllerExpress";
import { requestFromExpress, responseToExpress } from "../helpersExpress";
import { HttpMethod } from "../types";

/**
 * Configuration for a single route mapping HTTP methods to controller actions
 */
interface RouteConfig {
    app: Express;
    method: HttpMethod;
    urlPattern: string;
    controller?: Controller;
    middleware?: RequestHandler[];
}

/**
 * Configures a single route using the provided configuration and method map.
 * Maps HTTP requests to the controller's handle method after
 * converting Express request/response objects to our internal format.
 *
 * @param config - Route configuration object containing app, method, urlPattern, and controller
 * @param methodMap - Array of [HttpMethod, Express method name] pairs defining supported methods
 */
export function configureRoute(
    { app, method, urlPattern, controller = undefined, middleware = [] }: RouteConfig,
    methodMap: [HttpMethod, keyof Express][],
): void {
    if (!controller && middleware.length === 0) {
        console.warn(`Warning: Route ${urlPattern} for method ${method} has no controller or middleware.`);
        return;
    }
    let handler: RequestHandler = (req, res, next) => next();
    if (controller) {
        handler = async (req, res, next) => {
            try {
                const request = requestFromExpress(req);
                const response = await controller.handle(request);
                responseToExpress(response, res);
            } catch (error) {
                next(error);
            }
        };
    }



    for (const [httpMethod, appMethod] of methodMap) {
        if (httpMethod === method) {
            app[appMethod](urlPattern, ...middleware, handler);
            return;
        }
    }
    throw new Error(`Unsupported HTTP method: ${method}`);
}

/**
 * Configures multiple routes using an array of route configurations and a method map.
 *
 * @param configs - Array of route configuration objects
 * @param methodMap - Array of [HttpMethod, Express method name] pairs defining supported methods
 */
export function configureRoutes(configs: RouteConfig[], methodMap: [HttpMethod, keyof Express][]): void {
    configs.forEach(config => configureRoute(config, methodMap));
}

// Default method map for common use
export const DEFAULT_METHOD_MAP: [HttpMethod, keyof Express][] = [
    [HttpMethod.GET, "get"],
    [HttpMethod.POST, "post"],
    [HttpMethod.PATCH, "patch"],
    [HttpMethod.DELETE, "delete"],
];
