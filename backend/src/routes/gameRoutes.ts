import express from "express";
import { getGame } from "../controllers/gameControllers";

const router = express.Router();

router
    .get('/', getGame);

export { router };