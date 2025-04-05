import { z } from "zod";

/**
 * Schemas for assignment services
 */

export const createAssignmentSchema = z.object({
    classId: z.string(),
    learningPathId: z.string(),
    startDate: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for startDate" })
        .transform((val: string) => new Date(val)),
    deadline: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for startDate" })
        .transform((val: string) => new Date(val)),
    extraInstructions: z.string(),
});

export const deleteAssignmentSchema = z.object({
    id: z.string(),
});

export const getAssignmentSchema = z.object({
    id: z.string(),
});

export const getUserAssignmentsSchema = z.object({
    idParent: z.string(),
});

export const updateAssignmentSchema = z.object({
    id: z.string(),
    classId: z.string().optional(),
    learningPathId: z.string().optional(),
    startDate: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for startDate" })
        .transform((val: string) => new Date(val))
        .optional(),
    deadline: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for startDate" })
        .transform((val: string) => new Date(val))
        .optional(),
    extraInstructions: z.string().optional(),
});
