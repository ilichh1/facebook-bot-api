const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter = require('./api/auth/index');

const DB_CONNECTION = 'mongodb+srv://admin:IF3Tn81Z23rOfXey@firstcluster-chz9d.mongodb.net/test';
mongoose.connect(DB_CONNECTION);

const app = express();
const { PORT = 8080 } = process.env;

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.all('/', (req, res) => {
  res.send({
    message: 'My API is alive!'
  });
});

app.listen(PORT, () => console.log('The app is running on ' + PORT));