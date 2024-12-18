import { useContext, useEffect, useState } from "react";
import ChessBoard from "../components/ChessBoard";
import { Chess } from "chess.js";
import toast from "react-hot-toast";
import { GameContext } from "../context/GameContext";
import { useSocketContext } from "../context/SocketContext";

export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {
    const { socket } = useSocketContext();
    const { game, setGame } = useContext(GameContext);
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [loading, setLoading] = useState(true);

    const fetchGame = async () => {
        const gameIdString = localStorage.getItem("game_id");
        const storedGameId = gameIdString ? JSON.parse(gameIdString) : null;

        if (!game && storedGameId) {
            try {
                const res = await fetch("http://localhost:8080/api/game", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ gameId: storedGameId }),
                });
                const data = await res.json();
                setGame(data);
                const updatedChess = new Chess(data.fen);
                setChess(updatedChess);
                setBoard(updatedChess.board());
            } catch (error) {
                console.error("Error fetching game:", error);
            }
        }
    }

    useEffect(() => {
        fetchGame().finally(() => setLoading(false));
    }, [])

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Socket Message:", message);

            switch (message.type) {
                case MOVE:
                    const move = message.payload;
                    const updatedChess = new Chess(chess.fen());
                    updatedChess.move(move);
                    setChess(updatedChess);
                    setBoard(updatedChess.board());
                    break;

                case GAME_OVER:
                    localStorage.removeItem("game_id");
                    localStorage.removeItem("player_color");
                    toast.success(`${message.payload.winner} won!!`);
                    break;

                default:
                    break;
            }
        };
    }, [socket, fetchGame, chess]);

    if (loading) {
        return <div>Loading Game...</div>
    }

    if (!socket) {
        return <div>Connecting...</div>;
    }

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard
                            playerColor={JSON.parse(localStorage.getItem("player_color") || "null")}
                            chess={chess}
                            setBoard={setBoard}
                            socket={socket}
                            board={board}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
