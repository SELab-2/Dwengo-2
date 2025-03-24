import { z } from "zod";
import { UserType } from "../../core/entities/user";

/**
 * Schemas for user services
 */

export const assignStudentToGroupSchema = z.object({
    studentId: z.string(),
    groupId: z.string(),
});

export const createUserSchema = z.object({
    email: z.string().email(),
    firstName: z.string().min(1),
    familyName: z.string().min(1),
    passwordHash: z.string(),
    schoolName: z.string(),
    userType: z.nativeEnum(UserType),
});

export const deleteUserSchema = z.object({
    id: z.string(),
    userType: z.nativeEnum(UserType),
});

export const getAllUsersSchema = z.object({});

export const getAssignmentUsersSchema = z.object({
    idParent: z.string(),
});

export const getClassUsersSchema = z.object({
    idParent: z.string(),
});

export const getGroupUsersSchema = z.object({
    idParent: z.string(),
});

export const getClassSchema = z
    .object({
        userType: z.nativeEnum(UserType),
        id: z.string().optional(),
        email: z.string().email().optional(),
    })
    .refine(data => data.id !== undefined || data.email !== undefined, {
        message: "Either ID or email must be provided",
        path: ["id", "email"],
    });

export const removeUserFromSchema = z.object({
    id: z.string(),
    idParent: z.string(),
    userType: z.nativeEnum(UserType),
});

export const updateUserSchema = z.object({
    id: z.string(),
    userType: z.nativeEnum(UserType),
    email: z.string().email().optional(),
    firstName: z.string().min(1).optional(),
    familyName: z.string().min(1).optional(),
    passwordHash: z.string().optional(),
    schoolName: z.string().optional(),
});
