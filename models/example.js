const mongoose = require('mongoose')

const Example = mongoose.model('Example', new mongoose.Schema({
    field1: String,
}))

module.exports = Example
