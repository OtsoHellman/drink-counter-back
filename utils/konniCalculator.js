const getKonni = (user, drinks) => {
    if (drinks.length <= 0) {
        return -1
    }

    const { startingTime, numberOfDrinks } = getStartingTime(user, drinks)

    //can return negative values, use getKonniWithValidation if validation is needed
    return calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, Date.now()), numberOfDrinks)
}

const getKonniWithValidation = (user, drinks) => {
    return Math.max(getKonni(user, drinks), 0)
}

const calculateKonniByPeriod = (user, drinkingPeriod, numberOfDrinks) => {
    const mass = user.mass
    //metabolism constant
    const MR = user.gender === 'male' ? 0.015 : 0.017
    //body water constant
    const BW = user.gender === 'male' ? 0.58 : 0.49

    const scalingFactor = 13.37

    return scalingFactor * 10 * ((0.806 * 1.2 * numberOfDrinks) / (BW * mass) - MR * drinkingPeriod)
}

const getStartingTime = (user, drinks) => {
    let numberOfDrinks = 0
    let startingTime = drinks[0].timestamp
    for (let i = 0; i < drinks.length; i++) {
        const { drinkSize } = drinks[i].drinkType
        numberOfDrinks += drinkSize

        const cumulativeKonni = calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, drinks[i].timestamp), numberOfDrinks)
        const currentKonni = calculateKonniByPeriod(user, 0, drinkSize)

        if (cumulativeKonni < currentKonni) {
            startingTime = drinks[i].timestamp
            numberOfDrinks = drinkSize
        }
    }

    return {
        startingTime,
        numberOfDrinks
    }
}


const getDrinkingPeriod = (drink1, drink2) => {
    return (drink2 - drink1) / (3600 * 1000)
}

const getTimestamps = (user, drinks) => {
    if (drinks.length <= 0) {
        return []
    }
    const startingTime = getStartingTime(user, drinks).startingTime
    const currentDrinks = drinks.filter(drink => drink.timestamp >= startingTime)

    if (currentDrinks.length <= 0) {
        return []
    }

    resAgg = []
    let numberOfDrinks = 0

    resAgg.push({
        x: currentDrinks[0].timestamp - (30*60*1000),
        y: Math.max(calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, currentDrinks[0].timestamp), numberOfDrinks),0)
    })

    for (let drink of currentDrinks) {
        numberOfDrinks += drink.drinkType.drinkSize
        resAgg.push({
            x: drink.timestamp,
            y: Math.max(calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, drink.timestamp), numberOfDrinks),0)
        })
    }
    resAgg.push({
        x: Date.now(),
        y: Math.max(calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, Date.now()), numberOfDrinks),0)
    })
    return resAgg
}

exports.getKonni = getKonni
exports.getTimestamps = getTimestamps
exports.getKonniWithValidation = getKonniWithValidation