import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { Response } from 'express';
dotenv.config();

const generateTokenAndSetCookie = (userId: string, res: Response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: 15 * 24 * 60 * 60
    })

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    })
}

export { generateTokenAndSetCookie };