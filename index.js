const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter = require('./api/auth/index');

const DB_CONNECTION = 'mongodb+srv://admin:IF3Tn81Z23rOfXey@firstcluster-chz9d.mongodb.net/test?ssl=true&retryWrites=true&w=majority';
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
app.all('/', (req, res) => {
  res.send({
    message: 'My API is alive!'
  });
});

app.listen(PORT, () => console.log('The app is running on ' + PORT));