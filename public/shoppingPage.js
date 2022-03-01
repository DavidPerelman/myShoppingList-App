const userToken = localStorage.getItem('userToken');
const userId = localStorage.getItem('userId');
const listId = localStorage.getItem('listId');
const active = localStorage.getItem('active');
const url = window.location.search;
const urlParams = new URLSearchParams(url);
const addNewProductButton = document.getElementById('addNewProductButton');
const newProductForm = document.getElementById('newProductForm');
const deleteSelectedButton = document.getElementById('deleteSelectedButton');
const logoutButton = document.getElementById('logoutDiv');
const myListsButton = document.getElementById('linkMyListsDiv');

deleteSelectedButton.addEventListener('click', deleteSelectedProducts);
logoutButton.addEventListener('click', logout);
myListsButton.addEventListener('click', goToMyListsPage);

let productsData;
let getAllProductsDataUrl = `http://localhost:3001/products/productsData`;

async function getAllProductsDataJson(getAllProductsDataUrl) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  let response = await fetch(getAllProductsDataUrl, options);
  let allProductsData = await response.json();
  return allProductsData;
}

// async function getAllProductsData() {
//   productsData = await getAllProductsDataJson(getAllProductsDataUrl);

//   console.log(productsData);
//   localStorage.setItem('productsData', JSON.stringify(productsData));
//   getIdOfDatalist(productsData);
// }

// getAllProductsData();

let dataListsPerUser;
let apiUrl = `http://localhost:3001/lists/listsData?listId=${listId}`;

async function getFirstJson(apiUrl) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  let response = await fetch(apiUrl, options);
  let data = await response.json();
  return data;
}

async function main() {
  listData = await getFirstJson(apiUrl);
  console.log(listData);

  // displayActiveButton(listData);

  displayList(listData);
}

// function displayActiveButton() {

// }

main();

if (active === 'false') {
  let inputGroup = document.getElementById('input-group');
  let activeButton = document.createElement('button');
  let activeIcon = document.createElement('i');
  activeIcon.id = 'active-icon';
  activeIcon.className = 'fas fa-shopping-cart';
  activeButton.className = 'btn mb-3';
  activeButton.type = 'submit';
  activeButton.id = 'activeButton';
  activeButton.innerHTML = 'התחל קניה';
  inputGroup.appendChild(activeButton);
  activeButton.appendChild(activeIcon);
  activeButton.addEventListener('click', startShopping);
} else if (active === 'true') {
  let inputGroup = document.getElementById('input-group');
  let activeButton = document.createElement('button');
  let activeIcon = document.createElement('i');
  activeIcon.id = 'active-icon';
  activeIcon.className = 'fas fa-shopping-cart';
  activeButton.className = 'btn mb-3';
  activeButton.type = 'submit';
  activeButton.id = 'activeButton';
  activeButton.innerHTML = 'סיים קניה';
  inputGroup.appendChild(activeButton);
  activeButton.appendChild(activeIcon);
  activeButton.addEventListener('click', stopShopping);
}

async function getIdOfDatalist() {
  productsData = await getAllProductsDataJson(getAllProductsDataUrl);

  // console.log(productsData);

  // const productsData = JSON.parse(allProductsData);
  let options = '';

  for (let i = 0; i < productsData.length; i++) {
    options += `<option id='${productsData[i]._id}' name='${productsData[i].product_name}' value='${productsData[i].product_name}'></option>`;
  }

  document.getElementById('products-datalist').innerHTML = options;
}

getIdOfDatalist();

const input = document.getElementById('productInput');

addNewProductButton.disabled = true;

input.addEventListener('input', updateValue);

let productId;

function updateValue(e) {
  console.log('ds');

  productId = document
    .getElementById('products-datalist')
    .options.namedItem(e.target.value);

  if (productId && productId !== null) {
    productId = productId.id;
    addNewProductButton.disabled = false;
  } else {
    addNewProductButton.disabled = true;
  }
}

document
  .getElementById('addNewProductButton')
  .addEventListener('click', getVal);

async function getVal(e) {
  e.preventDefault();
  console.log(productId);
  let productItemsTr = document.getElementsByClassName('productItemsTr');

  let myListProducts = [];

  for (let i = 0; i < listData.products.length; i++) {
    myListProducts.push(listData.products[i]._id);
  }

  console.log(myListProducts);

  let productIncludes = myListProducts.includes(productId);

  if (productIncludes) {
    productInput.value = '';
    alert('המוצר כבר קיים ברשימה');
    return;
  } else {
    let apiUrl = `http://localhost:3001/list/addProductToList`;
    const dataProductUpdateValue = {
      productId: productId,
      listId: listId,
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataProductUpdateValue),
    };
    let response = await fetch(apiUrl, options);
    let data = await response.json();

    while (productItemsTr.length > 0) {
      productItemsTr[0].remove();
    }

    productInput.value = '';

    addNewProductButton.disabled = true;

    main();

    return data;
  }
}

let userData;
let listData;

let trForUpdate;

function displayList(listData) {
  let tableBody = document.getElementById('tbody');

  let product;

  for (let i = 0; i < listData.products.length; i++) {
    product = listData.products[i];

    // console.log(product);
    let productName = product.product.product_name;
    let productPrice = product.product.product_price;
    let productAmount = product.amount;
    let productDepartment = product.product.department;
    let productId = product._id;

    let tr = document.createElement('tr');
    tr.id = productId;
    tr.className = 'productItemsTr';
    tableBody.appendChild(tr);
    let tdCheckbox = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'checkboxProduct';
    checkbox.className = 'form-check-input procductCheckbox';
    tdCheckbox.className = 'procductCheckboxTd';

    tr.appendChild(tdCheckbox);
    tdCheckbox.appendChild(checkbox);

    let tdNAME = document.createElement('td');
    tdNAME.id = 'productName';
    tdNAME.className = 'productNameTd';

    let tdDepartment = document.createElement('td');
    tdDepartment.className = 'departmentTd';
    tr.append(tdNAME);
    tr.append(tdDepartment);
    tdNAME.innerHTML = productName;
    tdDepartment.innerHTML = productDepartment;
    tdNAME.id = `product-${product._id}`;

    let tdSUM = document.createElement('td');
    tdSUM.className = 'amountCounterTD';
    // let amountCounterDiv = document.createElement('div');
    // amountCounterDiv.id = 'amountCounterDiv';

    let minusSpan = document.createElement('span');
    minusSpan.className = 'minus-span bg-dark';
    minusSpan.id = `minus-${product._id}`;
    minusSpan.innerHTML = '-';

    let amountCounter = document.createElement('input');
    amountCounter.type = 'number';
    amountCounter.className = 'amountCounter';
    amountCounter.id = 'amountCounter';
    let amountProductValue = productAmount;
    amountCounter.value = parseInt(amountProductValue);

    let plusSpan = document.createElement('span');
    plusSpan.className = 'plus-span bg-dark';
    plusSpan.id = `plus-${product._id}`;
    plusSpan.innerHTML = '+';

    // tdSUM.appendChild(plusSpan);
    tdSUM.appendChild(amountCounter);
    // tdSUM.appendChild(minusSpan);
    // tdSUM.appendChild(amountCounterDiv);

    // minusSpan.disabled = 'true';
    minusSpan.addEventListener('click', minusSpanClick);
    plusSpan.addEventListener('click', plusSpanClick);

    tr.append(tdSUM);

    // Cart Button
    let tdCART = document.createElement('td');
    let shoppingButton = document.createElement('button');
    shoppingButton.className = 'shoppingButton';
    // let cartIcon = document.createElement('i');
    let cartIcon = document.createElement('img');
    tdCART.className = 'cartIconTd';
    tdCART.id = product._id;
    shoppingButton.id = product._id;
    cartIcon.id = product._id;
    cartIcon.className = 'cartIcon';

    const myArray = listData.products;

    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i]._id === productId) {
        if (myArray[i].inCart === false) {
          cartIcon.src = './assets/cart-plus.svg';
          cartIcon.id = 'false';
        } else if (myArray[i].inCart === true) {
          cartIcon.src = './assets/cart-minus.svg';
          cartIcon.id = 'true';
        }
      }
    }

    // const found = myArray.find((_id) => _id === listId);

    // console.log(found);
    // for (let z = 0; z < listData.products[i].lists.length; z++) {
    //   if (listData.products[i].lists[z].inCart === false) {
    //     cartIcon.src = './assets/cart-plus.svg';
    //     cartIcon.id = 'false';
    //   } else if (listData.products[i].lists[z].inCart === true) {
    //     cartIcon.src = './assets/cart-minus.svg';
    //     cartIcon.id = 'true';
    //   }
    // }

    cartIcon.style.width = '39px';
    // cartIcon.className = 'fas fa-cart-plus';
    cartIcon.style.fontSize = '24px';
    cartIcon.style.margin = 'auto';
    tdCART.style.cursor = 'pointer';
    shoppingButton.append(cartIcon);
    cartIcon.addEventListener('click', addToCartIconClick);
    tdCART.appendChild(shoppingButton);
    // tdCART.addEventListener('click', tdCartClick);

    // tr.append(tdEDIT);
    tr.append(tdCART);
    // tdEDIT.append(editIcon);
    tdCART.append(shoppingButton);

    // Delete Button
    let tdDELETE = document.createElement('td');
    let deleteButton = document.createElement('button');
    deleteButton.className = 'deleteButton';
    let deleteIcon = document.createElement('i');
    tdDELETE.className = 'deleteIcon';
    tdDELETE.id = product._id;
    deleteIcon.id = product._id;
    deleteIcon.className = 'deleteIcon';
    deleteIcon.className = 'far fa-trash-alt';
    deleteIcon.style.fontSize = '24px';
    deleteIcon.style.margin = 'auto';
    tdDELETE.style.cursor = 'pointer';
    deleteButton.append(deleteIcon);
    tdDELETE.appendChild(deleteButton);
    tdDELETE.addEventListener('click', deleteProducet);

    tr.append(tdDELETE);
    tdDELETE.append(deleteButton);
  }
}

function showModal() {
  let dataId = editIcon.getAttribute('data-bs-id');
  let dataName = editIcon.getAttribute('data-bs-name');
  let dataPrice = editIcon.getAttribute('data-bs-price');

  let modalBodyInputId = exampleModal.querySelector('.modal-body #product-id');
  let modalBodyInputName = exampleModal.querySelector(
    '.modal-body #product-name'
  );
  let modalBodyInputPrice = exampleModal.querySelector(
    '.modal-body #product-price'
  );

  modalBodyInputId.value = dataId;
  modalBodyInputName.value = dataName;
  modalBodyInputPrice.value = dataPrice;
}

let saveProductButton = document.getElementById('saveProductButton');

let tableBody = document.getElementById('productsTable');

for (let i = 0; i < tableBody; i++) {
  console.log(tableBody);
}

saveProductButton.addEventListener('click', function (e) {
  e.preventDefault();
  let tableBody = document.getElementById('productsTable');

  // let element = HTMLCollection.tr(1);

  let newName = document.getElementById('product-name').value;
  let newPrice = document.getElementById('product-price').value;
  let productId = document.getElementById('product-id').value;

  let trForUpdate = document.getElementById(`${productId}`);

  console.log(productId);

  for (let i = 0; i < listData.listProducts.length; i++) {
    if (listData.listProducts[i].id === productId) {
      listData.listProducts[i].name = newName;
      listData.listProducts[i].price = newPrice;
    }
  }

  // Update Product Name td
  trForUpdate.childNodes[1].innerHTML = newName;
  trForUpdate.childNodes[2].innerHTML = newPrice;
  let productItemsTr = document.getElementsByTagName('tr');

  while (productItemsTr.length > 0) {
    productItemsTr[0].remove();
  }

  displayList();
});

async function deleteProducet(e) {
  let productItemsTr = document.getElementsByClassName('productItemsTr');

  const productId = this.id;

  console.log(productId);

  return;
  if (productId === '' || listId === '') {
    return;
  } else {
    let apiUrl = `http://localhost:3001/list/deleteProductFromList`;

    const dataProductDeleteValue = {
      productId: productId,
      listId: listId,
    };

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataProductDeleteValue),
    };
    let response = await fetch(apiUrl, options);
    let data = await response.json();
    console.log(data);

    while (productItemsTr.length > 0) {
      productItemsTr[0].remove();
    }

    main();

    return data;
  }
}

let thCheckbox = document.getElementById('thCheckbox');
let tdCheckboxs = document.getElementsByClassName('procductCheckbox');

thCheckbox.addEventListener('change', checkAllProduct);

function checkAllProduct() {
  for (let i = 0; i < tdCheckboxs.length; i++) {
    if (tdCheckboxs[i].checked !== true) {
      tdCheckboxs[i].checked = true;
    } else {
      tdCheckboxs[i].checked = false;
    }

    if (tdCheckboxs[i].checked !== thCheckbox.checked) {
      tdCheckboxs[i].checked = thCheckbox.checked;
    }
  }
}

async function deleteSelectedProducts() {
  let productsToDeleteArray = [];
  let elements = document.getElementsByClassName('procductCheckbox');

  let productItemsTr = document.getElementsByClassName('productItemsTr');

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked === true) {
      productsToDelete = elements[i].parentElement.parentElement.id;
      productsToDeleteArray.push(productsToDelete);
    }
  }

  console.log(productsToDeleteArray);

  let apiUrl = `http://localhost:3001/list/deleteManyProductsFromList`;

  const dataProductsDeleteValue = {
    productsToDeleteArray: productsToDeleteArray,
    listId: listId,
  };

  const options = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(dataProductsDeleteValue),
  };
  let response = await fetch(apiUrl, options);
  let data = await response.json();
  console.log(data);

  while (productItemsTr.length > 0) {
    productItemsTr[0].remove();
  }

  main();

  return data;

  // for (let i = 0; i < elements.length; i++) {
  //   if (elements[i].checked === true) {
  //     productToDelete = elements[i].parentElement.parentElement.id;
  //     for (let z = 0; z < listData.productItems.length; z++) {
  //       if (productToDelete === listData.productItems[z].id) {
  //         listData.productItems.splice(z, 1);
  //       }
  //     }
  //   }
  // }

  // while (productItemsTr.length > 0) {
  //   productItemsTr[0].remove();
  // }

  // thCheckbox.checked = false;
  // displayList();
}

function logout() {
  console.log('dsd');
  localStorage.removeItem('userToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('listId');
  window.location = '/index.html';
}

function goToMyListsPage() {
  window.location = '/myLists.html?userId=' + userId + '&listId=';
  localStorage.removeItem('listId');
}

function addToCart() {
  let checkedTDs = document.getElementsByClassName('form-check-input');

  console.log('.productItemsTrInCart');

  for (let i = 0; i < checkedTDs.length; i++) {
    if (checkedTDs[i].checked === true) {
      console.log(checkedTDs[i]);
      let productToAddId = checkedTDs[i].parentElement.parentElement.id;
      let productToAddTR = checkedTDs[i].parentElement.parentElement;
      console.log(productToAddId);
      checkedTDs[i].checked = false;
      for (let z = 0; z < listData.productItems.length; z++) {
        if (productToAddId === listData.productItems[z].id) {
          listData.productItems[z].inCart = true;
          console.log(listData.productItems[z]);
        }
      }
    }
  }

  thCheckbox.checked = false;
}

thCheckbox.checked = false;

function removeFromCart(e) {
  let productTr = e.target.parentElement.parentElement;

  console.log(productTr);

  console.log('.productItemsTrInCart');

  thCheckbox.checked = false;
}

function plusSpanClick(e) {
  e.preventDefault();

  let amountCounter = parseInt(this.parentElement.childNodes[1].value);
  parseInt(amountCounter.value);
  amountCounter += 1;
  this.parentElement.childNodes[1].value = amountCounter;

  if (parseInt(this.parentElement.childNodes[1].value) > 99) {
    return (e.target.parentElement.childNodes[1].value = 99);
  }

  console.log(this.parentElement.childNodes[1].value);
}

function minusSpanClick(e) {
  e.preventDefault();

  let amountCounter = parseInt(this.parentElement.childNodes[1].value);
  parseInt(amountCounter.value);
  amountCounter -= 1;
  this.parentElement.childNodes[1].value = amountCounter;

  if (parseInt(this.parentElement.childNodes[1].value) <= 0) {
    return (e.target.parentElement.childNodes[1].value = 0);
  }

  console.log(this.parentElement.childNodes[1].value);
}

// function tdCartClick(e) {
//   e.preventDefault();

//   const productId = this.id;

//   console.log(productId);
// }

async function addToCartIconClick(e) {
  let productItemsTr = document.getElementsByClassName('productItemsTr');

  e.preventDefault();

  const inCartStatus = this.id;
  const productId = this.parentElement.id;

  console.log(inCartStatus);

  // this.src = './assets/cart-minus.svg';

  if (inCartStatus === 'false') {
    let productItemsTr = document.getElementsByClassName('productItemsTr');

    let apiUrl = `http://localhost:3001/list/addProductToCart`;

    const dataProductUpdateValue = {
      productId: productId,
      listId: listId,
      inCart: true,
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataProductUpdateValue),
    };
    let response = await fetch(apiUrl, options);
    let data = await response.json();

    // return;

    while (productItemsTr.length > 0) {
      productItemsTr[0].remove();
    }

    location.reload();

    // main();

    return data;
  } else if (inCartStatus === 'true') {
    let productItemsTr = document.getElementsByClassName('productItemsTr');

    let apiUrl = `http://localhost:3001/list/addProductToCart`;

    const dataProductUpdateValue = {
      productId: productId,
      listId: listId,
      inCart: false,
    };

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataProductUpdateValue),
    };
    let response = await fetch(apiUrl, options);
    let data = await response.json();

    // return;

    while (productItemsTr.length > 0) {
      productItemsTr[0].remove();
    }

    location.reload();

    // main();

    return data;
  }
  // const dataProductUpdateValue = {
  //   productId: productId,
  //   listId: listId,
  // };

  // const options = {
  //   method: 'PUT',
  //   headers: {
  //     Authorization: `Bearer ${userToken}`,
  //     'Content-Type': 'application/json',
  //     Accept: 'application/json',
  //   },
  //   body: JSON.stringify(dataProductUpdateValue),
  // };
  // let response = await fetch(apiUrl, options);
  // let data = await response.json();

  // return data;
}

async function startShopping(e) {
  let productItemsTr = document.getElementsByClassName('productItemsTr');

  console.log(listData);
  console.log('startShopping');

  let apiUrl = `http://localhost:3001/list/activeListStart`;
  const dataProductUpdateValue = {
    listId: listId,
  };

  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(dataProductUpdateValue),
  };
  let response = await fetch(apiUrl, options);
  let data = await response.json();

  // this.remove();
  const active = localStorage.removeItem('active');
  localStorage.setItem('active', true);

  location.reload();

  while (productItemsTr.length > 0) {
    productItemsTr[0].remove();
  }

  main();

  return data;
}

async function stopShopping(e) {
  let productItemsTr = document.getElementsByClassName('productItemsTr');

  console.log(listData);
  console.log('startShopping');

  let apiUrl = `http://localhost:3001/list/activeListStop`;
  const dataProductUpdateValue = {
    listId: listId,
  };

  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(dataProductUpdateValue),
  };
  let response = await fetch(apiUrl, options);
  let data = await response.json();

  // this.remove();
  const active = localStorage.removeItem('active');
  localStorage.setItem('active', false);

  location.reload();

  while (productItemsTr.length > 0) {
    productItemsTr[0].remove();
  }

  main();

  return data;
}
