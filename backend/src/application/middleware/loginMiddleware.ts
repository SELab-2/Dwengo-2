import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { AuthenticationManager } from "../auth";
import { defaultErrorHandler, defaultResponder, responseToExpress } from "../helpersExpress";
import { ErrorCode } from "../types";

export function loginMiddleware(
    authManager: AuthenticationManager,
): (req: ExpressRequest, res: ExpressResponse) => Promise<void> {
    return async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
        if (
            "authenticatedUserId" in req ||
            (req.body && "authenticatedUserId" in req.body) ||
            (req.params && "authenticatedUserId" in req.params) ||
            (req.query && "authenticatedUserId" in req.query)
        ) {
            const response = defaultErrorHandler({
                code: ErrorCode.BAD_REQUEST,
                message: "Request manipulation detected",
            });
            responseToExpress(response, res);
            return;
        }

        const { email, password } = req.body || {};
        if (!email || !password) {
            const response = defaultErrorHandler({
                code: ErrorCode.BAD_REQUEST,
                message: "Email and password are required",
            });
            responseToExpress(response, res);
            return;
        }

        try {
            const token = await authManager.authenticate(email, password);
            if (!token) {
                const response = defaultErrorHandler({
                    code: ErrorCode.UNAUTHORIZED,
                    message: "Invalid credentials",
                });
                responseToExpress(response, res);
                return;
            }

            const payload = authManager.verifyToken(token);
            if (!payload || !payload.id) {
                const response = defaultErrorHandler(undefined);
                responseToExpress(response, res);
                return;
            }

            req.body.authenticatedUserId = payload.id;
            const response = defaultResponder(200, {
                token,
                id: payload.id,
                message: "Authentication successful",
            });
            responseToExpress(response, res);
        } catch (error) {
            const response = defaultErrorHandler(undefined);
            responseToExpress(response, res);
        }
    };
}
