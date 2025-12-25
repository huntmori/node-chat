import {Payload} from "./BaseDto";

export class ProfileDto implements Payload
{
    uid: string = '';
    user_uid: string = '';
    nickname: string = '';
    created_at: Date = new Date();
    updated_at: Date = new Date();
}