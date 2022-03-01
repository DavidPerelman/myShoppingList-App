require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
require('./db/mongoConnect');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Models
const User = require('./models/user');
const List = require('./models/list');
const Product = require('./models/product');

// const List = require('./models/newList');
// const Product = require('./models/newProduct');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

// Create new user
app.post('/user/register', async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  // const firstName = req.body.firstName;
  // const lastName = req.body.lastName;
  // const email = req.body.email;
  // const password = req.body.password;

  User.find({ email }).then((users) => {
    if (users.length >= 1) {
      return res.status(409).json({
        msg: 'Email exists',
      });
    }

    bcrypt.hash(password, 10, (error, hash) => {
      if (error) {
        return res.status(500).json({ error });
      }

      User.collection
        .getIndexes({ full: true })
        .then((indexes) => {
          console.log('indexes:', indexes);
        })
        .catch(console.error);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hash,
      });

      // Create token
      const token = jwt.sign(
        { user_id: newUser._id, email: email },
        process.env.SECRET
      );
      // save user token
      newUser.token = token;

      newUser
        .save()
        .then((result) => {
          res.json({
            status: 'success',
            newUser,
          });
        })
        .catch((error) => {
          if (error.code === 'E11000') {
            // it could be .status, .code etc.. not sure
            console.log('User already exist');

            console.log(error.code);

            return res
              .status(500)
              .json({ status: 'error', msg: 'User already exist.' });
          }
        });
    });
  });
});

app.post('/user/login', async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required');
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.SECRET,
        {
          expiresIn: '2h',
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
});

app.get('/users/usersData', async (req, res) => {
  const userId = req.query.userId;

  const user = await User.findById(userId)
    .populate('lists', {
      listName: 1,
      date: 1,
      active: 1,
    })
    .exec();

  res.json(user);
});

app.get('/lists/listsData', async (req, res) => {
  const listId = req.query.listId;

  const list = await List.findById(listId).populate('products.product');

  res.json(list);
});

app.put('/list/changeAmountOfProduct', async (req, res) => {
  const listId = req.body.listId;
  const productId = req.body.productId;
  const amountReq = req.body.amount;

  const list = await List.findById(listId);

  console.log(list.products);

  let listBelong;
  for (let i = 0; i < list.products.length; i++) {
    if (list.products[i]._id.toString() === productId) {
      listBelong = list.products[i];
    }
  }

  // console.log(listBelong);
  listBelong.amount = amountReq;
  list.save();

  res.json(list);
});

app.get('/products/productsData', async (req, res) => {
  const products = await Product.find({});

  res.json(products);
});

app.post('/lists/createList', async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.userId);

  if (body.listName === undefined) {
    return res.status(400).json({ error: 'list name missing' });
  }

  const list = new List({
    listName: body.listName,
    user: user._id,
  });

  const savedList = await list.save();
  user.lists = user.lists.concat(savedList._id);

  await user.save();

  res.json(savedList);
});

app.put('/list/addProductToList', async (req, res) => {
  const productId = req.body.productId;
  const listId = req.body.listId;

  product = { product: productId, inCart: false, amount: 1 };

  const listSaved = await List.findById(listId)
    .exec()
    .then((list) => {
      list.products.push(product);
      return list.save();
    });

  res.json(listSaved);
});

app.post('/list/addProductToCart', async (req, res) => {
  const productIdReq = req.body.productId;
  const listIdReq = req.body.listId;
  const inCartReq = req.body.inCart;

  const list = await List.findById(listIdReq);

  let productListBelong;

  for (let i = 0; i < list.products.length; i++) {
    const productId = list.products[i]._id.toString();

    // console.log(productId);

    if (productIdReq === productId) {
      productListBelong = list.products[i];
    }
  }

  productListBelong.inCart = inCartReq;

  await list.save();

  res.json(list);
});

app.delete('/list/deleteProductFromList', async (req, res) => {
  const productId = req.body.productId;
  const listId = req.body.listId;

  const list = await List.findById(listId);

  list.products = list.products.pull(productId);

  await list.save();

  res.json(list);
});

app.delete('/lists/deleteList', async (req, res) => {
  const userId = req.body.userId;
  const listId = req.body.listId;

  const user = await User.findById(userId);
  user.lists = user.lists.pull(listId);

  const list = await List.findByIdAndDelete(listId);

  await user.save();

  res.json(user);
});

app.put('/list/editList', async (req, res) => {
  const listName = req.body.listName;
  const listId = req.body.listId;

  const list = await List.findByIdAndUpdate(
    listId,
    { $set: { listName: listName } },
    { new: true }
  );

  await list.save();

  res.json(list);
});

app.put('/list/activeListStart', async (req, res) => {
  const listId = req.body.listId;

  const list = await List.findByIdAndUpdate(
    listId,
    { $set: { active: true } },
    { new: true }
  );

  await list.save();

  res.json(list);
});

app.put('/list/activeListStop', async (req, res) => {
  const listId = req.body.listId;

  const list = await List.findByIdAndUpdate(
    listId,
    { $set: { active: false } },
    { new: true }
  );

  await list.save();

  res.json(list);
});

app.put('/list/addProductToCart', async (req, res) => {
  const listId = req.body.listId;
  const productId = req.body.productId;

  // console.log(productId);
  // console.log(listId);

  // return;

  // const product = await Product.findByIdAndUpdate(
  //   { _id: productId },
  //   { $set: { inCart: true } }
  // );

  const list = await List.findOneAndUpdate(
    { _id: listId },
    [{ _id: productId, inCart: true }],
    {
      overwrite: true,
    }
  );

  // const list = await List.findByIdAndUpdate(
  //   { _id: listId },
  //   {
  //     $set: {
  //       products: {
  //         _id: productId,
  //         inCart: true,
  //       },
  //     },
  //   }
  // );

  // await list.save();

  res.json(list);
});

app.delete('/lists/deleteManyLists', async (req, res) => {
  const userId = req.body.userId;
  const listsToDelete = req.body.listsToDelete;

  const user = await User.findById(userId);

  // console.log(userId);

  for (let i = 0; i < listsToDelete.length; i++) {
    console.log(listsToDelete[i]);
    user.lists = user.lists.pull(listsToDelete[i]);

    let list = await List.findByIdAndDelete(listsToDelete[i]);
  }

  await user.save();

  res.json(user);
});

app.delete('/list/deleteManyProductsFromList', async (req, res) => {
  const listId = req.body.listId;
  const productsToDeleteArray = req.body.productsToDeleteArray;

  const list = await List.findById(listId);

  // console.log(list);

  for (let i = 0; i < productsToDeleteArray.length; i++) {
    console.log(productsToDeleteArray[i]);
    list.products = list.products.pull(productsToDeleteArray[i]);
  }

  await list.save();

  res.json(list);
});

app.post('/products/createNewProduct', async (req, res) => {
  const product_name = req.body.product_name;

  // console.log(req.body);

  // return;

  const product = new Product({
    product_name: product_name,
  });

  await product.save();

  res.json(product);
});

app.post('/lists/createNewList', async (req, res) => {
  const listName = req.body.listName;
  const userId = req.body.userId;
  const productId = req.body.productId;

  const product_name = await Product.findById(productId);

  console.log(product_name.product_name);

  const list = new List({
    listName: listName,
    user: { _id: userId },
    products: {
      _id: productId,
      product_name: product_name.product_name,
      amount: 0,
      inCart: false,
    },
  });

  await list.save();

  console.log(list);
  res.json(list);
});

app.put('/list/addNewProductToList', async (req, res) => {
  const listId = req.body.listId;
  const productId = req.body.productId;

  console.log(listId);
  console.log(productId);
  const product_name = await Product.findById(productId);

  console.log(product_name.product_name);

  const list = await List.findByIdAndUpdate(listId, {
    $push: {
      products: {
        _id: productId,
        department: product_name.department,
        amount: 1,
        inCart: false,
      },
    },
  });

  await list.save();

  console.log(list);
  res.json(list);
});

app.get('/lists/listsAllData', async (req, res) => {
  const list = await List.find({})
    .populate('users', {
      _id: 1,
      email: 1,
      firstName: 1,
    })
    .exec();

  // console.log(list);
  res.json(list);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
