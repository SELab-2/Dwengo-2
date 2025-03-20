import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
import { logger } from "../../config/logger";
import { AuthenticationManager } from "../auth";
import { defaultErrorHandler, responseToExpress } from "../helpersExpress";
import { ErrorCode } from "../types";

export function authMiddleware(
    authService: AuthenticationManager,
): (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => void {
    return (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
        if (
            "authenticatedUserId" in req ||
            (req.body && "authenticatedUserId" in req.body) ||
            (req.params && "authenticatedUserId" in req.params) ||
            (req.query && "authenticatedUserId" in req.query)
        ) {
            logger.warn(`Authentication manipulation detected`, {
                ip: req.ip,
                path: req.path,
            });
            const response = defaultErrorHandler({
                code: ErrorCode.BAD_REQUEST,
                message: "Request manipulation detected",
            });
            responseToExpress(response, res);
            return;
        }

        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            const response = defaultErrorHandler({
                code: ErrorCode.UNAUTHORIZED,
                message: "No authentication token provided",
            });
            responseToExpress(response, res);
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const payload = authService.verifyToken(token);
        if (!payload) {
            const response = defaultErrorHandler({
                code: ErrorCode.UNAUTHORIZED,
                message: "Invalid or expired token",
            });
            responseToExpress(response, res);
            return;
        }

        req.body.authenticatedUserId = payload.id;

        next();
    };
}
