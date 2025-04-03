import { z } from "zod";

/**
 * Schemas for learningPath services
 */

export const getLearningPathSchema = z.object({
    id: z.string(),
    language: z.string().optional(),
});
