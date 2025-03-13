import dotenv from "dotenv";
import { Express } from "express";
import { ChallengeManager } from "../application/challenge";
import { services } from "./services";

export const challengeManager = new ChallengeManager(services.users.get);

export const setupServer = (app: Express) => {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};
