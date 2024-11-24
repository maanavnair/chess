import { User } from "../models/User"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { Request, Response } from "express";
import dotenv from "dotenv"

dotenv.config();

const signup = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ error: 'Email already in use' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id.toString(), res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            })
        }
        else {
            res.status(400).json({ error: "Invalid User Data" });
        }
    }
    catch (error) {
        console.log('Error in sign up controller: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!email || !isPasswordCorrect) {
            res.status(400).json({ error: "Invalid email or password" });
        }

        generateTokenAndSetCookie(user._id.toString(), res);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        });
    }
    catch (error) {
        console.log('Error in login controller: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log('Error in logout controller: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

interface JwtPayload {
    userId: string;
}

const userProfile = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        if (!decoded) {
            res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            return;
        }

        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            res.status(404).json({ error: 'User Not Found' });
            return;
        }
        const { username, email, _id } = user;
        const userProfile = { username, email, _id, token }
        res.status(201).json({ userProfile })

    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { signup, login, logout, userProfile };