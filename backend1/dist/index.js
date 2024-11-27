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
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = require("./routes/userRoutes");
const User_1 = require("./models/User");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use('/api/auth', userRoutes_1.router);
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
const gameManager = new GameManager_1.GameManager();
function parseJwtFromCookies(cookieHeader) {
    var _a;
    if (!cookieHeader) {
        return null;
    }
    const token = (_a = cookieHeader
        .split('; ')
        .find((row) => row.startsWith('jwt='))) === null || _a === void 0 ? void 0 : _a.split('=')[1];
    return token || null;
}
wss.on('connection', function connection(ws, req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Parse the token directly from the cookie header
            const token = parseJwtFromCookies(req.headers.cookie);
            if (!token) {
                ws.close(1008, 'Unauthorized - No Token Provided');
                return;
            }
            // Verify the JWT token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            // Fetch the user from the database
            const user = yield User_1.User.findById(decoded.userId).select('-password');
            if (!user) {
                ws.close(1008, 'User Not Found');
                return;
            }
            console.log('User connected:', user);
            // Add user to the game manager
            gameManager.addUser(ws);
            // Handle disconnection
            ws.on('close', () => {
                console.log('User disconnected');
                gameManager.removeUser(ws);
            });
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                ws.close(4000, 'Unauthorized - Token Expired');
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                ws.close(4001, 'Unauthorized - Invalid Token');
            }
            else {
                console.error('WebSocket connection error:', error);
                ws.close(1011, 'Internal Server Error');
            }
        }
    });
});
mongoose_1.default.connect(process.env.DB_URI || '')
    .then(() => {
    server.listen(8080, () => {
        console.log("Server Started");
    });
})
    .catch((err) => {
    console.log(err);
});
