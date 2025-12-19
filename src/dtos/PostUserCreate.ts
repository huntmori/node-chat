import {IsEmail, IsNotEmpty} from "class-validator";
import {
    BaseRequest
} from './BaseRequest'

export class PostUserCreate extends BaseRequest
{
    @IsNotEmpty({message: 'id는 필수값입니다.'})
    id: string|undefined;

    @IsNotEmpty({
        message: 'password는 필수값입니다.'
    })
    password: string|undefined;

    @IsNotEmpty({message: 'email은 필수값입니다.'})
    @IsEmail()
    email: string|undefined;
}