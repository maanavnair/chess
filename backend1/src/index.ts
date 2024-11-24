import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import express from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from "cors"
import cookieParser from "cookie-parser";
import { router as authRoutes } from './routes/userRoutes';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

wss.on('connection', function connection(ws) {
    gameManager.addUser(ws);
    ws.on("disconnect", () => gameManager.removeUser(ws));
});

mongoose.connect(process.env.DB_URI || '')
    .then(() => {
        server.listen(8080, () => {
            console.log("Server Started");
        })
    })
    .catch((err) => {
        console.log(err);
    })
