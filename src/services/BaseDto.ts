
export interface BaseResponse {
    result: boolean,
    error: boolean,
    payload: Payload,
    type: string
    message: string
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
        message: ''
    }
}

export function error(type: string, message:string): BaseResponse
{
    return {
        result: false,
        type: type,
        error: true,
        payload: {},
        message: message
    }
}

