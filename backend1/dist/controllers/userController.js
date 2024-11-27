"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.logout = exports.login = exports.signup = void 0;
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateTokenAndSetCookie_1 = require("../utils/generateTokenAndSetCookie");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (user) {
            res.status(400).json({ error: 'Email already in use' });
            return;
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const newUser = new User_1.User({
            name,
            username,
            email,
            password: hashedPassword,
        });
        if (newUser) {
            (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(newUser._id.toString(), res);
            yield newUser.save();
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email
            });
        }
        else {
            res.status(400).json({ error: "Invalid User Data" });
        }
    }
    catch (error) {
        console.log('Error in sign up controller: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.password);
        if (!email || !isPasswordCorrect) {
            res.status(400).json({ error: "Invalid email or password" });
            return;
        }
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(user._id.toString(), res);
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
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.log('Error in logout controller: ', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.logout = logout;
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({ error: 'Unauthorized - No Token Provided' });
            return;
        }
        const user = yield User_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User Not Found' });
            return;
        }
        const { username, email, _id, name } = user;
        const userProfile = { username, email, _id, name };
        res.status(201).json({ userProfile });
    }
    catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.userProfile = userProfile;
