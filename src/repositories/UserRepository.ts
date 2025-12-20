import {BaseRepository} from "./BaseRepository";
import {singleton} from "tsyringe";
import {User, UserColumns} from "../models/User";
import {encryptPassword} from "../services/jwt";
import mysql from "mysql2/promise";

@singleton()
export class UserRepository extends BaseRepository
{
    constructor() {
        super("users");
        this.logger.info('user repository created');
    }

    async getOne(col: UserColumns, val: string)
    {
        this.logger.info('get user');
        const sql = `SELECT  * FROM    users WHERE ${col} = ?`;

        const [rows] = await this.connection.query(sql, [val]) as any[];
        this.logger.info(rows);
        if (!rows || rows.length === 0) {
            return null;
        }

        const user = new User();
        Object.assign(user, rows[0]);
        return user;
    }

    async createOne(param: User): Promise<User|null> {
        let [result] = await this.connection.query(
            'insert into users (username, password, email, uid) values (?, ?, ?, UUID())',
            [
                param.username,
                await encryptPassword(param.password),
                param.email
            ]
        )
        console.log(result);
        result = result as mysql.ResultSetHeader
        if(result.affectedRows === 0) {
            return null;
        }

        const id = result.insertId;

        return this.getOne(UserColumns.id, id.toString());
    }
}