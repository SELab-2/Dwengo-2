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

export const createTaskSchema = z
    .object({
        assignmentId: z.string(),
        step: z.number(),
        question: z.string(),
        type: z.nativeEnum(TaskType),
        details: z.unknown(),
    })
    .superRefine((data, ctx) => {
        if (data.type === TaskType.MultipleChoice) {
            const result = MultipleChoiceDetailsSchema.safeParse(data.details);
            if (!result.success) {
                result.error.issues.forEach(issue => ctx.addIssue(issue));
            }
        } else if (data.type === TaskType.NormalQuestion) {
            const result = NormalQuestionDetailsSchema.safeParse(data.details);
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
