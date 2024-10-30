import ChessBoard from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"

const Game = () => {

    const socket = useSocket();

    if (!socket) return <div>Connecting...</div>

    return (
        <div className="flex justify-center ">
            <div className="pt-8 max-w-screen-lg w-full">
                <div className="grid grid-cols-6 gap-4 w-full">
                    <div className="cols-span-4">
                        <ChessBoard />
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