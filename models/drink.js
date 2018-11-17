const mongoose = require('mongoose')

const Drink = mongoose.model('Drink', new mongoose.Schema({
    username: String,
    timestamp: Number,
}))

module.exports = Drink
