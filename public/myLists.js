const userToken = localStorage.getItem('userToken');
const userId = localStorage.getItem('userId');
const firstName = localStorage.getItem('firstName');

let userData = {};
let lists = [];

let newListInput = document.getElementById('newListNameInput').value;
let newListForm = document.getElementById('newListForm');
let addNewListButton = document.getElementById('addNewListButton');
let deleteSelectedButton = document.getElementById('deleteSelectedButton');
let logoutButton = document.getElementById('logoutDiv');
let editProfileButton = document.getElementById('editProfileDiv');

deleteSelectedButton.addEventListener('click', deleteSelectedProducts);
logoutButton.addEventListener('click', logout);
editProfileButton.addEventListener('click', editProfile);

let dataListsPerUser;
const apiUrl = `http://localhost:3001/users/usersData?userId=${userId}`;

async function getFirstJson(apiUrl) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  try {
    const response = await fetch(apiUrl, options);
    const json = await response.json();

    if (json.error) {
      return json.error;
    } else {
      const userId = json._id;
      const userToken = json.token;
      // localStorage.setItem('userId', userId);
      // localStorage.setItem('userToken', userToken);
      return json;
    }
  } catch (error) {
    return error;
  }
}

async function main() {
  dataListsPerUser = await getFirstJson(apiUrl);

  let myDate = new Date();
  let hrs = myDate.getHours();

  let greet;

  if (hrs < 12) greet = 'בוקר טוב';
  else if (hrs >= 12 && hrs <= 17) greet = 'צהריים טובים';
  else if (hrs >= 17 && hrs <= 24) greet = 'ערב טוב';

  document.getElementById(
    'userGreet'
  ).innerHTML = `<b>${greet}</b> ${firstName}!`;

  displayList(dataListsPerUser);
}

main();

function displayList(dataListsPerUser) {
  let tbody = document.getElementById('tbody');

  console.log(dataListsPerUser);

  let listData;

  for (let i = 0; i < dataListsPerUser.lists.length; i++) {
    listData = dataListsPerUser.lists[i];

    let listName = listData.listName;
    let listId = listData._id;
    let listDate = listData.date.split(' ')[0];

    let tr = document.createElement('tr');
    tr.id = listId;
    tr.className = 'productListTr';
    tbody.appendChild(tr);
    let tdCheckbox = document.createElement('td');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'form-check-input procductCheckbox';

    tr.appendChild(tdCheckbox);
    tdCheckbox.appendChild(checkbox);

    let tdNAME = document.createElement('td');
    tdNAME.id = 'productName';
    let tdDate = document.createElement('td');
    tr.append(tdNAME);
    tr.append(tdDate);
    tdNAME.innerHTML = listName;
    tdDate.innerHTML = listDate;
    tdNAME.id = `product-${i}`;
    tdNAME.className = `tdListName`;
    tdDate.id = `date-product-${i}`;
    tdDate.className = `tdListDate`;
    tdNAME.addEventListener('click', tdNameClick);
    tdDate.addEventListener('click', tdDateClick);

    // Cart Button
    console.log();
    let tdCART = document.createElement('td');
    let shoppingButton = document.createElement('button');
    shoppingButton.className = `shoppingButton ${dataListsPerUser.lists[i].active}`;
    let cartIcon = document.createElement('i');
    tdCART.className = 'cartIcon';
    tdCART.id = listId;
    shoppingButton.id = listId;
    cartIcon.id = listId;
    cartIcon.className = 'cartIcon';
    cartIcon.className = 'fa fa-shopping-cart';
    cartIcon.style.fontSize = '24px';
    if (listData.active === false) {
      cartIcon.style.color = 'red';
    } else if (listData.active === true) {
      cartIcon.style.color = 'green';
    }
    cartIcon.style.margin = 'auto';
    tdCART.style.cursor = 'pointer';
    shoppingButton.append(cartIcon);
    tdCART.appendChild(shoppingButton);
    shoppingButton.addEventListener('click', tdCartClick);

    // tr.append(tdEDIT);
    tr.append(tdCART);
    // tdEDIT.append(editIcon);
    tdCART.append(shoppingButton);

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
    editIcon.setAttribute('data-bs-id', `${listId}`);
    editIcon.setAttribute('data-bs-name', `${listName}`);
    editIcon.setAttribute('data-bs-price', `${listDate}`);

    tdEDIT.addEventListener('click', function (e) {
      let dataId = editIcon.getAttribute('data-bs-id');
      let dataName = editIcon.getAttribute('data-bs-name');
      let modalBodyInputId = exampleModal.querySelector(
        '.modal-body #product-id'
      );
      let modalBodyInputName = exampleModal.querySelector(
        '.modal-body #product-name'
      );
      modalBodyInputId.value = dataId;
      modalBodyInputName.value = dataName;
    });

    // Delete Button
    let tdDELETE = document.createElement('td');
    let deleteIcon = document.createElement('i');
    tdDELETE.className = 'deleteIcon';
    deleteIcon.className = 'deleteIcon';
    deleteIcon.className = 'far fa-trash-alt';
    deleteIcon.style.fontSize = '24px';
    tdDELETE.appendChild(deleteIcon);
    tdDELETE.addEventListener('click', deleteList);

    tr.append(tdCART);
    tr.append(tdEDIT);
    tr.append(tdDELETE);
    tdEDIT.append(editIcon);
    tdDELETE.append(deleteIcon);
  }
}

let trForUpdate;

let deletedListJSON;

function deleteList(e) {
  console.log(e.target);

  let productListTr = document.getElementsByClassName('productListTr');

  let td = e.target.parentElement;
  let tr = td.parentElement;
  let listId = tr.id;

  console.log(listId);
  console.log(userId);

  let deleteListUrl = `http://localhost:3001/lists/deleteList?listId=${listId}`;

  console.log(deleteListUrl);
  async function getDeleteListJson(url) {
    const dataListDeleteValue = {
      userId: userId,
      listId: listId,
    };

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataListDeleteValue),
    };

    let response = await fetch(url, options);
    let data = await response.json();
    return data;
  }

  async function sendDeleteToApi() {
    deletedListJSON = await getDeleteListJson(deleteListUrl);

    while (productListTr.length > 0) {
      productListTr[0].remove();
    }

    main();
  }

  sendDeleteToApi();
}

newListForm.addEventListener('submit', sendAddNewToApi);

let newListJSON;

async function sendAddNewToApi(e) {
  e.preventDefault();

  let productListTr = document.getElementsByClassName('productListTr');

  const dataList = {
    listName: newListNameInput.value,
    userId: userId,
  };

  const newListUrl = 'http://localhost:3001/lists/createList';

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(dataList),
  };

  try {
    const response = await fetch(newListUrl, options);
    const json = await response.json();

    if (json.error) {
      return json.error;
    } else {
      newListNameInput.value = '';

      while (productListTr.length > 0) {
        productListTr[0].remove();
      }

      main();

      return json;
    }
  } catch (error) {
    return error;
  }
}

let editForm = document.getElementById('editForm');

let tableBody = document.getElementById('productsTable');

editForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let productListTr = document.getElementsByClassName('productListTr');

  let listName = document.getElementById('product-name').value;
  let listId = document.getElementById('product-id').value;

  console.log(listName);
  console.log(listId);

  const dataListUpdateValue = {
    listName: listName,
    listId: listId,
  };

  console.log(dataListUpdateValue);

  const url = 'http://localhost:3001/list/editList';

  async function getJson(url) {
    const options = {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataListUpdateValue),
    };
    let response = await fetch(url, options);
    let data = await response.json();
    return data;
  }

  async function sendDataListUpdateValue() {
    newListJSON = await getJson(url);

    while (productListTr.length > 0) {
      productListTr[0].remove();
    }

    main();
  }

  sendDataListUpdateValue();
});

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

function deleteSelectedProducts() {
  let productListTr = document.getElementsByClassName('productListTr');

  let elements = document.getElementsByClassName('procductCheckbox');

  let listsToDelete = [];

  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked === true) {
      let listId = elements[i].parentElement.parentElement.id;

      listsToDelete.push(listId);
    }
  }

  let deleteUrl = `http://localhost:3001/lists/deleteManyLists`;

  async function getDeleteListsJson(url) {
    const dataListsDeleteValue = {
      userId: userId,
      listsToDelete: listsToDelete,
    };

    const options = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dataListsDeleteValue),
    };

    let response = await fetch(url, options);
    let data = await response.json();
    return data;
  }

  async function sendDeleteListsToApi() {
    jsondata = await getDeleteListsJson(deleteUrl);

    while (productListTr.length > 0) {
      productListTr[0].remove();
    }

    main();

    thCheckbox.checked = false;
  }

  sendDeleteListsToApi();
}

function logout() {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('listId');
  localStorage.removeItem('firstName');
  window.location = '/index.html';
}

function tdNameClick(e) {
  console.log('tdNameClick');
  const listId = e.target.parentElement.id;
  e.preventDefault();
  console.log(this);
  localStorage.setItem('listId', listId);

  window.location = '/productsList.html';
}

function tdDateClick(e) {
  e.preventDefault();
  const listId = e.target.parentElement.id;
  localStorage.setItem('listId', listId);
  window.location = '/productsList.html';
}

function tdCartClick(e) {
  e.preventDefault();
  let status = this.className.split(' ')[1];
  const active = status === 'true';
  const listId = this.id;
  localStorage.setItem('listId', listId);
  localStorage.setItem('active', active);
  window.location = '/shoppingPage.html';
}

function editProfile(e) {
  e.preventDefault();
  console.log('editProfile');
}
