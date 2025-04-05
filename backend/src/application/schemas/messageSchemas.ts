import { z } from "zod";

/**
 * Schemas for message services
 */

export const createMessageSchema = z.object({
    senderId: z.string(),
    createdAt: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: "Invalid date format for startDate" })
        .transform((val: string) => new Date(val)),
    threadId: z.string(),
    content: z.string(),
});

export const deleteMessageSchema = z.object({
    id: z.string(),
});

export const getMessageSchema = z.object({
    id: z.string(),
});

export const getThreadMessagesSchema = z.object({
    idParent: z.string(),
});

export const updateMessageSchema = z.object({
    id: z.string(),
    content: z.string(),
});
