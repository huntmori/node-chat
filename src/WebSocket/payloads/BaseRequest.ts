
export interface BaseRequest<T> {
    type: string
    payload: T,
    message: string
}