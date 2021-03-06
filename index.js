const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter = require('./api/auth/index');
const settingsRouter = require('./api/settings/index');
const facebookRouter = require('./api/facebook/index');

const DB_CONNECTION = process.env.DB_CONNECTION_STRING;
mongoose.connect(DB_CONNECTION, {
  useUnifiedTopology: true
});

const app = express();
const { PORT = 8080 } = process.env;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/facebook', facebookRouter);
app.all('/', (req, res) => {
  res.send({
    message: 'My API is alive!'
  });
});

app.listen(PORT, () =>
  console.log(
    'The app is running on ' + PORT,
    `\n${process.env.APP_SUCCESS_STRING}`
    )
);