import { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { Request } from 'express';
import express from "express";
import http from "http";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { router as authRoutes } from './routes/userRoutes';
import { User } from './models/User';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use('/api/auth', authRoutes);

const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const gameManager = new GameManager();

interface jwtPayload {
    userId: string;
}

function parseJwtFromCookies(cookieHeader: string | undefined): string | null {
    if (!cookieHeader) {
        return null;
    }
    const token = cookieHeader
        .split('; ')
        .find((row) => row.startsWith('jwt='))
        ?.split('=')[1];
    return token || null;
}

wss.on('connection', async function connection(ws, req) {
    try {
        const token = parseJwtFromCookies(req.headers.cookie);

        if (!token) {
            ws.close(1008, 'Unauthorized - No Token Provided');
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwtPayload;

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            ws.close(1008, 'User Not Found');
            return;
        }

        gameManager.addUser(ws, user._id.toString());

        ws.on('close', () => {
            console.log('User disconnected');
            gameManager.removeUser(ws);
        });

    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            ws.close(4000, 'Unauthorized - Token Expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            ws.close(4001, 'Unauthorized - Invalid Token');
        } else {
            console.error('WebSocket connection error:', error);
            ws.close(1011, 'Internal Server Error');
        }
    }
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
