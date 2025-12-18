import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import indexRouter from './routes/index';
import authRouter from './controllers/api/auth';
import * as WebSocket from 'ws';
import http from 'http';
import {ConnectionManager} from "./WebSocket/ConnectionManager";
import {container} from "tsyringe";
import {WsServer} from "./WebSocket/WsServer";
import winston from "winston";


dotenv.config();

container.registerSingleton('ConnectionManager', ConnectionManager)
// WebSocket 연결 관리자
const connections: ConnectionManager = container.resolve(ConnectionManager);

// Winston 로거 설정
export const logger: winston.Logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}][${level}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}][${level}]: ${message}`;
                })
            )
        }),
        new winston.transports.File({
            filename: 'ws-server.log',
            format: winston.format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}][${level}]: ${message}`;
            })
        })
    ]
});

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
app.use('/', authRouter);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const wss = new WebSocket.Server({server})

const wsServer = new WsServer(
    connections,
    wss,
    logger
);


// 서버를 특정 포트에서 실행
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});