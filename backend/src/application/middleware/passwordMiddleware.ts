import bcrypt from "bcryptjs";
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
import { defaultErrorHandler, responseToExpress } from "../helpersExpress";
import { ErrorCode } from "../types";

export function passwordMiddleware() {
    return async (req: ExpressRequest, res: ExpressResponse, next: NextFunction): Promise<void> => {
        if (
            "passwordHash" in req ||
            (req.body && "passwordHash" in req.body) ||
            (req.params && "passwordHash" in req.params) ||
            (req.query && "passwordHash" in req.query)
        ) {
            const response = defaultErrorHandler({
                code: ErrorCode.BAD_REQUEST,
                message: "Request manipulation detected",
            });
            responseToExpress(response, res);
            return;
        }

        const { password } = req.body || {};
        if (!password) {
            const response = defaultErrorHandler({
                code: ErrorCode.BAD_REQUEST,
                message: "Password is required for registration",
            });
            responseToExpress(response, res);
            return;
        }
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        req.body.passwordHash = hash;
        delete req.body.password;

        next();
    };
}
