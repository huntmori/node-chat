import jwt from 'jsonwebtoken';
import CryptoJS from "crypto-js";
import argon2 from "argon2";
import {UserRepository} from "../repositories/UserRepository";
import {UserColumns} from "../models/User";
import {ApiException} from "../exceptions/ApiException";
import {Request} from "express";

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

const userRepository: UserRepository = new UserRepository();

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

export function parseToken(token: string): Promise<TokenPayload | null> {
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

export async function getUserByAccessToken(accessToken: string)
{
    const userInfo = await parseToken(accessToken);

    if (userInfo === null) {
        throw new ApiException(
            'token is not available',
            400,
            'auth.fail'
        )
    }

    const userId = userInfo?.userId ?? '';

    const user = await userRepository.getOne(UserColumns.username, userId);

    if(user === null) {
        throw new ApiException(
            'user not found',
            400,
            'auth.fail'
        )
    }

    return user;
}

export async function getUserByRequest(req: Request)
{
    let token = req.headers.authorization ?? '';

    return getUserByAccessToken(token);
}