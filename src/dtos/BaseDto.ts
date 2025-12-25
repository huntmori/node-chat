import {Response} from "express";

export interface BaseResponse {
    result: boolean,
    error: boolean,
    payload: Payload,
    type: string
    message: string[]
}

export interface BaseRequest {
    type: string
    payload: Payload,
    access_token: string,
    refresh_token: string
}

export interface Payload {}

export function ok(type: string, data: Payload): BaseResponse
{
    return {
        result: true,
        type: type,
        error: false,
        payload: data,
        message: []
    }
}

export function error(type: string, message:string[]|string): BaseResponse
{
    if(typeof message === 'string') {
        message = [message];
    }

    return {
        result: false,
        type: type,
        error: true,
        payload: {},
        message: message
    }
}

export function okResponse(res:Response, type:string, data:Payload| Payload[])
{
    return res.json(ok(type, data));
}

export function errorResponse(res:Response, type:string, message:string[]|string)
{
    return res.json(error(type, message));
}

