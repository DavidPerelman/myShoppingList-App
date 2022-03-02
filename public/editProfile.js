const userToken = localStorage.getItem('userToken');
const userId = localStorage.getItem('userId');
const firstName = localStorage.getItem('firstName');

console.log(userId);

let loginLink = document.getElementById('loginLink');
let firstNameInput = document.getElementById('floatingFirstName');
let lastNameInput = document.getElementById('floatingLastName');
let emailInput = document.getElementById('floatingEmail');
let oldPasswordInput = document.getElementById('floatingOldPassword');
let newPasswordInput = document.getElementById('floatingNewPassword');
const editProfileForm = document.getElementById('editProfileForm');

editProfileForm.addEventListener('submit', editProfile);

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
      console.log(json);
      const userId = json._id;
      const userToken = json.token;
      firstNameInput.value = json.firstName;
      lastNameInput.value = json.lastName;
      emailInput.value = json.email;
      oldPasswordInput.value = json.password;
      return json;
    }
  } catch (error) {
    return error;
  }
}

async function main() {
  dataListsPerUser = await getFirstJson(apiUrl);
}

main();

async function editProfile(e) {
  e.preventDefault();

  let firstName = firstNameInput.value;
  let lastName = lastNameInput.value;
  let email = emailInput.value;
  let oldPassword = oldPasswordInput.value;
  let newPassword = newPasswordInput.value;

  const data = { userId, firstName, lastName, email, oldPassword, newPassword };
  const apiUrl = 'http://localhost:3001/user/editProfile';
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch(apiUrl, options);
    const json = await response.json();

    if (json.error) {
      return json.error;
    } else {
      console.log(json);
      window.location = './myLists.html';
      // const userId = json.newUser._id;
      // console.log(userId);
      // console.log(json.newUser._id);
      // goToLoginPage();
    }
    // process body
  } catch (err) {
    console.log(err);
  }
}
