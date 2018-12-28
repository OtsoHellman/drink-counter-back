const User = require('../models/user')
const Drink = require('../models/drink')

const userHandler = require('./userHandler')

const postDrink = (request, response) => {
    const username = request.body.username
    const drinkSize = request.body.drinkSize
    if (!username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }

    if (!drinkSize || typeof(drinkSize) !== 'number' || drinkSize <= 0) {
        return response.status(400).json({
            error: 'invalid or missing drinkSize'
        })
    }

    User.findOne({
        username
    }).then((user) => {
        if (!user) {
            return response.status(400).json({
                error: 'user not in database'
            })
        }
        
        new Drink({
            username,
            drinkSize,
            timestamp: Date.now(),
        }).save((err, drink) => {
            if (err) {
                throw err
            }
            userHandler.emitAllWithKonni()
            return response.json(drink)
        })
    }).catch((err) => {
        return response.status(500).json({
            error: err.message,
        })
    })
}

exports.postDrink = postDrink