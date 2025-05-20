import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { UserType } from "../../core/entities/user";
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

        const { email, password, userType, refreshToken } = req.body || {};
        if (!((email && password && userType) || (!email && !password && !userType && refreshToken))) {
            const response = defaultErrorHandler({
                code: ErrorCode.BAD_REQUEST,
                message: "Email, password and userType or refresh token are required",
            });
            responseToExpress(response, res);
            return;
        }

        try {
            const tokens = await authManager.authenticate(
                email || "",
                password || "",
                userType as UserType,
                refreshToken,
            );
            if (!tokens) {
                const response = defaultErrorHandler({
                    code: ErrorCode.UNAUTHORIZED,
                    message: "Invalid credentials",
                });
                responseToExpress(response, res);
                return;
            }

            const payload = authManager.verifyToken(tokens.accessToken);
            if (!payload || !payload.id) {
                const response = defaultErrorHandler(undefined);
                responseToExpress(response, res);
                return;
            }

            req.body.authenticatedUserId = payload.id;
            const response = defaultResponder(200, {
                token: tokens.accessToken,
                refreshToken: tokens.refreshToken,
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
