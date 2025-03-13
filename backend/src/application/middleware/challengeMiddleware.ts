import { Request, Response, NextFunction } from "express";
import { services } from "../../config/services";
import { ChallengeManager } from "../challenge";

const challengeManager = new ChallengeManager(services.users.get);

export const challengeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const challenge = challengeManager.getChallenge();
    res.json({ challenge });
};
