const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser'); // a bit of middleware
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
// to serve static files
app.use(express.static('public'));

// to conver the json to JavaScript Object and attaches it the request body inside the handler
app.use(express.json());

app.use(cookieParser());

require('dotenv').config();

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.DB_URI;
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes);

// cookies
// app.get('/set-cookies', (req, res) => {
//   // vanilla node / express
//   // res.setHeader('Set-Cookie', 'newUser=true');

//   // if it doesn't exist, a new cookie is created else the previously existing cookie will be updated
//   res.cookie('newUser', true);
//   res.cookie('isEmployee', true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   });
//   // we can use different parameters in the options list like secure, httpOnly, etc.,

//   res.send('you got the cookie!');
// });

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   console.log(cookies.newUser);

//   res.json(cookies);
// });
