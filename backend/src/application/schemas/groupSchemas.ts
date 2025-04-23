import { z } from "zod";

export const createGroupSchema = z.object({
    members: z.array(z.string()),
    assignment: z.string(),
});

export const deleteGroupSchema = z.object({
    id: z.string(),
});

export const getAssignmentGroupsSchema = z.object({
    idParent: z.string(),
});

export const getGroupSchema = z.object({
    id: z.string(),
});

export const getUserGroupsSchema = z.object({
    idParent: z.string(),
});

export const updateGroupSchema = z.object({
    id: z.string(),
    members: z.array(z.string()),
});
