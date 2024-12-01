import { createContext, ReactNode, useState } from "react";

interface Game {
    _id: string,
    fen: string,
    // chess: any,
    // board: ({
    //     square: Square;
    //     type: PieceSymbol;
    //     color: Color;
    // } | null)[][]

}

interface GameContextType {
    game: Game | null;
    setGame: React.Dispatch<React.SetStateAction<Game | null>>;
}

export const GameContext = createContext<GameContextType>({
    game: null,
    setGame: () => null,
});

interface GameContextProviderProps {
    children: ReactNode
}

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
    const [game, setGame] = useState<Game | null>(null);

    return (
        <GameContext.Provider value={{ game, setGame }}>
            {children}
        </GameContext.Provider>
    )
}