import express, { Request, Response, NextFunction } from "express";
import { ChallengeManager } from "../challenge";
import { UserType } from "../../core/entities/user";
import { services } from "../../config/services";
import { UUID } from "crypto";

const challengeManager = new ChallengeManager(services.users.get);


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Assume userId is a UUID
  const userId: UUID = req.query.userId as UUID;
  const signedChallenge: string = req.query.signedChallenge as string;
  const userTypeString = req.query.userType;

  // Validate query params
  if (!signedChallenge || typeof signedChallenge !== "string") {
    res.status(400).send("Invalid or missing signedChallenge");
  }
  if (userTypeString !== "teacher" && userTypeString !== "student") {
    res.status(400).send("Invalid userType");
  }

  const userType = userTypeString === "teacher" ? UserType.TEACHER : UserType.STUDENT;

  // Verify the challenge itself
  if (await challengeManager.verifyChallenge(userId, signedChallenge, userType)) {
    // Call next middleware or route
    return next();
  } else {
    res.status(401).send("Invalid Challenge");
  }
};

export const teacherAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  await authMiddleware(req, res, () => {
    if (req.query.userType === "teacher") {
      return next();
    }
    return res.status(403).send("Access denied: only teachers allowed");
  });
};

export const studentAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  await authMiddleware(req, res, () => {
    if (req.query.userType === "student") {
      return next();
    }
    return res.status(403).send("Access denied: only teachers allowed");
  });
};


const router = express.Router();

router.get('/challenge', (_: express.Request, res: express.Response) => {
  res.send(challengeManager.getChallenge());
});

router.get("/login", authMiddleware, (_req, res) => {
  res.send("Login successful");
});

export default router;