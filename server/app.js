// use express
const express = require('express');
const app = express();
const PORT = 5000;

// use mongoose
const mongoose = require('mongoose');
const mongokeys = require('./config/keys');

// connect mongodb
mongoose.connect(mongokeys.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
    console.log('connected to mongo');
})
mongoose.connection.on('error', (err) => {
    console.log('error connecting', err);
});

// model schema
require('./config/usermodel');
require('./config/postmodel');

// use json -> router 이전에 선언해줘야만 한다
app.use(express.json());

// use express router
app.use(require('./routes/auth'));
app.use(require('./routes/post'))

app.listen(PORT || 5000 , () => console.log(`server is running on ${PORT}`));