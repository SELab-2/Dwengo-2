import { z } from "zod";
import { StepType } from "../../core/entities/step";

/**
 * Schemas for step services
 */

export const getStepSchema = z.object({
    id: z.string(),
});

export const deleteStepSchema = z.object({
    id: z.string(),
});

export const createStepSchema = z.object({
    assignmentId: z.string(),
    learningObjectId: z.string(),
    type: z.nativeEnum(StepType),
    form: z.string(),
});

export const getAssignmentStepsSchema = z.object({
    idParent: z.string(),
    learningObjectId: z.string().optional(),
});

export const updateStepSchema = z.object({
    id: z.string(),
    assignmentId: z.string().optional(),
    learningObjectId: z.string().optional(),
    type: z.nativeEnum(StepType).optional(),
    form: z.string().optional(),
});
