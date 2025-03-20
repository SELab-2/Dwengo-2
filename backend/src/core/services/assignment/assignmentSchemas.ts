import { z } from "zod";

/**
 * Schemas for assignment services
 */

export const createAssignmentSchema = z.object({
    classId: z.string(),
    learningPathId: z.string(),
    startDate: z.date(),
    deadline: z.date(),
    extraInstructions: z.string(),
});

export const deleteAssignmentSchema = z.object({
    id: z.string(),
});

export const getAssignmentSchema = z.object({
    id: z.string(),
});

export const getUserAssignmentsSchema = z.object({
    id: z.string(),
});

export const updateAssignmentSchema = z.object({
    id: z.string(),
    classId: z.string().optional(),
    learningPathId: z.string().optional(),
    startDate: z.date().optional(),
    deadline: z.date().optional(),
    extraInstructions: z.string().optional(),
});