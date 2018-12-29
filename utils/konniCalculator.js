const getKonni = (user, drinks) => {
    if (drinks.length <= 0) {
        return 0
    }

    const mass = user.mass
    //metabolism constant
    const MR = user.gender === 'male' ? 0.015 : 0.017
    //body water constant
    const BW = user.gender === 'male' ? 0.58 : 0.49

    const calculateKonniByPeriod = (drinkingPeriod, numberOfDrinks) => {
        return 10 * ((0.806 * 1.2 * numberOfDrinks) / (BW * mass) - MR * drinkingPeriod)
    }

    let numberOfDrinks = 0
    let startingTime = drinks[0].timestamp
    for (let i = 0; i < drinks.length; i++) {
        const drinkSize = drinks[i].drinkSize
        numberOfDrinks += drinkSize

        const cumulativeKonni = calculateKonniByPeriod(getDrinkingPeriod(startingTime, drinks[i].timestamp),numberOfDrinks)
        const currentKonni = calculateKonniByPeriod(0,drinkSize)

        if (cumulativeKonni < currentKonni) {
            startingTime = drinks[i].timestamp
            numberOfDrinks = drinkSize
        }
    }
    const ans = Math.max(calculateKonniByPeriod(getDrinkingPeriod(startingTime, Date.now()), numberOfDrinks), 0)
    return ans
}

const getDrinkingPeriod = (drink1, drink2) => {
    return (drink2 - drink1) / (3600 * 1000)
}

module.exports = getKonni
