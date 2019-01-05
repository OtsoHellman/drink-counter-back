const DrinkType = require('../models/drinkType')

exports.createDrinkType = (drinkName, drinkSize) => {
        return new DrinkType({
            drinkName,
            drinkSize,
        }).save()
}

exports.getAll = () => {
    return DrinkType.find()
}