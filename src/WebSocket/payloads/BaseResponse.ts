
export interface BaseResponse<T> {
    type: string
    result: boolean,
    error: boolean,
    payload: T,
    message: string
}