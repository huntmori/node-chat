import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import argon2 from "argon2";

const ACCESS_TOKEN_SECRET = 'access-secret';
const REFRESH_TOKEN_SECRET = 'refresh-secret';

// Refresh Token 저장소 (실제로는 Redis나 DB 사용)
const refreshTokens: Set<string> = new Set();

export interface TokenPayload {
    userId: string;
    email: string;
}

interface AuthUser {
    userId: string;
    email: string;
    role: string;
}

export async function encryptPassword(password: string)
{
    return await argon2.hash(password);
}

export async function verifyPassword(password: string, hashed: string)
{
    return argon2.verify(password, hashed);
}


// Access Token 생성 (짧은 만료 시간)
export async function generateAccessToken(payload: TokenPayload) {
    return (
        CryptoJS.AES.encrypt(
            jwt.sign(
                payload,
                ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            ),
        ACCESS_TOKEN_SECRET)
    ).toString();
}

// Refresh Token 생성 (긴 만료 시간)
export function generateRefreshToken(payload: TokenPayload): string {
    const refreshToken =
        CryptoJS.AES.encrypt(
            jwt.sign(
                payload,
                REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            ),
            REFRESH_TOKEN_SECRET
        ).toString();
    refreshTokens.add(refreshToken);
    return refreshToken;
}

// Token 갱신
export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
    if (!refreshTokens.has(refreshToken)) {
        return null;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(refreshToken, REFRESH_TOKEN_SECRET).toString();
        const decoded = jwt.verify(decrypted, REFRESH_TOKEN_SECRET) as TokenPayload;
        return await generateAccessToken({
            userId: decoded.userId,
            email: decoded.email
        }).then(token => token);
    } catch (error) {
        return null;
    }
}

// Refresh Token 무효화 (로그아웃)
export function revokeRefreshToken(refreshToken: string): void {
    refreshTokens.delete(refreshToken);
}

export function getUser(token: string): Promise<TokenPayload | null> {
    return new Promise((resolve) => {
        let realToken = token;
        if (token.indexOf(" ") > 0) {
            realToken = token.split(" ")[1];
        }

        try {
            realToken = CryptoJS.AES.decrypt(realToken, ACCESS_TOKEN_SECRET).toString(CryptoJS.enc.Utf8);

            if (!realToken) {
                return resolve(null);
            }

            jwt.verify(realToken, ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    console.error(err);
                    return resolve(null);
                }
                console.log('decoded', decoded);
                resolve(decoded as TokenPayload);
            });
        } catch (err) {
            console.error(err);
            resolve(null);
        }
    });
}