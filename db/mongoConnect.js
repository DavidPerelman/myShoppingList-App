const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/myShoppingList-App', {
    autoIndex: false,
  });
  console.log('mongo connected!');
}
