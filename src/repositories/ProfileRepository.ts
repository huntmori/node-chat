import {singleton} from "tsyringe";
import {BaseRepository} from "./BaseRepository";
import {User} from "../models/User";
import {Profile, ProfileColumns} from "../models/Profile";
import mysql from "mysql2/promise";
import {ApiException} from "../exceptions/ApiException";

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

    async update(profile: Profile) {
        let sql = `
            UPDATE  ${Profile.TABLE}
            SET     ${ProfileColumns.nickname} = ?,
                    ${ProfileColumns.updated_at} = NOW(),
                    ${ProfileColumns.is_active} = ?,
                    ${ProfileColumns.is_deleted} = ?,
                    ${ProfileColumns.deleted_at} = ?
            WHERE   ${ProfileColumns.uid} = ?
        `;

        const [result] = await this.connection.query(sql, [
            profile.nickname,
            profile.updated_at,
            profile.is_active,
            profile.is_deleted,
            profile.deleted_at,
            profile.uid
        ]) as any[];

        if (result === null || result.affectedRows === 0) {

        }

        return await this.getOne(ProfileColumns.uid, profile.uid ?? '');
    }

    async getList(param: { column: ProfileColumns; value: string }[]) {
        let baseSql = `
            SELECT  *
            FROM    ${Profile.TABLE}
            WHERE   1=1
        `;
        let values:string[] = [];

        param.forEach(p => {
            baseSql += ` AND ${p.column} = ? `
            values.push(p.value);
        });

        const [rows] = await this.connection.query(baseSql, values) as any[];

        const result = rows.map((row: any) => {
            const profile = new Profile();
            Object.assign(profile, row);
            return profile;
        })
        this.logger.info(result);
        return result;
    }
}