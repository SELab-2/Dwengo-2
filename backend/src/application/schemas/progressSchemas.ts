import { z } from "zod";

export const getUserAssignmentProgressSchema = z.object({
    userId: z.string(),
    assignmentId: z.string(),
});

export const getProgressSchema = z.object({
    idParent: z.string(),
});