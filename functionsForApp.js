const groupByBrandApp = () => {
    return beers.reduce((group, beer) => {
        const isExist = group.find(
            beersByBrand => beersByBrand.brand === beer.brand
        )
        if (!isExist) {
            return [
                ...group,
                {
                    brand: beer.brand,
                    beers:  `${beer.name} (${beer.id})` 
                }
            ]
        } else {
            return group.map(beersByBrand =>
                beersByBrand.brand === beer.brand
                    ? { ...beersByBrand, beers:beersByBrand.beers + `\n${beer.name} (${beer.id})` }
                    : beersByBrand
            )
        }
    }, [])
}

const filterByTypeApp = (type = 'Corn') => {
    return beers.filter(beer => beer.type === type).map(beer => ({
        name: beer.name, id: beer.id
    })
    )
}

const getCheapestBrandApp = () => {
    const averageByBrand = beers.reduce((group, beer) => {
        return {
            ...group,
            [beer.brand]: [...(group[beer.brand] || []), Number(beer.price)]
        }
    }, {})

    let cheapestPrice = 9999
    let cheapestBrand = ""
    for (let [brand, prices] of Object.entries(averageByBrand)) {
        const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length
        if (averagePrice < cheapestPrice) {
            cheapestPrice = averagePrice
            cheapestBrand = brand
        }
    }
    return {brand: cheapestBrand, ['average price']: cheapestPrice}
}

const getWithoutAllergiesApp = (ingredient = 'corn') => {
    return beers
        .filter(
            beer =>
                beer.ingredients.find(ing => ing.name === ingredient).ratio === '0'
        )
        .map(beer => ({
            name: beer.name, id: beer.id
        }))
}

const sortByWaterRatioApp = () => {
    const getWaterRatio = ingredients => {
        const ingredientsRatio = ingredients.reduce(
            (sum, ing) => sum + Number(ing.ratio),
            0
        )
        return 1 - ingredientsRatio
    }
    return beers
        .sort((a, b) => {
            const waterRatioA = getWaterRatio(a.ingredients)
            const waterRatioB = getWaterRatio(b.ingredients)
            if (waterRatioA === waterRatioB) {
                return a.id.localeCompare(b.id)
            } else {
                return waterRatioB - waterRatioA
            }
        })
        .map(beer => ({ name: `${beer.name} (${beer.id})`, ratio: getWaterRatio(beer.ingredients) }))
}

const groupByRoundedPriceApp = () => {
    return beers.reduce((group, beer) => {
        const roundedPrice = Math.ceil(beer.price / 100) * 100
        return {
            ...group,
            [roundedPrice]: [...(group[roundedPrice] || []), beer.id]
        }
    }, {})
}
