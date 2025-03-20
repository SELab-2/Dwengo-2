import { z } from "zod";

export const createGroupSchema = z.object({
    memberIds: z.array(z.string()),
    assignmentId: z.string(),
});

export const deleteGroupSchema = z.object({
    id: z.string(),
});

export const getAssignmentGroupSchema = z.object({
    id: z.string(),
});

export const getGroupSchema = z.object({
    id: z.string(),
});

export const getUserGroupsSchema = z.object({
    id: z.string(),
});

export const updateGroupSchema = z.object({
    id: z.string(),
    memberIds: z.array(z.string()),
});
