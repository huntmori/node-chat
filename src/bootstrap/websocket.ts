import {Server} from "http";
import {getLogger} from "../config/logger";
import {WsServer} from "../WebSocket/WsServer";
import * as WebSocket from 'ws';
import {ConnectionManager} from "../WebSocket/ConnectionManager";

export default function(server: Server, connections: ConnectionManager)
{

    const wss = new WebSocket.Server({server})

    return new WsServer(
        connections,
        wss,
        getLogger()
    );
}