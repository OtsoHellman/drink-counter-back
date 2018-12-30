const User = require('../models/user')
const Drink = require('../models/drink')

const getKonni = require('../utils/konniCalculator')

exports.allWithKonni = () => Promise.all([
    Drink.find({}).exec(),
    User.find({}).exec()
]).then(([drinks, users]) => users.map((user) => {
    const { username } = user
    const userDrinks = drinks.filter(drink => drink.username === username)
    return {
        x: username,
        y: getKonni(user, userDrinks)
    }
}))

exports.getUser = ({ params: { username } }) => Promise.all([
    Drink.find({
        username,
    }).exec(),
    User.findOne({
        username,
    }).exec()
]).then(([drinks, user]) => {
    if (!user) {
        const err = new Error('no user found')
        err.status = 404
        throw err
    }
    const userObject = user.toObject()
    return {
        ...userObject,
        konni: getKonni(userObject, drinks)
    }
})

exports.createUser = (user) => new Promise((resolve) => {
    new User(user).save((err, user) => {
        if (err) {
            throw err
        }
        resolve(user)
    })
})

exports.getAll = () => User.find({}).exec()
