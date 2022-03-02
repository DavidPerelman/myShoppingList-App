let loginLink = document.getElementById('loginLink');
let firstNameInput = document.getElementById('floatingFirstName');
let lastNameInput = document.getElementById('floatingLastName');
let emailInput = document.getElementById('floatingEmail');
let passwordInput = document.getElementById('floatingPassword');
const registerForm = document.getElementById('registerForm');

loginLink.addEventListener('click', goToLoginPage);

function goToLoginPage(e) {
  e.preventDefault();
  window.location = '/index.html';
}

const register = async (e) => {
  e.preventDefault();

  let firstName = firstNameInput.value;
  let lastName = lastNameInput.value;
  let email = emailInput.value;
  let password = passwordInput.value;

  const data = { firstName, lastName, email, password };
  const apiUrl = 'http://localhost:3001/user/register';
  const options = {
    method: 'POST',
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
      window.location = '/index.html';
    }
    // process body
  } catch (err) {
    console.log(err);
  }
};

registerForm.addEventListener('submit', register);
