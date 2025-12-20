import {BaseModel} from "./BaseModel";

export enum UserColumns
{
    id = 'id',
    uid = 'uid',
    username = 'username',
    password = 'password',
    email = 'email',
    created_at = 'created_at',
    updated_at = 'updated_at',
    
}

export class User extends BaseModel
{
    static TABLE = 'users';

    id!: number;
    uid!: string;
    username!: string;
    password!: string;
    email!: string;
    created_at!: Date;
    updated_at!: Date;
}