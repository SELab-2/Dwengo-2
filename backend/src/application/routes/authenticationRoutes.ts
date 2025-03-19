import { Express, RequestHandler } from "express";
import { configureRoutes, DEFAULT_METHOD_MAP } from "./routesExpress";
import { controllers } from "../../config/controllers";
import * as UserServices from "../../core/services/user";
import { getAuthManager } from "../auth";
import { Controller } from "../controllers";
import { createZodParamsExtractor } from "../extractors";
import { loginMiddleware } from "../middleware/loginMiddleware";
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
    const authManager = getAuthManager(controllers.users.services.get);
    const login = loginMiddleware(authManager);
    configureRoutes(
        [
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/login",
                middleware: [login, ...middleware],
            },
            {
                app,
                method: HttpMethod.POST,
                urlPattern: "/register",
                controller,
                extractor: extractors.createUser,
                handler: (req, data) => controller.create(req, data),
                middleware,
            },
        ],
        DEFAULT_METHOD_MAP,
    );
}
