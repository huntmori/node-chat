import express,
    {
        Response,
        Request,
        Router
} from "express";
import mysql from "mysql2/promise";
import pool from "../../config/database";
import {BaseRequest, error, Payload, ok } from "../../services/BaseDto";
import {PostUserCreate} from "../../dtos/PostUserCreate";
import {getLogger} from "../../config/logger";
import { BaseRequest as BRequest } from '../../dtos/BaseRequest'
import {encryptPassword} from "../../services/jwt";

const router:Router = express.Router()
const connection:mysql.Pool = pool;
const logger = getLogger();

router.post(
    '/api/user',
    async (req: Request, res: Response) => {
        logger.info(req.body);
        const body = req.body as BaseRequest;
        const data = body.payload as Payload;
        let dto = BRequest.plainToInstance(PostUserCreate, data);

        const errors = await dto.validate();

        if(errors.length > 0) {
            res.json(error('user.create', errors.map(e => e.toString())));
            return;
        }

        let sql = `
                SELECT  1
                FROM    users
                WHERE   %s = ?
            `

        let [idRows] = await connection.query(sql.replace('%s', 'username'), [dto.id ]);
        let [emailRows] = await connection.query(sql.replace('%s', 'email'), [dto.email]);
        console.log(idRows);
        console.log(emailRows);

        if(Array.isArray(idRows) && idRows.length > 0) {
            res.json(error('user.create', 'id already exists'))
            return;
        }
        if(Array.isArray(emailRows) && emailRows.length > 0) {
            res.json(error('user.create', 'email already exists'))
            return;
        }

        let [result] = await connection.query(
            'insert into users (username, password, email, uid) values (?, ?, ?, UUID())',
            [
                dto.id,
                await encryptPassword(dto.password),
                dto.email
            ]
        )
        console.log(result);
        result = result as mysql.ResultSetHeader
        if(result.affectedRows === 0) {
            res.json(error('user.create', 'failed to create user'))
            return;
        }

        res.json(ok('user.create', {
            id: dto.id,
            email: dto.email
        }))
        return;
    }
);

export default router;