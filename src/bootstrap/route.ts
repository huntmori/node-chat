import {Express} from "express";

import indexRouter from '../routes/index';
import authRouter from '../controllers/api/auth';
import userRouter from '../controllers/api/user';
import profileRouter from '../controllers/api/profile';
import * as WebSocket from "ws";
import {WsServer} from "../WebSocket/WsServer";
import {logger} from "../index";

export default function(app: Express)
{

    // Routes
    app.use('/', indexRouter);
    app.use('/', authRouter);
    app.use('/', userRouter);
    app.use('/', profileRouter)

    return app;
}

