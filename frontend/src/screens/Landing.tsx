import { useNavigate } from "react-router-dom"


const Landing = () => {

    const navigate = useNavigate();

    return (
        <div className="flex justify-center">
            <div className="pt-8 max-w-screen-lg">
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
                        <div className="mt-8 flex justify-center">
                            <button
                                className="px-8 py-4 bg-green-500 hover:bg-green-700 text-white font-bold rounded"
                                onClick={() => navigate('/login')}
                            >
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