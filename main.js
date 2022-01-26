let beers

async function fetchBeers() {
  const response = await fetch('/beers.json')
  const data = await response.json()
  beers = data
  startApp()
}

fetchBeers()

const startApp = () => {
  console.log(beers)

  const groupByBrand = () => {
    return beers.reduce((group, beer) => {
      const isExist = group.find(
        beersByBrand => beersByBrand.brand === beer.brand
      )
      if (!isExist) {
        return [
          ...group,
          {
            brand: beer.brand,
            beers: [beer.id]
          }
        ]
      } else {
        return group.map(beersByBrand =>
          beersByBrand.brand === beer.brand
            ? { ...beersByBrand, beers: [...beersByBrand.beers, beer.id] }
            : beersByBrand
        )
      }
    }, [])
  }
  console.log(groupByBrand())

  const filterByType = (type = 'Corn') => {
    return beers.filter(beer => beer.type === type).map(beer => beer.id)
  }

  const getCheapestBrand = () => {
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
    return cheapestBrand
  }

  const getWithoutAllergies = (ingredient = 'corn') => {
    return beers
      .filter(
        beer =>
          beer.ingredients.find(ing => ing.name === ingredient).ratio === '0'
      )
      .map(beer => beer.id)
  }

  const sortByWaterRatio = () => {
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
      .map(beer => ({ id: beer.id, ratio: getWaterRatio(beer.ingredients) }))
  }

  const groupByRoundedPrice = () => {
    return beers.reduce((group, beer) => {
      const roundedPrice = Math.ceil(beer.price / 100) * 100
      return {
        ...group,
        [roundedPrice]: [...(group[roundedPrice] || []), beer.id]
      }
    }, {})
  }

  console.log(getCheapestBrand())
}
