const mongoose = require('mongoose')

const Drink = mongoose.model('Drink', new mongoose.Schema({
    username: {
        type: String,
    },
    timestamp: {
        type: Number,
    },
}))

module.exports = Drink
