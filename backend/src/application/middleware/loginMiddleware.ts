import { UUID } from "crypto";
import { Request, Response, NextFunction } from "express";
import { challengeManager } from "../../config/setupServer";
import { UserType } from "../../core/entities/user";

export const challengeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { signedChallenge, role: userTypeString } = req.body;

    // assume every userId is a UUID
    const userId: UUID = req.query.userId as UUID;

    if (!signedChallenge || typeof signedChallenge !== "string") {
        res.status(400).send("Invalid or missing signedChallenge");
        return;
    }
    if (userTypeString !== "teacher" && userTypeString !== "student") {
        res.status(400).send("Invalid userType");
        return;
    }

    const userType = userTypeString === "teacher" ? UserType.TEACHER : UserType.STUDENT;
    const isValid = await challengeManager.verifyChallenge(userId, signedChallenge, userType);

    if (!isValid) {
        res.status(401).send("Login failed");
        return;
    }

    // Hijack getUser
    req.body.id = userId;

    next();
};
