import express from 'express';

import { setupMiddleware } from './config/setupMiddleware';
import { setupRoutes } from './config/setupRoutes';
import { setupServer } from './config/setupServer';

const app = express();
setupMiddleware(app);
setupRoutes(app);
setupServer(app);
