/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationManager } from "../../../src/application/auth";
import { UserType } from "../../../src/core/entities/user";
import { IUserRepository } from "../../../src/core/repositories/userRepositoryInterface";
import { GetUser } from "../../../src/core/services/user";

type mockUser = { id: string; email: string; passwordHash: string };

async function generatePasswordHash(password: string, saltRounds: number = 10): Promise<string> {
    return await bcrypt.hash(password, saltRounds);
}

function mockRepoConstructor(userData: mockUser) {
    const responseFn = () => ({ ...userData, toObject: () => ({ ...userData }) });
    const queryFn = (m: any, u: () => any, f: () => any) => (q: any) => (q === m ? u() : f());
    return {
        // eslint-disable-next-line prettier/prettier
        getById: jest.fn(queryFn(userData.id, () => Promise.resolve(responseFn()), () => Promise.reject(new Error("User not found")))),
        // eslint-disable-next-line prettier/prettier
        getByEmail: jest.fn(queryFn(userData.email, () => Promise.resolve(responseFn()), () => Promise.reject(new Error("User not found")))),
    };
}

jest.mock("../../../src/infrastructure/repositories/userRepositoryTypeORM", () => ({
    UserRepositoryTypeORM: jest.fn(
        (userData: mockUser) => mockRepoConstructor(userData) as unknown as jest.Mocked<IUserRepository>,
    ),
}));


const { UserRepositoryTypeORM } = jest.requireMock("../../../src/infrastructure/repositories/userRepositoryTypeORM");

const mockUsers = {
    user: { id: "u123", email: "u@example.com", passwordHash: "", userType: UserType.STUDENT },
};

let authManager: AuthenticationManager;

async function setup() {
    mockUsers.user.passwordHash = await generatePasswordHash("pass");
    authManager = new AuthenticationManager(
        new GetUser(UserRepositoryTypeORM(mockUsers.user)),
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
        const tokens = await authManager.authenticate("u@example.com", "pass", UserType.STUDENT);
        expect(tokens).not.toBeNull();
        expect(tokens!.accessToken).toBeDefined();
        expect(tokens!.refreshToken).toBeDefined();
        const payload = authManager.verifyToken(tokens!.accessToken);
        expect(payload!.id).toBe("u123");
    });
    it("fails bad creds", async () => {
        const tokens = await authManager.authenticate("u@example.com", "wrong", UserType.STUDENT);
        expect(tokens).toBeNull();
    });
    it("verifies good token", async () => {
        const token = jwt.sign({ id: "u123" }, "secret", { expiresIn: "1h" });
        const payload = authManager.verifyToken(token);
        expect(payload).not.toBeNull();
        expect({ id: payload!.id }).toEqual({ id: "u123" });
    });
    it("rejects bad token", async () => {
        const payload = authManager.verifyToken("garbage");
        expect(payload).toBeNull();
    });
    /*it("refreshes token", async () => {
        const oldTokens = await authManager.authenticate("u@example.com", "pass", UserType.STUDENT);
        await new Promise(resolve => setTimeout(resolve, 1100));
        const newTokens = authManager.refreshAccessToken(oldTokens!.refreshToken);
        expect(newTokens).not.toBeNull();
        expect(newTokens!.accessToken).not.toBe(oldTokens!.accessToken);
        const payload = authManager.verifyToken(newTokens!.accessToken);
        expect(payload!.id).toBe("u123");
    });*/
    it("blocks used refresh token", async () => {
        const tokens = await authManager.authenticate("u@example.com", "pass", UserType.STUDENT);
        authManager.refreshAccessToken(tokens!.refreshToken);
        const retry = authManager.refreshAccessToken(tokens!.refreshToken);
        expect(retry).toBeNull();
    });
    it("cleans up used tokens after expiry", async () => {
        const authShort = new AuthenticationManager(
            { execute: async (input: any) => mockUsers.user } as any,
            "secret",
            "1h",
            "refresh",
            "1s",
        );
        const tokens = await authShort.authenticate("u@example.com", "pass", UserType.STUDENT);
        authShort.refreshAccessToken(tokens!.refreshToken);
        await new Promise(resolve => setTimeout(resolve, 1100));
        expect((authShort as any).usedRefreshTokens.size).toBe(0);
    });
});
