import { z } from "zod";
import { TaskType } from "../../config/taskTypes";

/**
 * Schemas for task services
 */

const MultipleChoiceDetailsSchema = z.object({
    options: z.array(z.string()),
    correctAnswers: z.array(z.number()),
    allowMultipleAnswers: z.boolean().optional(),
});

const NormalQuestionDetailsSchema = z.object({
    predefined_answer: z.string().optional(),
});

const OtherSchema = z.object({});

const detailsSchemaMap = {
    [TaskType.MultipleChoice]: MultipleChoiceDetailsSchema,
    [TaskType.NormalQuestion]: NormalQuestionDetailsSchema,
    [TaskType.Other]: OtherSchema,
};

export const createTaskSchema = z
    .object({
        assignmentId: z.string(),
        step: z.number(),
        question: z.string(),
        type: z.nativeEnum(TaskType),
        details: z.unknown(),
    })
    .superRefine((data, ctx) => {
        const schema = detailsSchemaMap[data.type as TaskType];
        if (schema) {
            const result = schema.safeParse(data.details);
            if (!result.success) {
                result.error.issues.forEach(issue => ctx.addIssue(issue));
            }
        } else {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Unknown task type for details validation.",
            });
        }
    });

export const updateTaskSchema = z
    .object({
        id: z.string(),
        assignmentId: z.string().optional(),
        step: z.number().optional(),
        question: z.string().optional(),
        type: z.nativeEnum(TaskType).optional(),
        details: z.unknown().optional(), // details is now always optional
    })
    .superRefine((data, ctx) => {
        // Only validate details if it is present
        if (data.details !== undefined && data.type !== undefined) {
            const schema = detailsSchemaMap[data.type as TaskType];
            if (schema) {
                const result = schema.safeParse(data.details);
                if (!result.success) {
                    result.error.issues.forEach(issue => ctx.addIssue(issue));
                }
            } else {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Unknown task type for details validation.",
                });
            }
        }
    });

export const getTasksSchema = z.object({
    idParent: z.string(),
    step: z.preprocess(val => (val === undefined ? undefined : Number(val)), z.number().optional()),
});

export const getTaskSchema = z.object({
    id: z.string(),
});

export const deleteTaskSchema = z.object({
    id: z.string(),
});
