import { useEffect, useState } from "react"
import ChessBoard from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"
import toast from "react-hot-toast"

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"

const Game = () => {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
            switch (message.type) {
                case INIT_GAME:
                    setBoard(chess.board());
                    setPlayerColor(message.payload.color);
                    toast.success(`You're playing as ${message.payload.color}`);
                    setStarted(true);
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
                    console.log(message.payload.winner);
                    console.log(playerColor)
                    toast.success(`${message.payload.winner} won!!`);
                    break;
            }
        }
    }, [socket])

    if (!socket) return <div>Connecting...</div>

    return (
        <div className="justify-center flex">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="col-span-4 w-full flex justify-center">
                        <ChessBoard playerColor={playerColor} chess={chess} setBoard={setBoard} socket={socket} board={board} />
                    </div>
                    <div className="col-span-2 bg-slate-900 w-full flex justify-center">
                        <div className="pt-8">
                            {!started && <button
                                className="px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                                onClick={() => {
                                    socket.send(JSON.stringify({
                                        type: INIT_GAME
                                    }))
                                }}
                            >
                                Play
                            </button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game