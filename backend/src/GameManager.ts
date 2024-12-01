import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";

export class GameManager {

    private games: Game[];
    private pendingUser: { socket: WebSocket; userId: string } | null;
    private users: Map<WebSocket, string>;

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = new Map();
    }

    addUser(socket: WebSocket, userId: string) {
        this.users.set(socket, userId);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users.delete(socket);
        if (this.pendingUser?.socket === socket) {
            this.pendingUser = null;
        }
    }

    private async addHandler(socket: WebSocket) {
        socket.on("message", async (data) => {
            const message = JSON.parse(data.toString());

            if (message.type == INIT_GAME) {
                const userId = this.users.get(socket);
                if (!userId) {
                    return;
                }
                if (this.pendingUser) {
                    const { socket: pendingSocket, userId: pendingUserId } = this.pendingUser;
                    const game = new Game(pendingSocket, socket, pendingUserId, userId);
                    try {
                        const savedGame = await game.saveToDatabase();
                        game.setGameId(savedGame._id.toString());
                        game.sendInitMessage(savedGame._id.toString());
                        this.games.push(game);
                    }
                    catch (error) {
                        console.error("Error saving game to database: ", error);
                    }
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = { socket, userId };
                }
            }
            if (message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, message.payload.move);
                }
            }
        })

        socket.on("close", () => {
            this.removeUser(socket);
            console.log("Socket disconnected and user removed");
        })
    }
}