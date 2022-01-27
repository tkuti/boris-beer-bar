const _root = document.querySelector('#root')
const _listsBtn = document.querySelector('.btn-lists')
let _listsWrapper
let _listContainer

window.onpopstate = routing
routing()

_listsBtn.addEventListener('click', () => {
  directToLists()
})


function directToLists() {
  const url = new URL(window.location.href)
  url.hash = 'lists'
  history.pushState({ valami: "valami" }, '', url)
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
        history.pushState({}, '', window.location.href)
    }
  } catch (err) {
    clearDynamicContent()
    history.pushState({}, '', window.location.pathname)
  }
}

function renderHomePage() {
  clearDynamicContent()
  const _homeWrapper = createAnyElement('section', _root,
    { class: "home-wrapper" })
  createAnyElement("img", _homeWrapper, { src: './images/boris.png', alt: "Boris" })
  createAnyElement("h1", _homeWrapper, { innerHTML: 'Hey Boris!' })
  createAnyElement("p", _homeWrapper, { innerHTML: 'Welcome to your Beer App!' })
  createAnyElement("p", _homeWrapper, { innerHTML: 'Click the Lists button above and enjoy your work!' })
}

function renderListsPage() {
  clearDynamicContent()
  _listsWrapper = createAnyElement('section', _root,
  { class: "lists-wrapper" })
  createAnyElement("h2", _listsWrapper, { innerHTML: 'Lists' })
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
}

function getList(e) {
  switch (e.target.value) {
    case '1':
      clearListContainer()
      renderTable(groupByBrandApp(), "Beers by brand");
      break
    case '2':
      clearListContainer()
      renderInput("type")
      break
    case '3':
      clearListContainer()
      renderTable([getCheapestBrandApp()], "Brand with cheapest average price");
      break
    case '4':
      clearListContainer()
      renderInput("allergy")
      break
    case '5':
      clearListContainer()
      renderTable(sortByWaterRatioApp(), "Beers sorted by water ratio");
      break
    default:
      break

  }
}


function  renderInput (listType) {
  const _inputWrapper = createAnyElement('div', _listsWrapper)
  const _input = createAnyElement("input", _inputWrapper)
  const _button = createAnyElement('button', _inputWrapper, {innerHTML: "Send"})
  _button.addEventListener('click', () => {
    listType === "type"
    ? renderTable(filterByTypeApp(_input.value), "Beers by type")
    : renderTable(getWithoutAllergiesApp(_input.value), "Beers without allergies")
  })
}


function renderTable (list, title) {
  _listContainer = createAnyElement('div', _listsWrapper)
  createAnyElement('h3', _listContainer, { innerHTML: title})
  const _table = createAnyElement('table', _listContainer)
  const _rowTh = createAnyElement('tr', _table)
  const keys = Object.keys(list[0])
  keys.forEach(key => createAnyElement('th', _rowTh, { class: 'table-heading', innerHTML: key }))
  list.forEach(beer => {
    const _row = createAnyElement('tr',_table)
    keys.forEach(key => createAnyElement('td', _row, { class: 'cell', innerHTML: beer[key]}))
    
 })
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