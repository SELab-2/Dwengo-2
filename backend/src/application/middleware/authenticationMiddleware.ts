import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
import { AuthenticationManager } from "../auth";

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
            res.status(400).json({ message: "Request manipulation detected" });
            return;
        }

        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ message: "No authentication token provided" });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        const payload = authService.verifyToken(token);
        if (!payload) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }

        req.body.authenticatedUserId = payload.id;

        next();
    };
}
