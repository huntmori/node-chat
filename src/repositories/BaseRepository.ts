import mysql from "mysql2/promise";
import pool from '../config/database';
import {getLogger} from "../config/logger";
import winston from "winston";


export class BaseRepository
{
    protected tableName: string;
    protected connection: mysql.Pool
    protected logger: winston.Logger;

    constructor(tableName: string) {
        this.tableName = tableName;
        this.connection = pool;
        this.logger = getLogger();
    }
}