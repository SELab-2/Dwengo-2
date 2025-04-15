import { z } from "zod";

export const getUserAssignmentProgressSchema = z.object({
    idParent: z.string(),
    id: z.string(),
});

export const getProgressSchema = z.object({
    idParent: z.string(),
});