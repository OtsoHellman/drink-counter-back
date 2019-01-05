const User = require('../models/user')
const DrinkType = require('../models/drinkType')
const Drink = require('../models/drink')


const userHandler = require('./userHandler')

const postDrink = (request, response) => {
    const username = request.body.username
    const drinkTypeId = request.body.drinkTypeId
    if (!username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }

    if (!drinkTypeId) {
        return response.status(400).json({
            error: 'drink id missing'
        })
    }

    Promise.all([
        DrinkType.count({
            _id: drinkTypeId,
        }).exec(),
        User.findOne({
            username,
        }).exec()
    ]).then(([count, user]) => {
        if (!user) {
            return response.status(400).json({
                error: 'user not in database'
            })
        }

        if (count <= 0) {
            return response.status(400).json({
                error: 'drink type not in database'
            })
        }
        new Drink({
            username,
            drinkType: drinkTypeId,
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