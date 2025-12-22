import {BaseModel} from "./BaseModel";

export enum ProfileColumns
{
    idx = 'idx',
    uid = 'uid',
    user_uid = 'user_uid',
    nickname = 'nickname',
    created_at = 'created_at',
    updated_at = 'updated_at',
    is_active = 'is_active',
    is_deleted = 'is_deleted',
    deleted_at = 'deleted_at',
}

export class Profile extends BaseModel
{
    static TABLE = 'user_profile';

    idx!: number;
    uid?: string;
    user_uid!: string;
    nickname!: string;
    created_at?: Date;
    updated_at?: Date;
    is_active?: boolean;
    is_deleted?: boolean;
    deleted_at?: Date;
}