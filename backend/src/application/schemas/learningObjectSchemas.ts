import { z } from "zod";
import { HTMLType } from "../../core/entities/learningObject";

/**
 * Schemas for learningObject services
 */

export const getLearningObjectSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(HTMLType),
    language: z.string().optional(),
    version: z.string().optional(),
});
