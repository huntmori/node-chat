import {ConnectionManager} from "./ConnectionManager";
import {Server} from "ws";
import * as WebSocket from "ws";
import winston from "winston";

export class WsServer
{
    private readonly connectionManager: ConnectionManager;
    private readonly server: Server
    private readonly logger: winston.Logger

    constructor(
        connectionManager: ConnectionManager,
        server: Server,
        logger: winston.Logger
    ) {
        this.connectionManager = connectionManager;
        this.server = server;
        this.logger = logger;

        this.server.on('connection', (ws: WebSocket) => this.onConnection(ws));
    }

    private onConnection(ws: WebSocket)
    {
        this.logger.info('클라이언트가 연결되었습니다.');
        this.connectionManager.add(ws);

        ws.on('message', (message:string) => this.onMessage(ws, message));
        ws.on('close', () => this.onClose(ws));
        ws.on('error', (error: Error) => this.onError(ws, error));

    }

    private onMessage(ws:WebSocket, message: string)
    {
        let key = this.connectionManager.getKeyByWebsocket(ws);
        this.logger.info(`수신 메시지: ${key}:${message}`);

        this.connectionManager.addMessages(ws, message);

        // 연결된 모든 클라이언트에게 메시지 브로드캐스트
        this.server.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`서버로부터: ${message}`);
            }
        });
    }

    private onClose(ws: WebSocket)
    {
        this.logger.info('클라이언트 연결이 종료되었습니다.');
        this.connectionManager.remove(ws);
    }


    private onError(ws:WebSocket, error: Error)
    {
        this.logger.error('WebSocket 오류 발생:', error);
    }
}