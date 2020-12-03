const express = require('express');

const app = express();

const PORT = 5000;

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