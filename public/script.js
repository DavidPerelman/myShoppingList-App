let url = window.location.href;
let params = new URL(url).searchParams;
console.log(params);
let userId = params.get('userId');
console.log(userId);

let productInput = document.getElementById('productInput').value;
let priceInput = document.getElementById('priceInput').value;
let productForm = document.getElementById('productForm');
let submitButton = document.getElementById('submitButton');
let deleteSelectedButton = document.getElementById('deleteSelectedButton');
let logoutButton = document.getElementById('logoutButton');
let myListsButton = document.getElementById('myListsButton');

deleteSelectedButton.addEventListener('click', deleteSelectedProducts);
logoutButton.addEventListener('click', logout);
myListsButton.addEventListener('click', goToMyListsPage);
// deleteSelectedButton.disabled = true;

let trForUpdate;

// let productList = [];

class Product {
  constructor(name, price) {
    this.id = this.createGuid();
    this.ownerId = this.getOwnerId();
    this.name = name;
    this.price = price;
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  getOwnerId() {}
}

// let product1 = new Product('חלב', '5.00');
// productList.push(product1);

// let product2 = new Product('לחם', '6.00');
// productList.push(product2);

function displayList() {
  // for (let i = 0; i < users.length; i++) {
  //   console.log(users[0].productList[i]);
  //   console.log(users[0]);
  // }
  let tableBody = document.getElementById('productsTable');

  for (let i = 0; i < users[0].productList.length; i++) {
    let tr = document.createElement('tr');
    tr.id = users[0].productList[i].id;
    // tr.id = productList[i].id;
    tr.className = 'productListTr';
    tableBody.appendChild(tr);
    let tdCheckbox = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'procductCheckbox';

    tr.appendChild(tdCheckbox);
    tdCheckbox.appendChild(checkbox);

    let tdNAME = document.createElement('td');
    tdNAME.id = 'productName';
    let tdPRICE = document.createElement('td');
    tr.append(tdNAME);
    tr.append(tdPRICE);
    tdNAME.innerHTML = users[0].productList[i].name;
    // tdNAME.innerHTML = productList[i].name;
    tdPRICE.innerHTML = users[0].productList[i].price;
    // tdPRICE.innerHTML = productList[i].price;
    tdNAME.id = `product-${i}`;

    // Edit Button
    let tdEDIT = document.createElement('td');
    let editIcon = document.createElement('i');
    tdEDIT.className = 'editIcon';
    editIcon.className = 'editIcon';
    editIcon.className = 'far fa-edit';
    editIcon.style.fontSize = '24px';
    tdEDIT.appendChild(editIcon);
    editIcon.setAttribute('data-bs-toggle', 'modal');
    editIcon.setAttribute('data-bs-target', '#exampleModal');
    editIcon.setAttribute('data-bs-id', `${users[0].productList[i].id}`);
    editIcon.setAttribute('data-bs-name', `${users[0].productList[i].name}`);
    editIcon.setAttribute('data-bs-price', `${users[0].productList[i].price}`);

    tdEDIT.addEventListener('click', function (e) {
      let dataId = editIcon.getAttribute('data-bs-id');
      let dataName = editIcon.getAttribute('data-bs-name');
      let dataPrice = editIcon.getAttribute('data-bs-price');
      let modalBodyInputId = exampleModal.querySelector(
        '.modal-body #product-id'
      );
      let modalBodyInputName = exampleModal.querySelector(
        '.modal-body #product-name'
      );
      let modalBodyInputPrice = exampleModal.querySelector(
        '.modal-body #product-price'
      );
      modalBodyInputId.value = dataId;
      modalBodyInputName.value = dataName;
      modalBodyInputPrice.value = dataPrice;
    });

    // Delete Button
    let tdDELETE = document.createElement('td');
    // let deleteButton = document.createElement('button');
    let deleteIcon = document.createElement('i');
    tdDELETE.className = 'deleteIcon';
    deleteIcon.className = 'deleteIcon';
    // deleteIcon.className = 'deleteButton';
    deleteIcon.className = 'far fa-trash-alt';
    deleteIcon.style.fontSize = '24px';
    tdDELETE.appendChild(deleteIcon);
    tdDELETE.addEventListener('click', deleteProducet);

    tr.append(tdEDIT);
    tr.append(tdDELETE);
    tdEDIT.append(editIcon);
    tdDELETE.append(deleteIcon);
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

displayList();

productForm.addEventListener('submit', addProduct);

function addProductToTable(productList) {
  let tableBody = document.getElementById('productsTable');
  let tr = document.createElement('tr');
  tr.className = 'productListTr';

  // Checkbox td
  let tdCheckbox = document.createElement('td');
  let checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'procductCheckbox';
  tdCheckbox.appendChild(checkbox);

  let tdNAME = document.createElement('td');
  let tdPRICE = document.createElement('td');

  // Edit Button
  let tdEDIT = document.createElement('td');
  let editIcon = document.createElement('i');
  tdEDIT.className = 'editIcon';
  editIcon.className = 'editIcon';
  editIcon.className = 'far fa-edit';
  editIcon.style.fontSize = '24px';
  tdEDIT.appendChild(editIcon);
  editIcon.setAttribute('data-bs-toggle', 'modal');
  editIcon.setAttribute('data-bs-target', '#exampleModal');
  editIcon.setAttribute(
    'data-bs-id',
    `${productList[productList.length - 1].id}`
  );
  editIcon.setAttribute(
    'data-bs-name',
    `${productList[productList.length - 1].name}`
  );
  editIcon.setAttribute(
    'data-bs-price',
    `${productList[productList.length - 1].price}`
  );

  tdEDIT.addEventListener('click', function (e) {
    let dataId = editIcon.getAttribute('data-bs-id');
    let dataName = editIcon.getAttribute('data-bs-name');
    let dataPrice = editIcon.getAttribute('data-bs-price');
    let modalBodyInputId = exampleModal.querySelector(
      '.modal-body #product-id'
    );
    let modalBodyInputName = exampleModal.querySelector(
      '.modal-body #product-name'
    );
    let modalBodyInputPrice = exampleModal.querySelector(
      '.modal-body #product-price'
    );
    modalBodyInputId.value = dataId;
    modalBodyInputName.value = dataName;
    modalBodyInputPrice.value = dataPrice;
  });

  // Delete Button
  let tdDELETE = document.createElement('td');
  // let deleteIcon = document.createElement('button');
  let deleteIcon = document.createElement('i');
  tdDELETE.className = 'deleteIcon';
  deleteIcon.className = 'deleteIcon';
  deleteIcon.className = 'far fa-trash-alt';
  deleteIcon.style.fontSize = '24px';
  tdDELETE.appendChild(deleteIcon);
  tdDELETE.addEventListener('click', deleteProducet);

  tableBody.append(tr);
  tr.id = productList[productList.length - 1].id;
  tr.append(tdCheckbox);
  tr.append(tdNAME);
  tr.append(tdPRICE);
  tr.append(tdEDIT);
  tr.append(tdDELETE);
  tdEDIT.append(editIcon);
  tdDELETE.append(deleteIcon);
  tdNAME.innerHTML = productList[productList.length - 1].name;
  tdPRICE.innerHTML = productList[productList.length - 1].price;
}

function addProduct(e) {
  e.preventDefault();
  let productName = e.target.name.value;
  let productPrice = e.target.price.value;

  let product = new Product(productName, productPrice);
  users[0].productList.push(product);
  // product.push(product);
  addProductToTable(users[0].productList);
  productInput = document.getElementById('productInput').value = '';
  priceInput = document.getElementById('priceInput').value = '';
}

let saveProductButton = document.getElementById('saveProductButton');

let tableBody = document.getElementById('productsTable');

for (let i = 0; i < tableBody; i++) {
  console.log(tableBody[i]);
}

saveProductButton.addEventListener('click', function (e) {
  e.preventDefault();
  let tableBody = document.getElementById('productsTable');

  // let element = HTMLCollection.tr(1);

  let newName = document.getElementById('product-name').value;
  let newPrice = document.getElementById('product-price').value;
  let productId = document.getElementById('product-id').value;

  let trForUpdate = document.getElementById(`${productId}`);
  // let tdNameForUpdate = trForUpdate.childNodes[1].innerHTML;

  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id === productId) {
      productList[i].name = newName;
      productList[i].price = newPrice;
    }
  }

  // Update Product Name td
  trForUpdate.childNodes[1].innerHTML = newName;
  trForUpdate.childNodes[2].innerHTML = newPrice;
  let trs = document.getElementsByTagName('tr');

  for (let i = 0; i < trs.length; i++) {
    if (i > 0) {
      trs[i].remove();
    }
  }

  if (!trs[1]) {
  } else {
    trs[1].remove();
  }
  displayList();
});

function deleteProducet(e) {
  let td = e.target.parentElement;
  let tr = td.parentElement;
  let productId = tr.id;

  for (let i = 0; i < productList.length; i++) {
    if (productList[i].id === productId) {
      productList.splice(i, 1);
    }
  }
  tr.remove();
}

let thCheckbox = document.getElementById('thCheckbox');
let tdCheckboxs = document.getElementsByClassName('procductCheckbox');

thCheckbox.addEventListener('change', checkAllProduct);

function checkAllProduct() {
  // console.log(thCheckbox.checked);
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

let elements = document.getElementsByClassName('procductCheckbox');

function deleteSelectedProducts() {
  let productListTr = document.getElementsByClassName('productListTr');

  deleteSelectedButton.disabled = false;

  // console.log(productListTr);
  // console.log(elements);

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked === true) {
      productToDelete = elements[i].parentElement.parentElement.id;
      for (let z = 0; z < users[0].productList.length; z++) {
        if (productToDelete === users[0].productList[z].id) {
          users[0].productList.splice(z, 1);
        }
      }
    }
  }

  while (productListTr.length > 0) {
    productListTr[0].remove();
  }

  thCheckbox.checked = false;
  displayList();
}

function logout() {
  window.location = '/index.html';
}

function goToMyListsPage() {
  window.location = '/myLists.html';
}
