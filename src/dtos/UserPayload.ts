import {Payload} from "./BaseDto";

export class UserPayload implements Payload
{
    id!: number;
    uid!: string;
    username!: string;
    created_at!: Date;
    updated_at?: Date;
}