import { z } from "zod";

/**
 * Schemas for class services
 */

export const createClassSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    targetAudience: z.string().min(1),
    teacherId: z.string(),
});

export const deleteClassSchema = z.object({
    id: z.string(),
});

export const getClassByIdSchema = z.object({
    id: z.string()
});

export const getClassByNameSchema = z.object({
    className: z.string(),
});

export const getClassByUserSchema = z.object({
    userId: z.string(),
});

export const getAllClassesSchema = z.object({});

export const updateClassSchema = z.object({
    id: z.string(),
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    targetAudience: z.string().min(1).optional(),
});