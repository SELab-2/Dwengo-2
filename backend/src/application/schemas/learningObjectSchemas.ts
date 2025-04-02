import { z } from "zod";
import { HTMLType } from "../../core/entities/learningObject";

/**
 * Schemas for user services
 */

export const getLearningObjectSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(HTMLType),
    language: z.string().optional(),
    version: z.string().optional()
});