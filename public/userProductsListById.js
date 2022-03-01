const userToken = localStorage.getItem('userToken');
const userId = localStorage.getItem('userId');
const listId = localStorage.getItem('listId');
const firstName = localStorage.getItem('firstName');
const addNewProductButton = document.getElementById('addNewProductButton');
const newProductForm = document.getElementById('newProductForm');
const deleteSelectedButton = document.getElementById('deleteSelectedButton');
const logoutButton = document.getElementById('logoutDiv');
const myListsButton = document.getElementById('linkMyListsDiv');

deleteSelectedButton.disabled = true;
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

const listNameOutput = document.getElementById('listNameOutput');

async function main() {
  listData = await getFirstJson(apiUrl);

  let myDate = new Date();
  let hrs = myDate.getHours();

  let greet;

  if (hrs < 12) greet = 'בוקר טוב';
  else if (hrs >= 12 && hrs <= 17) greet = 'צהריים טובים';
  else if (hrs >= 17 && hrs <= 24) greet = 'ערב טוב';

  document.getElementById(
    'userGreet'
  ).innerHTML = `<b>${greet}</b> ${firstName}!`;

  listNameOutput.innerHTML = `${listData.listName}`;

  displayList(listData);
}

main();

async function getIdOfDatalist() {
  productsData = await getAllProductsDataJson(getAllProductsDataUrl);

  console.log(productsData);

  let options = '';

  for (let i = 0; i < productsData.length; i++) {
    options += `<option id='${productsData[i]._id}' name='${productsData[i].product_name}' value='${productsData[i].product_name}'></option>`;
  }

  document.getElementById('products-datalist').innerHTML = options;
}

getIdOfDatalist();

const input = document.getElementById('productInput');

input.addEventListener('input', updateValue);

let productId;

addNewProductButton.disabled = true;

function updateValue(e) {
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

  console.log(listData);

  let product;

  for (let i = 0; i < listData.products.length; i++) {
    product = listData.products[i];

    let productName = product.product.product_name;
    let productPrice = product.product.product_price;
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
    tdCheckbox.addEventListener('change', (e) => {
      let checkeedArr = [];
      let procductCheckbox =
        document.getElementsByClassName('procductCheckbox');

      for (let i = 0; i < procductCheckbox.length; i++) {
        checkeedArr.push(procductCheckbox[i].checked);
        console.log(checkeedArr);
        if (checkeedArr.includes(true)) {
          deleteSelectedButton.disabled = false;
        } else if (!checkeedArr.includes(true)) {
          deleteSelectedButton.disabled = true;
        }
      }
    });

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

    let minusSpan = document.createElement('span');
    minusSpan.className = 'minus-span bg-dark';
    minusSpan.id = `minus-${product._id}`;
    minusSpan.innerHTML = '-';

    let amountCounter = document.createElement('input');
    amountCounter.type = 'number';
    amountCounter.className = 'amountCounter';
    amountCounter.id = `amountCounter-${product._id}`;

    let amountProductValue;
    for (let z = 0; z < listData.products.length; z++) {
      amountProductValue = listData.products[i].amount;
      amountCounter.value = parseInt(amountProductValue);
    }

    let plusSpan = document.createElement('span');
    plusSpan.className = 'plus-span bg-dark';
    plusSpan.id = `plus-${product._id}`;
    plusSpan.innerHTML = '+';

    tdSUM.appendChild(plusSpan);
    tdSUM.appendChild(amountCounter);
    tdSUM.appendChild(minusSpan);

    minusSpan.addEventListener('click', minusSpanClick);
    plusSpan.addEventListener('click', plusSpanClick);

    tr.append(tdSUM);

    // Edit Button
    let tdEDIT = document.createElement('td');

    let editButton = document.createElement('button');
    editButton.className = 'editButton';
    let editIcon = document.createElement('img');
    tdEDIT.className = 'editIconTd';
    tdEDIT.id = product._id;
    editButton.id = product._id;
    editIcon.id = product._id;
    editIcon.className = 'editIcon';
    editIcon.src = './assets/save.svg';

    editIcon.style.width = '25px';
    editIcon.style.fontSize = '24px';
    editIcon.style.margin = 'auto';
    editIcon.style.paddingTop = '7px';
    tdEDIT.style.cursor = 'pointer';
    editButton.append(editIcon);
    editIcon.disabled = true;
    editButton.disabled = true;

    tdEDIT.addEventListener('click', saveIconClick);

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

    tr.append(tdEDIT);
    tr.append(tdDELETE);
    tdEDIT.append(editIcon);
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

  // console.log(productId);
  console.log(this.id);

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
  // deleteSelectedButton.disabled = !deleteSelectedButton.disabled;

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

  let checkeedArr = [];
  let procductCheckbox = document.getElementsByClassName('procductCheckbox');

  for (let i = 0; i < procductCheckbox.length; i++) {
    checkeedArr.push(procductCheckbox[i].checked);
    console.log(checkeedArr);
    if (checkeedArr.includes(true)) {
      deleteSelectedButton.disabled = false;
    } else if (!checkeedArr.includes(true)) {
      deleteSelectedButton.disabled = true;
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
  localStorage.removeItem('firstName');
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
}

async function saveIconClick(e) {
  const thisTr = e.target.parentElement.parentElement;
  let amountValue = thisTr.childNodes[3].childNodes[1].value;
  console.log(amountValue);
  console.log(thisTr.id);
  const productId = thisTr.id;
  console.log(listId);

  // return;

  let apiUrl = `http://localhost:3001/list/changeAmountOfProduct`;
  const dataProductUpdateValue = {
    productId: productId,
    listId: listId,
    amount: amountValue,
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

  // while (productItemsTr.length > 0) {
  //   productItemsTr[0].remove();
  // }

  // productInput.value = '';

  // addNewProductButton.disabled = true;

  // main();
  console.log(data);

  return data;
}
