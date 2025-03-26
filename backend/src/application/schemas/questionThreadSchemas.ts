import { z } from "zod";
import { VisibilityType } from "../../core/entities/questionThread";

/**
 * Schemas for questionThread Services
 */

export const createQuestionThreadSchema = z.object({
    creatorId: z.string(),
    assignmentId: z.string(),
    learningObjectId: z.string(),
    isClosed: z.boolean().default(false),
    visibility: z.nativeEnum(VisibilityType),
    messageIds: z.array(z.string()),
    id: z.string().optional(),
});

export const deleteQuestionThreadSchema = z.object({
    id: z.string(),
});

export const getAssignmentQuestionThreadsSchema = z.object({
    assignmentId: z.string(),
});

export const getQuestionThreadSchema = z.object({
    id: z.string(),
});

export const updateQuestionThreadSchema = z.object({
    id: z.string(),
    isClosed: z.boolean().optional(),
    visibility: z.nativeEnum(VisibilityType).optional(),
});
