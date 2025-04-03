import { z } from "zod";

/**
 * Schemas for learningPath services
 */

export const getLearningPathSchema = z.object({
    id: z.string(),
    language: z.string().optional(),
});

const getlLearningPathsSchema = z.object({
    all: z.string().optional(),
    language: z.string().optional(),
    hruid: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
  });
