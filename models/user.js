const mongoose = require('mongoose')

const User = mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        index: {
            unique: true
        },
    },
    mass: {
        type: Number,
        min: 0,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
}))

module.exports = User