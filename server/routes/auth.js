const express = require('express');
const passport = require('passport');
const router = express.Router();
// saving or posting on mongodb
const mongoose = require('mongoose');
const User = mongoose.model("User");

// bcrypt
const bcrypt = require('bcryptjs');

// jwt
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');

// GET /auth/google
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/signup'}),
        function(req,res) {
            res.redirect('http://localhost:3000/redirect')
        }
)

router.get('/api/current_user',(req,res) => {
    if(req.user) {
        const token = jwt.sign({name: req.user.name, _id: req.user._id},JWT_SECRET);
        console.log(token);
        res.json({token, svuser: req.user});
    }
})

router.get('/api/logout',(req,res) => {
    req.logout();
    res.send(req.user);
})

router.post('/signup', (req,res) => {
    const {name,email,password,pic} = req.body;
    console.log(req.body)
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
                password: hashedpassword,
                pic
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
                const token = jwt.sign({name: savedUser.name, _id: savedUser._id},JWT_SECRET);
                // 토큰 10분 제한
                //const token = jwt.sign({name: savedUser.name, _id: savedUser._id, exp: Math.floor(Date.now() / 1000) + 600},JWT_SECRET);
                const {_id,name,email,followers,followings,pic} = savedUser;
                res.json({token:token, svuser: {_id,name,email,followers,followings,pic}})
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