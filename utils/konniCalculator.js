const getKonni = (user, drinks) => {
    const mass = user.mass
    //metabolism constant
    const MR = user.gender === 'male' ? 0.015 : 0.017
    //body water constant
    const BW = user.gender === 'male' ? 0.58 : 0.49
    const numberOfDrinks = drinks.length
    //time since first drink in hours
    const drinkingPeriod = (Date.now() - drinks[0])/(3600*1000)

    return 10 * ((0.806*numberOfDrinks*1.2)/(BW*mass) - MR*drinkingPeriod)
}

exports.getKonni = getKonni
