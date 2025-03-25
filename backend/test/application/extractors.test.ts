/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail } from "assert";
import { z } from "zod";
import { createZodParamsExtractor } from "../../src/application/extractors";
import { HttpMethod, ErrorCode, Request } from "../../src/application/types";

// Define Zod schemas for testing (replacing the old class-based params)
const baseSchema = z.object({
    id: z.string(),
    name: z.string(),
});

const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    userType: z.string().default("user"),
});

const studentSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    grade: z.number(),
    schoolName: z.string().optional(),
    userType: z.literal("student").default("student"),
});

const teacherSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    subjects: z.array(z.string()),
    department: z.string().optional(),
    userType: z.literal("teacher").default("teacher"),
});

const classSchema = z.object({
    id: z.string(),
    name: z.string(),
    teacherId: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    maxStudents: z.number().default(30),
});

const assignmentSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    classId: z.string(),
    dueDate: z.date().optional(),
    maxPoints: z.number().default(100),
});

const variousTypesSchema = z.object({
    stringParam: z.string(),
    numberParam: z.number(),
    booleanParam: z.boolean(),
    dateParam: z.date(),
    arrayParam: z.array(z.string()),
    objectParam: z.record(z.string(), z.unknown()),
});

// Test cases updated for Zod-based extraction
const testCases: Record<
    string,
    Array<{
        name: string;
        schema: z.ZodType;
        request: Request;
        expected?: any;
        expectedError?: { code: string; message: string; fields?: string[] };
        checker?: (data: any) => void;
    }>
> = {
    baseSchema: [
        {
            name: "extracts basic parameters from body",
            schema: baseSchema,
            request: {
                method: HttpMethod.GET,
                headers: {},
                body: { id: "123", name: "Test Entity" },
                pathParams: {},
                queryParams: {},
            },
            expected: { id: "123", name: "Test Entity" },
        },
        {
            name: "throws error for missing required parameter",
            schema: baseSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: { id: "b-123" }, // Missing 'name'
                pathParams: {},
                queryParams: {},
            },
            expectedError: {
                code: ErrorCode.BAD_REQUEST,
                message: "Validation failed: name: Required",
                fields: ["name"],
            },
        },
    ],
    userSchema: [
        {
            name: "extracts user parameters with default type",
            schema: userSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: { id: "u-123", name: "John Doe", email: "john@example.com" },
                pathParams: {},
                queryParams: {},
            },
            expected: { id: "u-123", name: "John Doe", email: "john@example.com", userType: "user" },
        },
        {
            name: "extracts parameters from mixed sources",
            schema: userSchema,
            request: {
                method: HttpMethod.GET,
                headers: {},
                body: { name: "Mixed Source User" },
                pathParams: { id: "u-999" },
                queryParams: { email: "mixed@example.com" },
            },
            expected: { id: "u-999", name: "Mixed Source User", email: "mixed@example.com", userType: "user" },
        },
    ],
    studentSchema: [
        {
            name: "extracts student parameters with all fields",
            schema: studentSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: {
                    id: "s-123",
                    name: "Jane Student",
                    email: "jane@school.edu",
                    grade: 10,
                    schoolName: "High School",
                },
                pathParams: {},
                queryParams: {},
            },
            expected: {
                id: "s-123",
                name: "Jane Student",
                email: "jane@school.edu",
                grade: 10,
                schoolName: "High School",
                userType: "student",
            },
        },
        {
            name: "extracts student parameters without optional field",
            schema: studentSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: { id: "s-456", name: "Bob Student", email: "bob@school.edu", grade: 11 },
                pathParams: {},
                queryParams: {},
            },
            expected: {
                id: "s-456",
                name: "Bob Student",
                email: "bob@school.edu",
                grade: 11,
                userType: "student",
            },
        },
    ],
    teacherSchema: [
        {
            name: "extracts teacher parameters with all fields",
            schema: teacherSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: {
                    id: "t-789",
                    name: "Dr. Teacher",
                    email: "teacher@school.edu",
                    subjects: ["Math", "Physics"],
                    department: "Science",
                },
                pathParams: {},
                queryParams: {},
            },
            expected: {
                id: "t-789",
                name: "Dr. Teacher",
                email: "teacher@school.edu",
                subjects: ["Math", "Physics"],
                department: "Science",
                userType: "teacher",
            },
        },
    ],
    classSchema: [
        {
            name: "extracts class parameters with id from path",
            schema: classSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: {
                    name: "Advanced Math",
                    teacherId: "t-789",
                    startDate: new Date("2023-09-01"),
                    maxStudents: 25,
                },
                pathParams: { id: "c-456" },
                queryParams: {},
            },
            expected: {
                id: "c-456",
                name: "Advanced Math",
                teacherId: "t-789",
                startDate: new Date("2023-09-01"),
                maxStudents: 25,
            },
        },
    ],
    assignmentSchema: [
        {
            name: "extracts assignment parameters with id from path",
            schema: assignmentSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: {
                    title: "Final Project",
                    description: "Build a web application",
                    classId: "c-456",
                    dueDate: new Date("2023-12-15"),
                },
                pathParams: { id: "a-789" },
                queryParams: {},
            },
            expected: {
                id: "a-789",
                title: "Final Project",
                description: "Build a web application",
                classId: "c-456",
                dueDate: new Date("2023-12-15"),
                maxPoints: 100,
            },
        },
    ],
    variousTypesSchema: [
        {
            name: "handles various parameter types",
            schema: variousTypesSchema,
            request: {
                method: HttpMethod.POST,
                headers: {},
                body: {
                    stringParam: "string value",
                    numberParam: 42,
                    booleanParam: true,
                    dateParam: new Date("2023-01-01"),
                    arrayParam: ["a", "b", "c"],
                    objectParam: { key: "value" },
                },
                pathParams: {},
                queryParams: {},
            },
            expected: {
                stringParam: "string value",
                numberParam: 42,
                booleanParam: true,
                dateParam: new Date("2023-01-01"),
                arrayParam: ["a", "b", "c"],
                objectParam: { key: "value" },
            },
        },
    ],
};

// Generic test function for Zod-based extractors
const testZodExtractor = (
    schemaName: string,
    testCases: Array<{
        name: string;
        schema: z.ZodType;
        request: Request;
        expected?: any;
        expectedError?: { code: string; message: string; fields?: string[] };
        checker?: (data: any) => void;
    }>,
) => {
    describe(`${schemaName} Extractor`, () => {
        testCases.forEach(testCase => {
            it(testCase.name, () => {
                const extractor = createZodParamsExtractor(testCase.schema, testCase.checker);

                if (testCase.expectedError) {
                    try {
                        extractor(testCase.request);
                        fail(`Expected error with message: ${testCase.expectedError.message}, but no error was thrown`);
                    } catch (error) {
                        expect(error).toMatchObject(testCase.expectedError);
                    }
                } else if (testCase.expected) {
                    const result = extractor(testCase.request);
                    expect(result).toEqual(testCase.expected);
                }
            });
        });
    });
};

describe("Zod Parameter Extractor", () => {
    describe("createZodParamsExtractor", () => {
        Object.entries(testCases).forEach(([schemaName, cases]) => {
            testZodExtractor(schemaName, cases);
        });
    });
});
