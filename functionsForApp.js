const groupByBrandApp = () => {
  return beers.reduce((group, beer) => {
    const isExist = group.find(
      beersByBrand => beersByBrand.brand === beer.brand
    )
    return isExist
      ? group.map(beersByBrand =>
          beersByBrand.brand === beer.brand
            ? {
                ...beersByBrand,
                beers: beersByBrand.beers + `<br>${beer.name} (${beer.id})`
              }
            : beersByBrand
        )
      : [
          ...group,
          {
            brand: beer.brand,
            beers: `${beer.name} (${beer.id})`
          }
        ]
  }, [])
}

const filterByTypeApp = (type = 'Corn') => {
  return beers
    .filter(beer => beer.type.toLowerCase() === type.toLowerCase())
    .map(beer => ({
      name: beer.name,
      id: beer.id
    }))
}

const getCheapestBrandApp = () => {
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
  return { brand: cheapestBrand, averagePrice: cheapestPrice }
}

const getWithoutAllergiesApp = (ingredient = 'corn') => {
  return beers
    .filter(beer => {
      const existingIngredient = beer.ingredients.find(
        ing => ing.name === ingredient
      )
      return existingIngredient
        ? existingIngredient.ratio === '0'
          ? true
          : false
        : false
    })
    .map(beer => ({
      name: beer.name,
      id: beer.id
    }))
}

const sortByWaterRatioApp = () => {
  const getWaterRatio = ingredients => {
    const ingredientsRatio = ingredients.reduce(
      (sum, ing) => sum + Number(ing.ratio),
      0
    )
    return Math.round((1 - ingredientsRatio) * 1000) / 1000
  }
  return beers
    .sort((a, b) => {
      const waterRatioA = getWaterRatio(a.ingredients)
      const waterRatioB = getWaterRatio(b.ingredients)
      return waterRatioA === waterRatioB
        ? a.id.localeCompare(b.id)
        : waterRatioB - waterRatioA
    })
    .map(beer => ({
      name: `${beer.name} (${beer.id})`,
      ratio: getWaterRatio(beer.ingredients)
    }))
}

const groupByRoundedPriceApp = () => {
  const list = beers.reduce((acc, beer) => {
    const roundedPrice = Math.ceil(beer.price / 100) * 100
    const isExist = acc.find(group => group.price === roundedPrice)
    return isExist
      ? acc.map(group =>
          group.price === roundedPrice
            ? { ...group, beers: group.beers + `<br>${beer.name} (${beer.id})` }
            : group
        )
      : [
          ...acc,
          {
            price: roundedPrice,
            beers: `${beer.name} (${beer.id})`
          }
        ]
  }, [])
  return list.sort((a, b) => Number(a.price) - Number(b.price))
}
