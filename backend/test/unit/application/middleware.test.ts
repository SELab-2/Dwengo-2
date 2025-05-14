/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from "express";
import { AuthenticationManager } from "../../../src/application/auth";
import { authMiddleware } from "../../../src/application/middleware/authenticationMiddleware";
import { loginMiddleware } from "../../../src/application/middleware/loginMiddleware";
import { passwordMiddleware } from "../../../src/application/middleware/passwordMiddleware";
import { ApiError, ErrorCode } from "../../../src/application/types";
import { GetUser } from "../../../src/core/services/user";
import { IUserRepository } from "../../../src/core/repositories/userRepositoryInterface";

type mockUser = { id: string; email: string; passwordHash: string };

async function generatePasswordHash(password: string, saltRounds: number = 10): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

function mockRepoConstructor(userData: mockUser) {
    const responseFn = () => ({ ...userData, toObject: () => ({ ...userData }) });
    const queryFn = (m: any, s: () => any, f: () => any) => (q: any) => (q === m ? s() : f());
    return {
        // eslint-disable-next-line prettier/prettier
        getById: jest.fn(queryFn(userData.id, () => Promise.resolve(responseFn()), () => Promise.reject(new Error("User not found")))),
        // eslint-disable-next-line prettier/prettier
        getByEmail: jest.fn(queryFn(userData.email, () => Promise.resolve(responseFn()), () => Promise.reject(new Error("User not found")))),
    };
}

jest.mock("../../../src/application/helpersExpress", () => ({
    requestFromExpress: jest.fn(req => req),
    responseToExpress: jest.fn((response, res) => {
        res.status(response.status).json(response.body);
        return res;
    }),
    defaultResponder: jest.fn((status: number, body: unknown) => ({ status, headers: {}, body })),
    defaultErrorHandler: jest.fn((error: ApiError | unknown) => error),
}));

jest.mock("../../../src/infrastructure/repositories/userRepositoryTypeORM", () => ({
    UserRepositoryTypeORM: jest.fn(
        (userData: mockUser) => mockRepoConstructor(userData) as unknown as jest.Mocked<IUserRepository>,
    ),
}));

const { UserRepositoryTypeORM } = jest.requireMock("../../../src/infrastructure/repositories/userRepositoryTypeORM");
const { responseToExpress, defaultErrorHandler, defaultResponder } = jest.requireMock(
    "../../../src/application/helpersExpress",
);

const mockUsers: Record<string, mockUser> = {
    user: { id: "s123", email: "s@example.com", passwordHash: "" },
};
let authManager: AuthenticationManager;
let authMiddlewareFn: (
    req: jest.Mocked<ExpressRequest>,
    res: jest.Mocked<ExpressResponse>,
    next: jest.Mocked<NextFunction>,
) => void;
let loginMiddlewareFn: (req: ExpressRequest, res: ExpressResponse) => Promise<void>;
let passwordMiddlewareFn: (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => Promise<void>;

async function setupTestEnvironment() {
    mockUsers.user.passwordHash = await generatePasswordHash("pass");
    authManager = new AuthenticationManager(
        new GetUser(UserRepositoryTypeORM(mockUsers.user)),
    );
    authMiddlewareFn = authMiddleware(authManager);
    loginMiddlewareFn = loginMiddleware(authManager);
    passwordMiddlewareFn = passwordMiddleware();
}

describe("authMiddleware", () => {
    let req: jest.Mocked<ExpressRequest>;
    let res: jest.Mocked<ExpressResponse>;
    let next: jest.Mocked<NextFunction>;

    beforeAll(async () => {
        await setupTestEnvironment();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // eslint-disable-next-line prettier/prettier
        req = { headers: {}, body: {}, params: {}, query: {}, header: jest.fn(name => req.headers[name.toLowerCase()]) } as any;
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        next = jest.fn();
    });

    async function check(setup: () => void, cont: boolean, error: ApiError | undefined) {
        setup();
        await authMiddlewareFn(req, res, next);
        cont ? expect(next).toHaveBeenCalled() : expect(next).not.toHaveBeenCalled();
        if (error) {
            expect(defaultErrorHandler).toHaveBeenCalledWith(error);
            expect(responseToExpress).toHaveBeenCalledTimes(1);
            expect(responseToExpress).toHaveBeenCalledWith(error, res);
        }
    }

    it("should return 400 if authenticatedUserId is in req", async () => {
        // eslint-disable-next-line prettier/prettier
        check(() => {(req as any).authenticatedUserId = "someId"}, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("should return 400 if authenticatedUserId is in body", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.body.authenticatedUserId = "someId"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("should return 400 if authenticatedUserId is in params", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.params.authenticatedUserId = "someId"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("should return 400 if authenticatedUserId is in query", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.query.authenticatedUserId = "someId"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("should return 401 if no Authorization header is provided", async () => {
        // eslint-disable-next-line prettier/prettier
        await check( () => {}, false, { code: ErrorCode.UNAUTHORIZED, message: "No authentication token provided" } );
    });
    it("should return 401 if Authorization header has wrong prefix", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.headers.authorization = "Basic someToken"; }, false, { code: ErrorCode.UNAUTHORIZED, message: "No authentication token provided" });
    });
    it("should return 401 if token is invalid", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.headers.authorization = "Bearer invalidToken"; }, false, { code: ErrorCode.UNAUTHORIZED, message: "Invalid or expired token" });
    });
    it("should set authenticatedUserId and call next for a valid token", async () => {
        const tokens = await authManager.authenticate(mockUsers.user.email, "pass");
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.headers.authorization = `Bearer ${tokens!.accessToken}`; }, true, undefined);
        expect(req.body.authenticatedUserId).toBe(mockUsers.user.id);
    });
});

describe("loginMiddleware", () => {
    let req: jest.Mocked<ExpressRequest>;
    let res: jest.Mocked<ExpressResponse>;

    beforeAll(async () => {
        await setupTestEnvironment();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        req = { headers: {}, body: {}, params: {}, query: {} } as any;
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    });

    async function check(setup: () => void, expectResponse: boolean, error?: ApiError, successData?: any) {
        setup();
        await loginMiddlewareFn(req, res);
        if (expectResponse) {
            expect(responseToExpress).toHaveBeenCalledTimes(1);
            if (error) {
                expect(defaultErrorHandler).toHaveBeenCalledWith(error);
                expect(responseToExpress).toHaveBeenCalledWith(error, res);
            } else if (successData) {
                expect(defaultResponder).toHaveBeenCalledWith(200, expect.objectContaining(successData));
            }
        }
    }

    it("rejects if authenticatedUserId is in req", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {(req as any).authenticatedUserId = "someId";}, true, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if authenticatedUserId is in body", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.body.authenticatedUserId = "someId";}, true, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if authenticatedUserId is in params", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.params.authenticatedUserId = "someId";}, true, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if authenticatedUserId is in query", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.query.authenticatedUserId = "someId";}, true, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if neither email/password nor refreshToken is provided", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.body = {};}, true, { code: ErrorCode.BAD_REQUEST, message: "Email and password or refresh token are required" });
    });
    it("rejects if only email is provided", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.body = { email: "s@example.com" };}, true, { code: ErrorCode.BAD_REQUEST, message: "Email and password or refresh token are required" });
    });
    /*it("rejects invalid credentials", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.body = { email: "wrong@example.com", password: "wrong" };}, true, { code: ErrorCode.UNAUTHORIZED, message: "Invalid credentials" });
    });*/ //TODO: @Adrien can you take al look at this?
    it("accepts valid email/password and returns tokens", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.body = { email: mockUsers.user.email, password: "pass" };}, true, undefined,
            { id: mockUsers.user.id, message: "Authentication successful" },
        );
        expect(req.body.authenticatedUserId).toBe(mockUsers.user.id);
    });
    it("accepts valid refreshToken and returns new tokens", async () => {
        const tokens = await authManager.authenticate(mockUsers.user.email, "pass");
        // eslint-disable-next-line prettier/prettier
        await check(() => {req.body = { refreshToken: tokens!.refreshToken };}, true, undefined,
            { id: mockUsers.user.id, message: "Authentication successful" },
        );
        expect(req.body.authenticatedUserId).toBe(mockUsers.user.id);
    });
});

describe("passwordMiddleware", () => {
    let req: jest.Mocked<ExpressRequest>;
    let res: jest.Mocked<ExpressResponse>;
    let next: jest.Mocked<NextFunction>;

    beforeAll(async () => {
        await setupTestEnvironment();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        req = { headers: {}, body: {}, params: {}, query: {} } as any;
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
        next = jest.fn();
    });

    async function check(setup: () => void, cont: boolean, error?: ApiError) {
        setup();
        await passwordMiddlewareFn(req, res, next);
        cont ? expect(next).toHaveBeenCalled() : expect(next).not.toHaveBeenCalled();
        if (error) {
            expect(defaultErrorHandler).toHaveBeenCalledWith(error);
            expect(responseToExpress).toHaveBeenCalledTimes(1);
            expect(responseToExpress).toHaveBeenCalledWith(error, res);
        }
    }

    it("rejects if passwordHash is in req", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { (req as any).passwordHash = "someHash"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if passwordHash is in body", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.body.passwordHash = "someHash"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if passwordHash is in params", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.params.passwordHash = "someHash"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if passwordHash is in query", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.query.passwordHash = "someHash"; }, false, { code: ErrorCode.BAD_REQUEST, message: "Request manipulation detected" });
    });
    it("rejects if no password is provided", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.body = {}; }, false, { code: ErrorCode.BAD_REQUEST, message: "Password is required for registration" });
    });
    it("hashes password and calls next", async () => {
        // eslint-disable-next-line prettier/prettier
        await check(() => { req.body = { password: "newPassword123" }; }, true);
        expect(req.body.passwordHash).toBeDefined();
        expect(bcrypt.compareSync("newPassword123", req.body.passwordHash)).toBe(true);
        expect(req.body.password).toBeUndefined();
    });
});