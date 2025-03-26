import * as deps from "./dependencies";
import { middleware as mw } from "../../config/middleware";
import * as UserServices from "../../core/services/user";
import * as UserSchemas from "../schemas/userSchemas";

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
    createUser: deps.createZodParamsExtractor(UserSchemas.createUserSchema),
};

/* ************* Controller ************* */

export class AuthenticationController extends deps.Controller {
    constructor(register: UserServices.CreateUser) {
        super({ create: register });
    }
}

/* ************* Routes ************* */

export function authenticationRoutes(
    app: deps.Express,
    controller: AuthenticationController,
    middleware: deps.RequestHandler[] = [],
): void {
    deps.configureRoutes(
        [
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/login",
                middleware: [mw.login, ...middleware],
            },
            {
                app,
                method: deps.HttpMethod.POST,
                urlPattern: "/register",
                controller,
                extractor: extractors.createUser,
                handler: (req, data) => controller.create(req, data),
                middleware: [mw.password, ...middleware],
            },
        ],
        deps.DEFAULT_METHOD_MAP,
    );
}
