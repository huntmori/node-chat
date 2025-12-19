import express,
    {
        Response,
        Request,
        Router
} from "express";
import mysql from "mysql2/promise";
import pool from "../../config/database";
import {
    logger
} from '../../index';
import {BaseRequest, error} from "../../services/BaseDto";
import {plainToClass} from "class-transformer";
import {PostUserCreate} from "../../dtos/PostUserCreate";

const router:Router = express.Router()
const connection:mysql.Pool = pool;

interface UserCreate {
    username: string,
    password: string,
    email: string
}

router.post(
    '/api/user',
    async (req: Request, res: Response) => {
        const body = req.body as BaseRequest;
        const data = body.payload as UserCreate;

        const dto = plainToClass(PostUserCreate, data);
        const errors = await dto.validate();

        if(errors.length > 0) {
            res.json(error('user.create', errors.toString()))
        }

        const [row] = await connection.query(
            `
                SELECT  1
                FROM    users
                WHERE   username = ?
            `, [ data.username ]);

        if(Array.isArray(row) && row.length > 0) {
            res.json(error('user.create', 'username already exists'))
            return;
        }


    }
);