import express from "express";
import { login, logout, signup, userProfile } from "../controllers/userController";

const router = express.Router();

router
    .post('/signup', signup)
    .post('/login', login)
    .post('/logout', logout)
    .get('/user', userProfile)

export { router };