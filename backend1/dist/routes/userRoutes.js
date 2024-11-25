"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
exports.router = router;
router
    .post('/signup', userController_1.signup)
    .post('/login', userController_1.login)
    .post('/logout', userController_1.logout)
    .get('/user', userController_1.userProfile);