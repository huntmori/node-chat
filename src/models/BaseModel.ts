
export class BaseModel {
    static TABLE: string;
    toJSON() {
        return Object.getOwnPropertyNames(this).reduce((obj, key) => {
            obj[key] = (this as any)[key];
            console.log(key + ' : ' + (this as any)[key])
            return obj;
        }, {} as Record<string, any>);
    }
}