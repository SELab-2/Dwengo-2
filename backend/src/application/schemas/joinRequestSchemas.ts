import { z } from "zod";
import { JoinRequestType } from "../../core/entities/joinRequest";

/**
 * Schemas for joinRequest Services
 */

export const acceptJoinRequestSchema = z.object({
    requestId: z.string(),
});

export const createJoinRequestSchema = z.object({
    requesterId: z.string(),
    classId: z.string(),
    type: z.nativeEnum(JoinRequestType),
});

export const deleteJoinRequestSchema = z.object({
    id: z.string(),
});

export const getUserJoinRequestsSchema = z.object({
    userId: z.string(),
});

export const getJoinRequestSchema = z.object({
    userId: z.string(),
    requestId: z.string(),
});
