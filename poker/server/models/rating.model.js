    const mongoose = require('mongoose');

    const ratingSchema = new mongoose.Schema({
        telegramId: {
            type: String,
            required: true,
            unique: true
        },
        telegramUsername: {
            type: String,
            required: true
        },
        points: {
            type: Number,
            required: true
        }
    });

    const Rating = mongoose.model('Rating', ratingSchema);

    module.exports = Rating;
