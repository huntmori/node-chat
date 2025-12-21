import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import {ConnectionManager} from "./WebSocket/ConnectionManager";
import {container} from "tsyringe";
import winston from "winston";
import {getLogger} from "./config/logger";
import containerSetting from './bootstrap/container';
import routerSetting from './bootstrap/route';
import webSocketSettings from './bootstrap/websocket'
import httpSetting from './bootstrap/http'

dotenv.config();

containerSetting();

// Winston 로거 설정
export const logger: winston.Logger = getLogger();

const app = express();

const server = http.createServer(app);

// View engine setup
httpSetting(app)

//route
routerSetting(app);

// WebSocket 연결 관리자
const connections: ConnectionManager = container.resolve(ConnectionManager);
const wsServer = webSocketSettings(server, connections);

// 서버를 특정 포트에서 실행
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    logger.info(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});