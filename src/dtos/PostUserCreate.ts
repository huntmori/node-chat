import {IsEmail, IsNotEmpty} from "class-validator";
import {
    BaseRequest
} from './BaseRequest'
import {Expose} from "class-transformer";

export class PostUserCreate extends BaseRequest
{
    @IsNotEmpty({message: 'id는 필수값입니다.'})
    @Expose()
    id: string = '';

    @IsNotEmpty({
        message: 'password는 필수값입니다.'
    })
    @Expose()
    password: string = '';

    @IsNotEmpty({message: 'email은 필수값입니다.'})
    @IsEmail()
    @Expose()
    email: string = '';
}