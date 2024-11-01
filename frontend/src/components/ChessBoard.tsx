import { Color, PieceSymbol, Square } from "chess.js"
import { useState } from "react";
import { MOVE } from "../screens/Game";


const ChessBoard = ({ board, socket }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket;
}) => {

    const [from, setFrom] = useState<null | Square>(null);
    const [to, setTo] = useState<null | Square>(null);

    return (
        <div className="text-white-200">
            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {row.map((square, j) => {
                        return <div onClick={() => {
                            if (!from) {
                                setFrom(square?.square ? square.square : null);
                            }
                            else {
                                socket.send(JSON.stringify({
                                    type: MOVE,
                                    payload: {
                                        from,
                                        to: square?.square
                                    }
                                }))
                                setFrom(null);
                                console.log({
                                    from,
                                    to
                                })
                            }
                        }} key={j} className={`text-black w-16 h-16 ${(i + j) % 2 == 0 ? 'bg-green-500' :
                            'bg-white'}`}>
                            <div className="flex justify-center h-full w-full">
                                <div className="h-full justify-center flex flex-col">
                                    {square ? square.type : ""}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </div>
    )
}

export default ChessBoard