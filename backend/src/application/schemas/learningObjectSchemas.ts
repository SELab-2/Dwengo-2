import { z } from "zod";
import { HTMLType, LearningObjectContentType } from "../../core/entities/learningObject";

/**
 * Schemas for learningObject services
 */

export const getLearningObjectSchema = z.object({
    id: z.string(),
    type: z.nativeEnum(HTMLType),
    language: z.string().optional(),
    version: z.string().optional(),
});

export const getAllLearningObjectsSchema = z.object({
    searchTerm: z.string().optional(),
    uuid: z.string().optional(),
    hruid: z.string().optional(),
    version: z.number().optional(),
    language: z.string().optional(),
    contentType: z.nativeEnum(LearningObjectContentType).optional(),
    available: z.boolean().optional(),
    teacherExclusive: z.boolean().optional(),
    difficulty: z.number().int().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    targetAges: z.string().optional(),
    keywords: z.string().optional(),
    skosConcepts: z.string().optional(),
    minDifficulty: z.number().int().optional(),
    maxDifficulty: z.number().int().optional(),
    minTime: z.number().int().optional(),
    maxTime: z.number().int().optional(),
});

export const learningObjectSearchParams = [
    "searchTerm",
    "uuid",
    "hruid",
    "version",
    "language",
    "contentType",
    "available",
    "teacherExclusive",
    "difficulty",
    "title",
    "description",
    "targetAges",
    "keywords",
    "skosConcepts",
    "minDifficulty",
    "maxDifficulty",
    "minTime",
    "maxTime",
];
