import { WebSocket } from "ws";
import { Chess } from 'chess.js'
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";
import { gameModel } from "./models/Game";

export class Game {

    public player1: WebSocket;
    public player2: WebSocket;
    public player1Id: string;
    public player2Id: string;
    public board: Chess;
    private startTime: Date;
    private gameId: string | null = null;
    private moveCount = 0;

    constructor(player1: WebSocket, player2: WebSocket, player1Id: string, player2Id: string) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.board = new Chess();
        this.startTime = new Date();

        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white"
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black"
            }
        }));
    }

    async makeMove(socket: WebSocket, move: {
        from: string,
        to: string
    }) {

        if (!this.gameId) {
            return;
        }

        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 1 && socket != this.player2) {
            return;
        }

        try {
            this.board.move(move);
        }
        catch (e) {
            console.log(e);
            return;
        }

        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }))
        }

        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }))
        }
        console.log(this.board.fen());
        this.moveCount++;
        await this.updateGameInDatabase();
    }

    public async saveToDatabase() {
        try {
            const game = await gameModel.create({
                player1Id: this.player1Id,
                player2Id: this.player2Id,
                fen: this.board.fen(),
                moveCount: this.moveCount,
            });
            if (!game) {
                throw new Error("Game could not be saved to database");
            }
            this.gameId = game._id.toString();
            return game;
        }
        catch (error) {
            console.error("Error saving game to database", error);
            throw error;
        }
    }

    public setGameId(gameId: string) {
        this.gameId = gameId;
    }

    public async updateGameInDatabase() {
        await gameModel.findByIdAndUpdate(this.gameId, {
            fen: this.board.fen(),
            moveCount: this.moveCount,
        });
    }
}