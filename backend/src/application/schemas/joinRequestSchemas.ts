import { z } from "zod";
import { JoinRequestType } from "../../core/entities/joinRequest";

/**
 * Schemas for joinRequest Services
 */

export const acceptJoinRequestSchema = z.object({
    id: z.string(),
});

export const createJoinRequestSchema = z.object({
    requester: z.string(),
    class: z.string(),
    userType: z.nativeEnum(JoinRequestType),
});

export const deleteJoinRequestSchema = z.object({
    id: z.string(),
});

export const getUserJoinRequestsSchema = z.object({
    idParent: z.string(),
});

export const getJoinRequestSchema = z.object({
    id: z.string(),
});
