import express from "express";
import { ChallengeManager } from "../challenge";
import { UserType } from "../../core/entities/user";
import { services } from "../../config/services";
import { UUID } from "crypto";

const router = express.Router();
const challengeManager = new ChallengeManager(services.users.get);

router.get('/challenge', (_: express.Request, res: express.Response) => {
  res.send(challengeManager.getChallenge());
});

router.get('/login', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const userId: UUID = req.query.userId as UUID;
  const signedChallenge: string = req.query.signedChallenge as string;
  const userTypeString = req.query.userType;

  const userType = userTypeString === 'teacher' ? UserType.TEACHER : UserType.STUDENT;

  if (!userId || !signedChallenge) {
    res.status(400).send('Missing userId or signedChallenge');
    return;
  }

  if (await challengeManager.verifyChallenge(userId, signedChallenge, userType)) {
    res.send('Login successful');
    next();
  }
  else {
    res.status(401).send('Login failed');
  }
});

export default router;
