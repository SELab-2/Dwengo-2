import { Server } from "http";
import { Express } from "express";
import { logger } from "./logger";

export const setupServer = (app: Express): Server => {
    const PORT = process.env.PORT || 3000;
    return app.listen(PORT, () => {
        logger.info(`Server is running at http://localhost:${PORT}`);
    });
};
