

/**
 * Schemas for task services
 */

import { z } from "zod";

export const createTaskSchema = z.object({});

export const getTasksSchema = z.object({});

export const getTaskSchema = z.object({});

export const deleteTaskSchema = z.object({
    id: z.string(),
})