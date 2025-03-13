import { Request, Response, NextFunction } from "express";
import { ChallengeManager } from "../challenge";
import { UserType } from "../../core/entities/user";
import { services } from "../../config/services";
import { UUID } from "crypto";

const challengeManager = new ChallengeManager(services.users.get);

export const challengeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { signedChallenge, userType: userTypeString } = req.query;

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
    req.body.userId = userId;

    next();
};
