import { z } from "zod";
import { HTMLType } from "../../core/entities/LearningObject";

/**
 * Schemas for user services
 */

export const getObjectSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(HTMLType),
    language: z.string().optional(),
    version: z.number().optional()
});