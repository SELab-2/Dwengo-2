import dotenv from "dotenv";
import { Express } from "express";
import { services } from "./services";
import { ChallengeManager } from "../application/challenge";

export const challengeManager = new ChallengeManager(services.users.get);

export const setupServer = (app: Express) => {
    dotenv.config();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
};
