import { Request, Response } from "express";
import { gameModel } from "../models/Game";


const getGame = async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        const game = await gameModel.findById(_id);
        if (!game) {
            res.status(401).json({ error: "Can't find Game" });
            return;
        }
        res.status(201).json({
            _id,
            fen: game.fen
        })
    }
    catch (error) {
        console.log("Error in getGame controller: ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { getGame };