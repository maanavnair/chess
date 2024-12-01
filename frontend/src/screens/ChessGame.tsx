
import { useNavigate } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { INIT_GAME } from "./Game";
import { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";


const ChessGame = () => {

    const socket = useSocket();
    const { setGame } = useContext(GameContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setGame({
                _id: message.payload._id,
                fen: message.payload.fen,
            })
            localStorage.setItem("game_id", JSON.stringify(message.payload.gameId));
            localStorage.setItem("player_color", JSON.stringify(message.payload.color));
            navigate('/game');
        }
        return () => {
            socket.close();
        }
    }, [socket, setGame, navigate]);

    const initGame = async () => {
        socket?.send(JSON.stringify({
            type: INIT_GAME
        }))
    }

    return (
        <div className="pt-8">
            <button
                className="px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                onClick={initGame}
            >
                Play
            </button>
        </div>
    )
}

export default ChessGame