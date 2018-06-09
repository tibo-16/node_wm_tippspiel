const mongoose = require('mongoose');

var GamedaySchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    completed: {
        type: Boolean,
        default: false
    },
    games: [{
        homeTeam: {
            type: String,
            require: true
        },
        awayTeam: {
            type: String,
            require: true
        },
        result: {
            type: String,
            default: null
        }
    }]
});

var GameDay = mongoose.model('GameDay', GamedaySchema);

module.exports = {
    GameDay
};