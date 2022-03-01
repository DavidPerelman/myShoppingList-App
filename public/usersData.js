// let url = window.location.href;
let params = new URL(url).searchParams;
let userIdLog = params.get('userId');
let listName = 'קניות';

let newUserMailInput = document.getElementById('newUserMail');
let newUserPasswordInput = document.getElementById('newUserPassword');
// let loginButton = document.getElementById('loginButton');

// loginButton.addEventListener('click', addNewUser);

class List {
  constructor(name, id) {
    this.id = this.createGuid();
    this.date = this.createListDate();
    this.ownerId = id;
    this.name = name;
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  createListDate() {
    let currentdate = new Date();
    let datetime =
      currentdate.getDate() +
      '.' +
      (currentdate.getMonth() + 1) +
      '.' +
      currentdate.getFullYear();

    return datetime;
  }
}

class User {
  constructor(mail, password, myLists) {
    this.id = this.createGuid();
    this.registerDate = this.createRegisterDate();
    this.password = password;
    this.mail = mail;
    this.myLists = [];
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        let r = (Math.random() * 16) | 0,
          v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  createRegisterDate() {
    let currentdate = new Date();
    let datetime =
      currentdate.getDate() +
      '.' +
      (currentdate.getMonth() + 1) +
      '.' +
      currentdate.getFullYear();

    return datetime;
  }
}

let list1 = new List(listName, userIdLog);
// let newUser = new List(listName, userIdLog);

let users = [
  {
    id: 1,
    mail: 'david@gmail.com',
    password: '123',
    myLists: [
      {
        ownerId: 1,
        // id: list1.createGuid(),
        id: 1,
        name: 'קניות',
        // date: '1.1.2022',
        date: list1.createListDate(),
        productList: [
          {
            id: '1111',
            name: 'חלב',
            price: '5.00',
            inCart: false,
          },
          {
            id: '2222',
            name: 'לחם',
            price: '6.00',
            inCart: false,
          },
          {
            id: '3333',
            name: 'פסטה',
            price: '6.00',
            inCart: false,
          },
          {
            id: '4444',
            name: 'קטשופ',
            price: '6.00',
            inCart: false,
          },
          {
            id: '5555',
            name: 'גבינה',
            price: '6.00',
            inCart: false,
          },
          {
            id: '6666',
            name: 'חומוס',
            price: '6.00',
            inCart: false,
          },
          {
            id: '7777',
            name: 'בשר',
            price: '6.00',
            inCart: false,
          },
          {
            id: '8888',
            name: 'עוף',
            price: '6.00',
            inCart: false,
          },
        ],
      },
      {
        ownerId: 1,
        // id: list1.createGuid(),
        id: 2,
        name: 'מסיבה',
        date: list1.createListDate(),
        productList: [
          {
            id: '1',
            name: 'עוגה',
            price: '5.00',
            inCart: false,
          },
          {
            id: '2',
            name: 'פופקורן',
            price: '6.00',
            inCart: false,
          },
          {
            id: '3',
            name: 'בלונים',
            price: '6.00',
            inCart: false,
          },
          {
            id: '4',
            name: 'נרות',
            price: '6.00',
            inCart: false,
          },
          {
            id: '5',
            name: 'ביסלי',
            price: '6.00',
            inCart: false,
          },
          {
            id: '6',
            name: 'במבה',
            price: '6.00',
            inCart: false,
          },
          {
            id: '7',
            name: 'שתיה',
            price: '6.00',
            inCart: false,
          },
          {
            id: '8',
            name: 'כוסות',
            price: '6.00',
            inCart: false,
          },
        ],
      },
    ],
  },
];

// {
//   id: '2',
//   mail: 'avi@gmail.com',
//   password: '123',
//   productList: [
//     {
//       name: 'שוקו',
//       price: '5.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//     {
//       name: 'קפה',
//       price: '6.00',
//     },
//   ],

function addNewUser(e) {
  e.preventDefault();
  let newUserMail = newUserMailInput.value;
  console.log(newUserMail);
  let newUserPassword = newUserPasswordInput.value;
  console.log(newUserPassword);

  let newUser = new User(newUserMail, newUserPassword);
  console.log(newUser);
}
