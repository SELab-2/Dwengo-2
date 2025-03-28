import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationTokenPayload } from "./types";
import { User, UserType } from "../core/entities/user";
import { GetUser, GetUserInput } from "../core/services/user";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

export class AuthenticationManager {
    private getUserService: GetUser;
    private secretKey: string;
    private expiresIn: string;

    constructor(getUserService: GetUser, secretKey: string, expiresIn: string = "1h") {
        this.getUserService = getUserService;
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
    }

    async authenticate(email: string, password: string): Promise<string | null> {
        const userTypes = Object.values(UserType);
        for (const userType of userTypes) {
            const input: GetUserInput = { email: email, userType: userType as UserType };
            try {
                const user = (await this.getUserService.execute(input)) as User;

                if (user && (await bcrypt.compare(password, user.passwordHash))) {
                    return jwt.sign({ id: user.id }, this.secretKey, { expiresIn: this.expiresIn } as jwt.SignOptions);
                }
            } catch (error) {
                continue;
            }
        }

        return null;
    }

    verifyToken(token: string): AuthenticationTokenPayload | null {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            if (typeof decoded === "string") {
                try {
                    return JSON.parse(decoded) as AuthenticationTokenPayload;
                } catch {
                    return null;
                }
            }
            return decoded as AuthenticationTokenPayload;
        } catch (error) {
            return null;
        }
    }
}

let authManagerInstance: AuthenticationManager | null = null;

export function getAuthManager(getUserService: GetUser): AuthenticationManager {
    if (!authManagerInstance) {
        authManagerInstance = new AuthenticationManager(getUserService, JWT_SECRET, JWT_EXPIRES_IN);
    }
    return authManagerInstance;
}
