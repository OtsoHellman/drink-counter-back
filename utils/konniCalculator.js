const getKonni = (user, drinks) => {
    if (drinks.length <= 0) {
        return 0
    }

    const startingTimeObject = getStartingTime(user, drinks)
    const startingTime = startingTimeObject.startingTime
    const numberOfDrinks = startingTimeObject.numberOfDrinks

    const ans = Math.max(calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, Date.now()), numberOfDrinks), 0)

    return ans
}


const calculateKonniByPeriod = (user, drinkingPeriod, numberOfDrinks) => {
    const mass = user.mass
    //metabolism constant
    const MR = user.gender === 'male' ? 0.015 : 0.017
    //body water constant
    const BW = user.gender === 'male' ? 0.58 : 0.49

    return 10 * ((0.806 * 1.2 * numberOfDrinks) / (BW * mass) - MR * drinkingPeriod)
}

const getStartingTime = (user, drinks) => {
    let numberOfDrinks = 0
    let startingTime = drinks[0].timestamp
    for (let i = 0; i < drinks.length; i++) {
        const drinkSize = drinks[i].drinkType.drinkSize
        numberOfDrinks += drinkSize

        const cumulativeKonni = calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, drinks[i].timestamp), numberOfDrinks)
        const currentKonni = calculateKonniByPeriod(user, 0, drinkSize)

        if (cumulativeKonni < currentKonni) {
            startingTime = drinks[i].timestamp
            numberOfDrinks = drinkSize
        }
    }
    //enable this to clear users with 0 konni from graph:

    //if (calculateKonniByPeriod(user, getDrinkingPeriod(startingTime, Date.now()), numberOfDrinks) <= 0) {
    //    startingTime = Date.now()
    //    numberOfDrinks = 0
    //}

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
    for (let drink of currentDrinks) {
        numberOfDrinks += drink.drinkSize
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
