import { useEffect, useState } from "react"
import ChessBoard from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"

const Game = () => {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setChess(new Chess());
                    setBoard(chess.board());
                    console.log("Game initialised")
                    break;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    setBoard(chess.board());
                    console.log("Move Made");
                    break;
                case GAME_OVER:
                    console.log("Game Over");
                    break;
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div className="flex justify-center ">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="cols-span-4">
                        <ChessBoard board={board} />
                    </div>
                    <div className="cols-span-2">
                        <button
                            className="w-full px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                            onClick={() => {
                                socket.send(JSON.stringify({
                                    type: INIT_GAME
                                }))
                            }}
                        >
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game