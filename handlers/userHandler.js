const User = require('../models/user')
const Drink = require('../models/drink')

const getKonni = require('../utils/konniCalculator').getKonni

let io;

const initialize = (wsServer) => {
    io = wsServer
}

const allWithKonni = () => {
    return Promise.all([
        Drink.find({}).exec(),
        User.find({}).exec()
    ]).then(([drinks, users]) => {
        let resAgg = []
        for (let userObject of users) {
            const username = userObject.username
            const userDrinks = drinks.filter(drink => drink.username === username)
            resAgg.push({
                x: username,
                y: getKonni(userObject, userDrinks)
            })
        }
        return resAgg
    })
}

const emitAllWithKonni = () => {
    allWithKonni()
        .then((konni) => {
            io.emit("allWithKonni", { data: konni })
        })
}

const emitSocketAllWithKonni = (socket) => {
    allWithKonni()
        .then((konni) => {
            socket.emit("allWithKonni", { data: konni })
        })
}

const getAllWithKonni = (request, response) => {
    return allWithKonni()
        .then((resAgg) => {
            return response.send(resAgg)
        })
        .catch((err) => {
            return response.status(500).json({
                error: err.message,
            })
        })
}

const getUser = (request, response) => {
    const username = request.params.username
    Promise.all([
        Drink.find({
            username,
        }).exec(),
        User.findOne({
            username,
        }).exec()
    ]).then(([drinks, user]) => {
        if (!user) {
            return response.status(404).json({
                error: 'User not found',
            })
        }
        const userObject = user.toObject()

        return response.json({
            ...userObject,
            konni: getKonni(userObject, drinks)
        })
    }).catch((err) => {
        return response.status(500).json({
            error: err.message,
        })
    })
}

const postUser = (request, response) => {
    const user = request.body
    if (!user.username) {
        return response.status(400).json({
            error: 'username missing'
        })
    }
    if (!user.mass || user.mass > 9001) {
        return response.status(400).json({
            error: 'mass missing or invalid'
        })
    }
    if (!user.gender) {
        return response.status(400).json({
            error: 'gender missing'
        })
    }
    new User(user).save((err, user) => {
        if (err) {
            if (err.code === 11000) { // non-unique name
                return response.status(400).json({
                    error: 'name must be unique'
                })
            } else {
                return response.status(500).json({
                    error: err.message,
                })
            }
        }
        emitAllWithKonni()
        return response.json(user)
    })
}

const getAll = (request, response) => {
    User.find({}, (err, users) => {
        if (err) {
            return response.status(500).json({
                error: err.message,
            })
        }
        return response.json(users)
    })
}

exports.initialize = initialize
exports.getAllWithKonni = getAllWithKonni
exports.emitAllWithKonni = emitAllWithKonni
exports.emitSocketAllWithKonni = emitSocketAllWithKonni
exports.getUser = getUser
exports.getAll = getAll
exports.postUser = postUser