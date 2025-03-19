import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { AuthenticationManager } from "../auth";

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
            res.status(400).json({ message: "Request manipulation detected" });
            return;
        }

        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        try {
            const token = await authManager.authenticate(email, password);
            if (!token) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }

            const payload = authManager.verifyToken(token);
            if (!payload || !payload.id) {
                res.status(500).json({ message: "Error processing authentication token" });
                return;
            }

            req.body.authenticatedUserId = payload.id;
            res.status(200).json({ token, userId: payload.id, message: "Authentication successful" });
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Internal server error during authentication" });
        }
    };
}
