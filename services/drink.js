const User = require('../models/user')
const Drink = require('../models/drink')

exports.addDrink = (username, drinkSize) => {
    User.findOne({
        username,
    }).then((user) => {
        if (!user) {
            const err = new Error(`no user found with username ${username}`)
            err.status = 400
            throw err
        }

        return new Drink({
            username,
            drinkSize,
            timestamp: Date.now(),
        }).save().exec()
    })
}
