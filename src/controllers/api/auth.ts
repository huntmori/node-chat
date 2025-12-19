import express, {Request, Response, Router} from "express";
import pool from "../../config/database";
import mysql from 'mysql2/promise';
import argon2 from "argon2";
import * as jwt from '../../services/jwt';
import {TokenPayload, verifyPassword} from "../../services/jwt";
import { logger } from "../../index";
import {
    error,
    Payload,
    ok, BaseRequest
} from "../../services/BaseDto";

const router:Router = express.Router()

const connection:mysql.Pool = pool;

interface AuthRequest {
    username: string;
    password: string;
}

interface AuthResponse extends Payload{
    access_token: string;
    refresh_token: string;
}

interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}



// API endpoint for dynamic data
router.post('/api/auth/login', async (req: Request, res: Response) => {
    const body = (req.body) as BaseRequest;
    const data = body.payload as AuthRequest;

    let [rows] = await connection.query(
        `
                SELECT  *
                FROM    users
                WHERE   username = ?
            `, [data.username]
        );

    let [row] = rows as User[];
    if(!Array.isArray(rows) || rows.length === 0) {
        logger.info('user not selected');
        res.json(error('auth.login', 'please check id or password'))
        return;
    }

    logger.info('selected row: ', row)

    if(!await verifyPassword(row['password'], data.password)) {
        logger.info('password not matched');
        res.json(error('auth.login', 'please check id or password'))
        return;
    }

    const payload: TokenPayload = {
        userId: row.username,
        email: row.email
    }
    const accessToken: string = await jwt.generateAccessToken(payload);
    const refreshToken: string = jwt.generateRefreshToken(payload);

    logger.info('getUser:', await jwt.getUser(accessToken));

    const responseBody: AuthResponse = {
        access_token: accessToken,
        refresh_token: refreshToken
    }

    res.json(ok('auth.login', responseBody));
});

export default router;