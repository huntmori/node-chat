
// WebSocket 연결 관리자
import * as WebSocket from "ws";
import {randomUUID} from "node:crypto";
import {injectable} from "tsyringe";

@injectable()
export class ConnectionManager {
    private static connections: Map<string, WebSocket> = new Map();
    private static messages: Set<String> = new Set();

    static add(ws: WebSocket) {
        this.connections.set(randomUUID(), ws);
    }

    static remove(ws: WebSocket) {
        let key: string|null = null;
        const entries = this.connections.entries();
        for (let [k, v] of entries) {
            if (v === ws) {
                key = k;
                break;
            }
        }

        if (key)
            this.connections.delete(key);
    }

    static getConnections(): Array<any>
    {
        let result: Array<any> = [];
        for(let [key, conn] of this.connections) {
            result.push(
                {
                    key: key,
                    test: conn.readyState,
                    test2: conn.url,
                    test3: conn.extensions,
                    connection: conn
                }
            );
        }

        return result;
    }

    static getCount(): number {
        return this.connections.size;
    }

    static addMessages(message: string): void
    {
        this.messages.add(message);
    }

    static getMessageCount(): number {
        return this.messages.size;
    }

    static broadcast(message: string) {
        this.messages.add(message);
        this.connections.forEach((client) => {
            if ((client as any).readyState === WebSocket.OPEN) {
                (client as any).send(message);
            }
        });
    }
}
