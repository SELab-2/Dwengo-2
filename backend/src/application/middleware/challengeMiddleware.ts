import { Request, Response, NextFunction } from "express";
import { ChallengeManager } from "../challenge";
import { services } from "../../config/services";

const challengeManager = new ChallengeManager(services.users.get);

export const challengeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const challenge = challengeManager.getChallenge();
    res.json({ challenge });
};
