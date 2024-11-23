import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import express from "express";
import http from "http";

const app = express();
app.use(express.json());

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});

server.listen(8080, () => {
    console.log("Server Started");
})