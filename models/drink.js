const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const Drink = mongoose.model('Drink', new mongoose.Schema({
    username: String,
    timestamp: Number,
    drinkType: { type: Schema.Types.ObjectId, ref: 'DrinkType' }
}))

module.exports = Drink
