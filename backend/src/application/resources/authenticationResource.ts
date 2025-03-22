import { Express, RequestHandler } from "express";
import { middleware as mw } from "../../config/middleware";
import * as UserServices from "../../core/services/user";
import { Controller } from "../controllers";
import { createZodParamsExtractor } from "../extractors";
import { configureRoutes, DEFAULT_METHOD_MAP } from "../routes/routesExpress";
import { HttpMethod } from "../types";

/**
 * RESTful routing configuration for authentication-related endpoints.
 * Maps HTTP requests to the AuthenticationController's handle method after
 * converting Express request/response objects to our internal format.
 *
 * Supported endpoints:
 * - POST /login - Log in user
 * - POST /register - Register new user
 */

/* ************* Extractors ************* */

const extractors = {
    createUser: createZodParamsExtractor(UserServices.createUserSchema),
};

/* ************* Controller ************* */

export class AuthenticationController extends Controller {
    constructor(register: UserServices.CreateUser) {
        super({ create: register });
    }
}

/* ************* Routes ************* */

export function authenticationRoutes(
    app: Express,
    controller: AuthenticationController,
    middleware: RequestHandler[] = [],
): void {
    configureRoutes(
        [
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/login",
                middleware: [mw.login, ...middleware],
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/register",
                controller,
                extractor: extractors.createUser,
                handler: (req, data) => controller.create(req, data),
                middleware: [mw.password, ...middleware],
            },
        ],
        DEFAULT_METHOD_MAP,
    );
}
