/* eslint-disable @typescript-eslint/no-explicit-any */
import { fail } from "assert";
import * as Resources from "../../../src/application/resources";
import { HttpMethod, Request } from "../../../src/application/types";

// Mock dependencies
jest.mock("../../../src/application/helpersExpress", () => ({
    requestFromExpress: jest.fn(req => req),
    responseToExpress: jest.fn((response, res) => res),
    createErrorHandler: jest.fn(respond => (error: any) => ({
        status: 500,
        headers: {},
        body: { code: "INTERNAL_ERROR", message: "Unexpected server error" },
    })),
    defaultResponder: jest.fn((status: number, body: unknown) => ({ status, headers: {}, body })),
}));

jest.mock("typeorm", () => {
    const actualTypeORM = jest.requireActual("typeorm");
    return {
        ...actualTypeORM,
        DataSource: jest.fn().mockImplementation(() => ({
            initialize: jest.fn().mockResolvedValue(true),
            getRepository: jest.fn(),
            destroy: jest.fn().mockResolvedValue(true),
        })),
    };
});

jest.mock("../../../src/config/controllers", () => ({
    controllers: {
        assignment: {},
        authentication: {},
        class: {},
        group: {},
        joinCode: {},
        joinRequest: {},
        message: {},
        questionThread: {},
        submission: {},
        user: {},
        learningObject: {},
    },
}));

jest.mock("../../../src/config/middleware", () => ({
    middleware: {
        login: jest.fn((req, res, next) => next()),
        auth: jest.fn((req, res, next) => next()),
        password: jest.fn((req, res, next) => next()),
    },
}));

const { requestFromExpress, responseToExpress } = jest.requireMock("../../../src/application/helpersExpress");

type MockExpress = {
    get: jest.Mock<void, [string, ...any[]]>;
    post: jest.Mock<void, [string, ...any[]]>;
    patch: jest.Mock<void, [string, ...any[]]>;
    delete: jest.Mock<void, [string, ...any[]]>;
};

const createMockApp = (): MockExpress => ({
    get: jest.fn<void, [string, ...any[]]>(),
    post: jest.fn<void, [string, ...any[]]>(),
    patch: jest.fn<void, [string, ...any[]]>(),
    delete: jest.fn<void, [string, ...any[]]>(),
});

const mockController = {
    handle: jest.fn().mockImplementation(async (req: Request, extractor: any, handler: any) => {
        const params = extractor(req);
        return await handler(req, params);
    }),
    getOne: jest.fn().mockResolvedValue({ status: 200, headers: {}, body: {} }),
    getAll: jest.fn().mockResolvedValue({ status: 200, headers: {}, body: [] }),
    getChildren: jest.fn().mockResolvedValue({ status: 200, headers: {}, body: [] }),
    addChild: jest.fn().mockResolvedValue({ status: 201, headers: {}, body: {} }),
    removeChild: jest.fn().mockResolvedValue({ status: 204, headers: {}, body: {} }),
    update: jest.fn().mockResolvedValue({ status: 200, headers: {}, body: {} }),
    delete: jest.fn().mockResolvedValue({ status: 204, headers: {}, body: {} }),
    create: jest.fn().mockResolvedValue({ status: 201, headers: {}, body: {} }),
    services: {},
};

const mockExtractor = jest.fn((req: Request) => ({
    id: req.pathParams?.id || "test-id",
    idParent: req.pathParams?.idParent || "test-parent-id",
}));

const routeFunctions = {
    assignmentRoutes: Resources.assignmentRoutes,
    authenticationRoutes: Resources.authenticationRoutes,
    classRoutes: Resources.classRoutes,
    groupRoutes: Resources.groupRoutes,
    joinCodeRoutes: Resources.JoinCodeRoutes,
    joinRequestRoutes: Resources.joinRequestRoutes,
    messageRoutes: Resources.messageRoutes,
    questionThreadRoutes: Resources.questionThreadRoutes,
    submissionRoutes: Resources.submissionRoutes,
    progressRoutes: Resources.progressRoutes,
    userRoutes: Resources.userRoutes,
    learningObjectRoutes: Resources.learningObjectRoutes,
    learningPathRoutes: Resources.learningPathRoutes,
};

const routeConfigs: Record<
    keyof typeof routeFunctions,
    {
        method: HttpMethod;
        path: string;
        hasController?: boolean;
        request?: Partial<Request>; // Add optional request data
    }[]
> = {
    assignmentRoutes: [
        {
            method: HttpMethod.GET,
            path: "/assignments/:id",
            hasController: true,
            request: {
                pathParams: { id: "assignment-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/assignments/:id",
            hasController: true,
            request: {
                pathParams: { id: "assignment-1" },
                body: {
                    classId: "class-1",
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/assignments/:id",
            hasController: true,
            request: {
                pathParams: { id: "assignment-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/assignments",
            hasController: true,
            request: {
                body: {
                    classId: "class-1",
                    learningPathId: "path-1",
                    startDate: new Date("2025-01-01"),
                    deadline: new Date("2025-01-31"),
                    extraInstructions: "Complete all tasks",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users/:idParent/assignments",
            hasController: true,
            request: {
                pathParams: { idParent: "user-1" },
            },
        },
    ],
    authenticationRoutes: [
        { method: HttpMethod.POST, path: "/login", hasController: false },
        {
            method: HttpMethod.POST,
            path: "/register",
            hasController: true,
            request: {
                body: {
                    email: "test@example.com",
                    firstName: "Test",
                    familyName: "User",
                    passwordHash: "hashedpassword",
                    schoolName: "Test School",
                    userType: "student",
                },
            },
        },
    ],
    classRoutes: [
        {
            method: HttpMethod.GET,
            path: "/classes/:id",
            hasController: true,
            request: {
                pathParams: { id: "class-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/classes/:id",
            hasController: true,
            request: {
                pathParams: { id: "class-1" },
                body: {
                    name: "Updated Class Name", // Optional, but including one field
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/classes/:id",
            hasController: true,
            request: {
                pathParams: { id: "class-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/classes",
            hasController: true,
            request: {
                body: {
                    name: "New Class",
                    description: "A test class",
                    targetAudience: "Students",
                    teacherId: "teacher-1",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users/:idParent/classes",
            hasController: true,
            request: {
                pathParams: { idParent: "user-1" },
            },
        },
    ],
    groupRoutes: [
        {
            method: HttpMethod.GET,
            path: "/groups/:id",
            hasController: true,
            request: {
                pathParams: { id: "group-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/groups/:id",
            hasController: true,
            request: {
                pathParams: { id: "group-1" },
                body: {
                    memberIds: ["user-1", "user-2"],
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/groups/:id",
            hasController: true,
            request: {
                pathParams: { id: "group-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/groups",
            hasController: true,
            request: {
                body: {
                    memberIds: ["user-1", "user-2"],
                    assignmentId: "assignment-1",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users/:idParent/groups",
            hasController: true,
            request: {
                pathParams: { idParent: "user-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/assignments/:idParent/groups",
            hasController: true,
            request: {
                pathParams: { idParent: "assignment-1" },
            },
        },
    ],
    joinCodeRoutes: [
        {
            method: HttpMethod.GET,
            path: "/codes/:id",
            hasController: true,
            request: {
                pathParams: { id: "code-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/codes/:id",
            hasController: true,
            request: {
                pathParams: { id: "code-1" },
                body: {
                    expired: true,
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/codes/:id",
            hasController: true,
            request: {
                pathParams: { id: "code-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/codes",
            hasController: true,
            request: {
                body: {
                    classId: "class-1",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/classes/:idParent/codes",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1" },
            },
        },
    ],
    joinRequestRoutes: [
        {
            method: HttpMethod.GET,
            path: "/requests/:id",
            hasController: true,
            request: {
                pathParams: { id: "request-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/requests/:id",
            hasController: true,
            request: {
                pathParams: { id: "request-1" },
                body: {
                    status: "accepted",
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/requests/:id",
            hasController: true,
            request: {
                pathParams: { id: "request-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/requests",
            hasController: true,
            request: {
                body: {
                    userId: "user-1",
                    classId: "class-1",
                    status: "pending",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users/:idParent/requests",
            hasController: true,
            request: {
                pathParams: { idParent: "user-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/classes/:idParent/requests",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1" },
            },
        },
    ],
    messageRoutes: [
        {
            method: HttpMethod.GET,
            path: "/messages/:id",
            hasController: true,
            request: {
                pathParams: { id: "message-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/messages/:id",
            hasController: true,
            request: {
                pathParams: { id: "message-1" },
                body: {
                    content: "Updated message content",
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/messages/:id",
            hasController: true,
            request: {
                pathParams: { id: "message-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/messages",
            hasController: true,
            request: {
                body: {
                    content: "New message content",
                    questionThreadId: "question-1",
                    authorId: "user-1",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/questions/:idParent/messages",
            hasController: true,
            request: {
                pathParams: { idParent: "question-1" },
            },
        },
    ],
    questionThreadRoutes: [
        {
            method: HttpMethod.GET,
            path: "/questions/:id",
            hasController: true,
            request: {
                pathParams: { id: "question-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/questions/:id",
            hasController: true,
            request: {
                pathParams: { id: "question-1" },
                body: {
                    title: "Updated question title",
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/questions/:id",
            hasController: true,
            request: {
                pathParams: { id: "question-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/questions",
            hasController: true,
            request: {
                body: {
                    title: "New question",
                    content: "Question content",
                    assignmentId: "assignment-1",
                    authorId: "user-1",
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/assignments/:idParent/questions",
            hasController: true,
            request: {
                pathParams: { idParent: "assignment-1" },
            },
        },
    ],
    submissionRoutes: [
        {
            method: HttpMethod.GET,
            path: "/submissions/:id",
            hasController: true,
            request: {
                pathParams: { id: "submission-1" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/submissions/:id",
            hasController: true,
            request: {
                pathParams: { id: "submission-1" },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/submissions/:id",
            hasController: true,
            request: {
                pathParams: { id: "submission-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/submissions",
            hasController: true,
            request: {
                body: {
                    assignmentId: "assignment-1",
                    userId: "user-1",
                    content: "Submission content",
                    submissionDate: new Date("2025-01-15"),
                },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users/:idParent/submissions",
            hasController: true,
            request: {
                pathParams: { idParent: "user-1" },
            },
        },
    ],
    progressRoutes: [
        {
            method: HttpMethod.GET,
            path: "/users/:idParent/progress",
            hasController: true,
            request: {
                pathParams: { idParent: "user-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/assignments/:idParent/progress",
            hasController: true,
            request: {
                pathParams: { idParent: "assignment-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/groups/:idParent/progress",
            hasController: true,
            request: {
                pathParams: { idParent: "group-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users/:userId/assignments/:assignmentId/progress",
            hasController: true,
            request: {
                pathParams: { userId: "user-1", assignmentId: "assignment-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/classes/:idParent/score",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/classes/:idParent/completion",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/classes/:idParent/activity",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1" },
            },
        },
    ],
    userRoutes: [
        {
            method: HttpMethod.GET,
            path: "/users/:id",
            hasController: true,
            request: {
                pathParams: { id: "user-1" },
                queryParams: { userType: "student" },
            },
        },
        {
            method: HttpMethod.PATCH,
            path: "/users/:id",
            hasController: true,
            request: {
                pathParams: { id: "user-1" },
                body: {
                    userType: "student",
                    firstName: "Updated Name",
                },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/users/:id",
            hasController: true,
            request: {
                pathParams: { id: "user-1" },
                queryParams: { userType: "student" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/classes/:idParent/users",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1" },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/classes/:idParent/users/:id",
            hasController: true,
            request: {
                pathParams: { idParent: "class-1", id: "user-1" },
                queryParams: { userType: "student" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/groups/:idParent/users",
            hasController: true,
            request: {
                pathParams: { idParent: "group-1" },
            },
        },
        {
            method: HttpMethod.POST,
            path: "/groups/:idParent/users",
            hasController: true,
            request: {
                pathParams: { idParent: "group-1" },
                body: { id: "user-1" },
            },
        },
        {
            method: HttpMethod.DELETE,
            path: "/groups/:idParent/users/:id",
            hasController: true,
            request: {
                pathParams: { idParent: "group-1", id: "user-1" },
                queryParams: { userType: "student" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/assignments/:idParent/users",
            hasController: true,
            request: {
                pathParams: { idParent: "assignment-1" },
            },
        },
        {
            method: HttpMethod.GET,
            path: "/users",
            hasController: true,
            request: {},
        },
    ],
    learningObjectRoutes: [
        {
            method: HttpMethod.GET,
            path: "/learningObject",
            hasController: true,
            request: {},
        },
        {
            method: HttpMethod.GET,
            path: "/learningObject/:id",
            hasController: true,
            request: {
                pathParams: { id: "ct08_05" },
                queryParams: { type: "raw" },
            },
        },
    ],
    learningPathRoutes: [
        {
            method: HttpMethod.GET,
            path: "/learningPath",
            hasController: true,
            request: {},
        },
        {
            method: HttpMethod.GET,
            path: "/learningPath/:id",
            hasController: true,
            request: {
                pathParams: { id: "anm3" },
                queryParams: { type: "nl" },
            },
        },
    ]
};

const testRoutes = (
    routeFn: (app: any, controller: any, middleware?: any[]) => void,
    routes: { method: HttpMethod; path: string; hasController?: boolean; request?: Partial<Request> }[],
) => {
    describe(routeFn.name, () => {
        let mockApp: MockExpress;

        beforeEach(() => {
            jest.clearAllMocks();
            mockApp = createMockApp();
            routeFn(mockApp, mockController, []);
        });

        afterAll(async () => {
            jest.clearAllMocks();
            const { DataSource } = jest.requireMock("typeorm");
            if (typeof DataSource === "function") {
                const mockDataSource = new DataSource();
                await mockDataSource.destroy();
            }
        });

        it("registers all routes correctly", async () => {
            const methodMap: Record<any, keyof MockExpress> = {
                [HttpMethod.GET]: "get",
                [HttpMethod.POST]: "post",
                [HttpMethod.PATCH]: "patch",
                [HttpMethod.DELETE]: "delete",
            };

            const methodCounts: Record<any, number> = {
                [HttpMethod.GET]: 0,
                [HttpMethod.POST]: 0,
                [HttpMethod.PATCH]: 0,
                [HttpMethod.DELETE]: 0,
            };

            for (const { method, path, hasController = true, request } of routes) {
                const mockMethod = mockApp[methodMap[method]];
                const calls = mockMethod.mock.calls;
                const routeCall = calls.find(call => call[0] === path);

                if (!routeCall) {
                    fail(`Route for ${method} ${path} was not registered`);
                }

                expect(routeCall[0]).toBe(path);
                const handlers = routeCall.slice(1);
                expect(handlers.length).toBeGreaterThan(0);

                const routeHandler = handlers[handlers.length - 1];
                expect(typeof routeHandler).toBe("function");

                // Use route-specific request if provided, otherwise default
                const req = request
                    ? {
                        headers: {},
                        method,
                        body: request.body || {},
                        pathParams: request.pathParams || {},
                        queryParams: request.queryParams || {},
                    }
                    : {
                        headers: {},
                        method,
                        body: {},
                        pathParams: { id: "test-id", idParent: "test-parent-id" },
                        queryParams: {},
                    };
                const res = { headers: {}, body: {}, status: 200 };
                const next = jest.fn();

                await routeHandler(req, res, next);

                if (hasController) {
                    expect(requestFromExpress).toHaveBeenCalledWith(req);
                    const transformedReq = requestFromExpress.mock.results[0].value;

                    expect(mockController.handle).toHaveBeenCalledWith(
                        transformedReq,
                        expect.any(Function),
                        expect.any(Function),
                    );
                    const controllerResponse = await mockController.handle.mock.results[0].value;
                    expect(responseToExpress).toHaveBeenCalledWith(controllerResponse, res);
                } else {
                    expect(next).toHaveBeenCalled();
                    expect(requestFromExpress).not.toHaveBeenCalled();
                    expect(mockController.handle).not.toHaveBeenCalled();
                    expect(responseToExpress).not.toHaveBeenCalled();
                }

                methodCounts[method]++;
            }

            Object.entries(methodCounts).forEach(([method, count]) => {
                const mockMethod = mockApp[methodMap[method as HttpMethod]];
                expect(mockMethod).toHaveBeenCalledTimes(count);
            });
        });
    });
};

// Run tests
Object.entries(routeConfigs).forEach(([fnName, routes]) => {
    const fn = routeFunctions[fnName as keyof typeof routeFunctions];
    testRoutes(fn, routes);
});
