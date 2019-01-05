const User = require('../models/user')
const DrinkType = require('../models/drinkType')
const Drink = require('../models/drink')


const userHandler = require('./userHandler')

const postDrink = (request, response) => {
    const username = request.body.username
    const drinkName = request.body.drinkName
    if (!username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }

    if (!drinkName) {
        return response.status(400).json({
            error: 'drinkName missing'
        })
    }

    Promise.all([
        DrinkType.findOne({
            drinkName,
        }).exec(),
        User.findOne({
            username,
        }).exec()
    ]).then(([drinkType, user]) => {
        if (!user) {
            return response.status(400).json({
                error: 'user not in database'
            })
        }

        if (!drinkType) {
            return response.status(400).json({
                error: 'drink type not in database'
            })
        }
        new Drink({
            username,
            drinkType: drinkType._id,
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