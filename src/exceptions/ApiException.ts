
export class ApiException extends Error
{
    public statusCode: number;
    public code: string;
    public message: string;

    constructor(message: string, statusCode: number = 400, code: string = 'USER_ERROR') {
        super(message);
        this.message = message;
        this.name = 'UserException';
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}