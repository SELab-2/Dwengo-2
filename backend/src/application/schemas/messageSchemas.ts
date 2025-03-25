import { z } from "zod";

/**
 * Schemas for message services
 */

export const createMessageSchema = z.object({
    senderId: z.string(),
    createdAt: z.date(),
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
    threadId: z.string(),
});

export const updateMessageSchema = z.object({
    id: z.string(),
    content: z.string(),
});