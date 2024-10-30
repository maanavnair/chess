

const Landing = () => {
    return (
        <div>
            <div className="pt-2">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex justify-center">
                        <img src={"/chessboard.jpg"}
                            className="max-w-96"
                        />
                    </div>
                    <div className="pt-16">
                        <div className="flex justify-center">
                            <h1 className="text-4xl font-bold text-white">
                                Play chess online on the #1 site!
                            </h1>
                        </div>
                        <div className="mt-4 flex justify-center">
                            <button className="p-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Play Online
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Landing