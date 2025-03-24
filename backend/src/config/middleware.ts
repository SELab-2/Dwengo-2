import { controllers } from "./controllers";
import { getAuthManager } from "../application/auth";
import { authMiddleware } from "../application/middleware/authenticationMiddleware";
import { loginMiddleware } from "../application/middleware/loginMiddleware";
import { passwordMiddleware } from "../application/middleware/passwordMiddleware";

export const middleware = {
    login: loginMiddleware(getAuthManager(controllers.user.services.get)),
    auth: authMiddleware(getAuthManager(controllers.user.services.get)),
    password: passwordMiddleware(),
};
