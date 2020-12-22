// use express
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// passport Config
const passport = require('passport');
const cookieSession = require('cookie-session');
// Sessions
app.use(
    cookieSession({
        maxAge: 30*24*60*60*1000,
        keys:['asdasdasd']
    })
)

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

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// use json -> router 이전에 선언해줘야만 한다
app.use(express.json());

// use express router
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

require('./config/passport')(passport);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT || 5000 , () => console.log(`server is running on ${PORT}`));