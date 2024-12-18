import { useNavigate } from "react-router-dom";
import { INIT_GAME } from "./Game";
import { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";
import { useSocketContext } from "../context/SocketContext";
import toast from "react-hot-toast";

const ChessGame = () => {
    const { socket } = useSocketContext();
    const { setGame } = useContext(GameContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("Received Message: ", message);

            if (message.type === INIT_GAME) {
                setGame({
                    _id: message.payload._id,
                    fen: message.payload.fen,
                });
                toast.success(`You're playing as ${message.payload.color}`);

                localStorage.setItem("game_id", JSON.stringify(message.payload.gameId));
                localStorage.setItem("player_color", JSON.stringify(message.payload.color));

                navigate('/game');
            }
        };

        return () => {
            if (socket) {
                socket.onmessage = null;
            }
        };
    }, [socket]);

    const initGame = () => {
        socket && socket.send(
            JSON.stringify({
                type: INIT_GAME,
            })
        );
    };

    return (
        <div className="pt-8 w-full h-full flex justify-center items-center">
            <button
                className="px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                onClick={initGame}
            >
                Play
            </button>
        </div>
    );
};

export default ChessGame;
