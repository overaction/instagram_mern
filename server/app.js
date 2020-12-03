// use express
const express = require('express');
const app = express();
const PORT = 5000;

// use mongoose
const mongoose = require('mongoose');
const mongokeys = require('./config/keys');

// use usermodel schema
require('./config/usermodel');
mongoose.model("User");

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
})


const customMiddleware = (req,res,next) => {
    console.log("middleware");
    next();
}

app.use(customMiddleware);

app.get('/',(req,res) => {
    console.log('home');
    res.send("hello!");
});

app.get('/about',customMiddleware,(req,res) => {
    console.log('about');
    res.send("about page!");
});

app.listen(PORT || 5000 , () => console.log(`server is running on ${PORT}`));