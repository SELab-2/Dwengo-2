import { z } from "zod";
import { StatusType } from "../../core/entities/submission";

/**
 * Schemas for submission services
 */

export const getSubmissionSchema = z.object({
    id: z.string(),
});

export const deleteSubmissionSchema = z.object({
    id: z.string(),
});

export const createSubmissionSchema = z.object({
    studentId: z.string(),
    assignmentId: z.string(),
    learningObjectId: z.string(),
    time: z.string().transform((val: string) => new Date(val)),
    contents: z.string(),
    status: z.nativeEnum(StatusType).default(StatusType.NOT_ACCEPTED),
});

export const getUserSubmissionsSchema = z.object({
    idParent: z.string(),
    assignmentId: z.string().optional(),
    learningObjectId: z.string().optional(),
});
