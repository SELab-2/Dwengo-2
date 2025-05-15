import { z } from "zod";

/**
 * Schemas for join-code services
 */

export const createJoinCodeSchema = z.object({
    classId: z.string(),
});

export const deleteJoinCodeSchema = z.object({
    id: z.string(),
});

export const getJoinCodeSchema = z.object({
    id: z.string(),
});

export const getClassJoinCodesSchema = z.object({
    idParent: z.string(),
});

export const updateJoinCodeSchema = z.object({
    id: z.string(),
    expired: z.literal(true).optional(),
});
