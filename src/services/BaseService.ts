import winston from "winston";
import {getLogger} from "../config/logger";

export class BaseService
{
    protected logger: winston.Logger;

    constructor() {
        this.logger = getLogger();
    }
}