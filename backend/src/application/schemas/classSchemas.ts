import { z } from "zod";

// TODO - Move different get-types to a single schema with optionals and
// - a zod refine that deterimes if at least one is defined
// - all those that get with something different than a UUID or a unique
// - - vaue field should be routed to a service that possibly gets multiple
// - - entities that match, so a service like or equal to the one of
// - - getAllClasses
// - - example query: /users/:idParent/classes?name=cliodynamics
// - these also don't really follow the consistent style that the
// - - other schemas of group, users, assignments follow

/**
 * Schemas for class services
 */

export const createClassSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    targetAudience: z.string().min(1),
    teacherId: z.string(),
});

export const deleteClassSchema = z.object({
    id: z.string(),
});

export const getClassSchema = z
    .object({
        id: z.string().optional(),
        className: z.string().email().optional(),
    })
    .refine(data => data.id !== undefined || data.className !== undefined, {
        message: "Either ID or email must be provided",
        path: ["id", "className"],
    });

export const getUserClassesSchema = z.object({
    idParent: z.string(),
});

export const getAllClassesSchema = z.object({});

export const updateClassSchema = z.object({
    id: z.string(),
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    targetAudience: z.string().min(1).optional(),
});
