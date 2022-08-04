require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62ec0eced98cd8972663f877',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

const PUBLIC_FOLDER = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_FOLDER));

async function server() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
  }).then(() => console.log('Connected to mongodb'));

  await app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
}

server();