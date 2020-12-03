const express = require('express');
const router = express.Router();

// saving or posting on mongodb
const mongoose = require('mongoose');
const User = mongoose.model("User");

// bcrypt
const bcrypt = require('bcryptjs');

// jwt
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');

// login middleware
const requireLogin = require('../middleware/requireLogin');

router.get('/protected', requireLogin, (req,res) => {
    res.send('hello')
})

router.post('/signup', (req,res) => {
    const {name,email,password} = req.body;
    console.log(email);
    if(!email || !password || !name) {
        return res.status(422).json({error: "please add all the fields"});
    }
    User.findOne({email:req.body.email}) // email 항목에 동일한 "email"이 있는지 찾아줌
    .then((savedUser) => {
        if(savedUser) {
            return res.status(422).json({error: "user already exists with that email"});
        }
        bcrypt.hash(password,12)
        .then(hashedpassword => {
            const user = new User({
                name,
                email,
                password: hashedpassword
            });

            user.save() // mongodb에 저장
            .then((user) => {
                res.json({message: `saved successfully ${user}`})
            })
            .catch(err => {
                console.log(err);
            })
        })
    })
    .catch((err) => console.log(err));
})


router.post('/signin', (req,res) => {
    const {email, password} = req.body
    if(!email || !password) {
        res.status(422).json({error: "please add email or password"})
    }
    User.findOne({email: email})
    .then(savedUser => {
        console.log(savedUser);
        if(!savedUser) {
            return res.status(422).json({error: "Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(isMatch => {
            if(isMatch) {
                // return res.json({message: "Login successfully"})
                // jwt토큰 발급 후 제한시간 10분으로 지정
                const token = jwt.sign({name: savedUser.name, _id: savedUser._id, exp: Math.floor(Date.now() / 1000) + 600},JWT_SECRET);
                res.json({token:token})
            }
            else {
                return res.status(422).json({error: "Invalid Email or password"})
            }
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
})

module.exports = router;