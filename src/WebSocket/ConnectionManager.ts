
// WebSocket 연결 관리자
import * as WebSocket from "ws";
import {randomUUID} from "node:crypto";
import {singleton} from "tsyringe";

interface MessageLog {
    sender: string;
    message: string;
    timestamp: string
}

@singleton()
export class ConnectionManager {
    private connections: Map<string, WebSocket> = new Map();
    private messages: Array<MessageLog> = [];

    constructor(){
        console.log(
            "["
            + new Date().toISOString()
                .split('.')[0]
                .replace('T', ' ')
            + "][info]: " + 'connection manager created');

    }

    public add(ws: WebSocket) {
        this.connections.set(randomUUID(), ws);
    }

    public remove(ws: WebSocket) {
        let key: string|null = this.getKeyByWebsocket(ws);

        if (key)
            this.connections.delete(key);
    }

    public getKeyByWebsocket(ws: WebSocket): string|null
    {
        let key: string|null = null;
        const entries = this.connections.entries();
        for (let [k, v] of entries) {
            if (v === ws) {
                key = k;
                break;
            }
        }

        return key;
    }

    public getConnections(): Array<any>
    {
        console.log('get connections : ' + this.connections.size)
        let result: Array<any> = [];
        for(let [key, conn] of this.connections) {
            result.push(
                {
                    key: key,
                    state: conn.readyState,
                    messages: this.messages.filter((o)=> o.sender === key)
                }
            );
        }

        return result;
    }

    public getCount(): number {
        return this.connections.size;
    }

    public addMessages(ws:WebSocket, message: string): void
    {
        this.messages.push({
            sender: this.getKeyByWebsocket(ws) || 'unknown',
            message: message.toString(),
            timestamp: new Date().toISOString()
        });
    }

    public getMessageCount(): number {
        return this.messages.length;
    }

    public broadcast(ws:WebSocket, message: string) {
        this.addMessages(ws, message);
        this.connections.forEach((client) => {
            if ((client as any).readyState === WebSocket.OPEN) {
                (client as any).send(message);
            }
        });
    }
}
