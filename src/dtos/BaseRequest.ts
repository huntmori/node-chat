import {validate, ValidationError} from "class-validator";
import {Payload} from "../services/BaseDto";
import {ClassConstructor, ClassTransformOptions} from "class-transformer/types/interfaces";
import {
    plainToInstance
} from "class-transformer";

export class BaseRequest implements Payload
{
    async validate(): Promise<ValidationError[]>
    {
        return await validate(this);
    }

    static plainToInstance<T, V>(cls: ClassConstructor<T>, plain: V): T
    {
        return plainToInstance(cls, plain, {
            excludeExtraneousValues: false,  // false로 변경
            exposeDefaultValues: true,
            exposeUnsetFields: true
        });
    }
}