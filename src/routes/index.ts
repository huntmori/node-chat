import express, { Request, Response, Router } from 'express';
import "reflect-metadata";
import {ConnectionManager} from "../controllers/ConnectionManager";
import {container} from "tsyringe";

const router: Router = express.Router();

const connections: ConnectionManager = container.resolve(ConnectionManager);

// Welcome page
router.get('/', (req: Request, res: Response) => {
  res.render('index', {
    title: 'Welcome to Node Chat',
    serverTime: new Date().toLocaleString('ko-KR'),
    message: 'Vue.js와 함께하는 실시간 채팅 서버'
  });
});

// API endpoint for dynamic data
router.get('/api/stats', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    users: connections.getCount(),
    messages: connections.getMessageCount(),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connections: connections.getConnections()
  });
});




export default router;
