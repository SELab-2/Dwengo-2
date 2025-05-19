import { z } from "zod";
import { JoinRequestType } from "../../core/entities/joinRequest";

/**
 * Schemas for joinRequest Services
 */

export const acceptJoinRequestSchema = z.object({
    id: z.string(),
});

export const createJoinRequestSchema = z
    .object({
        requester: z.string(),
        class: z.string().optional(),
        code: z.string().optional(),
        userType: z.nativeEnum(JoinRequestType),
    })
    .refine(data => (data.class && !data.code) || (data.code && !data.class), {
        message: "Must provide either 'class' or 'code', but not both",
    });
export const deleteJoinRequestSchema = z.object({
    id: z.string(),
});

export const getUserJoinRequestsSchema = z.object({
    idParent: z.string(),
});

export const getClassJoinRequestsSchema = z.object({
    idParent: z.string(),
});

export const getJoinRequestSchema = z.object({
    id: z.string(),
});
