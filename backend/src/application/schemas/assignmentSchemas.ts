import { z } from "zod";

/**
 * Schemas for assignment services
 */

export const createAssignmentSchema = z.object({
    classId: z.string(),
    learningPathId: z.string(),
    start: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for start date" })
        .transform((val: string) => new Date(val)),
    deadline: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for deadline" })
        .transform((val: string) => new Date(val)),
    name: z.string(),
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
    start: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for start date" })
        .transform((val: string) => new Date(val))
        .optional(),
    deadline: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for deadline" })
        .transform((val: string) => new Date(val))
        .optional(),
    name: z.string().optional(),
    extraInstructions: z.string().optional(),
});
