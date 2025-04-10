/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationManager } from "../../../src/application/auth";
import { UserType } from "../../../src/core/entities/user";
import { IStudentRepository } from "../../../src/core/repositories/studentRepositoryInterface";
import { ITeacherRepository } from "../../../src/core/repositories/teacherRepositoryInterface";
import { GetUser } from "../../../src/core/services/user";

type mockUser = { id: string; email: string; passwordHash: string; userType: UserType };

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

jest.mock("../../../src/infrastructure/repositories/studentRepositoryTypeORM", () => ({
    StudentRepositoryTypeORM: jest.fn(
        (userData: mockUser) => mockRepoConstructor(userData) as unknown as jest.Mocked<IStudentRepository>,
    ),
}));
jest.mock("../../../src/infrastructure/repositories/teacherRepositoryTypeORM", () => ({
    TeacherRepositoryTypeORM: jest.fn(
        (userData: mockUser) => mockRepoConstructor(userData) as unknown as jest.Mocked<ITeacherRepository>,
    ),
}));

const { StudentRepositoryTypeORM } = jest.requireMock("../../../src/infrastructure/repositories/studentRepositoryTypeORM");
const { TeacherRepositoryTypeORM } = jest.requireMock("../../../src/infrastructure/repositories/teacherRepositoryTypeORM");

const mockUsers = {
    student: { id: "s123", email: "s@example.com", passwordHash: "", userType: UserType.STUDENT },
    teacher: { id: "t123", email: "t@example.com", passwordHash: "", userType: UserType.TEACHER },
};

let authManager: AuthenticationManager;

async function setup() {
    mockUsers.student.passwordHash = await generatePasswordHash("pass");
    mockUsers.teacher.passwordHash = await generatePasswordHash("pass");
    authManager = new AuthenticationManager(
        new GetUser(StudentRepositoryTypeORM(mockUsers.student), TeacherRepositoryTypeORM(mockUsers.teacher)),
        "secret",
        "1h",
        "refresh",
        "7d",
    );
}

describe("AuthenticationManager", () => {
    beforeAll(setup);

    beforeEach(() => {
        (authManager as any).usedRefreshTokens.clear();
    });

    it("authenticates with email/pass", async () => {
        const tokens = await authManager.authenticate("s@example.com", "pass");
        expect(tokens).not.toBeNull();
        expect(tokens!.accessToken).toBeDefined();
        expect(tokens!.refreshToken).toBeDefined();
        const payload = authManager.verifyToken(tokens!.accessToken);
        expect(payload!.id).toBe("s123");
        expect(payload!.userType).toBe(UserType.STUDENT);
    });
    it("fails bad creds", async () => {
        const tokens = await authManager.authenticate("s@example.com", "wrong");
        expect(tokens).toBeNull();
    });
    it("verifies good token", async () => {
        const token = jwt.sign({ id: "s123", userType: UserType.STUDENT }, "secret", { expiresIn: "1h" });
        const payload = authManager.verifyToken(token);
        expect(payload).not.toBeNull();
        expect({ id: payload!.id, userType: payload!.userType }).toEqual({ id: "s123", userType: UserType.STUDENT });
    });
    it("rejects bad token", async () => {
        const payload = authManager.verifyToken("garbage");
        expect(payload).toBeNull();
    });
    it("refreshes token", async () => {
        const oldTokens = await authManager.authenticate("t@example.com", "pass");
        await new Promise(resolve => setTimeout(resolve, 1100));
        const newTokens = authManager.refreshAccessToken(oldTokens!.refreshToken);
        expect(newTokens).not.toBeNull();
        expect(newTokens!.accessToken).not.toBe(oldTokens!.accessToken);
        const payload = authManager.verifyToken(newTokens!.accessToken);
        expect(payload!.id).toBe("t123");
    });
    it("blocks used refresh token", async () => {
        const tokens = await authManager.authenticate("t@example.com", "pass");
        authManager.refreshAccessToken(tokens!.refreshToken);
        const retry = authManager.refreshAccessToken(tokens!.refreshToken);
        expect(retry).toBeNull();
    });
    it("cleans up used tokens after expiry", async () => {
        const authShort = new AuthenticationManager(
            { execute: async (input: any) => mockUsers.student } as any,
            "secret",
            "1h",
            "refresh",
            "1s",
        );
        const tokens = await authShort.authenticate("s@example.com", "pass");
        authShort.refreshAccessToken(tokens!.refreshToken);
        await new Promise(resolve => setTimeout(resolve, 1100));
        expect((authShort as any).usedRefreshTokens.size).toBe(0);
    });
});
