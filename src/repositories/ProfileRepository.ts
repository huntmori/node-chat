import {singleton} from "tsyringe";
import {BaseRepository} from "./BaseRepository";
import {User} from "../models/User";
import {Profile, ProfileColumns} from "../models/Profile";
import mysql from "mysql2/promise";

@singleton()
export class ProfileRepository extends BaseRepository
{
    constructor() {
        super("user_profiles");
        this.logger.info('ProfileRepository created');
    }

    public async createOne(user: User, nickName: string)
    {
        const sql = `
            INSERT INTO ${Profile.TABLE}
            (
                ${ProfileColumns.uid},
                ${ProfileColumns.user_uid},
                ${ProfileColumns.nickname},
                ${ProfileColumns.created_at},
                ${ProfileColumns.updated_at},
                ${ProfileColumns.is_active},
                ${ProfileColumns.is_deleted}
            )
            VALUES (
                UUID(),
                ?,  
                ?,
                NOW(),
                NOW(),
                true,
                false
           )`;

        let [result] = await this.connection.query(
            sql,
            [
                user.uid,
                nickName
            ]
        );

        console.log(result);
        result = result as mysql.ResultSetHeader
        if(result.affectedRows === 0) {
            return null;
        }

        const idx = result.insertId;

        return this.getOne(ProfileColumns.idx, idx.toString());
    }

    public async getOne(col: ProfileColumns, val: string)
    {
        const sql = `
            SELECT  *
            FROM    ${Profile.TABLE}
            WHERE   ${col} = ?
        `;

        const [rows] = await this.connection.query(sql, [val]) as any[];

        if (!rows || rows.length === 0) {
            return null;
        }

        const profile = new Profile();
        Object.assign(profile, rows[0]);
        return profile;
    }
}