/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
    payload: JwtPayload,
    secret: Secret,
    expiresIn: SignOptions["expiresIn"]
) => {
    return jwt.sign(payload, secret, {
        expiresIn,
    });
};

const verifyToken = (token: string, secret?: string) => {
    try {
        // Jodi secret pass na hoy ba undefined thake, env theke nibe othoba fallback 'access-secret'
        const jwtSecret =
            secret ||
            process.env.JWT_ACCESS_SECRET ||
            "access-secret";

        const verifiedToken = jwt.verify(token, jwtSecret);

        return {
            success: true,
            data: verifiedToken,
        };
    } catch (error: any) {
        console.log("token verification failed:", error?.message || error);

        return {
            success: false,
            error: error?.message || "Token verification failed",
        };
    }
};

export const jwtUtils = {
    createToken,
    verifyToken,
};