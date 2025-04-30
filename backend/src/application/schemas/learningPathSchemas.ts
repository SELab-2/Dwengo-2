import { z } from "zod";

/**
 * Schemas for learningPath services
 */

export const getLearningPathSchema = z.object({
    id: z.string(),
    includeNodes: z
        .preprocess(
            (val: unknown) => val === "true", // Everything that is not 'true' will be false
            z.boolean(),
        )
        .optional(),
    language: z.string().optional(),
});

export const getAllLearningPathsSchema = z.object({
    all: z.string().optional(),
    language: z.string().optional(),
    hruid: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    includeNodes: z
        .preprocess(
            (val: unknown) => val === "true", // Everything that is not 'true' will be false
            z.boolean(),
        )
        .optional(),
});

export const learningPathSearchParams = ["language", "hruid", "title", "description"];
