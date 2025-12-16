import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { testConnection } from './config/database';
import indexRouter from './routes/index';
import * as WebSocket from 'ws';
import http from 'http';
import {randomUUID} from "node:crypto";


dotenv.config();

// WebSocket 연결 관리자
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

const app = express();

const server = http.createServer(app);


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', indexRouter);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const wss = new WebSocket.Server({server})

const conns: Array<WebSocket> = [];

wss.on('connection', (ws: WebSocket) => {
    console.log('클라이언트가 연결되었습니다.');
    conns.push(ws);
    ConnectionManager.add(ws);
    // 클라이언트로부터 메시지 수신 시 이벤트 핸들러
    ws.on('message', (message: string) => {
        console.log(`수신 메시지: ${message}`);
        ConnectionManager.addMessages(message);

        // 연결된 모든 클라이언트에게 메시지 브로드캐스트
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`서버로부터: ${message}`);
            }
        });
    });

    // 연결 종료 시 이벤트 핸들러
    ws.on('close', () => {
        console.log('클라이언트 연결이 종료되었습니다.');
    });

    // 오류 발생 시 이벤트 핸들러
    ws.on('error', (error) => {
        console.error('WebSocket 오류 발생:', error);
    });
});

// 서버를 특정 포트에서 실행
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;