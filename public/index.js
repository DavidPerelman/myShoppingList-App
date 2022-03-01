let registerLink = document.getElementById('registerLink');
let emailInput = document.getElementById('floatingInput');
let passwordInput = document.getElementById('floatingPassword');
const loginForm = document.getElementById('loginForm');

registerLink.addEventListener('click', goToRegisterPage);

function goToRegisterPage(e) {
  e.preventDefault();
  window.location = '/register.html';
}

let login = async (e) => {
  e.preventDefault();
  let email = emailInput.value;
  let password = passwordInput.value;
  const userData = { email, password };
  const apiUrl = 'http://localhost:3001/user/login';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(userData),
  };

  try {
    const response = await fetch(apiUrl, options);
    const json = await response.json();

    if (json.error) {
      return json.error;
    } else {
      const userId = json._id;
      const userToken = json.token;
      const firstName = json.firstName;
      console.log(json);
      console.log(userId);
      console.log(userToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('userToken', userToken);
      localStorage.setItem('firstName', firstName);

      window.location = '/myLists.html';
    }
  } catch (error) {
    return error;
  }
};

loginForm.addEventListener('submit', login);
