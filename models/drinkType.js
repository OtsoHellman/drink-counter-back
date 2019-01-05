const mongoose = require('mongoose')

const DrinkType = mongoose.model('DrinkType', new mongoose.Schema({
    drinkName: {
        type: String,
        unique: true,
        dropDups: true
    },
    drinkSize: Number
}))

module.exports = DrinkType