import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthenticationTokenPayload, TokenResponse } from "./types";
import { User } from "../core/entities/user";
import { GetUser, GetUserInput } from "../core/services/user";

// TODO - Consider allowing only one active token per user (probably not)

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret_for_development_only";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

export class AuthenticationManager {
    private getUserService: GetUser;
    private secretKey: string;
    private expiresIn: string;
    private refreshSecretKey: string;
    private refreshExpiresIn: string;
    private usedRefreshTokens: Set<string> = new Set();

    constructor(
        getUserService: GetUser,
        secretKey: string = JWT_SECRET,
        expiresIn: string = JWT_EXPIRES_IN,
        refreshSecretKey: string = REFRESH_TOKEN_SECRET,
        refreshExpiresIn: string = REFRESH_TOKEN_EXPIRES_IN,
    ) {
        this.getUserService = getUserService;
        this.secretKey = secretKey;
        this.expiresIn = expiresIn;
        this.refreshSecretKey = refreshSecretKey;
        this.refreshExpiresIn = refreshExpiresIn;
    }

    async authenticate(email: string, password: string, refreshToken?: string): Promise<TokenResponse | null> {
        if (refreshToken) {
            const refreshResult = this.refreshAccessToken(refreshToken);
            if (refreshResult) {
                return refreshResult;
            }
        }

        const input: GetUserInput = { email: email };
        const user = (await this.getUserService.execute(input)) as User;
        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            return this.generateTokens(user.id!);
        }

        return null;
    }

    private generateTokens(userId: string): TokenResponse {
        const accessToken = jwt.sign({ id: userId }, this.secretKey, {
            expiresIn: this.expiresIn,
        } as jwt.SignOptions);
        const refreshToken = jwt.sign(
            { id: userId, jti: Math.random().toString(36).substring(2) },
            this.refreshSecretKey,
            { expiresIn: this.refreshExpiresIn } as jwt.SignOptions,
        );
        return { accessToken, refreshToken };
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

    refreshAccessToken(refreshToken: string): TokenResponse | null {
        if (this.usedRefreshTokens.has(refreshToken)) {
            return null;
        }

        try {
            const decoded = jwt.verify(refreshToken, this.refreshSecretKey) as jwt.JwtPayload;
            if (
                !decoded?.id ||
                typeof decoded.id !== "string"
            ) {
                return null;
            }
            this.usedRefreshTokens.add(refreshToken);

            // Set up a cleanup to eventually remove the token from the invalidation list
            const payload = jwt.decode(refreshToken) as jwt.JwtPayload;
            if (payload && payload.exp) {
                const timeUntilExpiry = payload.exp * 1000 - Date.now();
                setTimeout(
                    () => {
                        this.usedRefreshTokens.delete(refreshToken);
                    },
                    timeUntilExpiry > 0 ? timeUntilExpiry : 0,
                );
            }

            return this.generateTokens(decoded.id);
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
