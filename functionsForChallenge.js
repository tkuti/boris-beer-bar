const startChallengeFunctions = () => {
  const groupByBrand = () => {
    return JSON.stringify(
      beers.reduce((group, beer) => {
        const isExist = group.find(
          beersByBrand => beersByBrand.brand === beer.brand
        )
        return isExist
          ? group.map(beersByBrand =>
              beersByBrand.brand === beer.brand
                ? { ...beersByBrand, beers: [...beersByBrand.beers, beer.id] }
                : beersByBrand
            )
          : [
              ...group,
              {
                brand: beer.brand,
                beers: [beer.id]
              }
            ]
      }, [])
    )
  }

  const filterByType = (type = 'Corn') => {
    return JSON.stringify(
      beers.filter(beer => beer.type === type).map(beer => beer.id)
    )
  }

  const getCheapestBrand = () => {
    const pricesByBrand = beers.reduce(
      (group, beer) => ({
        ...group,
        [beer.brand]: [...(group[beer.brand] || []), Number(beer.price)]
      }),
      {}
    )
    let cheapestPrice = 9999
    let cheapestBrand = ''
    Object.entries(pricesByBrand).forEach(([brand, prices]) => {
      const averagePrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length
      if (averagePrice < cheapestPrice) {
        cheapestPrice = averagePrice
        cheapestBrand = brand
      }
    })
    return JSON.stringify(cheapestBrand)
  }

  const getWithoutAllergies = (ingredient = 'corn') => {
    return JSON.stringify(
      beers
        .filter(
          beer =>
            beer.ingredients.find(ing => ing.name === ingredient).ratio === '0'
        )
        .map(beer => beer.id)
    )
  }

  const sortByWaterRatio = () => {
    const getWaterRatio = ingredients => {
      const ingredientsRatio = ingredients.reduce(
        (sum, ing) => sum + Number(ing.ratio),
        0
      )
      return 1 - ingredientsRatio
    }
    return JSON.stringify(
      beers
        .sort((a, b) => {
          const waterRatioA = getWaterRatio(a.ingredients)
          const waterRatioB = getWaterRatio(b.ingredients)
          return waterRatioA === waterRatioB
            ? a.id.localeCompare(b.id)
            : waterRatioB - waterRatioA
        })
        .map(beer => beer.id)
    )
  }

  const groupByRoundedPrice = () => {
    return JSON.stringify(
      beers.reduce((group, beer) => {
        const roundedPrice = Math.ceil(beer.price / 100) * 100
        return {
          ...group,
          [roundedPrice]: [...(group[roundedPrice] || []), beer.id]
        }
      }, {})
    )
  }

  console.log(groupByBrand())
  console.log(filterByType())
  console.log(getCheapestBrand())
  console.log(getWithoutAllergies('wheat'))
  console.log(sortByWaterRatio())
  console.log(groupByRoundedPrice())
}
