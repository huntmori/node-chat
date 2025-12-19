import {validate, ValidationError} from "class-validator";

export class BaseRequest
{
    async validate(): Promise<ValidationError[]>
    {
        return await validate(this);
    }
}