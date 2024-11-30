import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    player1Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    player2Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fen: {
        type: String,
        required: true
    },
    moveCount: {
        type: Number,
        default: 0,
        required: true
    }
}, { timestamps: true })

const gameModel = mongoose.model('Game', gameSchema);

export { gameModel };