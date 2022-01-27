const _root = document.querySelector('#root')
const _listsBtn = document.querySelector('.btn-lists')
let _listsWrapper
let _listContainer

let beers

async function fetchBeers() {
  const response = await fetch('/beers.json')
  beers = await response.json()
  startChallengeFunctions()
  routing()
}

fetchBeers()
window.onpopstate = routing
_listsBtn.addEventListener('click', directToLists)

function directToLists() {
  location.hash = 'lists'
  routing()
}

function routing() {
  try {
    switch (location.hash) {
      case '#lists':
        renderListsPage()
        break;
      default:
        renderHomePage()
    }
  } catch (err) {
    console.log(err)
    clearDynamicContent()
  }
}

function renderHomePage() {
  clearDynamicContent()
  const _homeWrapper = createAnyElement('section', _root, { class: "home-wrapper" })
  createAnyElement("img", _homeWrapper, { src: './images/boris.png', alt: "Boris" })
  createAnyElement("h1", _homeWrapper, { innerHTML: 'Hey Boris!', class: 'home-heading' })
  createAnyElement("p", _homeWrapper, { innerHTML: 'Welcome to your Beer App!' })
  createAnyElement("p", _homeWrapper, { innerHTML: 'Click the Lists button above and enjoy your work!' })
}

function renderListsPage() {
  clearDynamicContent()
  _listsWrapper = createAnyElement('section', _root, { class: "lists-wrapper" })
  createAnyElement("p", _listsWrapper, { innerHTML: 'Choose a list you wish to render' })
  const _listSelect = createAnyElement("select", _listsWrapper, { name: "list-select", id: "list-select" })
  createAnyElement('option', _listSelect, { value: 0, innerHTML: "--Choose--" })
  createAnyElement('option', _listSelect, { value: 1, innerHTML: "By brand" })
  createAnyElement('option', _listSelect, { value: 2, innerHTML: "By type" })
  createAnyElement('option', _listSelect, { value: 3, innerHTML: "Cheapest" })
  createAnyElement('option', _listSelect, { value: 4, innerHTML: "Without allergies" })
  createAnyElement('option', _listSelect, { value: 5, innerHTML: "By water ratio" })
  createAnyElement('option', _listSelect, { value: 6, innerHTML: "By rounded price" })
  _listSelect.addEventListener('change', getList)
  _listContainer = createAnyElement('div', _listsWrapper)
}

function getList(e) {
  clearListContainer()
  switch (e.target.value) {
    case '1':
      console.log(groupByBrandApp());
      renderTable(groupByBrandApp(), "Beers by brand");
      break
    case '2':
      renderInput("type")
      break
    case '3':
      renderTable([getCheapestBrandApp()], "Brand with cheapest average price");
      break
    case '4':
      renderInput("allergy")
      break
    case '5':
      renderTable(sortByWaterRatioApp(), "Beers sorted by water ratio");
      break
    case '6':
      renderTable(groupByRoundedPriceApp(), "Beers group by rounded prices");
      break
    default:
      break
  }
}

function  renderInput (listType) {
  const _inputWrapper = createAnyElement('div', _listContainer, {class: 'input-wrapper'})
  const _input = createAnyElement("input", _inputWrapper)
  const _button = createAnyElement('button', _inputWrapper, {innerHTML: "Filter", class: "btn"})
  _button.addEventListener('click', () => {
    listType === "type"
    ? renderTable(filterByTypeApp(_input.value), `Beers by type - ${_input.value}`)
    : renderTable(getWithoutAllergiesApp(_input.value), `Beers without allergies - ${_input.value}`)
  })
}

function renderTable (list, title) {
  createAnyElement('h3', _listContainer, { innerHTML: title})
  const keys = list.length > 0 ? Object.keys(list[0]) : null
  if (keys) {
    const _table = createAnyElement('table', _listContainer)
    const _rowTh = createAnyElement('tr', _table)
    createAnyElement('th', _rowTh, {innerHTML: "#", class: 'table-heading'})
    keys.forEach(key => createAnyElement('th', _rowTh, { class: 'table-heading', innerHTML: key }))
    list.forEach((beer, index) => {
      const _row = createAnyElement('tr',_table )
      createAnyElement('td', _row, {innerHTML: index + 1, class: 'cell'})
      keys.forEach(key => createAnyElement('td', _row, { class: 'cell', innerHTML: beer[key]}))
   })
  } else {
    createAnyElement('span', _listContainer, { innerHTML: 'No beers found'})
  }
}

function createAnyElement(elem, parent, props) {
  const element = document.createElement(elem)
  parent.appendChild(element)
  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key !== 'class'){
        element[key] = value
      } else {
        element.classList.add(value)
      }
    })
  } 
  return element;
}

function clearListContainer () {
  _listContainer && (_listContainer.textContent = '')
}

function clearDynamicContent() {
  _root.textContent = ''
}