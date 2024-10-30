import ChessBoard from "../components/ChessBoard"

const Game = () => {
    return (
        <div className="flex justify-center ">
            <div className="pt-8 max-w-screen-lg">
                <div className="grid grid-cols-6 gap-4 md:grid-cols-2">
                    <div className="cols-span-4">
                        <ChessBoard />
                    </div>
                    <div className="cols-span-2">
                        <button className="px-32 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded">
                            Play
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Game