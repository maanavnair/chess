import { Color, PieceSymbol, Square } from "chess.js"
import { useState } from "react";
import { MOVE } from "../screens/Game";

const ChessBoard = ({ chess, board, socket, setBoard, playerColor }: {
    playerColor: 'white' | 'black' | null,
    chess: any,
    setBoard: any,
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][]
    socket: WebSocket;
}) => {
    const [from, setFrom] = useState<null | Square>(null);

    const handleSquareClick = (squareRepresentation: Square) => {
        if (!from) {
            const piece = chess.get(squareRepresentation);

            if (!piece) {
                return;
            }

            const pieceColor = piece.color === 'w' ? 'white' : 'black';
            if (pieceColor !== playerColor) {
                console.log("Can't move opponent's pieces");
                return;
            }

            const currentTurn = chess.turn() === 'w' ? 'white' : 'black';
            if (currentTurn !== playerColor) {
                console.log("Not your turn");
                return;
            }

            setFrom(squareRepresentation);
        }
        else {
            try {
                const move = {
                    from,
                    to: squareRepresentation
                };

                const result = chess.move(move);
                if (result) {
                    socket.send(JSON.stringify({
                        type: MOVE,
                        payload: {
                            move
                        }
                    }));
                    setBoard(chess.board());
                } else {
                    console.log("Invalid move");
                }
            } catch (e) {
                console.log("Invalid move:", e);
            }

            setFrom(null);
        }
    };

    return (
        <div className="text-white-200">
            {board.map((row, i) => {
                return <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        const isSelected = from === squareRepresentation;

                        return (
                            <div
                                onClick={() => handleSquareClick(squareRepresentation)}
                                key={j}
                                className={`
                                    text-black w-16 h-16 
                                    ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-white'}
                                    ${isSelected ? 'border-2 border-yellow-400' : ''}
                                    ${from && chess.moves({ square: from }).includes(squareRepresentation) ?
                                        'bg-yellow-200' : ''}
                                `}
                            >
                                <div className="flex justify-center h-full w-full">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? square.type : ""}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            })}
        </div>
    );
};

export default ChessBoard;